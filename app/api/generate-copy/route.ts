import { NextRequest } from 'next/server';
import { getSettings } from '@/lib/settings';
import { AIService } from '@/lib/ai-service';
import { withRateLimit } from '@/lib/middleware';
import { jsonError, jsonSuccess } from '@/lib/api';
import { logger } from '@/lib/logger';
import { captureError } from '@/lib/monitoring';
import { generateRequestId } from '@/lib/utils';
import { Metrics } from '@/lib/metrics';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const reqId = generateRequestId();
  logger.info('copy.generate:start', { reqId });
  return withRateLimit(req, 'COPY_GENERATE', async (request, user) => {
    try {
      const options = await request.json().catch(() => ({}));
      if (!options.productName) {
        Metrics.copyGenerate(400);
        return jsonError('productName required', 400);
      }

      const settings = await getSettings();
      const effectiveGeminiKey = settings.defaultAIProvider === 'local' ? undefined : settings.geminiApiKey;
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

      const payload = {
        ...copy,
        providers: aiService.getAvailableProviders(),
        timestamp: new Date().toISOString(),
        userId: user?.id || null,
        reqId,
      };
      logger.info('copy.generate:success', { reqId });
      Metrics.copyGenerate(200);
      return jsonSuccess(payload);
    } catch (error: any) {
      logger.error('copy.generate:error', { reqId, error: error?.message });
      captureError(error, { reqId, route: 'generate-copy' });
      Metrics.copyGenerate(500);
      return jsonError(error?.message || 'Generation failed', 500);
    }
  });
}
