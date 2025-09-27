import { NextRequest } from 'next/server';
import sharp from 'sharp';
import { getPresetConfig, type MarketplacePreset } from '@/lib/marketplace';
import { getSettings } from '@/lib/settings';
import { logger } from '@/lib/logger';
import { generateRequestId } from '@/lib/utils';
import { DatabaseService } from '@/lib/database';
import { captureError } from '@/lib/monitoring';
import { getClientIP, getUserAgent } from '@/lib/middleware';
import { withSpan, initTracing } from '@/lib/tracing';
import { Metrics } from '@/lib/metrics';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Max size now sourced from dynamic settings (fallback 8MB)
let cachedMaxBytes = 8 * 1024 * 1024;
async function resolveMaxBytes() {
  try {
    const s = await getSettings();
    if (s.maxFileSize && s.maxFileSize > 0 && s.maxFileSize < 128) {
      cachedMaxBytes = s.maxFileSize * 1024 * 1024;
    }
  } catch {/* ignore */}
  return cachedMaxBytes;
}
const ACCEPTED_MIME = ['image/png', 'image/jpeg', 'image/jpg'];

export async function POST(request: NextRequest) {
  const t0 = Date.now();
  const reqId = generateRequestId();
  initTracing();
  try {
    const formData = await withSpan('process.parseForm', () => request.formData().catch(() => null));
    if (!formData) {
      Metrics.imageProcessed('unknown', 0, 0, 400);
      return jsonError('Form data required', 400, reqId);
    }

    const file = formData.get('image');
    const toleranceRaw = formData.get('tolerance');
    const presetRaw = (formData.get('preset') as string) || 'general';
    const branding = formData.get('branding') === 'true';

  if (!(file instanceof File)) { Metrics.imageProcessed('unknown', 0, 0, 400); return jsonError('Image file required', 400, reqId); }
  if (file.size === 0) { Metrics.imageProcessed('unknown', 0, 0, 400); return jsonError('Empty file', 400, reqId); }
    const MAX_FILE_BYTES = await resolveMaxBytes();
    if (file.size > MAX_FILE_BYTES) {
      Metrics.imageProcessed('unknown', file.size, 0, 413);
      return jsonError(`File too large. Max ${(MAX_FILE_BYTES / 1024 / 1024).toFixed(1)}MB`, 413, reqId);
    }
    if (!ACCEPTED_MIME.includes(file.type)) { Metrics.imageProcessed('unknown', file.size, 0, 415); return jsonError('Unsupported file type', 415, reqId); }

    const preset = presetRaw as MarketplacePreset;
    const config = getPresetConfig(preset);

    let tolerance: number | undefined = undefined;
    if (toleranceRaw) {
      const parsed = parseInt(String(toleranceRaw), 10);
      if (!isNaN(parsed)) tolerance = Math.min(Math.max(parsed, 0), 60);
    }

    const inputArrayBuffer = await file.arrayBuffer();
    const inputBuffer = Buffer.from(inputArrayBuffer);

    // Probe metadata
  const baseSharp = sharp(inputBuffer, { failOnError: false });
  const meta = await withSpan('process.metadata', () => baseSharp.metadata());

    // Resize & format pipeline
    let pipeline = baseSharp.resize(config.dimensions.width, config.dimensions.height, {
      fit: 'cover',
      position: 'center',
    });

    // Simple enhancement (brightness/contrast via linear & saturation via modulate)
    pipeline = pipeline.modulate({
      brightness: config.optimization.brightness,
      saturation: config.optimization.saturation,
    });

    // Sharpness simulation
    if (config.optimization.sharpness > 1) {
      pipeline = pipeline.sharpen({ sigma: 1 });
    }

    // Output handling
    const quality = config.quality;
    const isPNG = config.format === 'png';
    if (isPNG) {
      pipeline = pipeline.png({ quality, compressionLevel: 9, palette: false });
    } else {
      pipeline = pipeline.jpeg({ quality, mozjpeg: true });
    }

    // Background flattening
    if (config.flattenBackground) {
      pipeline = pipeline.flatten({ background: config.backgroundColor });
    }

    // Branding / watermark (simple text overlay placeholder) when enabled
    if (branding && config.branding?.watermark) {
      // For now generate a tiny SVG buffer with text then composite
      let watermarkText = 'YukiYaki';
      try { const s = await getSettings(); if (s.watermarkEnabled) watermarkText = s.watermarkText || watermarkText; } catch {}
      const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='400' height='80'>
        <style>
          text { font: 36px sans-serif; fill: rgba(242,140,40,0.55); }
        </style>
        <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle'>${watermarkText}</text>
      </svg>`;
      const svgBuf = Buffer.from(svg);
      pipeline = pipeline.composite([
        {
          input: svgBuf,
          top: config.dimensions.height - 100,
          left: Math.max(0, Math.floor((config.dimensions.width - 400) / 2)),
        },
      ]);
    }

  const outputBuffer = await withSpan('process.sharpPipeline', () => pipeline.toBuffer());
    const processingTimeMs = Date.now() - t0;

    // Track DB usage (non-blocking best effort)
    DatabaseService.trackImageProcessing({
      userId: undefined, // attach user if auth added here later
      originalName: file.name,
      fileSize: file.size,
      dimensions: { width: config.dimensions.width, height: config.dimensions.height },
      preset,
      outputFormat: config.format,
      outputSize: outputBuffer.length,
      processingTimeMs,
      userAgent: getUserAgent(request),
      ipAddress: getClientIP(request),
    }).catch((e) => logger.error('trackImageProcessing:error', { reqId, error: e.message }));

    logger.info('image.process:success', {
      reqId,
      preset,
      sizeIn: file.size,
      sizeOut: outputBuffer.length,
      ms: processingTimeMs,
      tolerance,
      branding,
      width: meta.width,
      height: meta.height,
    });

    const res = new Response(new Uint8Array(outputBuffer), {
      status: 200,
      headers: {
        'Content-Type': isPNG ? 'image/png' : 'image/jpeg',
        'X-Processing-Time': `${processingTimeMs}ms`,
        'X-Request-Id': reqId,
        'Cache-Control': 'no-store',
      },
    });
    Metrics.imageProcessed(preset, file.size, outputBuffer.length, 200);
    return res;
  } catch (error: any) {
    logger.error('image.process:error', { reqId, error: error?.message });
    captureError(error, { reqId, route: 'process-image' });
    Metrics.imageProcessed('unknown', 0, 0, 500);
    return jsonError(error?.message || 'Processing failed', 500, reqId);
  }
}

// Helper JSON error (local to keep file self-contained)
function jsonError(message: string, status: number, reqId: string) {
  return new Response(
    JSON.stringify({ error: message, status, reqId, timestamp: new Date().toISOString() }),
    {
      status,
      headers: {
        'Content-Type': 'application/json',
        'X-Request-Id': reqId,
      },
    },
  );
}
