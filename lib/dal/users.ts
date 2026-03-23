import { cache } from 'react';
import { db } from '@/db';
import { user } from '@/db/schema';
import { eq, desc, count } from 'drizzle-orm';
import type { User } from '@/db/schema';

export const getUserById = cache(async (userId: string): Promise<User | null> => {
  try {
    const [result] = await db
      .select()
      .from(user)
      .where(eq(user.id, userId))
      .limit(1);
    return result ?? null;
  } catch (error) {
    console.error('[DAL] Error fetching user by id:', error);
    return null;
  }
});

export const getAllUsersForAdmin = cache(
  async (params?: { page?: number; limit?: number; role?: string }): Promise<{
    users: User[];
    pagination: { total: number; page: number; limit: number; totalPages: number };
  }> => {
    try {
      const page = params?.page ?? 1;
      const limit = params?.limit ?? 10;
      const offset = (page - 1) * limit;

      const conditions = params?.role && params.role !== 'all'
        ? eq(user.role, params.role)
        : undefined;

      const [totalResult, userRows] = await Promise.all([
        db.select({ count: count() }).from(user).where(conditions),
        db
          .select()
          .from(user)
          .where(conditions)
          .orderBy(desc(user.createdAt))
          .limit(limit)
          .offset(offset),
      ]);

      const total = totalResult[0]?.count ?? 0;

      return {
        users: userRows,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      console.error('[DAL] Error fetching all users for admin:', error);
      return {
        users: [],
        pagination: { total: 0, page: 1, limit: 10, totalPages: 0 },
      };
    }
  }
);
