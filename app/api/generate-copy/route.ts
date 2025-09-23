import { NextRequest } from 'next/server';
import { getSettings } from '@/lib/settings';
import { AIService } from '@/lib/ai-service';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const options = await req.json().catch(() => ({}));

    if (!options.productName) {
      return new Response('productName required', { status: 400 });
    }

    const settings = await getSettings();
    // If admin sets default provider to local, force local by not passing the Gemini key
    const effectiveGeminiKey = settings.defaultAIProvider === 'local' ? undefined : settings.geminiApiKey;
    const aiService = new AIService(effectiveGeminiKey, undefined);

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
    });
  } catch (error: any) {
    console.error('Copy generation error:', error);
    return new Response(error.message || 'Generation failed', { status: 500 });
  }
}
