import { NextResponse, type NextRequest } from 'next/server';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { z } from 'zod';
import { db } from '@/db';
import { blogPosts, blogCategories, blogTags, blogPostCategories, blogPostTags } from '@/db/schema';
import { eq, desc, like, and, inArray } from 'drizzle-orm';
import { generateSlug } from '@/lib/utils';
import { apiSuccess, apiError, handleApiError, parseJsonBody } from '@/lib/api/response';

// Server-side reading time calculation
function calculateReadingTime(content: string): string {
  const wordsPerMinute = 200;
  const words = content.split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
}

// Schema for blog post creation
const blogPostSchema = z.object({
  title: z.string().min(3).max(255),
  content: z.string().min(10),
  excerpt: z.string().max(500).optional().nullable(),
  cover_image: z.string().url().optional().nullable().or(z.literal('').transform(() => null)),
  published: z.boolean().default(false),
  user_id: z.string(),
  slug: z.string().optional(),
  categories: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    const userId = session?.user?.id ?? null;

    if (!userId) {
      return apiError('Unauthorized', 401);
    }

    const body = await parseJsonBody<Record<string, any>>(request);

    const validatedData = blogPostSchema.parse(body);

    // Use provided slug or generate from title
    const slug = validatedData.slug || generateSlug(validatedData.title);

    // Set published date if post is published
    const publishedAt = validatedData.published ? new Date() : null;

    // Create blog post
    const result = await db.insert(blogPosts).values({
      title: validatedData.title,
      slug,
      content: validatedData.content,
      excerpt: validatedData.excerpt,
      coverImage: validatedData.cover_image,
      published: validatedData.published,
      publishedAt,
      userId: validatedData.user_id,
    }).returning();

    const postId = result[0].id;

    // Insert categories if provided
    if (validatedData.categories && validatedData.categories.length > 0) {
      const validCategoryIds = validatedData.categories.filter(id => id && id.trim() !== '');
      for (const categoryId of validCategoryIds) {
        try {
          await db.insert(blogPostCategories).values({
            postId,
            categoryId: categoryId.trim(),
          });
        } catch (error) {
          console.error(`Error inserting category ${categoryId}:`, error);
        }
      }
    }

    // Insert tags if provided
    if (validatedData.tags && validatedData.tags.length > 0) {
      const validTagIds = validatedData.tags.filter(id => id && id.trim() !== '');
      for (const tagId of validTagIds) {
        try {
          await db.insert(blogPostTags).values({
            postId,
            tagId: tagId.trim(),
          });
        } catch (error) {
          console.error(`Error inserting tag ${tagId}:`, error);
        }
      }
    }

    return apiSuccess(result[0], 201);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return apiError('Validation failed', 400, error.errors);
    }
    return handleApiError(error, 'Failed to create blog post');
  }
}

