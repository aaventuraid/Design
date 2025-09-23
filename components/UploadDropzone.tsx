'use client';
import { useCallback, useRef, useState } from 'react';
import { getPresetOptions, type MarketplacePreset } from '@/lib/marketplace';

export default function UploadDropzone({
  onFile,
  loading,
}: {
  onFile: (
    file: File,
    options?: { tolerance?: number; preset?: MarketplacePreset; branding?: boolean },
  ) => void | Promise<void>;
  loading?: boolean;
}) {
  const [tolerance, setTolerance] = useState(12);
  const [preset, setPreset] = useState<MarketplacePreset>('gofood');
  const [branding, setBranding] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const presetOptions = getPresetOptions();

  const handleFiles = useCallback(
    (files?: FileList | null) => {
      if (!files || files.length === 0) return;
      const file = files[0];
      onFile(file, { tolerance, preset, branding });
    },
    [onFile, tolerance, preset, branding],
  );

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setDragActive(true);
    }
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleFiles(e.dataTransfer.files);
      }
    },
    [handleFiles],
  );

  const handleClick = useCallback(() => {
    if (!loading && fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, [loading]);

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 ${dragActive
            ? 'border-primary-orange bg-primary-orange/5 scale-[1.02] shadow-lg'
            : loading
              ? 'border-gray-300 bg-gray-50 cursor-not-allowed'
              : 'border-primary-blue/30 hover:bg-gradient-to-br hover:from-primary-blue/5 hover:to-primary-orange/5 hover:border-primary-orange/50 hover:shadow-md'
          }`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClick();
          }
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
          disabled={loading}
        />

        <div className="space-y-6">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-gradient-to-r from-primary-orange to-primary-blue rounded-2xl flex items-center justify-center">
              <span className="text-white text-3xl">📸</span>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-neutral-dark">
              {loading ? 'Memproses Foto...' : 'Unggah Foto Makanan'}
            </h3>
            <p className="text-neutral-gray max-w-md mx-auto">
              {loading
                ? 'Sedang memproses foto Anda dengan teknologi AI terbaru'
                : 'Tarik & letakkan file atau klik untuk memilih foto dari perangkat Anda'}
            </p>
          </div>

          {!loading && (
            <div className="space-y-4">
              <button
                type="button"
                className="bg-gradient-to-r from-primary-orange to-primary-blue text-white font-semibold px-8 py-3 rounded-xl hover:shadow-lg transition-all duration-200 hover:scale-105"
                disabled={loading}
              >
                Pilih Foto
              </button>

              <div className="text-xs text-neutral-gray space-y-1">
                <p>📁 Format: PNG, JPG, JPEG (maksimal 8MB)</p>
                <p>✨ Rekomendasi: Background putih/terang untuk hasil optimal</p>
              </div>
            </div>
          )}

          {loading && (
            <div className="space-y-4">
              <div className="w-12 h-12 mx-auto">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-orange border-t-transparent"></div>
              </div>
              <p className="text-sm text-neutral-gray">Harap tunggu...</p>
            </div>
          )}
        </div>
      </div>

      {/* Settings Panel */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <h4 className="font-semibold text-neutral-dark mb-6 flex items-center gap-2">
          <span className="text-lg">⚙️</span>
          Pengaturan Proses
        </h4>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-neutral-dark mb-3">
              Platform Target
            </label>
            <select
              value={preset}
              onChange={(e) => setPreset(e.target.value as MarketplacePreset)}
              className="w-full border border-gray-200 rounded-xl p-3 bg-white focus:ring-2 focus:ring-primary-orange/20 focus:border-primary-orange transition-colors"
            >
              {presetOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <p className="text-xs text-neutral-gray mt-2">
              {presetOptions.find((p) => p.value === preset)?.description}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-dark mb-3">
              Toleransi Penghapusan Background
            </label>
            <input
              type="range"
              min={0}
              max={60}
              value={tolerance}
              onChange={(e) => setTolerance(parseInt(e.target.value))}
              className="w-full accent-primary-orange h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-neutral-gray mt-2">
              <span>Ketat (0)</span>
              <span className="font-medium bg-primary-orange/10 px-2 py-1 rounded">
                {tolerance}
              </span>
              <span>Longgar (60)</span>
            </div>
            <p className="text-xs text-neutral-gray mt-2">
              Nilai tinggi untuk background yang sulit dihapus
            </p>
          </div>

          <div>
            <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl hover:bg-gray-50 transition-colors">
              <input
                type="checkbox"
                checked={branding}
                onChange={(e) => setBranding(e.target.checked)}
                className="w-5 h-5 accent-primary-orange rounded"
              />
              <div className="flex-1">
                <span className="text-sm font-medium text-neutral-dark">Tambahkan Branding</span>
                <p className="text-xs text-neutral-gray">
                  Sisipkan elemen brand Yuki Yaki Corner pada hasil foto
                </p>
              </div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
