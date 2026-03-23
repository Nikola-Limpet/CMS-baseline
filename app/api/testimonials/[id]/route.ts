import { type NextRequest } from 'next/server';
import { z } from 'zod';
import { db } from '@/db';
import { testimonials } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { requireAuth, isAuthError } from '@/lib/auth/require';
import { apiSuccess, apiError, handleApiError, parseJsonBody } from '@/lib/api/response';

const testimonialUpdateSchema = z.object({
  author_name: z.string().min(1).max(255).optional(),
  author_title: z.string().max(255).optional().nullable(),
  author_image: z.string().url().optional().nullable().or(z.literal('').transform(() => null)),
  content: z.string().min(3).optional(),
  rating: z.number().int().min(1).max(5).optional().nullable(),
  featured: z.boolean().optional(),
  published: z.boolean().optional(),
  display_order: z.number().int().optional(),
});

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAuth();
    if (isAuthError(authResult)) return authResult;

    const { id } = await context.params;
    const [row] = await db.select().from(testimonials).where(eq(testimonials.id, id)).limit(1);
    if (!row) return apiError('Testimonial not found', 404);

    return apiSuccess(row);
  } catch (error) {
    return handleApiError(error, 'Failed to fetch testimonial');
  }
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAuth();
    if (isAuthError(authResult)) return authResult;

    const { id } = await context.params;
    const body = await parseJsonBody<Record<string, unknown>>(request);
    const parsed = testimonialUpdateSchema.safeParse(body);
    if (!parsed.success) return apiError('Invalid request body', 400, parsed.error.format());

    const data = parsed.data;
    const updateData: Record<string, unknown> = {
      authorName: data.author_name,
      authorTitle: data.author_title,
      authorImage: data.author_image,
      content: data.content,
      rating: data.rating,
      featured: data.featured,
      published: data.published,
      displayOrder: data.display_order,
      updatedAt: new Date(),
    };

    const filtered = Object.fromEntries(
      Object.entries(updateData).filter(([, v]) => v !== undefined)
    );

    const updated = await db.update(testimonials).set(filtered).where(eq(testimonials.id, id)).returning();
    if (!updated.length) return apiError('Testimonial not found', 404);

    return apiSuccess(updated[0]);
  } catch (error) {
    return handleApiError(error, 'Failed to update testimonial');
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAuth();
    if (isAuthError(authResult)) return authResult;

    const { id } = await context.params;
    const deleted = await db.delete(testimonials).where(eq(testimonials.id, id)).returning();
    if (!deleted.length) return apiError('Testimonial not found', 404);

    return apiSuccess({ message: 'Testimonial deleted', deletedId: id });
  } catch (error) {
    return handleApiError(error, 'Failed to delete testimonial');
  }
}
