import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/database';

// Explicitly mark this route as dynamic
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email dan password diperlukan' }, { status: 400 });
    }

    const user = await DatabaseService.authenticateUser(email, password);

    if (!user) {
      return NextResponse.json({ error: 'Email atau password salah' }, { status: 401 });
    }

    const session = await DatabaseService.createSession(user.id);

    // Log audit
    await DatabaseService.logAudit({
      userId: user.id,
      action: 'LOGIN',
      resource: 'auth',
      ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
    });

    return NextResponse.json({
      token: session.token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
      },
      expiresAt: session.expiresAt,
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
