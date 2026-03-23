import { apiFetch } from '../fetch-client';
import type { BlogPost, BlogCategory, BlogTag } from '@/db/schema';

// Type for blog post creation/update
export type BlogPostData = {
  title: string;
  content: string;
  excerpt?: string;
  cover_image?: string;
  published: boolean;
  user_id: string;
  categories?: string[]; // Array of category IDs
  tags?: string[]; // Array of tag IDs
};

// Blog API service
export const blogsApi = {
  // Post methods
  posts: {
    getAll: async (options?: {
      published?: boolean;
      limit?: number;
      offset?: number;
      search?: string;
      categoryId?: string;
      tagId?: string;
    }) => {
      const searchParams = new URLSearchParams();
      if (options) {
        Object.entries(options).forEach(([key, value]) => {
          if (value !== undefined) searchParams.set(key, String(value));
        });
      }
      const query = searchParams.toString();
      return apiFetch(`/api/blogs${query ? `?${query}` : ''}`);
    },

    getById: async (id: string) => {
      return apiFetch(`/api/blogs/${id}`);
    },

    getBySlug: async (slug: string) => {
      return apiFetch(`/api/blogs/slug/${slug}`);
    },

    create: async (data: BlogPostData) => {
      return apiFetch<BlogPost>('/api/blogs', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },

    update: async (id: string, data: Partial<BlogPostData>) => {
      return apiFetch(`/api/blogs/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      });
    },

    delete: async (id: string) => {
      return apiFetch(`/api/blogs/${id}`, { method: 'DELETE' });
    }
  },

  // Category methods
  categories: {
    getAll: async (): Promise<BlogCategory[]> => {
      return apiFetch<BlogCategory[]>('/api/blogs/categories');
    },

    getById: async (id: string) => {
      return apiFetch(`/api/blogs/categories/${id}`);
    },

    create: async (data: { name: string; description?: string }) => {
      return apiFetch<BlogCategory>('/api/blogs/categories', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },

    update: async (id: string, data: { name?: string; description?: string }) => {
      return apiFetch(`/api/blogs/categories/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      });
    },

    delete: async (id: string) => {
      return apiFetch(`/api/blogs/categories/${id}`, { method: 'DELETE' });
    }
  },

  // Tag methods
  tags: {
    getAll: async (): Promise<BlogTag[]> => {
      return apiFetch<BlogTag[]>('/api/blogs/tags');
    },

    getById: async (id: string) => {
      return apiFetch(`/api/blogs/tags/${id}`);
    },

    create: async (data: { name: string }) => {
      return apiFetch<BlogTag>('/api/blogs/tags', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },

    update: async (id: string, name: string) => {
      return apiFetch(`/api/blogs/tags/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ name }),
      });
    },

    delete: async (id: string) => {
      return apiFetch(`/api/blogs/tags/${id}`, { method: 'DELETE' });
    }
  }
};
