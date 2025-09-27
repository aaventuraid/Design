import { NextRequest } from 'next/server';
import { DatabaseService } from '@/lib/database';
import '@/lib/bootstrap'; // side-effect: initialize monitoring early
import { jsonError, jsonSuccess, withRoute } from '@/lib/api';
import { logger } from '@/lib/logger';
import { generateRequestId } from '@/lib/utils';
import { captureError } from '@/lib/monitoring';
import { Metrics } from '@/lib/metrics';

// Explicitly mark this route as dynamic
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  const reqId = generateRequestId();
  logger.info('auth.login:start', { reqId });
  return withRoute(async () => {
    const body = await request.json().catch(() => null);
    if (!body?.email || !body?.password) {
      Metrics.authLogin(400);
      return jsonError('Email dan password diperlukan', 400);
    }

    let user;
    try {
      user = await DatabaseService.authenticateUser(body.email, body.password);
    } catch (e: any) {
      captureError(e, { reqId, stage: 'authenticateUser' });
      throw e;
    }
    if (!user) {
      logger.warn('auth.login:invalid_credentials', { reqId, email: body.email });
      Metrics.authLogin(401);
      return jsonError('Email atau password salah', 401);
    }

    const session = await DatabaseService.createSession(user.id);

    await DatabaseService.logAudit({
      userId: user.id,
      action: 'LOGIN',
      resource: 'auth',
      ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
    });

    logger.info('auth.login:success', { reqId, userId: user.id });
    Metrics.authLogin(200);
    return jsonSuccess({
      token: session.token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
      },
      expiresAt: session.expiresAt,
      reqId,
    });
  });
}
