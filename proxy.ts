import { getSessionCookie } from "better-auth/cookies";
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Locale configuration
const LOCALE_COOKIE = 'NEXT_LOCALE';
const locales = ['en', 'km'] as const;
type Locale = (typeof locales)[number];
const defaultLocale: Locale = 'en';

function getLocaleFromRequest(request: NextRequest): Locale {
  // 1. Check cookie first
  const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value;
  if (cookieLocale && locales.includes(cookieLocale as Locale)) {
    return cookieLocale as Locale;
  }

  // 2. Check Accept-Language header
  const acceptLanguage = request.headers.get('accept-language');
  if (acceptLanguage) {
    const languages = acceptLanguage.split(',').map(lang => {
      const [code, q = 'q=1'] = lang.trim().split(';');
      return {
        code: code.split('-')[0].toLowerCase(),
        quality: parseFloat(q.split('=')[1]) || 1,
      };
    });
    languages.sort((a, b) => b.quality - a.quality);
    for (const { code } of languages) {
      if (locales.includes(code as Locale)) {
        return code as Locale;
      }
    }
  }

  return defaultLocale;
}

// Protected routes that require authentication
const protectedPatterns = [
  '/dashboard',
];

function isProtectedRoute(pathname: string): boolean {
  return protectedPatterns.some(pattern => pathname.startsWith(pattern));
}

// Auth routes (sign-in, sign-up) — redirect if already authenticated
const authPatterns = ['/sign-in', '/sign-up'];

function isAuthRoute(pathname: string): boolean {
  return authPatterns.some(pattern => pathname.startsWith(pattern));
}

// Next.js 16 requires named export 'proxy' instead of default export
export const proxy = (request: NextRequest) => {
  const response = NextResponse.next();
  const pathname = request.nextUrl.pathname;

  // Handle locale detection and cookie setting
  const locale = getLocaleFromRequest(request);
  if (!request.cookies.has(LOCALE_COOKIE)) {
    response.cookies.set(LOCALE_COOKIE, locale, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365, // 1 year
      sameSite: 'lax',
    });
  }

  const sessionCookie = getSessionCookie(request);

  // Redirect unauthenticated users away from protected routes
  if (isProtectedRoute(pathname) && !sessionCookie) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  // Redirect authenticated users away from auth routes
  if (isAuthRoute(pathname) && sessionCookie) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return response;
};

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
