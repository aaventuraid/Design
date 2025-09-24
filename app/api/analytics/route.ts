import { NextRequest, NextResponse } from 'next/server';
import { withAuth, withAdminAuth } from '@/lib/middleware';
import { DatabaseService } from '@/lib/database';

// Explicitly mark this route as dynamic
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// User analytics (untuk user sendiri)
export async function GET(request: NextRequest) {
  return withAuth(request, async (_, user) => {
    try {
      const analytics = await DatabaseService.getAnalytics(user.id);

      return NextResponse.json({
        analytics,
        user: {
          id: user.id,
          role: user.role,
          createdAt: user.createdAt,
        },
      });
    } catch (error) {
      console.error('Analytics error:', error);
      return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
    }
  });
}

// Admin analytics (semua data)
export async function POST(request: NextRequest) {
  return withAdminAuth(request, async (_, __) => {
    try {
      const { userId } = await request.json();

      // Jika userId disediakan, ambil data user tersebut. Jika tidak, ambil global
      const analytics = await DatabaseService.getAnalytics(userId);

      // Additional admin-only stats
      const { prisma } = await import('@/lib/database');
      const [totalUsers, activeUsers, premiumUsers] = await Promise.all([
        prisma.user.count(),
        prisma.user.count({
          where: {
            isActive: true,
          },
        }),
        prisma.user.count({
          where: {
            role: 'PREMIUM',
            isActive: true,
          },
        }),
      ]);

      return NextResponse.json({
        analytics,
        systemStats: {
          totalUsers,
          activeUsers,
          premiumUsers,
        },
      });
    } catch (error) {
      console.error('Admin analytics error:', error);
      return NextResponse.json({ error: 'Failed to fetch admin analytics' }, { status: 500 });
    }
  });
}
