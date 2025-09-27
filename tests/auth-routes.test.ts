import { describe, it, expect } from 'vitest';
import { randomUUID } from 'crypto';
import { POST as loginRoute } from '@/app/api/auth/login/route';
import { POST as rotateRoute } from '@/app/api/auth/rotate/route';
import { POST as revokeAllRoute } from '@/app/api/auth/revoke-all/route';
import { DatabaseService } from '@/lib/database';

async function doLogin(email: string, password: string) {
  const body = JSON.stringify({ email, password });
  const res = await loginRoute(new Request('http://local/api/auth/login', { method: 'POST', body } as any) as any);
  const json = await (res as any).json();
  if (!json?.token) throw new Error('login failed');
  return json.token as string;
}

describe('Auth rotate & revoke routes', () => {
  it('rotates session token', async () => {
  const email = `rot-route-${Date.now()}-${randomUUID()}@ex.com`;
    const password = 'secret1234';
    await DatabaseService.createUser({ email, password });
    const token = await doLogin(email, password);
    const res = await rotateRoute(new Request('http://local/api/auth/rotate', { method: 'POST', headers: { authorization: `Bearer ${token}` } } as any) as any);
    const json = await (res as any).json();
    expect(json.token).toBeDefined();
    expect(json.token).not.toBe(token);
  });

  it('revokes all sessions and returns new token', async () => {
  const email = `rev-route-${Date.now()}-${randomUUID()}@ex.com`;
    const password = 'secret1234';
    await DatabaseService.createUser({ email, password });
    const token = await doLogin(email, password);
    const res = await revokeAllRoute(new Request('http://local/api/auth/revoke-all', { method: 'POST', headers: { authorization: `Bearer ${token}` } } as any) as any);
    const json = await (res as any).json();
    expect(json.token).toBeDefined();
    expect(json.token).not.toBe(token);
  });

  it('fails rotate with invalid token', async () => {
    const res = await rotateRoute(new Request('http://local/api/auth/rotate', { method: 'POST', headers: { authorization: 'Bearer invalid' } } as any) as any);
    const json = await (res as any).json();
    expect(json.error).toBeDefined();
  });

  it('fails revoke-all with invalid token', async () => {
    const res = await revokeAllRoute(new Request('http://local/api/auth/revoke-all', { method: 'POST', headers: { authorization: 'Bearer invalid' } } as any) as any);
    const json = await (res as any).json();
    expect(json.error).toBeDefined();
  });
});
