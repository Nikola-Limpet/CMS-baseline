import { NextRequest } from 'next/server';
import { db } from '@/db';
import { user as userTable } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';
import { requireAdmin, requireAuth, isAuthError } from '@/lib/auth/require';
import { apiSuccess, apiError, handleApiError, parseJsonBody } from '@/lib/api/response';

// GET handler to fetch all users (Admin only)
export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAdmin();
    if (isAuthError(authResult)) return authResult;

    // Get query parameters for filtering and pagination
    const url = new URL(request.url);
    const role = url.searchParams.get('role');
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    // Execute query with filters and pagination
    const dbUsers = await db.select()
      .from(userTable)
      .where(role ? eq(userTable.role, role as any) : undefined)
      .limit(limit)
      .offset(offset);

    // Get total count for pagination
    const totalCountResult = await db.select({ value: sql`count(*)` }).from(userTable);
    const total = Number(totalCountResult[0].value);

    return apiSuccess({
      users: dbUsers,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    return handleApiError(error, 'Failed to fetch users');
  }
}

// POST handler to create or update a user in our database
export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAuth();
    if (isAuthError(authResult)) return authResult;

    const userData = await parseJsonBody<Record<string, any>>(request);

    if (!userData.id || !userData.email) {
      return apiError('Missing required fields: id and email are required', 400);
    }

    // Check if user already exists
    const existingUser = await db.query.user.findFirst({
      where: eq(userTable.id, userData.id),
    });

    if (existingUser) {
      // Update existing user
      const updateData: Partial<typeof userTable.$inferInsert> = {
        email: userData.email,
        name: userData.name,
        image: userData.image,
        bio: userData.bio,
        banned: userData.banned,
        updatedAt: new Date(),
      };

      if (userData.role && !['admin', 'user'].includes(userData.role)) {
        return apiError('Invalid role. Must be "admin" or "user".', 400);
      }
      if (userData.role) {
        updateData.role = userData.role;
      }

      await db.update(userTable).set(updateData).where(eq(userTable.id, userData.id));

      return apiSuccess({
        message: 'User updated successfully',
        user: {
          ...existingUser,
          ...updateData,
        }
      });
    } else {
      // Create new user (Better Auth handles signup; this is admin-only fallback)
      const newUser = await db.insert(userTable)
        .values({
          id: userData.id,
          email: userData.email,
          name: userData.name || userData.email.split('@')[0],
          emailVerified: false,
          role: userData.role && ['admin', 'user'].includes(userData.role) ? userData.role : 'user',
          image: userData.image,
          bio: userData.bio,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();

      return apiSuccess({
        message: 'User created successfully',
        user: newUser[0]
      }, 201);
    }
  } catch (error) {
    return handleApiError(error, 'Failed to create/update user');
  }
}
