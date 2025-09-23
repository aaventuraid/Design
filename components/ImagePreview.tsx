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
  if (!original && !processed) return null;

  const presetConfig = getPresetConfig(currentPreset);

  return (
    <div className="space-y-4">
      {/* Preview Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-neutral-dark">Preview Hasil</h3>
        {processed && (
          <div className="text-sm text-neutral-gray">
            Optimized untuk <strong className="text-primary-orange">{presetConfig.name}</strong>•{' '}
            {presetConfig.dimensions.width}×{presetConfig.dimensions.height}
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Original Image */}
        <figure className="border-2 border-gray-200 rounded-xl p-4 bg-white">
          <figcaption className="text-sm font-medium mb-3 text-neutral-dark flex items-center gap-2">
            📷 Foto Asli
          </figcaption>
          {original ? (
            <div className="bg-gray-50 rounded-lg overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={original}
                alt="Original"
                className="w-full h-auto object-contain max-h-80"
              />
            </div>
          ) : (
            <div className="text-neutral-gray text-sm bg-gray-50 rounded-lg p-8 text-center">
              Belum ada gambar
            </div>
          )}
        </figure>

        {/* Processed Image */}
        <figure className="border-2 border-primary-orange/20 rounded-xl p-4 bg-white">
          <figcaption className="text-sm font-medium mb-3 text-neutral-dark flex items-center gap-2">
            ✨ Hasil Proses
            {processed && (
              <span className="text-xs bg-primary-orange/10 text-primary-orange px-2 py-1 rounded">
                PNG
              </span>
            )}
          </figcaption>
          {loading ? (
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <div className="animate-spin w-8 h-8 border-4 border-primary-orange border-t-transparent rounded-full mx-auto mb-2"></div>
              <p className="text-neutral-gray text-sm">Memproses gambar...</p>
            </div>
          ) : processed ? (
            <div className="space-y-3">
              <div className="bg-gray-50 rounded-lg overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={processed}
                  alt="Processed"
                  className="w-full h-auto object-contain max-h-80"
                />
              </div>

              {/* Download Actions */}
              <div className="flex gap-2">
                <a
                  href={processed}
                  download={`yuki-yaki-${currentPreset}-${Date.now()}.png`}
                  className="btn btn-primary flex-1 text-center"
                >
                  📥 Unduh PNG
                </a>
                <button
                  onClick={() => navigator.clipboard.writeText(processed)}
                  className="btn btn-secondary px-3"
                  title="Copy image URL"
                >
                  📋
                </button>
              </div>

              {/* Image Info */}
              <div className="text-xs text-neutral-gray bg-gray-50 rounded p-2">
                <div className="grid grid-cols-2 gap-2">
                  <span>
                    Platform: <strong>{presetConfig.name}</strong>
                  </span>
                  <span>
                    Quality: <strong>{presetConfig.quality}%</strong>
                  </span>
                  <span>
                    Dimensions: <strong>{presetConfig.dimensions.aspectRatio}</strong>
                  </span>
                  <span>
                    Max Size:{' '}
                    <strong>
                      {presetConfig.fileSize.max}
                      {presetConfig.fileSize.unit}
                    </strong>
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-neutral-gray text-sm bg-gray-50 rounded-lg p-8 text-center">
              Upload gambar untuk melihat hasil
            </div>
          )}
        </figure>
      </div>
    </div>
  );
}
