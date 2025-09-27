import { NextRequest, NextResponse } from 'next/server';
import { generateRequestId } from '@/lib/utils';
// Edge middleware must avoid Node.js native modules (crypto, fs, etc.).
// Removed database / jwt / redis imports to keep bundle Edge-safe.

// In-memory rate limit store (ephemeral - good enough for single instance)
type RateBucket = { count: number; reset: number };
const ipBuckets: Record<string, RateBucket> = {};

// Basic config per route pattern (unauth public heavy endpoints)
const RATE_LIMITS: { pattern: RegExp; limit: number; windowMs: number }[] = [
  { pattern: /^\/api\/auth\/login/, limit: 10, windowMs: 15 * 60 * 1000 }, // 10 / 15m
  { pattern: /^\/api\/generate-copy/, limit: 60, windowMs: 60 * 1000 }, // 60 / 1m
  { pattern: /^\/api\/process/, limit: 20, windowMs: 60 * 1000 }, // 20 / 1m (maintenance anyway)
];

// Per-user quota disabled in Edge middleware (was requiring DB + JWT). Route handlers still enforce quotas.
const _USER_ACTION_MAP: never[] = [];

function getClientIP(req: NextRequest) {
  const fwd = req.headers.get('x-forwarded-for');
  if (fwd) return fwd.split(',')[0].trim();
  return 'unknown';
}

function applySecurityHeaders(response: NextResponse) {
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  // Cross-Origin Opener/Resource Policies for stronger isolation
  response.headers.set('Cross-Origin-Opener-Policy', 'same-origin');
  response.headers.set('Cross-Origin-Resource-Policy', 'same-origin');
  // HSTS only in production (avoid local dev issues)
  if (process.env.NODE_ENV === 'production') {
    response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  }
  const isProd = process.env.NODE_ENV === 'production';
  const scriptSrc = isProd ? "script-src 'self'" : "script-src 'self' 'unsafe-inline' 'unsafe-eval'";
  response.headers.set(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "img-src 'self' blob: data:",
      scriptSrc,
      "style-src 'self' 'unsafe-inline'",
      "connect-src 'self' https: http:",
      "font-src 'self' data:",
      "object-src 'none'",
      "frame-ancestors 'self'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join('; '),
  );
  return response;
}

function checkRateLimit(ip: string, pathname: string) {
  const rule = RATE_LIMITS.find((r) => r.pattern.test(pathname));
  if (!rule) return null; // no limit for this path
  const key = `${rule.pattern.source}:${ip}`;
  const now = Date.now();
  let bucket = ipBuckets[key];
  if (!bucket || bucket.reset < now) {
    bucket = { count: 0, reset: now + rule.windowMs };
    ipBuckets[key] = bucket;
  }
  bucket.count += 1;
  const remaining = Math.max(0, rule.limit - bucket.count);
  const allowed = bucket.count <= rule.limit;
  return { allowed, remaining, reset: bucket.reset, limit: rule.limit };
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const reqId = generateRequestId();

  // Rate limiting for selected public endpoints
  const ip = getClientIP(request);
  // Try Redis rate limit first if REDIS_URL set
  let rate = null as any;
  // (Redis path removed for pure Edge compatibility)
  if (!rate) {
    rate = checkRateLimit(ip, pathname);
  }
  if (rate && !rate.allowed) {
    const retryAfterSec = Math.ceil((rate.reset - Date.now()) / 1000);
    const res = NextResponse.json(
      {
        error: 'Rate limit exceeded',
        retryAfter: retryAfterSec,
        limit: rate.limit,
      },
      { status: 429 },
    );
    res.headers.set('Retry-After', String(retryAfterSec));
    res.headers.set('X-RateLimit-Limit', String(rate.limit));
    res.headers.set('X-RateLimit-Remaining', '0');
    res.headers.set('X-RateLimit-Reset', new Date(rate.reset).toISOString());
    res.headers.set('X-Request-Id', reqId);
    return applySecurityHeaders(res);
  }

  // Optional user-level quota check (after IP rate limit) for authenticated requests
  // Per-user quota check removed (Edge-safe). Quotas enforced in API handlers.

  const response = NextResponse.next();
  response.headers.set('X-Request-Id', reqId);
  if (rate) {
    response.headers.set('X-RateLimit-Limit', String(rate.limit));
    response.headers.set('X-RateLimit-Remaining', String(rate.remaining));
    response.headers.set('X-RateLimit-Reset', new Date(rate.reset).toISOString());
  }
  return applySecurityHeaders(response);
}

export const config = {
  matcher: [
    '/api/auth/login',
    '/api/generate-copy',
    '/api/process',
    // can add '/api/(.*)' later when confident
  ],
};
