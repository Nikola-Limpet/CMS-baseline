import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { apiError } from '@/lib/api/response';

export interface AuthResult {
  userId: string;
  role: string;
}

export function isAuthError(result: AuthResult | NextResponse): result is NextResponse {
  return result instanceof NextResponse;
}

export async function requireAuth(): Promise<AuthResult | NextResponse> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return apiError('Unauthorized', 401);
  }

  return { userId: session.user.id, role: session.user.role || 'user' };
}

export async function requireAdmin(): Promise<AuthResult | NextResponse> {
  const result = await requireAuth();
  if (isAuthError(result)) {
    return result;
  }

  if (result.role !== 'admin') {
    return apiError('Forbidden: Admin access required', 403);
  }

  return result;
}
