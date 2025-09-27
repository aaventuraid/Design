// NextRequest import removed as not needed
import { formatUptime } from '@/lib/utils';
import { prisma } from '@/lib/database';
import { getRedis } from '@/lib/redis';
import { initMonitoring } from '@/lib/monitoring';
import { initTracing, withSpan } from '@/lib/tracing';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  const startTime = Date.now();
  // Ensure monitoring & tracing initialized early via health ping
  initMonitoring().catch(() => {});
  initTracing();

  try {
    const now = new Date();
    const uptimeSec = Math.floor(process.uptime());

    // Parallel infra checks (DB + Redis) with timeouts
    const timeout = (ms: number) => new Promise((_, r) => setTimeout(() => r(new Error('timeout')), ms));

    const dbCheck = Promise.race([
      prisma.$queryRaw`SELECT 1 as ok` as any,
      timeout(1500),
    ])
      .then(() => ({ ok: true }))
      .catch((e) => ({ ok: false, error: (e as any)?.message || 'db_error' }));

    const redisCheck = Promise.race([
      (async () => {
        const r = await getRedis();
        if (!r) return { ok: false, skipped: true };
        try {
          await r.ping?.();
          return { ok: true };
        } catch (e: any) {
          return { ok: false, error: e.message };
        }
      })(),
      timeout(800),
    ]).catch((e) => ({ ok: false, error: (e as any)?.message || 'redis_error' }));

    const [db, redis] = await withSpan('health.components', () => Promise.all([dbCheck, redisCheck])) as [
      { ok: boolean; error?: string },
      { ok: boolean; skipped?: boolean; error?: string }
    ];

    // Readiness conditions
    const minUptimeReady = uptimeSec >= 5; // lowered after confidence
    const dbReady = db.ok;
  const redisReady = redis.ok || !!redis.skipped; // optional dependency
    const isReady = minUptimeReady && dbReady && redisReady;
    const healthStatus = isReady ? 'healthy' : 'degraded';

    const responseTime = Date.now() - startTime;
    const response = {
      success: true,
      status: healthStatus,
      ready: isReady,
      components: {
        uptime: { ok: minUptimeReady, seconds: uptimeSec },
        database: db,
        redis: redis,
      },
      version: '1.0.0-coolify-v4',
      timestamp: now.toISOString(),
      uptime: {
        seconds: uptimeSec,
        human: formatUptime(uptimeSec),
      },
      environment: {
        nodeEnv: process.env.NODE_ENV || 'unknown',
        port: process.env.PORT || '3000',
        hostname: process.env.HOSTNAME || '0.0.0.0',
        platform: process.platform,
        nodeVersion: process.version,
      },
      deployment: {
        coolify: !!process.env.COOLIFY_URL,
        container: process.env.NODE_ENV === 'production',
        pid: process.pid,
      },
      performance: {
        responseTimeMs: responseTime,
        memoryUsage: {
          rss: Math.round(process.memoryUsage().rss / 1024 / 1024),
          heapUsed: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
          heapTotal: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
        },
      },
      message: isReady
        ? 'Service healthy'
        : 'Service not fully ready',
    };

    return Response.json(response, {
      status: isReady ? 200 : 503,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Content-Type': 'application/json',
        'X-Health-Check': 'v2',
        'X-Health-Status': healthStatus,
        'X-Startup-Ready': isReady.toString(),
      },
    });
  } catch (error: any) {
    return Response.json(
      {
        success: false,
        status: 'error',
        error: error.message,
        timestamp: new Date().toISOString(),
      },
      {
        status: 500,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
      },
    );
  }
}

// formatUptime imported from utils
