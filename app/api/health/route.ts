// NextRequest import removed as not needed
import { formatUptime } from '@/lib/utils';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  const startTime = Date.now();

  try {
    const responseTime = Date.now() - startTime;
    const now = new Date();
    const uptimeSec = Math.floor(process.uptime());

    // SSoT: Single source for readiness logic
    const isReady = uptimeSec >= 10; // Consider ready after 10 seconds
    const healthStatus = isReady ? 'healthy' : 'starting';

    const response = {
      ok: true,
      status: healthStatus,
      ready: isReady,
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
        ? 'Service is running - Coolify v4 ready'
        : 'Service starting - Please wait for readiness',
    };

    return Response.json(response, {
      status: isReady ? 200 : 503, // Service Unavailable during startup
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Content-Type': 'application/json',
        'X-Health-Check': 'coolify-v4-enhanced',
        'X-Health-Status': healthStatus,
        'X-Startup-Ready': isReady.toString(),
      },
    });
  } catch (error: any) {
    return Response.json(
      {
        ok: false,
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
