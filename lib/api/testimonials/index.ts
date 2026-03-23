import { apiFetch } from '../fetch-client';
import type { Testimonial } from '@/db/schema';

export type TestimonialData = {
  author_name: string;
  author_title?: string;
  author_image?: string;
  content: string;
  rating?: number;
  featured: boolean;
  published: boolean;
  display_order?: number;
};

export const testimonialsApi = {
  getAll: async (): Promise<Testimonial[]> => {
    return apiFetch<Testimonial[]>('/api/testimonials');
  },

  getById: async (id: string): Promise<Testimonial> => {
    return apiFetch<Testimonial>(`/api/testimonials/${id}`);
  },

  create: async (data: TestimonialData): Promise<Testimonial> => {
    return apiFetch<Testimonial>('/api/testimonials', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: string, data: Partial<TestimonialData>): Promise<Testimonial> => {
    return apiFetch<Testimonial>(`/api/testimonials/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string): Promise<void> => {
    await apiFetch(`/api/testimonials/${id}`, { method: 'DELETE' });
  },
};
