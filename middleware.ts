import { NextResponse, type NextRequest } from 'next/server';

const locales = ['en', 'zh'];
const defaultLocale = 'en';

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (!hasLocale) {
    const url = request.nextUrl.clone();
    url.pathname = `/${defaultLocale}${pathname}`;
    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: ['/((?!_next|_static|favicon.ico|.*\\..*).*)']
};
