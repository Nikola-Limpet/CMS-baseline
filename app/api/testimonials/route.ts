import { type NextRequest } from 'next/server';
import { z } from 'zod';
import { db } from '@/db';
import { testimonials } from '@/db/schema';
import { desc } from 'drizzle-orm';
import { requireAuth, isAuthError } from '@/lib/auth/require';
import { apiSuccess, apiError, handleApiError, parseJsonBody } from '@/lib/api/response';

const testimonialSchema = z.object({
  author_name: z.string().min(1).max(255),
  author_title: z.string().max(255).optional().nullable(),
  author_image: z.string().url().optional().nullable().or(z.literal('').transform(() => null)),
  content: z.string().min(3),
  rating: z.number().int().min(1).max(5).optional().nullable(),
  featured: z.boolean().default(false),
  published: z.boolean().default(false),
  display_order: z.number().int().default(0),
});

export async function GET() {
  try {
    const authResult = await requireAuth();
    if (isAuthError(authResult)) return authResult;

    const rows = await db
      .select()
      .from(testimonials)
      .orderBy(desc(testimonials.createdAt));

    return apiSuccess(rows);
  } catch (error) {
    return handleApiError(error, 'Failed to fetch testimonials');
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAuth();
    if (isAuthError(authResult)) return authResult;

    const body = await parseJsonBody<Record<string, unknown>>(request);
    const data = testimonialSchema.parse(body);

    const result = await db.insert(testimonials).values({
      authorName: data.author_name,
      authorTitle: data.author_title,
      authorImage: data.author_image,
      content: data.content,
      rating: data.rating,
      featured: data.featured,
      published: data.published,
      displayOrder: data.display_order,
    }).returning();

    return apiSuccess(result[0], 201);
  } catch (error) {
    if (error instanceof z.ZodError) return apiError('Validation failed', 400, error.errors);
    return handleApiError(error, 'Failed to create testimonial');
  }
}
