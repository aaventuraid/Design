import { type MarketplacePreset, getPresetConfig } from "@/lib/marketplace";

export default function ImagePreview({
  original,
  processed,
  loading,
  currentPreset = "general",
}: {
  original: string | null;
  processed: string | null;
  loading?: boolean;
  currentPreset?: MarketplacePreset;
}) {
  if (!original && !processed && !loading) return null;

  const presetConfig = getPresetConfig(currentPreset);
  const isPng = presetConfig.format === "png";
  const fileExt = isPng ? "png" : "jpg";
  const mimeLabel = isPng ? "PNG" : "JPEG";

  return (
    <div className="space-y-10">
      <div className="text-center space-y-6">
        <div className="space-y-4">
          <h3 className="text-title text-3xl">Hasil Pemrosesan</h3>
          <div className="w-16 h-1 bg-gradient-to-r from-primary-orange to-primary-blue mx-auto rounded-full"></div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="card-elevated overflow-hidden">
          <div className="p-6 bg-gradient-to-r from-gray-50 to-gray-100 border-b">
            <h4 className="text-title text-lg">📷 Foto Asli</h4>
          </div>
          <div className="p-6">
            {original ? (
              <img src={original} alt="Foto asli" className="w-full h-auto rounded-brand-lg" />
            ) : (
              <div className="bg-gray-50 rounded-brand-lg p-16 text-center">
                <p className="text-caption">Belum ada foto</p>
              </div>
            )}
          </div>
        </div>

        <div className="card-elevated overflow-hidden border-2 border-primary-orange/20">
          <div className="p-6 bg-gradient-to-r from-primary-orange/5 to-primary-blue/5 border-b">
            <h4 className="text-title text-lg">✨ Hasil Proses</h4>
          </div>
          <div className="p-6">
            {loading ? (
              <div className="bg-gray-50 rounded-brand-lg p-16 text-center">
                <div className="w-16 h-16 mx-auto mb-4">
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-orange/30 border-t-primary-orange"></div>
                </div>
                <p className="text-title">Memproses...</p>
              </div>
            ) : processed ? (
              <div className="space-y-6">
                <img src={processed} alt="Hasil proses" className="w-full h-auto rounded-brand-lg" />
                <a href={processed} download={`yuki-yaki.${fileExt}`} className="btn-primary w-full">
                  📥 Unduh {mimeLabel}
                </a>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-brand-lg p-16 text-center">
                <p className="text-caption">Hasil akan muncul di sini</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
