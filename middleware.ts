import { NextResponse, type NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const pathname = url.pathname;
  const lower = pathname.toLowerCase().replace(/\/+$/, '');
  if (pathname !== lower) {
    url.pathname = lower;
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: '/:path*',
};
