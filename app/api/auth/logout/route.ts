import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

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
