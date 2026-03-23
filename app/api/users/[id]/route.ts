import { NextRequest } from 'next/server';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { db } from '@/db';
import { user as userTable, User } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { apiSuccess, apiError, handleApiError, parseJsonBody } from '@/lib/api/response';


// GET handler to fetch a specific user
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    // Check authentication
    const session = await auth.api.getSession({ headers: await headers() });
    const userId = session?.user?.id ?? null;
    if (!userId) {
      return apiError('Unauthorized', 401);
    }

    const currentUser = await db.query.user.findFirst({
      where: eq(userTable.id, userId),
    });

    if (!currentUser) {
      return apiError('User not found', 404);
    }

    if (currentUser.role !== 'admin' && userId !== id) {
      return apiError('Forbidden: Admin access required', 403);
    }

    const requestedUserId = id;

    // Fetch user from our database
    const dbUser = await db.query.user.findFirst({
      where: eq(userTable.id, requestedUserId),
    });

    if (!dbUser) {
      return apiError('User not found', 404);
    }

    return apiSuccess(dbUser);
  } catch (error) {
    return handleApiError(error, 'Failed to fetch user');
  }
}

// PATCH handler to update a specific user
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    // Check authentication
    const session = await auth.api.getSession({ headers: await headers() });
    const userId = session?.user?.id ?? null;
    if (!userId) {
      return apiError('Unauthorized', 401);
    }

    const currentUser = await db.query.user.findFirst({
      where: eq(userTable.id, userId),
    });

    if (!currentUser) {
      return apiError('User not found', 404);
    }

    const userData = await parseJsonBody<Record<string, any>>(request);

    if (currentUser.role !== 'admin' && userId !== id) {
      return apiError('Forbidden: Cannot update other users', 403);
    }

    // If not admin, remove sensitive fields
    if (currentUser.role !== 'admin') {
      delete userData.role;
      delete userData.active;
    }

    // Check if user exists
    const existingUser = await db.query.user.findFirst({
      where: eq(userTable.id, id),
    });

    if (!existingUser) {
      return apiError('User not found', 404);
    }

    const { role, ...otherUserDataFields } = userData;
    const updatePayload: Partial<User> = {
      ...otherUserDataFields,
      updatedAt: new Date(),
    };

    // If role was part of userData (meaning an admin is trying to set it,
    // as non-admin attempts to include 'role' would have been deleted from userData earlier)
    if (Object.prototype.hasOwnProperty.call(userData, 'role')) {
      if (typeof role !== 'string' || !['admin', 'student'].includes(role)) {
        return apiError('Invalid role. Must be "admin" or "student".', 400);
      }
      updatePayload.role = role as 'admin' | 'student';
    }

    await db.update(userTable)
      .set(updatePayload)
      .where(eq(userTable.id, id));

    // Fetch updated user
    const updatedUser = await db.query.user.findFirst({
      where: eq(userTable.id, id),
    });

    return apiSuccess({
      message: 'User updated successfully',
      user: updatedUser
    });
  } catch (error) {
    return handleApiError(error, 'Failed to update user');
  }
}

// DELETE handler to delete a specific user
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    // Check authentication
    const session = await auth.api.getSession({ headers: await headers() });
    const userId = session?.user?.id ?? null;
    if (!userId) {
      return apiError('Unauthorized', 401);
    }

    const currentUser = await db.query.user.findFirst({
      where: eq(userTable.id, userId),
    });

    if (!currentUser || currentUser.role !== 'admin') {
      return apiError('Forbidden: Admin access required', 403);
    }

    const existingUser = await db.query.user.findFirst({
      where: eq(userTable.id, id),
    });

    if (!existingUser) {
      return apiError('User not found', 404);
    }

    if (id === userId) {
      return apiError('Cannot delete your own account', 400);
    }

    await db.delete(userTable)
      .where(eq(userTable.id, id));

    return apiSuccess({ message: 'User deleted successfully' });
  } catch (error) {
    return handleApiError(error, 'Failed to delete user');
  }
}
