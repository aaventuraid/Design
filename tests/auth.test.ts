import { describe, it, expect } from 'vitest';
import { DatabaseService } from '@/lib/database';

describe('Auth basic', () => {
  it('hash + authenticate roundtrip', async () => {
  const email = `test-user-${Date.now()}@example.com`;
    const password = 'secret1234';
    const user = await DatabaseService.createUser({ email, password });
    const auth = await DatabaseService.authenticateUser(email, password);
    expect(auth?.id).toBe(user.id);
  });
});
