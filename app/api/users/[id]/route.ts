import { NextRequest } from 'next/server';
import { db } from '@/db';
import { user as userTable, User } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { requireAuth, requireAdmin, isAuthError } from '@/lib/auth/require';
import { apiSuccess, apiError, handleApiError, parseJsonBody } from '@/lib/api/response';


// GET handler to fetch a specific user
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const authResult = await requireAuth();
    if (isAuthError(authResult)) return authResult;
    const { userId, role } = authResult;

    if (role !== 'admin' && userId !== id) {
      return apiError('Forbidden: Admin access required', 403);
    }

    const dbUser = await db.query.user.findFirst({
      where: eq(userTable.id, id),
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
    const authResult = await requireAuth();
    if (isAuthError(authResult)) return authResult;
    const { userId, role } = authResult;

    if (role !== 'admin' && userId !== id) {
      return apiError('Forbidden: Cannot update other users', 403);
    }

    const userData = await parseJsonBody<Record<string, any>>(request);

    // If not admin, remove sensitive fields
    if (role !== 'admin') {
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

    const { role: newRole, ...otherUserDataFields } = userData;
    const updatePayload: Partial<User> = {
      ...otherUserDataFields,
      updatedAt: new Date(),
    };

    // If role was part of userData (meaning an admin is trying to set it,
    // as non-admin attempts to include 'role' would have been deleted from userData earlier)
    if (Object.prototype.hasOwnProperty.call(userData, 'role')) {
      if (typeof newRole !== 'string' || !['admin', 'student'].includes(newRole)) {
        return apiError('Invalid role. Must be "admin" or "student".', 400);
      }
      updatePayload.role = newRole as 'admin' | 'student';
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
    const authResult = await requireAdmin();
    if (isAuthError(authResult)) return authResult;
    const { userId } = authResult;

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
