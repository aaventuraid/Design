import { type MarketplacePreset, getPresetConfig } from '@/lib/marketplace';

export default function ImagePreview({
  original,
  processed,
  loading,
  currentPreset = 'general',
}: {
  original: string | null;
  processed: string | null;
  loading?: boolean;
  currentPreset?: MarketplacePreset;
}) {
  if (!original && !processed && !loading) return null;

  const presetConfig = getPresetConfig(currentPreset);
  const isPng = presetConfig.format === 'png';
  const showsTransparency =
    isPng && presetConfig.allowTransparency && !presetConfig.flattenBackground;
  const fileExt = isPng ? 'png' : 'jpg';
  const mimeLabel = isPng ? 'PNG' : 'JPEG';

  return (
    <div className="space-y-6" aria-live={loading ? 'polite' : 'off'} aria-busy={loading}>
      {/* Preview Header */}
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-bold text-neutral-dark">Hasil Pemrosesan</h3>
        {processed && (
          <div className="text-sm text-neutral-gray">
            Dioptimalkan untuk{' '}
            <span className="font-semibold text-primary-orange">{presetConfig.name}</span> •{' '}
            <span className="font-mono">
              {presetConfig.dimensions.width}×{presetConfig.dimensions.height}
            </span>
          </div>
        )}
      </div>

  <div className="grid md:grid-cols-2 gap-6" role="group" aria-label="Perbandingan gambar sebelum dan sesudah">
        {/* Original Image */}
        <div className="group">
          <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-neutral-dark flex items-center gap-2">
                <span className="text-lg">📷</span>
                Foto Asli
              </h4>
            </div>

            {original ? (
              <div className="bg-gray-50 rounded-xl overflow-hidden border relative">
                { }
                <img
                  src={original}
                  alt="Foto asli"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-auto object-contain max-h-80 md:max-h-[420px]"
                />
                <span className="sr-only">Gambar asli sebelum diproses</span>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-xl p-12 text-center border-2 border-dashed border-gray-300">
                <span className="text-4xl text-gray-300 block mb-2">🖼️</span>
                <p className="text-neutral-gray text-sm">Belum ada foto yang diunggah</p>
              </div>
            )}
          </div>
        </div>

        {/* Processed Image */}
        <div className="group">
          <div className="bg-white border-2 border-primary-orange/20 rounded-2xl p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-neutral-dark flex items-center gap-2">
                <span className="text-lg">✨</span>
                Hasil Proses
              </h4>
              {processed && (
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-primary-orange/10 text-primary-orange px-2 py-1 rounded-full font-medium">
                    {mimeLabel}
                  </span>
                  {showsTransparency && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                      Transparan
                    </span>
                  )}
                </div>
              )}
            </div>

            {loading ? (
              <div className="bg-gray-50 rounded-xl p-12 text-center border-2 border-dashed border-gray-300">
                <div className="w-12 h-12 mx-auto mb-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-orange border-t-transparent"></div>
                </div>
                <p className="text-neutral-dark font-medium mb-1">Memproses Foto...</p>
                <p className="text-neutral-gray text-sm">
                  Sedang menghilangkan background dan mengoptimalkan kualitas
                </p>
              </div>
            ) : processed ? (
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-xl overflow-hidden border relative">
                  {/* Checkerboard background only when transparency is expected */}
                  {showsTransparency && (
                    <div
                      className="absolute inset-0 opacity-20"
                      style={{
                        backgroundImage: `repeating-conic-gradient(#666 0% 25%, transparent 0% 50%) 50% / 20px 20px`,
                      }}
                    ></div>
                  )}
                  { }
                  <img
                    src={processed}
                    alt="Hasil proses"
                    loading="lazy"
                    decoding="async"
                    className="relative w-full h-auto object-contain max-h-80 md:max-h-[420px]"
                  />
                  <span className="sr-only">Gambar hasil setelah diproses</span>
                </div>

                {/* Download Actions */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href={processed}
                    download={`yuki-yaki-${currentPreset}-${Date.now()}.${fileExt}`}
                    className="flex-1 bg-gradient-to-r from-primary-orange to-primary-blue text-white py-3 px-4 rounded-xl font-semibold text-center hover:shadow-lg transition-all duration-200 hover:scale-[1.02] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-orange/50"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <span>📥</span>
                      Unduh {mimeLabel}
                    </div>
                  </a>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(processed);
                      const toast = document.createElement('div');
                      toast.className =
                        'fixed top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
                      toast.textContent = 'URL gambar disalin!';
                      document.body.appendChild(toast);
                      setTimeout(() => toast.remove(), 2000);
                    }}
                    className="px-4 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-orange/40"
                    title="Salin URL gambar"
                  >
                    <span className="text-xl">📋</span>
                  </button>
                </div>

                {/* Image Info */}
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 border">
                  <h5 className="font-medium text-neutral-dark mb-2 flex items-center gap-2">
                    <span className="text-sm">ℹ️</span>
                    Informasi Hasil
                  </h5>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-neutral-gray">Platform:</span>
                      <p className="font-semibold text-primary-orange">{presetConfig.name}</p>
                    </div>
                    <div>
                      <span className="text-neutral-gray">Kualitas:</span>
                      <p className="font-semibold text-primary-blue">{presetConfig.quality}%</p>
                    </div>
                    <div>
                      <span className="text-neutral-gray">Rasio:</span>
                      <p className="font-semibold text-neutral-dark">
                        {presetConfig.dimensions.aspectRatio}
                      </p>
                    </div>
                    <div>
                      <span className="text-neutral-gray">Ukuran Max:</span>
                      <p className="font-semibold text-green-600">
                        {presetConfig.fileSize.max}
                        {presetConfig.fileSize.unit}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-xl p-12 text-center border-2 border-dashed border-gray-300">
                <span className="text-4xl text-gray-300 block mb-2">⏳</span>
                <p className="text-neutral-gray text-sm">
                  Hasil akan muncul di sini setelah pemrosesan
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
