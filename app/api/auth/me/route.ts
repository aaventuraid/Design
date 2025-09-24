import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/middleware';

// Explicitly mark this route as dynamic
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  return withAuth(request, async (_, user) => {
    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
        createdAt: user.createdAt,
        lastLoginAt: user.lastLoginAt,
      },
    });
  });
}
