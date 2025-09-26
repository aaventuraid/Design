import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/database';
import jwt from 'jsonwebtoken';
// import bcrypt from 'bcryptjs'; // Unused for now

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Rate limiting for admin auth
const rateLimiter = new Map<string, { count: number; resetTime: number }>();

function getRateLimitKey(ip: string): string {
  return `admin_auth_${ip}`;
}

function checkRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const key = getRateLimitKey(ip);
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxAttempts = 5;

  const current = rateLimiter.get(key);
  if (!current || current.resetTime < now) {
    rateLimiter.set(key, { count: 1, resetTime: now + windowMs });
    return { allowed: true, remaining: maxAttempts - 1 };
  }

  if (current.count >= maxAttempts) {
    return { allowed: false, remaining: 0 };
  }

  current.count++;
  return { allowed: true, remaining: maxAttempts - current.count };
}

export async function POST(req: NextRequest) {
  try {
    const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';

    // Check rate limit
    const rateLimit = checkRateLimit(clientIp);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many authentication attempts. Try again later.' },
        {
          status: 429,
          headers: {
            'X-RateLimit-Remaining': '0',
            'Retry-After': '900', // 15 minutes
          },
        },
      );
    }

    const body = await req.json().catch(() => null);
    if (!body || !body.email || !body.password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const { email, password } = body;

    // Validate input
    if (typeof email !== 'string' || typeof password !== 'string') {
      return NextResponse.json({ error: 'Invalid input format' }, { status: 400 });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    // Authenticate user
    const user = await DatabaseService.authenticateUser(email, password);

    if (!user || user.role !== 'ADMIN') {
      // Log failed attempt
      await DatabaseService.logAudit({
        action: 'ADMIN_LOGIN_FAILED',
        resource: 'admin_auth',
        details: { email, reason: 'Invalid credentials or not admin' },
        ipAddress: clientIp,
        userAgent: req.headers.get('user-agent') || 'unknown',
      });

      return NextResponse.json({ error: 'Invalid admin credentials' }, { status: 401 });
    }

    // Create secure session
    const token = jwt.sign(
      {
        userId: user.id,
        role: user.role,
        sessionType: 'admin',
        iat: Math.floor(Date.now() / 1000),
      },
      process.env.JWT_SECRET || 'fallback-secret',
      {
        expiresIn: '2h', // Short session for admin
        issuer: 'yuki-yaki-admin',
        audience: 'yuki-yaki-app',
      },
    );

    // Save session to database
    await DatabaseService.createSession(user.id);

    // Log successful login
    await DatabaseService.logAudit({
      userId: user.id,
      action: 'ADMIN_LOGIN_SUCCESS',
      resource: 'admin_auth',
      details: { email: user.email },
      ipAddress: clientIp,
      userAgent: req.headers.get('user-agent') || 'unknown',
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });

    // Set secure cookie
    response.cookies.set('admin-session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7200, // 2 hours
      path: '/',
    });

    response.headers.set('X-RateLimit-Remaining', rateLimit.remaining.toString());

    return response;
  } catch (error: any) {
    console.error('Admin auth error:', error);
    return NextResponse.json(
      { error: 'Authentication service temporarily unavailable' },
      { status: 503 },
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const token = req.cookies.get('admin-session')?.value;

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any;

        // Delete session from database
        await DatabaseService.deleteSession(token);

        // Log logout
        await DatabaseService.logAudit({
          userId: decoded.userId,
          action: 'ADMIN_LOGOUT',
          resource: 'admin_auth',
          ipAddress: req.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown',
          userAgent: req.headers.get('user-agent') || 'unknown',
        });
      } catch {
        // Invalid token, but still clear cookie
      }
    }

    const response = NextResponse.json({ success: true });
    response.cookies.delete('admin-session');

    return response;
  } catch (error: any) {
    console.error('Admin logout error:', error);
    const response = NextResponse.json({ success: true }); // Always succeed logout
    response.cookies.delete('admin-session');
    return response;
  }
}
