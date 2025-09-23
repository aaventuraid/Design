import { NextRequest } from 'next/server';
import { getSettings } from '@/lib/settings';
import pkg from '../../../package.json';

export const runtime = 'nodejs';

export async function GET(_req: NextRequest) {
  try {
    const settings = await getSettings();
    const hasGeminiKey = Boolean(settings.geminiApiKey || process.env.GEMINI_API_KEY);
    const version = (pkg as any)?.version || '0.0.0';
    const now = new Date();
    const uptimeSec = Math.floor(process.uptime());

    return Response.json({
      ok: true,
      version,
      hasGeminiKey,
      defaultAIProvider: settings.defaultAIProvider || 'local',
      serverTime: now.toISOString(),
      uptimeSec,
    });
  } catch (e: any) {
    return new Response(e?.message || 'health error', { status: 500 });
  }
}
