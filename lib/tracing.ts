// Lightweight optional tracing scaffold (no external OTEL deps by default)
// Can be extended to real OpenTelemetry instrumentation later.

type Span = { name: string; start: number; attrs: Record<string, any> };

let tracingEnabled = false;

export function initTracing() {
  if (tracingEnabled) return;
  if (process.env.TRACING_ENABLED === '1') {
    tracingEnabled = true;
  }
}

export async function withSpan<T>(
  name: string,
  fn: (span: { setAttr: (k: string, v: any) => void }) => Promise<T> | T,
): Promise<T> {
  if (!tracingEnabled) return fn({ setAttr: () => {} });
  const span: Span = { name, start: Date.now(), attrs: {} };
  const setAttr = (k: string, v: any) => { span.attrs[k] = v; };
  try {
    const result = await fn({ setAttr });
    end(span, undefined);
    return result;
  } catch (e: any) {
    setAttr('error', e.message || 'error');
    end(span, e);
    throw e;
  }
}

import { logger } from './logger.js';

function end(span: Span, err?: any) {
  if (!tracingEnabled) return;
  const durationMs = Date.now() - span.start;
  logger.info('trace.span', {
    span: span.name,
    ms: durationMs,
    ...span.attrs,
    ...(err ? { error: err.message || 'error' } : {}),
  });
}

export function isTracingEnabled() { return tracingEnabled; }
