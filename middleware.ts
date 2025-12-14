// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const adminToken = request.cookies.get('admin-token');
  const isAdminPath = request.nextUrl.pathname.startsWith('/admin');
  const isLoginPage = request.nextUrl.pathname === '/admin/login';
  
  // Rule 1: Allow access to login page for everyone
  if (isLoginPage) {
    return NextResponse.next();
  }
  
  // Rule 2: Block access to admin routes without token
  if (isAdminPath && !adminToken) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }
  
  // Rule 3: Allow access to admin routes with token
  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
};