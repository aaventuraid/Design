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

    const rotated = await DatabaseService.rotateSession(token);
    if (!rotated) return NextResponse.json({ error: 'Rotasi gagal' }, { status: 400 });

    await DatabaseService.logAudit({
      userId: user.id,
      action: 'ROTATE_SESSION',
      resource: 'auth',
      details: { rotated: true },
      ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
    });

    return NextResponse.json({ token: rotated.newToken, expiresAt: rotated.expiresAt });
  } catch (e: any) {
    captureError(e, { route: 'rotate-session' });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
