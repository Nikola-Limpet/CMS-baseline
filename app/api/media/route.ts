import { type NextRequest } from 'next/server';
import { z } from 'zod';
import { db } from '@/db';
import { mediaAssets } from '@/db/schema';
import { desc, like } from 'drizzle-orm';
import { requireAuth, isAuthError } from '@/lib/auth/require';
import { apiSuccess, apiError, handleApiError, parseJsonBody } from '@/lib/api/response';

const mediaCreateSchema = z.object({
  filename: z.string().min(1).max(255),
  s3_key: z.string().min(1).max(500),
  url: z.string().url().max(500),
  mime_type: z.string().min(1).max(100),
  size: z.number().int().positive(),
  alt_text: z.string().max(255).optional().nullable(),
});

export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAuth();
    if (isAuthError(authResult)) return authResult;

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');

    let query = db.select().from(mediaAssets).orderBy(desc(mediaAssets.createdAt)).$dynamic();
    if (search) {
      query = query.where(like(mediaAssets.filename, `%${search}%`));
    }

    const rows = await query;
    return apiSuccess(rows);
  } catch (error) {
    return handleApiError(error, 'Failed to fetch media assets');
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAuth();
    if (isAuthError(authResult)) return authResult;

    const body = await parseJsonBody<Record<string, unknown>>(request);
    const data = mediaCreateSchema.parse(body);

    const result = await db.insert(mediaAssets).values({
      filename: data.filename,
      s3Key: data.s3_key,
      url: data.url,
      mimeType: data.mime_type,
      size: data.size,
      altText: data.alt_text,
      uploadedBy: authResult.userId,
    }).returning();

    return apiSuccess(result[0], 201);
  } catch (error) {
    if (error instanceof z.ZodError) return apiError('Validation failed', 400, error.errors);
    return handleApiError(error, 'Failed to create media record');
  }
}
