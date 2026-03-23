import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ImprovedBlogPostForm from '@/components/dashboard/blogs/ImprovedBlogPostForm';
import { db } from '@/db';
import {
  blogPosts,
  blogPostCategories,
  blogPostTags,
  blogCategories,
  blogTags,
  type BlogPost,
} from '@/db/schema';
import { eq, inArray } from 'drizzle-orm';

export const metadata: Metadata = {
  title: 'Edit Blog Post - Admin Dashboard',
  description: 'Edit an existing blog post',
};

interface EditBlogPostPageProps {
  params: Promise<{ id: string }>;
}

async function getBlogPostById(
  id: string
): Promise<(BlogPost & { categories: any[]; tags: any[] }) | undefined> {
  try {
    // Get the blog post
    const result = await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.id, id))
      .limit(1);
    if (!result.length) return undefined;

    // Get category relationships
    const postCategoryRelations = await db
      .select({
        categoryId: blogPostCategories.categoryId,
      })
      .from(blogPostCategories)
      .where(eq(blogPostCategories.postId, id));

    // Get category details
    const categoryIds = postCategoryRelations.map(rel => rel.categoryId);
    const categories =
      categoryIds.length > 0
        ? await db
            .select()
            .from(blogCategories)
            .where(
              categoryIds.length === 1
                ? eq(blogCategories.id, categoryIds[0])
                : inArray(blogCategories.id, categoryIds)
            )
        : [];

    // Get tag relationships
    const postTagRelations = await db
      .select({
        tagId: blogPostTags.tagId,
      })
      .from(blogPostTags)
      .where(eq(blogPostTags.postId, id));

    // Get tag details
    const tagIds = postTagRelations.map(rel => rel.tagId);
    const tags =
      tagIds.length > 0
        ? await db
            .select()
            .from(blogTags)
            .where(
              tagIds.length === 1
                ? eq(blogTags.id, tagIds[0])
                : inArray(blogTags.id, tagIds)
            )
        : [];

    // Return post with categories and tags
    return {
      ...result[0],
      categories,
      tags,
    };
  } catch (error) {
    console.error('Database error fetching blog post:', error);
    throw new Error('Failed to load blog post details.');
  }
}

export default async function EditBlogPostPage({
  params,
}: EditBlogPostPageProps) {
  let post: (BlogPost & { categories: any[]; tags: any[] }) | undefined;
  let fetchError: Error | null = null;

  try {
    const { id } = await params;
    console.log('🔍 Attempting to fetch blog post with ID:', id);
    
    post = await getBlogPostById(id);
    
    console.log('📊 Fetched blog post data:', {
      id: post?.id,
      title: post?.title,
      hasContent: !!post?.content,
      contentLength: post?.content?.length || 0,
      hasCoverImage: !!post?.coverImage,
      categoriesCount: post?.categories?.length || 0,
      tagsCount: post?.tags?.length || 0,
      published: post?.published,
    });
  } catch (error) {
    fetchError = error as Error;
    console.error('❌ Error fetching blog post for edit:', error);
  }

  if (fetchError || !post) {
    console.error('❌ Blog post not found or error occurred:', fetchError?.message);
    notFound(); // Redirect to 404 page
  }

  console.log('✅ Rendering ImprovedBlogPostForm with post data');
  return <ImprovedBlogPostForm postToEdit={post} />;
}
