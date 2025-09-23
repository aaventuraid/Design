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
      const f = files[0];
      onFile(f, { tolerance, preset, branding });
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
    <div className="grid md:grid-cols-[1fr,320px] gap-4">
      <div
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${dragActive
            ? 'border-primary-orange bg-primary-orange/5'
            : 'border-primary-blue/30 hover:bg-gray-50 hover:border-primary-orange/50'
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
        <div className="space-y-3">
          <div className="text-4xl">📸</div>
          <div>
            <p className="font-semibold text-lg text-neutral-dark">
              Tarik & letakkan gambar atau klik untuk unggah
            </p>
            <p className="text-sm text-neutral-gray mt-1">
              PNG/JPG sampai 8MB • Hasil optimal dengan background putih/bersih
            </p>
          </div>
          <button
            type="button"
            className="btn btn-primary text-lg px-6 py-3"
            disabled={loading}
            onClick={(e) => {
              e.stopPropagation();
              handleClick();
            }}
          >
            {loading ? 'Memproses…' : 'Pilih Gambar'}
          </button>
        </div>
      </div>

      <div className="border rounded-xl p-4 space-y-4 bg-gray-50">
        <h3 className="font-semibold text-neutral-dark">Pengaturan</h3>

        <div>
          <label className="block text-sm font-medium mb-2">Platform Target</label>
          <select
            value={preset}
            onChange={(e) => setPreset(e.target.value as MarketplacePreset)}
            className="w-full border rounded-lg p-3 bg-white focus:ring-2 focus:ring-primary-orange/20 focus:border-primary-orange"
          >
            {presetOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <p className="text-xs text-neutral-gray mt-1">
            {presetOptions.find((p) => p.value === preset)?.description}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Background Removal Tolerance</label>
          <input
            type="range"
            min={0}
            max={60}
            value={tolerance}
            onChange={(e) => setTolerance(parseInt(e.target.value))}
            className="w-full accent-primary-orange"
          />
          <div className="flex justify-between text-xs text-neutral-gray mt-1">
            <span>Ketat (0)</span>
            <span className="font-medium">{tolerance}</span>
            <span>Longgar (60)</span>
          </div>
        </div>

        <div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={branding}
              onChange={(e) => setBranding(e.target.checked)}
              className="accent-primary-orange"
            />
            <span className="text-sm">Tambah branding Yuki Yaki Corner</span>
          </label>
          <p className="text-xs text-neutral-gray mt-1">
            Border brand color untuk Instagram & media sosial
          </p>
        </div>
      </div>
    </div>
  );
}
