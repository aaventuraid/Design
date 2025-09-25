import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  // TEMPORARY: Completely disable middleware for debugging redirect loop
  console.log(`[MIDDLEWARE] ${request.method} ${request.nextUrl.pathname}`);
  return NextResponse.next();
}

export const config = {
  // Temporary disable matcher for debugging
  matcher: [],
};
