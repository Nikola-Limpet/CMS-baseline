import { cache } from 'react';
import { db } from '@/db';
import { testimonials } from '@/db/schema';
import { eq, and, desc, asc } from 'drizzle-orm';
import type { Testimonial } from '@/db/schema';

export const getFeaturedTestimonials = cache(
  async (limit = 6): Promise<Testimonial[]> => {
    try {
      return await db
        .select()
        .from(testimonials)
        .where(and(eq(testimonials.published, true), eq(testimonials.featured, true)))
        .orderBy(asc(testimonials.displayOrder), desc(testimonials.createdAt))
        .limit(limit);
    } catch (error) {
      console.error('[DAL] Error fetching featured testimonials:', error);
      return [];
    }
  }
);

export const getAllTestimonialsForAdmin = cache(
  async (): Promise<Testimonial[]> => {
    try {
      return await db
        .select()
        .from(testimonials)
        .orderBy(desc(testimonials.createdAt));
    } catch (error) {
      console.error('[DAL] Error fetching all testimonials:', error);
      return [];
    }
  }
);
