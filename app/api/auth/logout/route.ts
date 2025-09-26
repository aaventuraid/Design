import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/database';
import { extractBearerToken } from '@/lib/utils';

// Explicitly mark this route as dynamic
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const token = extractBearerToken(request);

    if (!token) {
      return NextResponse.json({ error: 'Token diperlukan' }, { status: 400 });
    }

    // Get user for audit log
    const user = await DatabaseService.validateSession(token);

    await DatabaseService.deleteSession(token);

    // Log audit
    if (user) {
      await DatabaseService.logAudit({
        userId: user.id,
        action: 'LOGOUT',
        resource: 'auth',
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
      });
    }

    return NextResponse.json({ message: 'Logout berhasil' });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
