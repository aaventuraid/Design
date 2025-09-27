import { describe, it, expect } from 'vitest';
import { generateRequestId, extractBearerToken } from '@/lib/utils';

describe('Utils', () => {
  it('generates unique request ids', () => {
    const a = generateRequestId();
    const b = generateRequestId();
    expect(a).not.toBe(b);
  });
  it('extracts bearer token', () => {
    const token = 'abc123';
    const req = new Request('http://x', { headers: { authorization: `Bearer ${token}` } });
    expect(extractBearerToken(req)).toBe(token);
  });
});
