'use client';
import UploadDropzone from '@/components/UploadDropzone';
import ImagePreview from '@/components/ImagePreview';
import CopyGenerator from '@/components/CopyGenerator';
import { useState } from 'react';
import { type MarketplacePreset, getPresetConfig } from '@/lib/marketplace';

export default function HomePage() {
  const [original, setOriginal] = useState<string | null>(null);
  const [processed, setProcessed] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPreset, setCurrentPreset] = useState<MarketplacePreset>('gofood');
  const [lastFile, setLastFile] = useState<File | null>(null);
  const [lastOptions, setLastOptions] = useState<{ tolerance?: number; branding?: boolean }>({});
  const [compareSelections, setCompareSelections] = useState<Record<MarketplacePreset, boolean>>({
    gofood: true,
    grabfood: true,
    grabfood_cover: false,
    shopeefood: true,
    instagram: false,
    general: false,
  });
  const [compareLoading, setCompareLoading] = useState(false);
  const [compareResults, setCompareResults] = useState<
    { preset: MarketplacePreset; url: string; contentType: string }[]
  >([]);

  const onFile = async (
    file: File,
    options?: { tolerance?: number; preset?: MarketplacePreset; branding?: boolean },
  ) => {
    setError(null);
    setLoading(true);
    setProcessed(null);
    setLastFile(file);
    setLastOptions({ tolerance: options?.tolerance, branding: options?.branding });

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

  const comparePresets = async () => {
    if (!lastFile) {
      setError('Silakan unggah foto terlebih dahulu untuk membandingkan.');
      return;
    }
    const selected = (Object.keys(compareSelections) as MarketplacePreset[]).filter(
      (k) => compareSelections[k],
    );
    if (selected.length === 0) return;
    setCompareLoading(true);
    setCompareResults([]);
    try {
      const tasks = selected.map(async (preset) => {
        const form = new FormData();
        form.append('image', lastFile);
        if (lastOptions.tolerance !== undefined)
          form.append('tolerance', String(lastOptions.tolerance));
        form.append('preset', preset);
        if (lastOptions.branding) form.append('branding', 'true');
        const res = await fetch('/api/process', { method: 'POST', body: form });
        if (!res.ok) throw new Error(await res.text());
        const blob = await res.blob();
        return { preset, url: URL.createObjectURL(blob), contentType: blob.type || 'image/*' };
      });
      const results = await Promise.all(tasks);
      setCompareResults(results);
    } catch (e: any) {
      setError(e.message || 'Gagal membandingkan hasil');
    } finally {
      setCompareLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="text-center space-y-6 py-12">
        <div className="space-y-4">
          <div className="inline-block">
            <h1
              className="text-4xl md:text-6xl font-bold text-transparent bg-gradient-to-r from-primary-orange to-primary-blue bg-clip-text leading-tight"
              style={{ fontFamily: 'var(--font-montserrat), sans-serif' }}
            >
              Studio Foto F&B Profesional
            </h1>
          </div>
          <div className="w-24 h-1 bg-gradient-to-r from-primary-orange to-primary-blue mx-auto rounded-full"></div>
        </div>

        <p className="text-xl text-neutral-dark max-w-4xl mx-auto leading-relaxed font-medium">
          Transformasi foto makanan Yuki Yaki Corner menjadi{' '}
          <strong className="text-primary-orange">background transparan</strong> dengan kualitas
          profesional. Dioptimalkan khusus untuk platform marketplace terpopuler.
        </p>

        <div className="flex flex-wrap justify-center gap-6 pt-4">
          <div className="flex items-center gap-2 bg-primary-orange/10 px-4 py-2 rounded-full">
            <span className="text-primary-orange font-semibold">GoFood</span>
          </div>
          <div className="flex items-center gap-2 bg-primary-blue/10 px-4 py-2 rounded-full">
            <span className="text-primary-blue font-semibold">GrabFood</span>
          </div>
          <div className="flex items-center gap-2 bg-primary-orange/10 px-4 py-2 rounded-full">
            <span className="text-primary-orange font-semibold">ShopeeFood</span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto pt-8">
          <div className="flex flex-col items-center space-y-2 p-4">
            <div className="w-12 h-12 bg-gradient-to-r from-primary-orange to-primary-blue rounded-full flex items-center justify-center">
              <span className="text-white text-xl">✨</span>
            </div>
            <h3 className="font-semibold text-neutral-dark">Hapus Background</h3>
            <p className="text-sm text-neutral-gray text-center">
              Otomatis menghilangkan background dengan presisi tinggi
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 p-4">
            <div className="w-12 h-12 bg-gradient-to-r from-primary-blue to-primary-orange rounded-full flex items-center justify-center">
              <span className="text-white text-xl">🎨</span>
            </div>
            <h3 className="font-semibold text-neutral-dark">Preset Marketplace</h3>
            <p className="text-sm text-neutral-gray text-center">
              Penyesuaian khusus untuk setiap platform
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 p-4">
            <div className="w-12 h-12 bg-gradient-to-r from-primary-orange to-primary-blue rounded-full flex items-center justify-center">
              <span className="text-white text-xl">🤖</span>
            </div>
            <h3 className="font-semibold text-neutral-dark">Generator Copy AI</h3>
            <p className="text-sm text-neutral-gray text-center">
              Buat judul dan deskripsi menarik secara otomatis
            </p>
          </div>
        </div>
      </section>

      {/* Upload Section */}
      <UploadDropzone onFile={onFile} loading={loading} />

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 rounded-r-lg p-4 shadow-sm">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-red-400 text-xl">⚠️</span>
            </div>
            <div className="ml-3">
              <p className="text-red-800 font-medium">Terjadi Kesalahan</p>
              <p className="text-red-700 text-sm mt-1">{error}</p>
            </div>
          </div>
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
      <section className="bg-gradient-to-br from-primary-blue/5 via-white to-primary-orange/5 rounded-2xl p-8 border border-gray-100 shadow-sm">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-neutral-dark mb-2">💡 Panduan Hasil Optimal</h3>
          <p className="text-neutral-gray">
            Ikuti tips berikut untuk mendapatkan foto produk terbaik
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Kualitas Foto */}
          <div className="space-y-3">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-10 h-10 bg-primary-orange/10 rounded-full flex items-center justify-center">
                <span className="text-primary-orange text-lg">📸</span>
              </div>
              <h4 className="text-lg font-semibold text-neutral-dark">Kualitas Foto</h4>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-primary-orange mt-1">•</span>
              <p className="text-neutral-gray">Background putih atau terang yang bersih</p>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-primary-orange mt-1">•</span>
              <p className="text-neutral-gray">Pencahayaan merata dan tidak gelap</p>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-primary-orange mt-1">•</span>
              <p className="text-neutral-gray">Fokus tajam pada produk makanan</p>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-primary-orange mt-1">•</span>
              <p className="text-neutral-gray">
                Resolusi minimum <strong>1024×1024 piksel</strong>
              </p>
            </div>
          </div>

          {/* Target Platform */}
          <div className="space-y-3">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-10 h-10 bg-primary-blue/10 rounded-full flex items-center justify-center">
                <span className="text-primary-blue text-lg">🎯</span>
              </div>
              <h4 className="text-lg font-semibold text-neutral-dark">Target Platform</h4>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-primary-orange mt-1">•</span>
              <p className="text-neutral-gray">
                <span className="font-medium text-primary-orange">GoFood:</span> Persegi 1080×1080
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-primary-blue mt-1">•</span>
              <p className="text-neutral-gray">
                <span className="font-medium text-primary-blue">GrabFood (Menu):</span> Persegi
                1200×1200
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-primary-orange mt-1">•</span>
              <p className="text-neutral-gray">
                <span className="font-medium text-primary-orange">ShopeeFood:</span> Persegi 800×800
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-primary-blue mt-1">•</span>
              <p className="text-neutral-gray">
                <span className="font-medium text-primary-blue">GrabFood (Cover):</span> Banner
                1800×1000 (9:5)
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-primary-blue mt-1">•</span>
              <p className="text-neutral-gray">
                <span className="font-medium text-primary-blue">Instagram:</span> Potret 1080×1350 +
                branding
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Compare Section */}
      <section className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-neutral-dark">Bandingkan Platform</h3>
          <div className="text-sm text-neutral-gray">
            Gunakan foto terakhir yang diunggah untuk memproses beberapa preset sekaligus
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {(
            [
              'gofood',
              'grabfood',
              'shopeefood',
              'grabfood_cover',
              'instagram',
              'general',
            ] as MarketplacePreset[]
          ).map((p) => {
            const cfg = getPresetConfig(p);
            return (
              <label
                key={p}
                className="flex items-center gap-3 p-3 rounded-xl border hover:bg-gray-50"
              >
                <input
                  type="checkbox"
                  checked={!!compareSelections[p]}
                  onChange={(e) =>
                    setCompareSelections((prev) => ({ ...prev, [p]: e.target.checked }))
                  }
                  className="accent-primary-orange"
                />
                <div>
                  <div className="font-medium text-neutral-dark">{cfg.name}</div>
                  <div className="text-xs text-neutral-gray">
                    {cfg.dimensions.width}×{cfg.dimensions.height} • {cfg.format.toUpperCase()}
                  </div>
                </div>
              </label>
            );
          })}
        </div>
        <div className="mt-4 flex items-center gap-3">
          <button
            onClick={comparePresets}
            disabled={compareLoading || !lastFile}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              compareLoading || !lastFile
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-primary-orange to-primary-blue text-white hover:shadow-md hover:scale-[1.01]'
            }`}
          >
            {compareLoading ? 'Memproses…' : 'Proses Bandingkan'}
          </button>
          {!lastFile && (
            <span className="text-sm text-neutral-gray">Unggah foto terlebih dahulu</span>
          )}
        </div>

        {compareResults.length > 0 && (
          <div className="mt-6 grid md:grid-cols-3 gap-6">
            {compareResults.map((r) => {
              const cfg = getPresetConfig(r.preset);
              return (
                <div key={r.preset} className="border rounded-xl p-3 bg-gray-50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-semibold text-neutral-dark">{cfg.name}</div>
                    <div className="text-xs bg-primary-orange/10 text-primary-orange px-2 py-1 rounded">
                      {cfg.format.toUpperCase()}
                    </div>
                  </div>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={r.url}
                    alt={cfg.name}
                    className="w-full h-auto object-contain max-h-64"
                  />
                  <div className="mt-2 text-xs text-neutral-gray">
                    {cfg.dimensions.width}×{cfg.dimensions.height}
                  </div>
                  <a
                    href={r.url}
                    download={`compare-${r.preset}-${Date.now()}.${cfg.format === 'png' ? 'png' : 'jpg'}`}
                    className="mt-2 block text-center bg-white border rounded-lg py-2 hover:bg-gray-100"
                  >
                    Unduh
                  </a>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
