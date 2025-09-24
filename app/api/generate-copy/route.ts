import { NextRequest } from 'next/server';
import { getSettings } from '@/lib/settings';
import { AIService } from '@/lib/ai-service';
import { getClientIP } from '@/lib/middleware';
import { DatabaseService } from '@/lib/database';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    // Database-based rate limiting dan auth
    let user = null;
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (token) {
      user = await DatabaseService.validateSession(token);
    }

    const rateLimit = await DatabaseService.checkRateLimit(user?.id || null, 'COPY_GENERATE');

    if (!rateLimit.allowed) {
      return new Response(
        JSON.stringify({
          error: 'Rate limit exceeded. Coba lagi sebentar.',
          resetTime: rateLimit.resetTime,
          remaining: rateLimit.remaining,
        }),
        {
          status: 429,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }

    // Track usage
    await DatabaseService.trackUsage({
      userId: user?.id,
      action: 'COPY_GENERATE',
      ipAddress: getClientIP(req),
    });

    const options = await req.json().catch(() => ({}));

    if (!options.productName) {
      return new Response('productName required', { status: 400 });
    }

    const settings = await getSettings();
    // If admin sets default provider to local, force local by not passing the Gemini key
    const effectiveGeminiKey =
      settings.defaultAIProvider === 'local' ? undefined : settings.geminiApiKey;
    const aiService = new AIService(effectiveGeminiKey);

    const copy = await aiService.generateCopy({
      productName: options.productName,
      category: options.category,
      ingredients: options.ingredients,
      price: options.price,
      specialFeatures: options.specialFeatures,
      tone: options.tone || 'casual',
      language: options.language || 'id',
      platform: options.platform || 'gofood',
      bananaMode: options.bananaMode || false,
    });

    return Response.json({
      ...copy,
      providers: aiService.getAvailableProviders(),
      timestamp: new Date().toISOString(),
      rateLimit: {
        remaining: rateLimit.remaining,
        resetTime: rateLimit.resetTime,
      },
    });
  } catch (error: any) {
    console.error('Copy generation error:', error);
    return new Response(error.message || 'Generation failed', { status: 500 });
  }
}
