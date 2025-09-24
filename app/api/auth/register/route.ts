import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/database';
import { validateEmail, validatePassword, validateUsername, sanitizeInput } from '@/lib/validators';

// Explicitly mark this route as dynamic
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const { email, username, password, role = 'USER' } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email dan password diperlukan' }, { status: 400 });
    }

    // Sanitize inputs
    const sanitizedEmail = sanitizeInput(email);
    const sanitizedUsername = username ? sanitizeInput(username) : undefined;

    // Validate email format
    if (!validateEmail(sanitizedEmail)) {
      return NextResponse.json({ error: 'Format email tidak valid' }, { status: 400 });
    }

    // Validate password strength
    if (!validatePassword(password)) {
      return NextResponse.json({ error: 'Password minimal 8 karakter' }, { status: 400 });
    }

    // Validate username if provided
    if (sanitizedUsername && !validateUsername(sanitizedUsername)) {
      return NextResponse.json(
        { error: 'Username harus 3-30 karakter, hanya huruf, angka, dan underscore' },
        { status: 400 },
      );
    }

    try {
      const user = await DatabaseService.createUser({
        email: sanitizedEmail,
        username: sanitizedUsername,
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
