import { describe, it, expect } from 'vitest';
import { inc, snapshot, prometheusText, Metrics } from '@/lib/metrics';

describe('Metrics basic', () => {
  it('increments custom counter', () => {
    inc('custom_event_total', 2, { type: 'x' });
    const snap = snapshot();
    const series = snap.find(s => s.name === 'custom_event_total');
    expect(series).toBeDefined();
    expect(series!.series[0].value).toBeGreaterThanOrEqual(2);
  });

  it('records predefined helpers', () => {
    Metrics.authLogin(200);
    Metrics.copyGenerate(500);
    const text = prometheusText();
    expect(text).toContain('auth_login_total');
    expect(text).toContain('copy_generate_total');
  });
});
