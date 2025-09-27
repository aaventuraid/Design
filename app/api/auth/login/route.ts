import { NextRequest } from 'next/server';
import { DatabaseService, prisma } from '@/lib/database';
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

    let authResult;
    try {
      authResult = await DatabaseService.authenticateUserDetailed(body.email, body.password);
    } catch (e: any) {
      captureError(e, { reqId, stage: 'authenticateUser' });
      throw e;
    }
    if (!authResult.success) {
      // Opportunistic admin auto-provision if first login after deployment
      const defaultAdminEmail = process.env.ADMIN_EMAIL || 'admin@yukiyaki.id';
      if (authResult.reason === 'NOT_FOUND' && body.email === defaultAdminEmail) {
        logger.warn('auth.login:admin_missing_attempt_provision', { reqId, email: body.email });
        try {
          const password = body.password;
          // Basic safeguard: only create if no ANY admin exists
          const existingAdmin = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
          if (!existingAdmin) {
            await DatabaseService.createUser({
              email: defaultAdminEmail,
              password,
              role: 'ADMIN',
              preferences: { theme: 'light', language: 'id', notifications: true },
            });
            logger.info('auth.login:admin_auto_created', { reqId, email: defaultAdminEmail });
            // Re-run authentication
            authResult = await DatabaseService.authenticateUserDetailed(body.email, body.password);
          }
        } catch (e: any) {
          captureError(e, { reqId, stage: 'admin_auto_provision' });
        }
      }
    }
    if (!authResult.success) {
      Metrics.authLogin(401);
      let message = 'Email atau password salah';
      let code = authResult.reason;
      switch (authResult.reason) {
        case 'NOT_FOUND':
          message = 'Akun tidak ditemukan';
          break;
        case 'INACTIVE':
          message = 'Akun nonaktif. Hubungi admin.';
          break;
        case 'INVALID_PASSWORD':
          message = 'Password salah';
          break;
      }
      logger.warn('auth.login:failed', { reqId, email: body.email, reason: authResult.reason });
      return jsonError(message, 401, { code });
    }
    const user = authResult.user;

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
