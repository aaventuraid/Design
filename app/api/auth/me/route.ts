import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/middleware';

export async function GET(request: NextRequest) {
  return withAuth(request, async (req, user) => {
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
