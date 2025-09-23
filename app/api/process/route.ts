import { NextRequest } from 'next/server';
import sharp from 'sharp';
import { getPresetConfig, type MarketplacePreset } from '@/lib/marketplace';
import { Brand } from '@/lib/branding';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('image') as File | null;
    const tolerance = Number(formData.get('tolerance') ?? 12);
    const preset = String(formData.get('preset') ?? 'general') as MarketplacePreset;
    const addBranding = String(formData.get('branding') ?? 'false') === 'true';

    if (!file) return new Response('Image is required', { status: 400 });

    const presetConfig = getPresetConfig(preset);

    const arrayBuffer = await file.arrayBuffer();
    let img = sharp(Buffer.from(arrayBuffer)).removeAlpha().toColorspace('rgb');

    // Convert to PNG with transparent background by detecting white-ish background and making it transparent
    // Simple heuristic: Use chroma-key against near-white
    const { data, info } = await img.raw().ensureAlpha().toBuffer({ resolveWithObject: true });
    const key = { r: 255, g: 255, b: 255 };
    const tol = Math.max(0, Math.min(255, tolerance));
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      if (Math.abs(r - key.r) <= tol && Math.abs(g - key.g) <= tol && Math.abs(b - key.b) <= tol) {
        data[i + 3] = 0; // transparent
      }
    }
    let out = sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } });

    // Apply marketplace-specific optimization
    const opt = presetConfig.optimization;
    out = out
      .modulate({
        brightness: opt.brightness,
        saturation: opt.saturation,
      })
      .sharpen(opt.sharpness);

    // Resize to optimal dimensions for the marketplace
    if (preset !== 'general') {
      out = out.resize(presetConfig.dimensions.width, presetConfig.dimensions.height, {
        fit: 'cover',
        position: 'center',
      });
    }

    // Add branding overlay if requested and supported by preset
    if (addBranding && presetConfig.branding?.logoOverlay) {
      // TODO: Implement logo overlay with brand colors
      // For now, we'll add a subtle brand-colored border
      out = out.composite([
        {
          input: Buffer.from(`
          <svg width="${presetConfig.dimensions.width}" height="${presetConfig.dimensions.height}">
            <rect x="0" y="0" width="${presetConfig.dimensions.width}" height="8" fill="${Brand.colors.primaryOrange}"/>
            <rect x="0" y="${presetConfig.dimensions.height - 8}" width="${presetConfig.dimensions.width}" height="8" fill="${Brand.colors.primaryBlue}"/>
          </svg>
        `),
          top: 0,
          left: 0,
        },
      ]);
    }

    const png = await out
      .png({
        compressionLevel: 9,
        quality: presetConfig.quality,
      })
      .toBuffer();
    const body = new Uint8Array(png);

    // Set response headers with marketplace info
    const headers = new Headers({
      'Content-Type': 'image/png',
      'X-Marketplace': preset,
      'X-Dimensions': `${presetConfig.dimensions.width}x${presetConfig.dimensions.height}`,
      'X-Optimized-For': presetConfig.name,
    });

    return new Response(body, { headers });
  } catch (e: any) {
    console.error('Processing error:', e);
    return new Response(e?.message || 'Processing error', { status: 500 });
  }
}
