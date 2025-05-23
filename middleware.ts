import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { match as matchLocale } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';
import { i18n } from '@/config/i18n.config';

function getLocale(request: NextRequest): string {
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  const locales = i18n.locales;
  const languages = new Negotiator({ headers: negotiatorHeaders }).languages();

  const locale = matchLocale(languages, locales, i18n.defaultLocale);
  return locale;
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const pathnameIsMissingLocale = i18n.locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  // Check for session cart cookie
  const sessionCartId = request.cookies.get('sessionCartId');
  let response = NextResponse.next();

  // If there's no sessionCartId, create one
  if (!sessionCartId) {
    const newSessionCartId = crypto.randomUUID();
    response.cookies.set('sessionCartId', newSessionCartId);
  }

  // Handle locale redirect if needed
  if (pathnameIsMissingLocale) {
    const locale = getLocale(request);
    response = NextResponse.redirect(
      new URL(
        `/${locale}${pathname.startsWith('/') ? '' : '/'}${pathname}`,
        request.url
      )
    );

    // Ensure we preserve the sessionCartId even during redirect
    if (!sessionCartId) {
      response.cookies.set('sessionCartId', crypto.randomUUID());
    }
  }

  return response;
}

export const config = {
  // Matcher ignoring `/_next/` and `/api/`
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
