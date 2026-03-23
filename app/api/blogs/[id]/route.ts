import { type NextRequest } from 'next/server';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { z } from 'zod';
import { db } from '@/db';
import { blogPosts, blogPostCategories, blogPostTags } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { generateSlug } from '@/lib/utils';
import { apiSuccess, apiError, handleApiError, parseJsonBody } from '@/lib/api/response';

// Server-side reading time calculation
function calculateReadingTime(content: string): string {
  const wordsPerMinute = 200;
  const words = content.split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
}

// Schema for blog post update (used by PATCH)
const blogPostUpdateSchema = z.object({
  title: z.string().min(3).max(255).optional(),
  content: z.string().min(10).optional(),
  excerpt: z.string().max(500).optional().nullable(),
  cover_image: z.string().url().optional().nullable().or(z.literal('').transform(() => null)), // Handle empty strings
  published: z.boolean().optional(),
  user_id: z.string().optional(), // Note: snake_case, and likely should be derived from auth, not body
  categories: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  slug: z.string().optional(), // Added slug as it's often updatable
  publishedAt: z.date().optional().nullable(), // Added publishedAt
});

// Get a blog post by ID
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const session = await auth.api.getSession({ headers: await headers() });
    const userId = session?.user?.id ?? null;
    if (!userId) {
      return apiError('Unauthorized', 401);
    }

    const { id } = await context.params;

    const post = await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.id, id))
      .limit(1);

    if (!post.length) {
      return apiError('Blog post not found', 404);
    }

    const postCategoriesData = await db
      .select({
        categoryId: blogPostCategories.categoryId,
      })
      .from(blogPostCategories)
      .where(eq(blogPostCategories.postId, id));

    const postTagsData = await db
      .select({
        tagId: blogPostTags.tagId,
      })
      .from(blogPostTags)
      .where(eq(blogPostTags.postId, id));

    return apiSuccess({
      ...post[0],
      categories: postCategoriesData.map(c => c.categoryId),
      tags: postTagsData.map(t => t.tagId),
      readingTime: calculateReadingTime(post[0].content)
    });
  } catch (error) {
    return handleApiError(error, 'Failed to fetch blog post');
  }
}

// Delete a blog post
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    const userId = session?.user?.id ?? null;
    if (!userId) {
      return apiError('Unauthorized', 401);
    }

    const { id } = await context.params;

    const existingPost = await db
      .select({ id: blogPosts.id })
      .from(blogPosts)
      .where(eq(blogPosts.id, id))
      .limit(1);

    if (existingPost.length === 0) {
      return apiError('Blog post not found', 404);
    }

    await db.transaction(async (tx) => {
      await tx.delete(blogPostCategories).where(eq(blogPostCategories.postId, id));
      await tx.delete(blogPostTags).where(eq(blogPostTags.postId, id));
      await tx.delete(blogPosts).where(eq(blogPosts.id, id));
    });

    return apiSuccess({ message: 'Blog post deleted successfully', deletedId: id });

  } catch (error) {
    return handleApiError(error, 'Failed to delete blog post');
  }
}

// Update a blog post
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    const userId = session?.user?.id ?? null;

    if (!userId) {
      return apiError('Unauthorized', 401);
    }

    const body = await parseJsonBody<Record<string, any>>(request);

    // Validate with schema
    const parsedBody = blogPostUpdateSchema.safeParse(body);
    if (!parsedBody.success) {
      return apiError('Invalid request body', 400, parsedBody.error.format());
    }

    const data = parsedBody.data;

    // First, check if the blog post exists and belongs to the user
    const existingPost = await db.query.blogPosts.findFirst({
      where: and(eq(blogPosts.id, id), eq(blogPosts.userId, userId)),
    });

    if (!existingPost) {
      return apiError('Blog post not found or you do not have permission to edit it', 404);
    }

    // Prepare update data
    const updateData = {
      title: data.title,
      content: data.content,
      excerpt: data.excerpt,
      coverImage: data.cover_image && data.cover_image.trim() !== '' ? data.cover_image : null, // Handle empty strings
      published: data.published,
      slug: data.slug || (data.title ? generateSlug(data.title) : existingPost.slug),
      updatedAt: new Date(),
      // Only set publishedAt if published status is changing from false to true
      publishedAt: data.published && !existingPost.published ? new Date() : existingPost.publishedAt,
    };


    // Filter out undefined values
    const filteredUpdateData = Object.fromEntries(
      Object.entries(updateData).filter(([_, value]) => value !== undefined)
    );

    // Update the blog post
    const updatedPost = await db
      .update(blogPosts)
      .set(filteredUpdateData)
      .where(eq(blogPosts.id, id))
      .returning();

    // Handle categories if provided
    if (data.categories && Array.isArray(data.categories)) {
      // First, delete existing category relationships
      await db
        .delete(blogPostCategories)
        .where(eq(blogPostCategories.postId, id));

      // Filter out empty values and insert valid category relationships
      const validCategoryIds = data.categories.filter(categoryId =>
        categoryId && typeof categoryId === 'string' && categoryId.trim() !== ''
      );


      for (const categoryId of validCategoryIds) {
        try {
          await db.insert(blogPostCategories).values({
            postId: id,
            categoryId: categoryId.trim(),
          });
        } catch (error) {
          console.error(`Error inserting category ${categoryId}:`, error);
          // Continue with other categories instead of failing completely
        }
      }
    }

    // Handle tags if provided
    if (data.tags && Array.isArray(data.tags)) {
      // First, delete existing tag relationships
      await db
        .delete(blogPostTags)
        .where(eq(blogPostTags.postId, id));

      // Filter out empty values and insert valid tag relationships
      const validTagIds = data.tags.filter(tagId =>
        tagId && typeof tagId === 'string' && tagId.trim() !== ''
      );


      for (const tagId of validTagIds) {
        try {
          await db.insert(blogPostTags).values({
            postId: id,
            tagId: tagId.trim(),
          });
        } catch (error) {
          console.error(`Error inserting tag ${tagId}:`, error);
          // Continue with other tags instead of failing completely
        }
      }
    }

    // Fetch the updated post with categories and tags for a complete response
    const postCategoriesData = await db
      .select({
        categoryId: blogPostCategories.categoryId,
      })
      .from(blogPostCategories)
      .where(eq(blogPostCategories.postId, id));

    const postTagsData = await db
      .select({
        tagId: blogPostTags.tagId,
      })
      .from(blogPostTags)
      .where(eq(blogPostTags.postId, id));

    return apiSuccess({
      ...updatedPost[0],
      categories: postCategoriesData.map(c => c.categoryId),
      tags: postTagsData.map(t => t.tagId),
      readingTime: calculateReadingTime(updatedPost[0].content),
      message: 'Blog post updated successfully'
    });

  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('foreign key constraint')) {
        return apiError('Invalid category or tag ID provided', 400, error.message);
      }

      if (error.message.includes('unique constraint')) {
        return apiError('A blog post with this slug already exists', 409, error.message);
      }
    }

    return handleApiError(error, `Failed to update blog post ${id}`);
  }
}
