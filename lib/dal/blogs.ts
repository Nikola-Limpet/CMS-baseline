import { cache } from 'react';
import { db } from '@/db';
import { blogPosts, blogCategories, blogTags } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import type { BlogPost, BlogCategory, BlogTag } from '@/db/schema';

export const getLatestPublishedBlogs = cache(
  async (limit = 3): Promise<BlogPost[]> => {
    try {
      return await db
        .select()
        .from(blogPosts)
        .where(eq(blogPosts.published, true))
        .orderBy(desc(blogPosts.publishedAt))
        .limit(limit);
    } catch (error) {
      console.error('[DAL] Error fetching latest published blogs:', error);
      return [];
    }
  }
);

export const getFeaturedBlogPost = cache(
  async (): Promise<BlogPost | null> => {
    try {
      const [post] = await db
        .select()
        .from(blogPosts)
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
  async (limit = 20): Promise<BlogPost[]> => {
    try {
      return await db
        .select()
        .from(blogPosts)
        .where(eq(blogPosts.published, true))
        .orderBy(desc(blogPosts.publishedAt))
        .limit(limit);
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
