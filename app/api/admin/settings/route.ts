import { NextRequest } from 'next/server';
import { getSettings, saveSettings } from '@/lib/settings';

export const runtime = 'nodejs';

export async function GET() {
  const settings = await getSettings();
  return Response.json({
    settings: {
      imageBgProvider: settings.imageBgProvider,
      geminiApiKey: settings.geminiApiKey ? undefined : undefined,
      githubModelsApiKey: settings.githubModelsApiKey ? undefined : undefined,
      hasGeminiKey: Boolean(settings.geminiApiKey),
      hasGithubModelsKey: Boolean(settings.githubModelsApiKey),
    },
  });
}

export async function POST(req: NextRequest) {
  const adminPass = process.env.ADMIN_PASSWORD || 'admin';
  const provided = req.headers.get('x-admin-password') || '';
  if (provided !== adminPass) return new Response('Unauthorized', { status: 401 });
  const body = await req.json().catch(() => null);
  if (!body) return new Response('Invalid JSON', { status: 400 });
  const updated = await saveSettings(body);
  return Response.json({ settings: updated });
}
