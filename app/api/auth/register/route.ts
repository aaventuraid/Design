import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    const { email, username, password, role = 'USER' } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email dan password diperlukan' }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Format email tidak valid' }, { status: 400 });
    }

    // Validate password strength
    if (password.length < 6) {
      return NextResponse.json({ error: 'Password minimal 6 karakter' }, { status: 400 });
    }

    try {
      const user = await DatabaseService.createUser({
        email,
        username,
        password,
        role: role as 'ADMIN' | 'USER' | 'PREMIUM',
      });

      const session = await DatabaseService.createSession(user.id);

      // Log audit
      await DatabaseService.logAudit({
        userId: user.id,
        action: 'REGISTER',
        resource: 'auth',
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
      });

      return NextResponse.json(
        {
          token: session.token,
          user: {
            id: user.id,
            email: user.email,
            username: user.username,
            role: user.role,
          },
          expiresAt: session.expiresAt,
        },
        { status: 201 },
      );
    } catch (error: any) {
      if (error.code === 'P2002') {
        // Prisma unique constraint violation
        const field = error.meta?.target?.includes('email') ? 'Email' : 'Username';
        return NextResponse.json({ error: `${field} sudah digunakan` }, { status: 409 });
      }
      throw error;
    }
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
