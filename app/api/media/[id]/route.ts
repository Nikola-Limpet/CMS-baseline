import { type NextRequest } from 'next/server';
import { z } from 'zod';
import { db } from '@/db';
import { mediaAssets } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { requireAuth, isAuthError } from '@/lib/auth/require';
import { apiSuccess, apiError, handleApiError, parseJsonBody } from '@/lib/api/response';

const mediaUpdateSchema = z.object({
  alt_text: z.string().max(255).optional().nullable(),
});

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAuth();
    if (isAuthError(authResult)) return authResult;

    const { id } = await context.params;
    const [row] = await db.select().from(mediaAssets).where(eq(mediaAssets.id, id)).limit(1);
    if (!row) return apiError('Media asset not found', 404);

    return apiSuccess(row);
  } catch (error) {
    return handleApiError(error, 'Failed to fetch media asset');
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
    const data = mediaUpdateSchema.parse(body);

    const updated = await db
      .update(mediaAssets)
      .set({ altText: data.alt_text })
      .where(eq(mediaAssets.id, id))
      .returning();

    if (!updated.length) return apiError('Media asset not found', 404);
    return apiSuccess(updated[0]);
  } catch (error) {
    return handleApiError(error, 'Failed to update media asset');
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
    const deleted = await db.delete(mediaAssets).where(eq(mediaAssets.id, id)).returning();
    if (!deleted.length) return apiError('Media asset not found', 404);

    return apiSuccess({ message: 'Media asset deleted', deletedId: id });
  } catch (error) {
    return handleApiError(error, 'Failed to delete media asset');
  }
}
