import { describe, it, expect } from 'vitest';
import { DatabaseService } from '@/lib/database';

// These are logic-level tests (not full HTTP) simulating session rotation and revoke.

describe('Auth session security', () => {
  it('can rotate a session token', async () => {
    const user = await DatabaseService.createUser({ email: `rot-${Date.now()}@ex.com`, password: 'secret1234' });
    const session = await DatabaseService.createSession(user.id);
    const rotated = await DatabaseService.rotateSession(session.token);
    expect(rotated?.newToken).toBeDefined();
    expect(rotated?.newToken).not.toBe(session.token);
  });

  it('can revoke all sessions', async () => {
    const user = await DatabaseService.createUser({ email: `rev-${Date.now()}@ex.com`, password: 'secret1234' });
    await DatabaseService.createSession(user.id);
    await DatabaseService.createSession(user.id);
    const count = await DatabaseService.deleteAllSessionsForUser(user.id);
    expect(count).toBeGreaterThanOrEqual(2);
  });
});
