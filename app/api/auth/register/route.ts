import { NextRequest } from 'next/server';
import { DatabaseService } from '@/lib/database';
import { jsonCreated, jsonError, withRoute } from '@/lib/api';
import { validateEmail, validatePassword, validateUsername, sanitizeInput } from '@/lib/validators';

// Explicitly mark this route as dynamic
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  return withRoute(async () => {
    const body = await request.json().catch(() => null);
    if (!body?.email || !body?.password) {
      return jsonError('Email dan password diperlukan', 400);
    }
    const role = body.role || 'USER';

    const sanitizedEmail = sanitizeInput(body.email);
    const sanitizedUsername = body.username ? sanitizeInput(body.username) : undefined;

    if (!validateEmail(sanitizedEmail)) return jsonError('Format email tidak valid', 400);
    if (!validatePassword(body.password)) return jsonError('Password minimal 8 karakter', 400);
    if (sanitizedUsername && !validateUsername(sanitizedUsername)) {
      return jsonError('Username harus 3-30 karakter, hanya huruf, angka, dan underscore', 400);
    }

    let user;
    try {
      user = await DatabaseService.createUser({
        email: sanitizedEmail,
        username: sanitizedUsername,
        password: body.password,
        role: role as 'ADMIN' | 'USER' | 'PREMIUM',
      });
    } catch (error: any) {
      if (error.code === 'P2002') {
        const field = error.meta?.target?.includes('email') ? 'Email' : 'Username';
        return jsonError(`${field} sudah digunakan`, 409);
      }
      throw error;
    }

    const session = await DatabaseService.createSession(user.id);
    await DatabaseService.logAudit({
      userId: user.id,
      action: 'REGISTER',
      resource: 'auth',
      ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
    });

    return jsonCreated({
      token: session.token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
      },
      expiresAt: session.expiresAt,
    });
  });
}
