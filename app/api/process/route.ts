import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const startTime = Date.now();

  try {
    // Return maintenance response to avoid Sharp compatibility issues during deployment
    const responseTime = Date.now() - startTime;

    return new Response(
      JSON.stringify({
        message: 'Image processing endpoint - temporarily under maintenance',
        status: 'available',
        timestamp: new Date().toISOString(),
        responseTime: `${responseTime}ms`,
        endpoint: '/api/process',
        methods: ['POST'],
        note: 'Full image processing will be restored after deployment stabilization',
        version: '1.0.0-maintenance',
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'X-Maintenance-Mode': 'true',
        },
      },
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        error: 'Service temporarily unavailable',
        message: error?.message || 'Unknown error',
        timestamp: new Date().toISOString(),
      }),
      {
        status: 503,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }
}
