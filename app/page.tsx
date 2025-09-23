'use client';
import UploadDropzone from '@/components/UploadDropzone';
import ImagePreview from '@/components/ImagePreview';
import CopyGenerator from '@/components/CopyGenerator';
import { useState } from 'react';
import { type MarketplacePreset } from '@/lib/marketplace';

export default function HomePage() {
  const [original, setOriginal] = useState<string | null>(null);
  const [processed, setProcessed] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPreset, setCurrentPreset] = useState<MarketplacePreset>('gofood');

  const onFile = async (
    file: File,
    options?: { tolerance?: number; preset?: MarketplacePreset; branding?: boolean },
  ) => {
    setError(null);
    setLoading(true);
    setProcessed(null);

    if (options?.preset) {
      setCurrentPreset(options.preset);
    }

    try {
      const form = new FormData();
      form.append('image', file);
      if (options?.tolerance !== undefined) form.append('tolerance', String(options.tolerance));
      if (options?.preset) form.append('preset', options.preset);
      if (options?.branding) form.append('branding', 'true');

      const res = await fetch('/api/process', { method: 'POST', body: form });
      if (!res.ok) throw new Error(await res.text());

      const blob = await res.blob();
      setOriginal(URL.createObjectURL(file));
      setProcessed(URL.createObjectURL(blob));
    } catch (e: any) {
      setError(e.message || 'Gagal memproses gambar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="text-center space-y-3 py-8">
        <div className="inline-block">
          <h1
            className="text-4xl md:text-5xl font-[700] text-transparent bg-gradient-to-r from-primary-orange to-primary-blue bg-clip-text"
            style={{ fontFamily: 'var(--font-montserrat), sans-serif' }}
          >
            Studio Foto F&B Profesional
          </h1>
        </div>
        <p className="text-lg text-neutral-gray max-w-3xl mx-auto leading-relaxed">
          Transform foto makanan Yuki Yaki Corner jadi <strong>background transparan</strong> dan
          tampil profesional. Optimized khusus untuk{' '}
          <span className="text-primary-orange font-semibold">GoFood</span>,
          <span className="text-primary-blue font-semibold"> GrabFood</span>, dan
          <span className="text-primary-orange font-semibold"> ShopeeFood</span>.
        </p>
        <div className="flex justify-center gap-4 text-sm text-neutral-gray">
          <span className="flex items-center gap-1">✨ Background removal</span>
          <span className="flex items-center gap-1">🎨 Marketplace presets</span>
          <span className="flex items-center gap-1">🤖 AI copy generation</span>
        </div>
      </section>

      {/* Upload Section */}
      <UploadDropzone onFile={onFile} loading={loading} />

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600 font-medium">❌ {error}</p>
        </div>
      )}

      {/* Image Preview Section */}
      <ImagePreview
        original={original}
        processed={processed}
        loading={loading}
        currentPreset={currentPreset}
      />

      {/* AI Copy Generator */}
      <CopyGenerator />

      {/* Tips Section */}
      <section className="bg-gradient-to-br from-primary-blue/5 to-primary-orange/5 rounded-xl p-6">
        <h3 className="font-semibold text-neutral-dark mb-4">💡 Tips untuk Hasil Terbaik</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <p>
              <strong>📸 Foto Berkualitas:</strong>
            </p>
            <ul className="text-neutral-gray ml-4 space-y-1">
              <li>• Background putih/terang dan bersih</li>
              <li>• Pencahayaan merata, tidak terlalu gelap</li>
              <li>• Fokus tajam pada produk makanan</li>
              <li>• Resolusi minimal 1024x1024px</li>
            </ul>
          </div>
          <div className="space-y-2">
            <p>
              <strong>🎯 Platform Targeting:</strong>
            </p>
            <ul className="text-neutral-gray ml-4 space-y-1">
              <li>
                • <span className="text-primary-orange">GoFood:</span> Square 1080x1080, saturasi
                tinggi
              </li>
              <li>
                • <span className="text-primary-blue">GrabFood:</span> Landscape 1200x900, balanced
              </li>
              <li>
                • <span className="text-primary-orange">ShopeeFood:</span> Square 800x800, compact
              </li>
              <li>
                • <span className="text-primary-blue">Instagram:</span> Portrait 1080x1350 +
                branding
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
