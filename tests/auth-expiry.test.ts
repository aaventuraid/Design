import { describe, it, expect } from 'vitest';
import { DatabaseService, prisma } from '@/lib/database';

describe('Session expiry validation', () => {
  it('returns null for expired session', async () => {
    const user = await DatabaseService.createUser({ email: `exp-${Date.now()}@ex.com`, password: 'secret1234' });
    const session = await DatabaseService.createSession(user.id);
    // Force expire
    await prisma.session.update({ where: { token: session.token }, data: { expiresAt: new Date(Date.now() - 1000) } });
    const validated = await DatabaseService.validateSession(session.token);
    expect(validated).toBeNull();
  });
});
