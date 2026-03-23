import { NextResponse } from 'next/server';

/**
 * Standardized API response shapes:
 * Success: { success: true, data: T }
 * Error:   { success: false, error: string, details?: unknown }
 */

export function apiSuccess<T>(data: T, status = 200): NextResponse {
  return NextResponse.json({ success: true, data }, { status });
}

export function apiMessage(message: string, status = 200): NextResponse {
  return NextResponse.json({ success: true, message }, { status });
}

export function apiError(message: string, status = 400, details?: unknown): NextResponse {
  const body: { success: false; error: string; details?: unknown } = {
    success: false,
    error: message,
  };
  if (details !== undefined) {
    body.details = details;
  }
  return NextResponse.json(body, { status });
}

export async function parseJsonBody<T>(request: Request): Promise<T> {
  try {
    return (await request.json()) as T;
  } catch {
    throw new ApiError('Invalid JSON in request body', 400);
  }
}

export class ApiError extends Error {
  status: number;
  details?: unknown;

  constructor(message: string, status = 400, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

export function handleApiError(error: unknown, fallbackMessage: string): NextResponse {
  if (error instanceof ApiError) {
    return apiError(error.message, error.status, error.details);
  }

  console.error(`${fallbackMessage}:`, error);
  return apiError(fallbackMessage, 500);
}
