import { NextRequest } from 'next/server';
import { getSettings } from '@/lib/settings';
import { prisma } from '@/lib/database';
import pkg from '../../../package.json';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(_req: NextRequest) {
  const startTime = Date.now();

  try {
    // Basic app info
    const version = (pkg as any)?.version || '0.0.0';
    const now = new Date();
    const uptimeSec = Math.floor(process.uptime());

    // Database health check
    let dbStatus = 'unknown';
    let dbError = null;
    try {
      await prisma.$connect();
      // Simple query to test database
      const userCount = await prisma.user.count();
      dbStatus = 'connected';
      await prisma.$disconnect();
    } catch (error: any) {
      dbStatus = 'error';
      dbError = error.message;
    }

    // Settings check (non-critical)
    let hasGeminiKey = false;
    let defaultAIProvider = 'local';
    try {
      const settings = await getSettings();
      hasGeminiKey = Boolean(settings.geminiApiKey || process.env.GEMINI_API_KEY);
      defaultAIProvider = settings.defaultAIProvider || 'local';
    } catch (error) {
      // Settings failure is not critical for health check
      console.warn('Health check: Settings unavailable:', error);
    }

    // Environment info
    const environment = {
      nodeEnv: process.env.NODE_ENV || 'unknown',
      port: process.env.PORT || '3000',
      coolifyUrl: process.env.COOLIFY_URL || null,
      coolifyFqdn: process.env.COOLIFY_FQDN || null,
    };

    // Response time
    const responseTime = Date.now() - startTime;

    // Overall health status
    const isHealthy = dbStatus === 'connected';

    const response = {
      ok: isHealthy,
      status: isHealthy ? 'healthy' : 'unhealthy',
      version,
      timestamp: now.toISOString(),
      uptime: {
        seconds: uptimeSec,
        human: formatUptime(uptimeSec),
      },
      database: {
        status: dbStatus,
        error: dbError,
      },
      ai: {
        hasGeminiKey,
        defaultProvider: defaultAIProvider,
      },
      environment,
      performance: {
        responseTimeMs: responseTime,
        memoryUsage: process.memoryUsage(),
      },
    };

    return Response.json(response, {
      status: isHealthy ? 200 : 503,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
      },
    });
  } catch (error: any) {
    console.error('Health check failed:', error);
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

function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / (24 * 3600));
  const hours = Math.floor((seconds % (24 * 3600)) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (days > 0) return `${days}d ${hours}h ${minutes}m ${secs}s`;
  if (hours > 0) return `${hours}h ${minutes}m ${secs}s`;
  if (minutes > 0) return `${minutes}m ${secs}s`;
  return `${secs}s`;
}
