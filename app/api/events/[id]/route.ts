import { type NextRequest } from 'next/server';
import { z } from 'zod';
import { db } from '@/db';
import { events, eventPostCategories } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { generateSlug } from '@/lib/utils';
import { requireAuth, isAuthError } from '@/lib/auth/require';
import { apiSuccess, apiError, handleApiError, parseJsonBody } from '@/lib/api/response';

const eventUpdateSchema = z.object({
  title: z.string().min(3).max(255).optional(),
  content: z.string().min(10).optional(),
  excerpt: z.string().max(500).optional().nullable(),
  cover_image: z.string().url().optional().nullable().or(z.literal('').transform(() => null)),
  published: z.boolean().optional(),
  user_id: z.string().optional(),
  slug: z.string().optional(),
  event_date: z.string().optional().transform((s) => s ? new Date(s) : undefined),
  event_end_date: z.string().optional().nullable().transform((s) => s ? new Date(s) : null),
  location: z.string().max(255).optional().nullable(),
  registration_url: z.string().url().optional().nullable().or(z.literal('').transform(() => null)),
  categories: z.array(z.string()).optional(),
  // SEO fields
  meta_title: z.string().max(255).optional().nullable().or(z.literal('').transform(() => null)),
  meta_description: z.string().max(500).optional().nullable().or(z.literal('').transform(() => null)),
  og_image: z.string().url().optional().nullable().or(z.literal('').transform(() => null)),
  canonical_url: z.string().url().optional().nullable().or(z.literal('').transform(() => null)),
  no_index: z.boolean().optional(),
});

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAuth();
    if (isAuthError(authResult)) return authResult;

    const { id } = await context.params;
    const [event] = await db.select().from(events).where(eq(events.id, id)).limit(1);
    if (!event) return apiError('Event not found', 404);

    const categoriesData = await db
      .select({ categoryId: eventPostCategories.categoryId })
      .from(eventPostCategories)
      .where(eq(eventPostCategories.eventId, id));

    return apiSuccess({ ...event, categories: categoriesData.map(c => c.categoryId) });
  } catch (error) {
    return handleApiError(error, 'Failed to fetch event');
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
    const [existing] = await db.select({ id: events.id }).from(events).where(eq(events.id, id)).limit(1);
    if (!existing) return apiError('Event not found', 404);

    await db.transaction(async (tx) => {
      await tx.delete(eventPostCategories).where(eq(eventPostCategories.eventId, id));
      await tx.delete(events).where(eq(events.id, id));
    });

    return apiSuccess({ message: 'Event deleted successfully', deletedId: id });
  } catch (error) {
    return handleApiError(error, 'Failed to delete event');
  }
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  try {
    const authResult = await requireAuth();
    if (isAuthError(authResult)) return authResult;

    const body = await parseJsonBody<Record<string, unknown>>(request);
    const parsed = eventUpdateSchema.safeParse(body);
    if (!parsed.success) return apiError('Invalid request body', 400, parsed.error.format());

    const data = parsed.data;

    const existing = await db.query.events.findFirst({
      where: and(eq(events.id, id), eq(events.userId, authResult.userId)),
    });
    if (!existing) return apiError('Event not found or no permission', 404);

    const updateData: Record<string, unknown> = {
      title: data.title,
      content: data.content,
      excerpt: data.excerpt,
      coverImage: data.cover_image !== undefined ? (data.cover_image?.trim() || null) : undefined,
      published: data.published,
      slug: data.slug || (data.title ? generateSlug(data.title) : undefined),
      eventDate: data.event_date,
      eventEndDate: data.event_end_date,
      location: data.location,
      registrationUrl: data.registration_url !== undefined ? (data.registration_url?.trim() || null) : undefined,
      updatedAt: new Date(),
      publishedAt: data.published && !existing.published ? new Date() : existing.publishedAt,
      // SEO fields
      metaTitle: data.meta_title,
      metaDescription: data.meta_description,
      ogImage: data.og_image,
      canonicalUrl: data.canonical_url,
      noIndex: data.no_index,
    };

    const filtered = Object.fromEntries(
      Object.entries(updateData).filter(([, v]) => v !== undefined)
    );

    const updated = await db.update(events).set(filtered).where(eq(events.id, id)).returning();

    if (data.categories && Array.isArray(data.categories)) {
      await db.delete(eventPostCategories).where(eq(eventPostCategories.eventId, id));
      for (const categoryId of data.categories.filter(id => id?.trim())) {
        try {
          await db.insert(eventPostCategories).values({ eventId: id, categoryId: categoryId.trim() });
        } catch (error) {
          console.error(`Error inserting event category ${categoryId}:`, error);
        }
      }
    }

    return apiSuccess({ ...updated[0], message: 'Event updated successfully' });
  } catch (error) {
    if (error instanceof Error && error.message.includes('unique constraint')) {
      return apiError('An event with this slug already exists', 409);
    }
    return handleApiError(error, `Failed to update event ${id}`);
  }
}
