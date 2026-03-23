import { cache } from 'react';
import { db } from '@/db';
import { blogPosts, blogCategories, blogTags, user } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import type { BlogPost, BlogCategory, BlogTag } from '@/db/schema';

export type BlogPostWithAuthor = BlogPost & {
  authorName: string | null;
  authorImage: string | null;
};

export const getLatestPublishedBlogs = cache(
  async (limit = 3): Promise<BlogPostWithAuthor[]> => {
    try {
      const rows = await db
        .select({
          id: blogPosts.id,
          title: blogPosts.title,
          slug: blogPosts.slug,
          content: blogPosts.content,
          excerpt: blogPosts.excerpt,
          coverImage: blogPosts.coverImage,
          published: blogPosts.published,
          publishedAt: blogPosts.publishedAt,
          scheduledPublishAt: blogPosts.scheduledPublishAt,
          userId: blogPosts.userId,
          createdAt: blogPosts.createdAt,
          updatedAt: blogPosts.updatedAt,
          authorName: user.name,
          authorImage: user.image,
        })
        .from(blogPosts)
        .leftJoin(user, eq(blogPosts.userId, user.id))
        .where(eq(blogPosts.published, true))
        .orderBy(desc(blogPosts.publishedAt))
        .limit(limit);
      return rows;
    } catch (error) {
      console.error('[DAL] Error fetching latest published blogs:', error);
      return [];
    }
  }
);

export const getFeaturedBlogPost = cache(
  async (): Promise<BlogPostWithAuthor | null> => {
    try {
      const [post] = await db
        .select({
          id: blogPosts.id,
          title: blogPosts.title,
          slug: blogPosts.slug,
          content: blogPosts.content,
          excerpt: blogPosts.excerpt,
          coverImage: blogPosts.coverImage,
          published: blogPosts.published,
          publishedAt: blogPosts.publishedAt,
          scheduledPublishAt: blogPosts.scheduledPublishAt,
          userId: blogPosts.userId,
          createdAt: blogPosts.createdAt,
          updatedAt: blogPosts.updatedAt,
          authorName: user.name,
          authorImage: user.image,
        })
        .from(blogPosts)
        .leftJoin(user, eq(blogPosts.userId, user.id))
        .where(eq(blogPosts.published, true))
        .orderBy(desc(blogPosts.publishedAt))
        .limit(1);
      return post ?? null;
    } catch (error) {
      console.error('[DAL] Error fetching featured blog post:', error);
      return null;
    }
  }
);

export const getPublishedBlogs = cache(
  async (limit = 20): Promise<BlogPostWithAuthor[]> => {
    try {
      const rows = await db
        .select({
          id: blogPosts.id,
          title: blogPosts.title,
          slug: blogPosts.slug,
          content: blogPosts.content,
          excerpt: blogPosts.excerpt,
          coverImage: blogPosts.coverImage,
          published: blogPosts.published,
          publishedAt: blogPosts.publishedAt,
          scheduledPublishAt: blogPosts.scheduledPublishAt,
          userId: blogPosts.userId,
          createdAt: blogPosts.createdAt,
          updatedAt: blogPosts.updatedAt,
          authorName: user.name,
          authorImage: user.image,
        })
        .from(blogPosts)
        .leftJoin(user, eq(blogPosts.userId, user.id))
        .where(eq(blogPosts.published, true))
        .orderBy(desc(blogPosts.publishedAt))
        .limit(limit);
      return rows;
    } catch (error) {
      console.error('[DAL] Error fetching published blogs:', error);
      return [];
    }
  }
);

export const getAllBlogCategories = cache(
  async (): Promise<BlogCategory[]> => {
    try {
      return await db
        .select()
        .from(blogCategories)
        .orderBy(blogCategories.name);
    } catch (error) {
      console.error('[DAL] Error fetching blog categories:', error);
      return [];
    }
  }
);

export const getAllBlogPostsForAdmin = cache(
  async (): Promise<BlogPost[]> => {
    try {
      return await db
        .select()
        .from(blogPosts)
        .orderBy(desc(blogPosts.createdAt));
    } catch (error) {
      console.error('[DAL] Error fetching all blog posts for admin:', error);
      return [];
    }
  }
);

export const getAllBlogTags = cache(
  async (): Promise<BlogTag[]> => {
    try {
      return await db
        .select()
        .from(blogTags)
        .orderBy(blogTags.name);
    } catch (error) {
      console.error('[DAL] Error fetching blog tags:', error);
      return [];
    }
  }
);
