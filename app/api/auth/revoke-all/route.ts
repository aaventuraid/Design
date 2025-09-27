import { NextRequest, NextResponse } from 'next/server';
import { extractBearerToken } from '@/lib/utils';
import { DatabaseService } from '@/lib/database';
import { captureError } from '@/lib/monitoring';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  const token = extractBearerToken(request);
  if (!token) return NextResponse.json({ error: 'Token diperlukan' }, { status: 400 });
  try {
    const user = await DatabaseService.validateSession(token);
    if (!user) return NextResponse.json({ error: 'Token tidak valid' }, { status: 401 });

    const deleted = await DatabaseService.deleteAllSessionsForUser(user.id);
    const newSession = await DatabaseService.createSession(user.id);

    await DatabaseService.logAudit({
      userId: user.id,
      action: 'REVOKE_ALL_SESSIONS',
      resource: 'auth',
      details: { deleted, rotated: true },
      ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
    });

    return NextResponse.json({ token: newSession.token, expiresAt: newSession.expiresAt });
  } catch (e: any) {
    captureError(e, { route: 'revoke-all' });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
