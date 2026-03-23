import { type NextRequest } from 'next/server';
import { z } from 'zod';
import { db } from '@/db';
import { events, eventPostCategories, user } from '@/db/schema';
import { eq, desc, asc, like, and, gte, lt } from 'drizzle-orm';
import { generateSlug } from '@/lib/utils';
import { requireAuth, isAuthError } from '@/lib/auth/require';
import { apiSuccess, apiError, handleApiError, parseJsonBody } from '@/lib/api/response';

const eventSchema = z.object({
  title: z.string().min(3).max(255),
  content: z.string().min(10),
  excerpt: z.string().max(500).optional().nullable(),
  cover_image: z.string().url().optional().nullable().or(z.literal('').transform(() => null)),
  published: z.boolean().default(false),
  user_id: z.string().optional(),
  slug: z.string().optional(),
  event_date: z.string().transform((s) => new Date(s)),
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

export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAuth();
    if (isAuthError(authResult)) return authResult;

    const body = await parseJsonBody<Record<string, unknown>>(request);
    const data = eventSchema.parse(body);
    const slug = data.slug || generateSlug(data.title);
    const publishedAt = data.published ? new Date() : null;

    const result = await db.insert(events).values({
      title: data.title,
      slug,
      content: data.content,
      excerpt: data.excerpt,
      coverImage: data.cover_image,
      published: data.published,
      publishedAt,
      eventDate: data.event_date,
      eventEndDate: data.event_end_date,
      location: data.location,
      registrationUrl: data.registration_url,
      userId: authResult.userId,
      metaTitle: data.meta_title,
      metaDescription: data.meta_description,
      ogImage: data.og_image,
      canonicalUrl: data.canonical_url,
      noIndex: data.no_index ?? false,
    }).returning();

    const eventId = result[0].id;

    if (data.categories && data.categories.length > 0) {
      for (const categoryId of data.categories.filter(id => id?.trim())) {
        try {
          await db.insert(eventPostCategories).values({ eventId, categoryId: categoryId.trim() });
        } catch (error) {
          console.error(`Error inserting event category ${categoryId}:`, error);
        }
      }
    }

    return apiSuccess(result[0], 201);
  } catch (error) {
    if (error instanceof z.ZodError) return apiError('Validation failed', 400, error.errors);
    return handleApiError(error, 'Failed to create event');
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const published = searchParams.get('published');
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);
    const upcoming = searchParams.get('upcoming');

    const conditions = [];
    if (published === 'true') conditions.push(eq(events.published, true));
    if (published === 'false') conditions.push(eq(events.published, false));
    if (search) conditions.push(like(events.title, `%${search}%`));
    if (upcoming === 'true') conditions.push(gte(events.eventDate, new Date()));
    if (upcoming === 'false') conditions.push(lt(events.eventDate, new Date()));

    const where = conditions.length > 0 ? and(...conditions) : undefined;
    const orderBy = upcoming === 'true' ? asc(events.eventDate) : desc(events.eventDate);

    const rows = await db
      .select({
        id: events.id,
        title: events.title,
        slug: events.slug,
        content: events.content,
        excerpt: events.excerpt,
        coverImage: events.coverImage,
        published: events.published,
        publishedAt: events.publishedAt,
        eventDate: events.eventDate,
        eventEndDate: events.eventEndDate,
        location: events.location,
        registrationUrl: events.registrationUrl,
        userId: events.userId,
        createdAt: events.createdAt,
        updatedAt: events.updatedAt,
        authorName: user.name,
        authorImage: user.image,
      })
      .from(events)
      .leftJoin(user, eq(events.userId, user.id))
      .where(where)
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset);

    return apiSuccess(rows);
  } catch (error) {
    return handleApiError(error, 'Failed to fetch events');
  }
}
