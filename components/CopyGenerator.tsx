'use client';
import { useState } from 'react';
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
      setCopy(result);
      onGenerate?.(result);
    } catch (error: any) {
      console.error('Copy generation failed:', error);
      alert('Gagal generate copy: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  return (
    <div className="border rounded-xl bg-white shadow-sm">
      <div className="p-4 border-b">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center justify-between w-full text-left"
        >
          <div>
            <h3 className="font-semibold text-neutral-dark">🤖 AI Copy Generator</h3>
            <p className="text-sm text-neutral-gray">Generate judul & deskripsi produk dengan AI</p>
          </div>
          <span className={`transform transition-transform ${expanded ? 'rotate-180' : ''}`}>
            ▼
          </span>
        </button>
      </div>

      {expanded && (
        <div className="p-4 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nama Produk *</label>
              <input
                type="text"
                value={options.productName}
                onChange={(e) => setOptions({ ...options, productName: e.target.value })}
                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-primary-orange/20"
                placeholder="e.g., Beef Yakiniku Premium"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Kategori</label>
              <select
                value={options.category}
                onChange={(e) => setOptions({ ...options, category: e.target.value })}
                className="w-full border rounded-lg p-2"
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
              <label className="block text-sm font-medium mb-1">Tone</label>
              <select
                value={options.tone}
                onChange={(e) => setOptions({ ...options, tone: e.target.value as any })}
                className="w-full border rounded-lg p-2"
              >
                <option value="casual">Casual</option>
                <option value="professional">Professional</option>
                <option value="playful">Playful</option>
                <option value="premium">Premium</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Platform</label>
              <select
                value={options.platform}
                onChange={(e) => setOptions({ ...options, platform: e.target.value as any })}
                className="w-full border rounded-lg p-2"
              >
                <option value="gofood">GoFood</option>
                <option value="grabfood">GrabFood</option>
                <option value="shopeefood">ShopeeFood</option>
                <option value="instagram">Instagram</option>
                <option value="general">General</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Bahasa</label>
              <select
                value={options.language}
                onChange={(e) => setOptions({ ...options, language: e.target.value as any })}
                className="w-full border rounded-lg p-2"
              >
                <option value="id">Indonesia</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>

          <button
            onClick={generateCopy}
            disabled={loading || !options.productName.trim()}
            className="btn btn-primary w-full"
          >
            {loading ? 'Generating...' : '✨ Generate Copy'}
          </button>

          {copy && (
            <div className="mt-6 space-y-4">
              <h4 className="font-semibold text-neutral-dark">Generated Copy:</h4>

              <div className="space-y-3">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <label className="text-xs text-neutral-gray uppercase tracking-wide">
                        Judul
                      </label>
                      <p className="font-semibold">{copy.title}</p>
                    </div>
                    <button
                      onClick={() => copyToClipboard(copy.title)}
                      className="text-xs text-primary-orange hover:text-primary-blue"
                    >
                      Copy
                    </button>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <label className="text-xs text-neutral-gray uppercase tracking-wide">
                        Deskripsi
                      </label>
                      <p>{copy.description}</p>
                    </div>
                    <button
                      onClick={() => copyToClipboard(copy.description)}
                      className="text-xs text-primary-orange hover:text-primary-blue"
                    >
                      Copy
                    </button>
                  </div>
                </div>

                {copy.hashtags && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <label className="text-xs text-neutral-gray uppercase tracking-wide">
                          Hashtags
                        </label>
                        <p className="text-sm text-primary-blue">{copy.hashtags.join(' ')}</p>
                      </div>
                      <button
                        onClick={() => copyToClipboard(copy.hashtags?.join(' ') || '')}
                        className="text-xs text-primary-orange hover:text-primary-blue"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <div className="bg-gray-50 rounded-lg p-3 flex-1">
                    <label className="text-xs text-neutral-gray uppercase tracking-wide">
                      Call to Action
                    </label>
                    <p className="font-semibold text-primary-orange">{copy.callToAction}</p>
                  </div>

                  {copy.brandMessage && (
                    <div className="bg-gray-50 rounded-lg p-3 flex-1">
                      <label className="text-xs text-neutral-gray uppercase tracking-wide">
                        Brand Message
                      </label>
                      <p className="text-sm">{copy.brandMessage}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
