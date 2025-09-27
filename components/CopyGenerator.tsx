'use client';
import { useState } from 'react';
import { showToast } from '@/lib/toast';
import { type GeneratedCopy, type CopyGenerationOptions } from '@/lib/ai-service';

interface CopyGeneratorProps {
  onGenerate?: (copy: GeneratedCopy) => void;
}

export default function CopyGenerator({ onGenerate }: CopyGeneratorProps) {
  const [options, setOptions] = useState<CopyGenerationOptions>({
    productName: '',
    category: 'yakiniku',
    tone: 'casual',
    language: 'id',
    platform: 'gofood',
  });
  const [copy, setCopy] = useState<GeneratedCopy | null>(null);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const generateCopy = async () => {
    if (!options.productName.trim()) return;

    setLoading(true);
    try {
      const response = await fetch('/api/generate-copy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(options),
      });

      if (!response.ok) throw new Error(await response.text());
      const result = await response.json();
      if (Array.isArray(result.providers)) {
        const gemini = result.providers.find((p: any) => p.name === 'Gemini' && p.available);
        showToast(gemini ? 'Menggunakan Gemini' : 'Menggunakan Local Fallback', 'info');
      }
      setCopy(result);
      onGenerate?.(result);
    } catch (error: any) {
      console.error('Copy generation failed:', error);
      showToast('Gagal generate copy: ' + (error.message || 'Error'), 'error', 3000);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast('Teks berhasil disalin!', 'success');
  };

  return (
    <div className="border border-gray-200 rounded-2xl bg-white shadow-sm overflow-hidden" aria-live={loading ? 'polite' : 'off'}>
      <div className="p-6 border-b border-gray-100">
        <button
          onClick={() => setExpanded(!expanded)}
          aria-expanded={expanded}
          aria-controls="copy-generator-panel"
          className="flex items-center justify-between w-full text-left hover:opacity-80 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-orange/40 rounded-lg"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-primary-orange to-primary-blue rounded-xl flex items-center justify-center">
              <span className="text-white text-xl">🤖</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-neutral-dark">Generator Copy AI</h3>
              <p className="text-sm text-neutral-gray">
                Buat judul dan deskripsi produk yang menarik secara otomatis
              </p>
            </div>
          </div>
          <div
            className={`transform transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
          >
            <svg
              className="w-5 h-5 text-neutral-gray"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </button>
      </div>

      {expanded && (
        <div id="copy-generator-panel" className="p-6 space-y-6" role="region" aria-label="Form generator copy AI">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-neutral-dark mb-2">
                Nama Produk <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={options.productName}
                onChange={(e) => setOptions({ ...options, productName: e.target.value })}
                className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-primary-orange/30 focus:border-primary-orange transition-colors"
                placeholder="Contoh: Beef Yakiniku Premium"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-neutral-dark mb-2">Kategori</label>
              <select
                value={options.category}
                onChange={(e) => setOptions({ ...options, category: e.target.value })}
                className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-primary-orange/30 focus:border-primary-orange transition-colors"
              >
                <option value="yakiniku">Yakiniku</option>
                <option value="rice_bowl">Rice Bowl</option>
                <option value="appetizer">Appetizer</option>
                <option value="beverage">Minuman</option>
                <option value="dessert">Dessert</option>
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-neutral-dark mb-2">
                Gaya Bahasa
              </label>
              <select
                value={options.tone}
                onChange={(e) => setOptions({ ...options, tone: e.target.value as any })}
                className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-primary-orange/30 focus:border-primary-orange transition-colors"
              >
                <option value="casual">Santai</option>
                <option value="professional">Profesional</option>
                <option value="playful">Ramah</option>
                <option value="premium">Premium</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-neutral-dark mb-2">
                Platform Target
              </label>
              <select
                value={options.platform}
                onChange={(e) => setOptions({ ...options, platform: e.target.value as any })}
                className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-primary-orange/30 focus:border-primary-orange transition-colors"
              >
                <option value="gofood">GoFood</option>
                <option value="grabfood">GrabFood</option>
                <option value="shopeefood">ShopeeFood</option>
                <option value="instagram">Instagram</option>
                <option value="general">Umum</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-neutral-dark mb-2">Bahasa</label>
              <select
                value={options.language}
                onChange={(e) => setOptions({ ...options, language: e.target.value as any })}
                className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-primary-orange/30 focus:border-primary-orange transition-colors"
              >
                <option value="id">Indonesia</option>
                <option value="en">Inggris</option>
              </select>
            </div>
          </div>

          {/* Experimental Banana Mode toggle */}
          <div className="grid md:grid-cols-3 gap-4 items-end">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-neutral-dark mb-2">
                Mode Banana (Eksperimen)
              </label>
              <label className="flex items-center gap-3 p-3 border border-dashed border-gray-200 rounded-xl bg-gray-50 cursor-pointer focus-within:ring-2 focus-within:ring-primary-orange/20">
                <input
                  type="checkbox"
                  checked={Boolean(options.bananaMode)}
                  onChange={(e) => setOptions({ ...options, bananaMode: e.target.checked })}
                  className="accent-primary-orange scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-orange/40"
                />
                <span className="text-sm text-neutral-gray">
                  Gaya bahasa ekstra catchy dan dinamis sesuai fitur baru Gemini.
                </span>
              </label>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={generateCopy}
              disabled={loading || !options.productName.trim()}
              className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-200 ${
                loading || !options.productName.trim()
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-primary-orange to-primary-blue text-white hover:shadow-lg hover:scale-[1.02] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-orange/50'
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Membuat Copy...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <span>✨</span>
                  Buat Copy Otomatis
                </div>
              )}
            </button>
          </div>

          {copy && (
            <div className="mt-8 space-y-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 text-sm">✓</span>
                </div>
                <h4 className="text-lg font-bold text-neutral-dark">Copy Berhasil Dibuat</h4>
              </div>

              <div className="space-y-4">
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-xl p-4">
                  <div className="flex justify-between items-start mb-2">
                    <label className="text-xs font-semibold text-orange-700 uppercase tracking-wider">
                      📝 Judul Produk
                    </label>
                      <button
                      onClick={() => copyToClipboard(copy.title)}
                        className="px-3 py-1 bg-orange-200 hover:bg-orange-300 text-orange-700 text-xs rounded-lg transition-colors font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/50"
                    >
                      Salin
                    </button>
                  </div>
                  <p className="font-semibold text-orange-900 text-lg leading-tight">
                    {copy.title}
                  </p>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4">
                  <div className="flex justify-between items-start mb-2">
                    <label className="text-xs font-semibold text-blue-700 uppercase tracking-wider">
                      📋 Deskripsi Produk
                    </label>
                      <button
                      onClick={() => copyToClipboard(copy.description)}
                        className="px-3 py-1 bg-blue-200 hover:bg-blue-300 text-blue-700 text-xs rounded-lg transition-colors font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/50"
                    >
                      Salin
                    </button>
                  </div>
                  <p className="text-blue-900 leading-relaxed">{copy.description}</p>
                </div>

                {copy.hashtags && (
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-xl p-4">
                    <div className="flex justify-between items-start mb-2">
                      <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        🏷️ Hashtag
                      </label>
                      <button
                        onClick={() => copyToClipboard(copy.hashtags?.join(' ') || '')}
                        className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs rounded-lg transition-colors font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-orange/40"
                      >
                        Salin
                      </button>
                    </div>
                    <p className="text-sm text-primary-blue font-medium">
                      {copy.hashtags.join(' ')}
                    </p>
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-4">
                    <label className="text-xs font-semibold text-green-700 uppercase tracking-wider mb-2 block">
                      📢 Call to Action
                    </label>
                    <p className="font-semibold text-green-800">{copy.callToAction}</p>
                  </div>

                  {copy.brandMessage && (
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-4">
                      <label className="text-xs font-semibold text-purple-700 uppercase tracking-wider mb-2 block">
                        🎯 Pesan Brand
                      </label>
                      <p className="font-semibold text-purple-800">{copy.brandMessage}</p>
                    </div>
                  )}
                </div>

                <div className="border-t pt-4 mt-6">
                  <button
                    onClick={() => {
                      const allCopy = `${copy.title}\n\n${copy.description}\n\n${copy.hashtags?.join(' ') || ''}\n\n${copy.callToAction}${copy.brandMessage ? `\n\n${copy.brandMessage}` : ''}`;
                      copyToClipboard(allCopy);
                    }}
                    className="w-full py-2 bg-gradient-to-r from-primary-orange to-primary-blue text-white rounded-lg hover:shadow-md transition-all duration-200 font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-orange/50"
                  >
                    📋 Salin Semua Copy
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
