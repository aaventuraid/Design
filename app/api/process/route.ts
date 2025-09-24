import { NextRequest } from 'next/server';
import sharp from 'sharp';
import { getPresetConfig, type MarketplacePreset } from '@/lib/marketplace';
import { Brand } from '@/lib/branding';

export const runtime = 'nodejs';

// Simple per-IP rate limiter (memory). Suitable for single-instance setups.
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const RATE_LIMIT_MAX = 30; // 30 requests/min/IP for image processing
const ipHits = new Map<string, { count: number; resetAt: number }>();

function rateLimit(ip: string | null | undefined): boolean {
  if (!ip) return false;
  const now = Date.now();
  const cur = ipHits.get(ip);
  if (!cur || now > cur.resetAt) {
    ipHits.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  cur.count += 1;
  if (cur.count > RATE_LIMIT_MAX) return true;
  return false;
}

export async function POST(req: NextRequest) {
  try {
    // Rate limit
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || (req as any).ip;
    if (rateLimit(ip)) {
      return new Response('Rate limit exceeded. Coba lagi sebentar.', { status: 429 });
    }
    const formData = await req.formData();
    const file = formData.get('image') as File | null;
    const tolerance = Number(formData.get('tolerance') ?? 12);
    const preset = String(formData.get('preset') ?? 'general') as MarketplacePreset;
    const addBranding = String(formData.get('branding') ?? 'false') === 'true';

    if (!file) return new Response('Image is required', { status: 400 });

    const presetConfig = getPresetConfig(preset);

    const arrayBuffer = await file.arrayBuffer();
    // Processing block with safe passthrough fallback on failure
    try {
      // Ensure processing in standard sRGB colorspace; avoid invalid 'rgb' target
      let img = sharp(Buffer.from(arrayBuffer)).rotate().toColorspace('srgb');

      // Background handling & subject isolation (simple heuristic chroma-key on near-white)
      const meta = await img.metadata();
      // If image is extremely small or metadata missing, skip chroma-key and return PNG directly
      if (!meta.width || !meta.height || meta.width * meta.height < 4) {
        // Minimal encode following preset format
        const direct = await (
          presetConfig.format === 'jpeg'
            ? img
                .flatten({ background: presetConfig.backgroundColor })
                .jpeg({ quality: Math.round(presetConfig.quality) })
            : img.png({ compressionLevel: 9 })
        ).toBuffer();
        return new Response(new Uint8Array(direct), {
          headers: new Headers({
            'Content-Type': presetConfig.format === 'jpeg' ? 'image/jpeg' : 'image/png',
            'X-Marketplace': preset,
            'X-Dimensions': `${meta.width || 1}x${meta.height || 1}`,
            'X-Optimized-For': presetConfig.name,
          }),
        });
      }

      const { data, info } = await img.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
      const key = { r: 255, g: 255, b: 255 };
      const tol = Math.max(0, Math.min(255, tolerance));
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        if (
          Math.abs(r - key.r) <= tol &&
          Math.abs(g - key.g) <= tol &&
          Math.abs(b - key.b) <= tol
        ) {
          data[i + 3] = 0; // transparent
        }
      }
      let out = sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } });

      // Add a small safe margin to avoid tight crops after resize (improves menu thumbnail look)
      const padBase = Math.round(Math.min(info.width, info.height) * 0.04);
      if (padBase > 0) {
        const bgHex = presetConfig.backgroundColor.replace('#', '');
        const r = parseInt(bgHex.slice(0, 2), 16);
        const g = parseInt(bgHex.slice(2, 4), 16);
        const b = parseInt(bgHex.slice(4, 6), 16);
        out = out.extend({
          top: padBase,
          bottom: padBase,
          left: padBase,
          right: padBase,
          background: presetConfig.allowTransparency ? { r: 0, g: 0, b: 0, alpha: 0 } : { r, g, b },
        });
      }

      // Apply marketplace-specific optimization
      const opt = presetConfig.optimization;
      out = out
        .modulate({ brightness: opt.brightness, saturation: opt.saturation })
        .linear(opt.contrast, 0) // contrast boost (approximate)
        .normalize() // auto levels
        .gamma(1.02) // subtle mid-tone lift
        .sharpen(opt.sharpness);
      try {
        out = out.recomb([
          // subtle warm tone matrix to boost appetizing look
          [1.02, 0.02, 0],
          [0.01, 1.01, 0],
          [0, 0.01, 0.99],
        ]);
      } catch {
        // some formats without RGB channels may fail recomb; safely ignore
      }

      // Resize to optimal dimensions for the marketplace
      if (preset !== 'general') {
        out = out.resize(presetConfig.dimensions.width, presetConfig.dimensions.height, {
          fit: 'cover',
          position: 'center',
        });
      }

      // Potential enhancement: add soft drop-shadow for depth (skipped for stability in this version)

      // Add branding overlay if requested and supported by preset
      if (addBranding && presetConfig.branding?.logoOverlay) {
        // TODO: Implement logo overlay with brand colors
        // For now, we'll add a subtle brand-colored border
        const dims =
          preset === 'general'
            ? await out
                .metadata()
                .then((m) => ({ width: m.width || info.width, height: m.height || info.height }))
            : presetConfig.dimensions;
        out = out.composite([
          {
            input: Buffer.from(`
          <svg width="${dims.width}" height="${dims.height}">
            <rect x="0" y="0" width="${dims.width}" height="8" fill="${Brand.colors.primaryOrange}"/>
            <rect x="0" y="${(dims.height as number) - 8}" width="${dims.width}" height="8" fill="${Brand.colors.primaryBlue}"/>
          </svg>
        `),
            top: 0,
            left: 0,
          },
        ]);
      }

      // Background flattening if required by preset (marketplaces often disallow transparency)
      if (presetConfig.flattenBackground) {
        out = out.flatten({ background: presetConfig.backgroundColor });
      }

      // Encode according to preset
      let buffer: Buffer;
      let contentType: string;
      if (presetConfig.format === 'jpeg') {
        let q = Math.round(presetConfig.quality);
        buffer = await out.jpeg({ quality: q, mozjpeg: true }).toBuffer();
        // Size budgeting: reduce quality slightly if above limit
        const maxBytes = Math.round(
          presetConfig.fileSize.unit === 'MB'
            ? presetConfig.fileSize.max * 1024 * 1024
            : presetConfig.fileSize.max * 1024,
        );
        let attempts = 0;
        while (buffer.byteLength > maxBytes && q > 60 && attempts < 5) {
          q -= 5;
          buffer = await out.jpeg({ quality: q, mozjpeg: true }).toBuffer();
          attempts++;
        }
        contentType = 'image/jpeg';
      } else {
        buffer = await out.png({ compressionLevel: 9 }).toBuffer();
        contentType = 'image/png';
      }
      const body = new Uint8Array(buffer);

      // Set response headers with marketplace info
      const headers = new Headers({
        'Content-Type': contentType,
        'X-Marketplace': preset,
        'X-Dimensions': `${presetConfig.dimensions.width}x${presetConfig.dimensions.height}`,
        'X-Optimized-For': presetConfig.name,
      });

      return new Response(body, { headers });
    } catch (procErr: any) {
      console.error('Processing pipeline failed, passthrough original image:', procErr);
      // Return original image bytes to avoid hard failure
      const headers = new Headers({
        'Content-Type': file.type || 'application/octet-stream',
        'X-Optimized-For': presetConfig.name,
        'X-Marketplace': preset,
        'X-Processed': 'false',
      });
      return new Response(new Uint8Array(arrayBuffer), { headers });
    }
  } catch (e: any) {
    console.error('Processing error:', e);
    return new Response(e?.message || 'Processing error', { status: 500 });
  }
}
