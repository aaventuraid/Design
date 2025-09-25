import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { DatabaseService } from '@/lib/database';

export async function middleware(request: NextRequest) {
  // Apply to admin routes only
  if (!request.nextUrl.pathname.startsWith('/admin')) {
    return NextResponse.next();
  }

  // Skip auth check for login page
  if (request.nextUrl.pathname === '/admin/login') {
    return NextResponse.next();
  }

  // Handle reverse proxy headers properly
  const protocol = request.headers.get('x-forwarded-proto') || 'http';
  const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || 'localhost:3000';
  const baseUrl = `${protocol}://${host}`;

  try {
    // Get token from cookie
    const token = request.cookies.get('admin-session')?.value;

    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', baseUrl));
    }

    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any;

    if (decoded.sessionType !== 'admin') {
      return NextResponse.redirect(new URL('/admin/login', baseUrl));
    }

    // Verify session still exists
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
  matcher: ['/admin/:path*'],
};
