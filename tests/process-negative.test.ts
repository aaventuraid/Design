import { describe, it, expect } from 'vitest';
import { POST as processRoute } from '@/app/api/process/route';

describe('Image process negative cases', () => {
  it('rejects missing form data', async () => {
    // send empty form (no image field)
    const form = new FormData();
    const req = new Request('http://local/api/process', { method: 'POST', body: form as any } as any);
    const res = await processRoute(req as any);
    const json = await (res as any).json();
    expect(json.error).toBeDefined();
  });

  it('rejects unsupported mime type', async () => {
    const form = new FormData();
    const blob = new Blob(['hello world'], { type: 'text/plain' });
    const file = new File([blob], 'test.txt', { type: 'text/plain' });
    form.append('image', file);
    const req = new Request('http://local/api/process', { method: 'POST', body: form as any } as any);
    const res = await processRoute(req as any);
    const json = await (res as any).json();
    expect(json.error).toBe('Unsupported file type');
  });
});
