import { cache } from 'react';
import { db } from '@/db';
import { mediaAssets } from '@/db/schema';
import { eq, desc, sql } from 'drizzle-orm';
import type { MediaAsset } from '@/db/schema';

export const getAllMediaForAdmin = cache(
  async (): Promise<MediaAsset[]> => {
    try {
      return await db
        .select()
        .from(mediaAssets)
        .orderBy(desc(mediaAssets.createdAt));
    } catch (error) {
      console.error('[DAL] Error fetching media assets:', error);
      return [];
    }
  }
);

export const getMediaStats = cache(
  async (): Promise<{ count: number; totalSize: number }> => {
    try {
      const [result] = await db
        .select({
          count: sql<number>`count(*)::int`,
          totalSize: sql<number>`coalesce(sum(${mediaAssets.size}), 0)::int`,
        })
        .from(mediaAssets);
      return result ?? { count: 0, totalSize: 0 };
    } catch (error) {
      console.error('[DAL] Error fetching media stats:', error);
      return { count: 0, totalSize: 0 };
    }
  }
);
