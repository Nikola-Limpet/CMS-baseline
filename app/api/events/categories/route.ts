import { db } from '@/db';
import { eventCategories } from '@/db/schema';
import { requireAuth, isAuthError } from '@/lib/auth/require';
import { apiSuccess, apiError, handleApiError } from '@/lib/api/response';

export async function GET() {
  try {
    const categories = await db.select().from(eventCategories);
    return apiSuccess(categories);
  } catch (error) {
    return handleApiError(error, 'Failed to fetch event categories');
  }
}

export async function POST(request: Request) {
  try {
    const authResult = await requireAuth();
    if (isAuthError(authResult)) return authResult;

    const body = await request.json();
    const name = body.name;
    const description = body.description;

    if (typeof name !== 'string' || !name.trim()) {
      return apiError('Category name must be a non-empty string', 400);
    }

    const slug = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const result = await db.insert(eventCategories).values({
      name,
      slug,
      description: description || null,
    }).returning();

    return apiSuccess(result[0], 201);
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'code' in error && error.code === '23505') {
      return apiError('A category with this name already exists.', 409);
    }
    return handleApiError(error, 'Failed to create event category');
  }
}
