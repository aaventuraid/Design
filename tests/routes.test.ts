import { describe, it, expect } from 'vitest';
import { DatabaseService } from '@/lib/database';
import { POST as loginRoute } from '@/app/api/auth/login/route';
import { GET as healthRoute } from '@/app/api/health/route';

// NOTE: These tests invoke route handlers directly (unit-style) rather than full HTTP server.

describe('Route handlers', () => {
  it('login rejects invalid payload', async () => {
    const res = await loginRoute(new Request('http://localhost/api/auth/login', { method: 'POST', body: JSON.stringify({}) } as any) as any);
    const json = await (res as any).json();
    expect(json.error).toBeDefined();
  });

  it('login succeeds with valid credentials', async () => {
    const email = `rtest-${Date.now()}@ex.com`;
    const password = 'secret1234';
    await DatabaseService.createUser({ email, password });
    const body = JSON.stringify({ email, password });
    const res = await loginRoute(new Request('http://localhost/api/auth/login', { method: 'POST', body } as any) as any);
    const json = await (res as any).json();
  expect(json.success).toBe(true);
  expect(json.token).toBeDefined();
  });

  it('health exposes readiness fields', async () => {
    const res = await healthRoute();
    const json = await (res as any).json();
  expect(json.success).toBe(true);
  expect(json.components?.database).toBeDefined();
  });
});