export async function GET(request: NextRequest) {
  try {
    // Check authentication only for administrative operations
    let userId: string | null = null;
    try {
      const session = await auth.api.getSession({ headers: await headers() });
      userId = session?.user?.id ?? null;
    } catch (authError) {
      console.warn('Auth error during blog fetch:', authError);
      userId = null;
    }

    // Get search params
    const searchParams = request.nextUrl.searchParams;
    const published = searchParams.get('published');
    const search = searchParams.get('search');
    const limitParam = searchParams.get('limit');
    const offsetParam = searchParams.get('offset');
    const category = searchParams.get('category');
    const tags = searchParams.get('tags')?.split(',').filter(Boolean);
    const withRelations = searchParams.get('withRelations') === 'true';

    // Parse pagination parameters
    const limit = limitParam ? parseInt(limitParam) : 20;
    const offset = offsetParam ? parseInt(offsetParam) : 0;

    if (published === 'false' && !userId) {
      return apiError('Unauthorized', 401);
    }

    // Build base conditions
    const conditions = [];

    // Handle published filter
    if (published !== null) {
      conditions.push(eq(blogPosts.published, published === 'true'));
    } else if (!userId) {
      conditions.push(eq(blogPosts.published, true));
    }

    // Handle search
    if (search) {
      conditions.push(like(blogPosts.title, `%${search}%`));
    }

    // Pre-filter by category/tags if needed
    let postIds: string[] | null = null;
    if (category || (tags && tags.length > 0)) {
      const subqueries = [];
      
      if (category) {
        subqueries.push(
          db.select({ postId: blogPostCategories.postId })
            .from(blogPostCategories)
            .where(eq(blogPostCategories.categoryId, category))
        );
      }

      if (tags && tags.length > 0) {
        subqueries.push(
          db.select({ postId: blogPostTags.postId })
            .from(blogPostTags)
            .where(inArray(blogPostTags.tagId, tags))
        );
      }

      // Execute subqueries in parallel
      const results = await Promise.all(subqueries);
      
      if (category && tags && tags.length > 0) {
        // Intersection of category and tag results
        const categoryPostIds = new Set(results[0].map(r => r.postId));
        const tagPostIds = new Set(results[1].map(r => r.postId));
        postIds = Array.from(categoryPostIds).filter(id => tagPostIds.has(id));
      } else {
        // Union of results
        postIds = [...new Set(results.flat().map(r => r.postId))];
      }

      if (postIds.length === 0) {
        return NextResponse.json([]);
      }
    }

    // Add post ID filter if we have filtered IDs
    if (postIds && postIds.length > 0) {
      conditions.push(inArray(blogPosts.id, postIds));
    }

    // Execute main query
    const query = db.select().from(blogPosts).$dynamic();

    if (conditions.length > 0) {
      query.where(conditions.length === 1 ? conditions[0] : and(...conditions));
    }

    query.orderBy(desc(blogPosts.publishedAt))
         .limit(limit)
         .offset(offset);

    const posts = await query;

    // Add relations if requested
    if (withRelations && posts.length > 0) {
      const blogPostIds = posts.map(p => p.id);
      
      // Fetch relations in parallel
      const [postCategories, postTags] = await Promise.all([
        db.select({
          postId: blogPostCategories.postId,
          categoryId: blogCategories.id,
          categoryName: blogCategories.name,
          categorySlug: blogCategories.slug
        })
        .from(blogPostCategories)
        .innerJoin(blogCategories, eq(blogPostCategories.categoryId, blogCategories.id))
        .where(inArray(blogPostCategories.postId, blogPostIds)),

        db.select({
          postId: blogPostTags.postId,
          tagId: blogTags.id,
          tagName: blogTags.name,
          tagSlug: blogTags.slug
        })
        .from(blogPostTags)
        .innerJoin(blogTags, eq(blogPostTags.tagId, blogTags.id))
        .where(inArray(blogPostTags.postId, blogPostIds))
      ]);

      // Create lookup maps for O(1) access
      const categoriesByPost = new Map<string, any[]>();
      const tagsByPost = new Map<string, any[]>();

      postCategories.forEach(rel => {
        if (!categoriesByPost.has(rel.postId)) {
          categoriesByPost.set(rel.postId, []);
        }
        categoriesByPost.get(rel.postId)!.push({
          id: rel.categoryId,
          name: rel.categoryName,
          slug: rel.categorySlug
        });
      });

      postTags.forEach(rel => {
        if (!tagsByPost.has(rel.postId)) {
          tagsByPost.set(rel.postId, []);
        }
        tagsByPost.get(rel.postId)!.push({
          id: rel.tagId,
          name: rel.tagName,
          slug: rel.tagSlug
        });
      });

      // Attach relations to posts and add reading time
      const postsWithRelations = posts.map(post => ({
        ...post,
        categories: categoriesByPost.get(post.id) || [],
        tags: tagsByPost.get(post.id) || [],
        readingTime: calculateReadingTime(post.content)
      }));

      // Set cache headers for better performance
      const response = NextResponse.json(postsWithRelations);
      response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
      return response;
    }

    // Add reading time to posts without relations
    const postsWithReadingTime = posts.map(post => ({
      ...post,
      readingTime: calculateReadingTime(post.content)
    }));

    // Set cache headers
    const response = NextResponse.json(postsWithReadingTime);
    response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
    return response;

  } catch (error) {
    return handleApiError(error, 'Failed to fetch blog posts');
  }
}