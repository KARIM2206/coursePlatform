import { NextResponse } from 'next/server'
import { locales, defaultLocale } from './i18n/config'

export function middleware(request) {
  const { pathname } = request.nextUrl
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (pathnameHasLocale) return

  // احصل على اللغة من الكوكيز أو القيمة الافتراضية
  const locale = request.cookies.get('NEXT_LOCALE')?.value || defaultLocale
  request.nextUrl.pathname = `/${locale}${pathname}`
  return NextResponse.redirect(request.nextUrl)
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}