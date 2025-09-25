import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { DatabaseService } from '@/lib/database';

export async function middleware(request: NextRequest) {
  // Temporary disable middleware for debugging redirect loop
  console.log(`[MIDDLEWARE] ${request.method} ${request.nextUrl.pathname}`);
  
  // Apply to admin routes only
  if (!request.nextUrl.pathname.startsWith('/admin')) {
    return NextResponse.next();
  }

  // Skip auth check for login page
  if (request.nextUrl.pathname === '/admin/login') {
    return NextResponse.next();
  }

  // TEMPORARY: Skip all admin auth checks to test redirect loop
  console.log(`[MIDDLEWARE] Skipping auth check for debugging: ${request.nextUrl.pathname}`);
  return NextResponse.next();

  // Handle reverse proxy headers properly (disabled for now)
  const protocol = request.headers.get('x-forwarded-proto') || 'http';
  const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || 'localhost:3000';
  const baseUrl = `${protocol}://${host}`;

  try {
    // Get token from cookie
    const token = request.cookies.get('admin-session')?.value;

    if (!token || typeof token !== 'string') {
      return NextResponse.redirect(new URL('/admin/login', baseUrl));
    }

    // Verify JWT with proper type checking
    const jwtSecret = process.env.JWT_SECRET || 'fallback-secret';
    const decoded = jwt.verify(token, jwtSecret) as any;

    if (decoded.sessionType !== 'admin') {
      return NextResponse.redirect(new URL('/admin/login', baseUrl));
    }

    // Verify session still exists (token is guaranteed to be string here)
    const user = await DatabaseService.validateSession(token);
    if (!user || user.role !== 'ADMIN') {
      const response = NextResponse.redirect(new URL('/admin/login', baseUrl));
      response.cookies.delete('admin-session');
      return response;
    }

    // Add user info to headers for components
    const response = NextResponse.next();
    response.headers.set('x-admin-user-id', user.id);
    response.headers.set('x-admin-email', user.email);

    return response;
  } catch (error) {
    // Invalid token
    const response = NextResponse.redirect(new URL('/admin/login', baseUrl));
    response.cookies.delete('admin-session');
    return response;
  }
}

export const config = {
  // Temporary disable matcher for debugging
  matcher: [],
};
