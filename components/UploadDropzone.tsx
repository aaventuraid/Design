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
    <div className="space-y-8" aria-label="Area unggah foto dan pengaturan proses">
      {/* Upload Area */}
      <div
        className={`card-elevated relative border-2 border-dashed rounded-brand-xl p-16 text-center cursor-pointer transition-all duration-500 ${
          dragActive
            ? 'border-primary-orange bg-gradient-to-br from-primary-orange/10 to-primary-orange/5 scale-[1.02] shadow-brand-hover'
            : loading
              ? 'border-gray-300 bg-gray-50/50 cursor-not-allowed loading-brand'
              : 'border-primary-blue/30 hover:bg-gradient-to-br hover:from-primary-blue/8 hover:to-primary-orange/8 hover:border-primary-orange/60 hover:shadow-brand-hover focus-within:ring-2 focus-within:ring-primary-orange/30'
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

        <div className="space-y-8 max-w-2xl mx-auto">
          <div className="flex justify-center">
            <div className={`w-24 h-24 rounded-brand-xl flex items-center justify-center shadow-brand transition-all duration-300 ${
              loading 
                ? 'bg-gradient-to-r from-gray-400 to-gray-500' 
                : 'bg-gradient-to-br from-primary-orange to-primary-blue hover:scale-110'
            }`}>
              <span className="text-white text-4xl">
                {loading ? '⚡' : '📸'}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-title text-3xl">
              {loading ? 'Memproses Foto...' : 'Unggah Foto Makanan'}
            </h3>
            <p className="text-body text-lg max-w-lg mx-auto leading-relaxed">
              {loading
                ? 'Sedang mengoptimalkan foto Anda dengan teknologi AI terbaru untuk hasil terbaik'
                : 'Tarik & letakkan file atau klik untuk memilih foto makanan dari perangkat Anda'}
            </p>
          </div>

          {!loading && (
            <div className="space-y-6">
              <button
                type="button"
                aria-label="Pilih foto dari perangkat"
                className="btn-primary btn-lg group"
                disabled={loading}
              >
                <span className="group-hover:scale-110 transition-transform duration-200">📷</span>
                Pilih Foto
              </button>

              <div className="grid md:grid-cols-2 gap-4 text-sm text-neutral-gray max-w-lg mx-auto">
                <div className="flex items-center gap-3 p-3 bg-primary-orange/5 rounded-brand border border-primary-orange/20">
                  <span className="text-primary-orange text-lg">📁</span>
                  <span>Format: PNG, JPG, JPEG (maks 8MB)</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-primary-blue/5 rounded-brand border border-primary-blue/20">
                  <span className="text-primary-blue text-lg">✨</span>
                  <span>Rekomendasi: Background putih untuk hasil optimal</span>
                </div>
              </div>
            </div>
          )}

          {loading && (
            <div className="space-y-6">
              <div className="w-16 h-16 mx-auto">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-orange/30 border-t-primary-orange"></div>
              </div>
              <div className="space-y-2">
                <p className="text-body font-medium">Harap tunggu sebentar...</p>
                <div className="w-48 h-2 bg-gray-200 rounded-full mx-auto overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-primary-orange to-primary-blue rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Settings Panel */}
      <div className="card-elevated p-8 bg-gradient-to-br from-white to-gray-50/50">
        <h4 className="text-title text-xl mb-8 flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-primary-blue to-primary-orange rounded-brand flex items-center justify-center">
            <span className="text-white text-lg">⚙️</span>
          </div>
          Pengaturan Proses
        </h4>

        <div className="space-y-8">
          <div className="space-y-4">
            <label className="block text-subtitle text-base">
              Platform Target
            </label>
            <select
              value={preset}
              onChange={(e) => setPreset(e.target.value as MarketplacePreset)}
              className="input text-base h-14 font-poppins"
            >
              {presetOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <p className="text-caption bg-primary-blue/5 p-3 rounded-brand border-l-4 border-primary-blue">
              {presetOptions.find((p) => p.value === preset)?.description}
            </p>
          </div>

          <div className="space-y-4">
            <label className="block text-subtitle text-base">
              Toleransi Penghapusan Background
            </label>
            <div className="space-y-3">
              <input
                type="range"
                min={0}
                max={60}
                value={tolerance}
                onChange={(e) => setTolerance(parseInt(e.target.value))}
                className="w-full h-3 bg-gray-200 rounded-brand appearance-none cursor-pointer slider-orange focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-orange/30"
                style={{
                  background: `linear-gradient(to right, #F28C28 0%, #F28C28 ${(tolerance/60)*100}%, #e5e7eb ${(tolerance/60)*100}%, #e5e7eb 100%)`
                }}
              />
              <div className="flex justify-between items-center text-sm">
                <span className="text-neutral-gray">Ketat (0)</span>
                <div className="flex items-center gap-2">
                  <span className="font-poppins font-semibold bg-gradient-to-r from-primary-orange to-primary-blue text-white px-4 py-2 rounded-brand shadow-brand">
                    {tolerance}
                  </span>
                </div>
                <span className="text-neutral-gray">Longgar (60)</span>
              </div>
            </div>
            <p className="text-caption bg-primary-orange/5 p-3 rounded-brand border-l-4 border-primary-orange">
              💡 Nilai tinggi untuk background yang sulit dihapus. Mulai dari 12 untuk hasil optimal.
            </p>
          </div>

          <div className="space-y-4">
            <label className="flex items-start gap-4 cursor-pointer p-4 rounded-brand-lg hover:bg-gradient-to-r hover:from-primary-orange/5 hover:to-primary-blue/5 transition-all duration-300 border-2 border-transparent hover:border-primary-orange/20 focus-within:ring-2 focus-within:ring-primary-orange/30">
              <input
                type="checkbox"
                checked={branding}
                onChange={(e) => setBranding(e.target.checked)}
                className="w-6 h-6 accent-primary-orange rounded-brand mt-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-orange/40"
              />
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-subtitle text-base">Tambahkan Branding</span>
                  <span className="text-xs bg-gradient-to-r from-primary-orange to-primary-blue text-white px-2 py-1 rounded-full">
                    Premium
                  </span>
                </div>
                <p className="text-caption leading-relaxed">
                  Sisipkan elemen brand Yuki Yaki Corner pada hasil foto untuk meningkatkan brand awareness
                </p>
              </div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
