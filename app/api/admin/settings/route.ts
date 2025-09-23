import { NextRequest } from 'next/server';
import { getSettings, saveSettings } from '@/lib/settings';

export const runtime = 'nodejs';

export async function GET() {
  const settings = await getSettings();
  return Response.json({
    settings: {
      imageBgProvider: settings.imageBgProvider,
      // Never expose API keys to the client; only report availability flags
      hasGeminiKey: Boolean(settings.geminiApiKey || process.env.GEMINI_API_KEY),
      defaultAIProvider: settings.defaultAIProvider,
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const adminPass = process.env.ADMIN_PASSWORD || 'admin';
    const provided = req.headers.get('x-admin-password') || '';
    if (provided !== adminPass) return new Response('Unauthorized', { status: 401 });
    const body = await req.json().catch(() => null);
    if (!body) return new Response('Invalid JSON', { status: 400 });
    const updated = await saveSettings(body);
    return Response.json({ settings: updated });
  } catch (e: any) {
    console.error('Save settings error:', e);
    return Response.json({ error: e?.message || 'Failed to save settings' }, { status: 500 });
  }
}
