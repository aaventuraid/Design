export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  // Pure lightweight liveness: no DB, no Redis
  return Response.json(
    {
      ok: true,
      status: 'alive',
      pid: process.pid,
      uptimeSec: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
    },
    {
      status: 200,
      headers: {
        'Cache-Control': 'no-store',
      },
    },
  );
}
