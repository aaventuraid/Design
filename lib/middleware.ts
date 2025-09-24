import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/database';

// Middleware untuk autentikasi
export async function withAuth(
  request: NextRequest,
  handler: (request: NextRequest, user: any) => Promise<NextResponse>,
) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json({ error: 'Token diperlukan' }, { status: 401 });
    }

    const user = await DatabaseService.validateSession(token);

    if (!user) {
      return NextResponse.json({ error: 'Token tidak valid' }, { status: 401 });
    }

    return await handler(request, user);
  } catch (error) {
    console.error('Auth middleware error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Middleware untuk admin saja
export async function withAdminAuth(
  request: NextRequest,
  handler: (request: NextRequest, user: any) => Promise<NextResponse>,
) {
  return withAuth(request, async (req, user) => {
    if (user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Akses admin diperlukan' }, { status: 403 });
    }
    return await handler(req, user);
  });
}

// Middleware untuk rate limiting
export async function withRateLimit(
  request: NextRequest,
  action: 'IMAGE_PROCESS' | 'COPY_GENERATE' | 'API_CALL',
  handler: (request: NextRequest, user?: any) => Promise<NextResponse>,
) {
  try {
    // Get user from token (optional)
    let user = null;
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (token) {
      user = await DatabaseService.validateSession(token);
    }

    // Check rate limit
    const rateLimit = await DatabaseService.checkRateLimit(user?.id || null, action);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: 'Rate limit exceeded. Coba lagi sebentar.',
          resetTime: rateLimit.resetTime,
          remaining: rateLimit.remaining,
        },
        { status: 429 },
      );
    }

    // Track usage
    await DatabaseService.trackUsage({
      userId: user?.id,
      action,
      ipAddress: getClientIP(request),
    });

    // Add rate limit headers to response
    const response = await handler(request, user);

    response.headers.set('X-RateLimit-Remaining', rateLimit.remaining.toString());
    response.headers.set('X-RateLimit-Reset', rateLimit.resetTime.toISOString());

    return response;
  } catch (error) {
    console.error('Rate limit middleware error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Helper untuk mendapatkan IP client
export function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');

  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  if (realIP) {
    return realIP;
  }

  return 'unknown';
}

// Helper untuk mendapatkan User-Agent
export function getUserAgent(request: NextRequest): string {
  return request.headers.get('user-agent') || 'unknown';
}
