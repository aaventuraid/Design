'use client';
import { useEffect, useState } from 'react';

type Settings = {
  // AI Configuration
  geminiApiKey?: string;
  defaultAIProvider?: 'gemini' | 'local';

  // Image Processing
  imageBgProvider?: 'internal' | 'external';
  defaultTolerance?: number;
  maxFileSize?: number;

  // Marketplace Configuration
  defaultMarketplace?: 'gofood' | 'grabfood' | 'shopeefood' | 'instagram';
  brandingEnabled?: boolean;
  watermarkEnabled?: boolean;

  // UI/UX Settings
  theme?: 'light' | 'dark' | 'auto';
  language?: 'id' | 'en';

  // Analytics & Monitoring
  analyticsEnabled?: boolean;
  processingHistory?: boolean;

  // Rate Limiting
  rateLimit?: number;

  // Brand Assets
  logoUrl?: string;
  brandColors?: {
    primary?: string;
    secondary?: string;
  };
};

export default function AdminForm() {
  const [settings, setSettings] = useState<Settings>({
    defaultAIProvider: 'local',
    imageBgProvider: 'internal',
    defaultTolerance: 12,
    maxFileSize: 8,
    defaultMarketplace: 'gofood',
    brandingEnabled: false,
    watermarkEnabled: false,
    theme: 'light',
    language: 'id',
    analyticsEnabled: true,
    processingHistory: true,
    rateLimit: 100,
  });
  const [password, setPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('ai');

  useEffect(() => {
    fetch('/api/admin/settings')
      .then((r) => r.json())
      .then((d) => setSettings((s) => ({ ...s, ...d.settings })))
      .catch(() => { });
  }, []);

  const save = async () => {
    setSaving(true);
    setMessage(null);
    try {
      if (!password.trim()) {
        setMessage('❌ Masukkan kata sandi admin (default: admin)');
        return;
      }

      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
        body: JSON.stringify(settings),
      });

      if (res.status === 401) {
        setMessage('❌ Kata sandi admin salah');
        return;
      }

      if (!res.ok) {
        const t = await res.text();
        throw new Error(t || 'Gagal menyimpan pengaturan');
      }

      setMessage('✅ Pengaturan berhasil disimpan!');
      setTimeout(() => setMessage(null), 3000);
    } catch (e: any) {
      setMessage('❌ ' + (e.message || 'Gagal menyimpan pengaturan'));
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'ai', label: '🤖 AI & API', icon: '🤖' },
    { id: 'image', label: '🖼️ Image Processing', icon: '🖼️' },
    { id: 'marketplace', label: '🏪 Marketplace', icon: '🏪' },
    { id: 'brand', label: '🎨 Branding', icon: '🎨' },
    { id: 'system', label: '⚙️ System', icon: '⚙️' },
  ];

  return (
    <div className="space-y-6">
      {/* Admin Authentication */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <label className="block text-sm font-medium mb-2">🔐 Kata Sandi Admin</label>
        <input
          type="password"
          className="border rounded-lg p-3 w-full max-w-xs focus:ring-2 focus:ring-primary-orange/20"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Masukkan kata sandi admin (default: admin)"
        />
        <p className="text-xs text-neutral-gray mt-2">
          Diperlukan untuk menyimpan perubahan. Jika belum diatur, gunakan password default: <span className="font-semibold">admin</span>
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b">
        <div className="flex flex-wrap gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-t-lg text-sm font-medium transition-colors ${activeTab === tab.id
                ? 'bg-primary-orange text-white border-b-2 border-primary-orange'
                : 'text-neutral-gray hover:text-neutral-dark hover:bg-gray-50'
                }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="min-h-96">
        {activeTab === 'ai' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-neutral-dark">AI & API Configuration</h3>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Gemini API Key</label>
                <input
                  type="password"
                  className="border rounded-lg p-3 w-full focus:ring-2 focus:ring-primary-orange/20"
                  value={settings.geminiApiKey || ''}
                  onChange={(e) => setSettings({ ...settings, geminiApiKey: e.target.value })}
                  placeholder="Masukkan Gemini API key"
                />
                <p className="text-xs text-neutral-gray mt-1">Digunakan untuk generator copy AI (hanya Gemini yang didukung)</p>
              </div>
              {/* Slot kosong untuk info fitur eksperimen Banana */}
              <div className="bg-gray-50 border border-dashed border-gray-200 rounded-lg p-3 text-xs text-neutral-gray">
                Dukungan mode eksperimen <span className="font-semibold">Banana</span> pada Gemini dapat diaktifkan di UI generator (akan ditambahkan). Tidak perlu konfigurasi tambahan di sini.
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Default AI Provider</label>
              <select
                className="border rounded-lg p-3 w-full max-w-xs focus:ring-2 focus:ring-primary-orange/20"
                value={settings.defaultAIProvider || 'local'}
                onChange={(e) =>
                  setSettings({ ...settings, defaultAIProvider: e.target.value as any })
                }
              >
                <option value="gemini">Gemini (Utama)</option>
                <option value="local">Local Fallback</option>
              </select>
            </div>
          </div>
        )}

        {activeTab === 'image' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-neutral-dark">Image Processing Settings</h3>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Background Removal Provider
                </label>
                <select
                  className="border rounded-lg p-3 w-full focus:ring-2 focus:ring-primary-orange/20"
                  value={settings.imageBgProvider || 'internal'}
                  onChange={(e) =>
                    setSettings({ ...settings, imageBgProvider: e.target.value as any })
                  }
                >
                  <option value="internal">Internal (Heuristic)</option>
                  <option value="external">External API (Coming Soon)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Default Tolerance</label>
                <input
                  type="number"
                  min="0"
                  max="60"
                  className="border rounded-lg p-3 w-full focus:ring-2 focus:ring-primary-orange/20"
                  value={settings.defaultTolerance || 12}
                  onChange={(e) =>
                    setSettings({ ...settings, defaultTolerance: parseInt(e.target.value) })
                  }
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Max File Size (MB)</label>
              <input
                type="number"
                min="1"
                max="20"
                className="border rounded-lg p-3 w-full max-w-xs focus:ring-2 focus:ring-primary-orange/20"
                value={settings.maxFileSize || 8}
                onChange={(e) =>
                  setSettings({ ...settings, maxFileSize: parseInt(e.target.value) })
                }
              />
            </div>
          </div>
        )}

        {activeTab === 'marketplace' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-neutral-dark">Marketplace Configuration</h3>

            <div>
              <label className="block text-sm font-medium mb-2">Default Marketplace</label>
              <select
                className="border rounded-lg p-3 w-full max-w-xs focus:ring-2 focus:ring-primary-orange/20"
                value={settings.defaultMarketplace || 'gofood'}
                onChange={(e) =>
                  setSettings({ ...settings, defaultMarketplace: e.target.value as any })
                }
              >
                <option value="gofood">GoFood</option>
                <option value="grabfood">GrabFood</option>
                <option value="shopeefood">ShopeeFood</option>
                <option value="instagram">Instagram</option>
              </select>
            </div>

            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.brandingEnabled || false}
                  onChange={(e) => setSettings({ ...settings, brandingEnabled: e.target.checked })}
                  className="accent-primary-orange scale-110"
                />
                <span className="text-sm font-medium">Enable Branding by Default</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.watermarkEnabled || false}
                  onChange={(e) => setSettings({ ...settings, watermarkEnabled: e.target.checked })}
                  className="accent-primary-orange scale-110"
                />
                <span className="text-sm font-medium">Enable Watermark for Instagram</span>
              </label>
            </div>
          </div>
        )}

        {activeTab === 'brand' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-neutral-dark">Brand Assets & Colors</h3>

            <div>
              <label className="block text-sm font-medium mb-2">Logo URL</label>
              <input
                type="url"
                className="border rounded-lg p-3 w-full focus:ring-2 focus:ring-primary-orange/20"
                value={settings.logoUrl || ''}
                onChange={(e) => setSettings({ ...settings, logoUrl: e.target.value })}
                placeholder="https://example.com/logo.png"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Primary Brand Color</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    className="w-12 h-12 border rounded-lg cursor-pointer"
                    value={settings.brandColors?.primary || '#F28C28'}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        brandColors: { ...settings.brandColors, primary: e.target.value },
                      })
                    }
                  />
                  <input
                    type="text"
                    className="border rounded-lg p-3 flex-1 font-mono text-sm focus:ring-2 focus:ring-primary-orange/20"
                    value={settings.brandColors?.primary || '#F28C28'}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        brandColors: { ...settings.brandColors, primary: e.target.value },
                      })
                    }
                    placeholder="#F28C28"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Secondary Brand Color</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    className="w-12 h-12 border rounded-lg cursor-pointer"
                    value={settings.brandColors?.secondary || '#2B3A67'}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        brandColors: { ...settings.brandColors, secondary: e.target.value },
                      })
                    }
                  />
                  <input
                    type="text"
                    className="border rounded-lg p-3 flex-1 font-mono text-sm focus:ring-2 focus:ring-primary-orange/20"
                    value={settings.brandColors?.secondary || '#2B3A67'}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        brandColors: { ...settings.brandColors, secondary: e.target.value },
                      })
                    }
                    placeholder="#2B3A67"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'system' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-neutral-dark">System Configuration</h3>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">UI Theme</label>
                <select
                  className="border rounded-lg p-3 w-full focus:ring-2 focus:ring-primary-orange/20"
                  value={settings.theme || 'light'}
                  onChange={(e) => setSettings({ ...settings, theme: e.target.value as any })}
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="auto">Auto (System)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Default Language</label>
                <select
                  className="border rounded-lg p-3 w-full focus:ring-2 focus:ring-primary-orange/20"
                  value={settings.language || 'id'}
                  onChange={(e) => setSettings({ ...settings, language: e.target.value as any })}
                >
                  <option value="id">Indonesia</option>
                  <option value="en">English</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Rate Limit (requests per hour)
              </label>
              <input
                type="number"
                min="10"
                max="1000"
                className="border rounded-lg p-3 w-full max-w-xs focus:ring-2 focus:ring-primary-orange/20"
                value={settings.rateLimit || 100}
                onChange={(e) => setSettings({ ...settings, rateLimit: parseInt(e.target.value) })}
              />
            </div>

            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.analyticsEnabled !== false}
                  onChange={(e) => setSettings({ ...settings, analyticsEnabled: e.target.checked })}
                  className="accent-primary-orange scale-110"
                />
                <span className="text-sm font-medium">Enable Analytics & Usage Tracking</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.processingHistory !== false}
                  onChange={(e) =>
                    setSettings({ ...settings, processingHistory: e.target.checked })
                  }
                  className="accent-primary-orange scale-110"
                />
                <span className="text-sm font-medium">Keep Processing History</span>
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Save Actions */}
      <div className="flex items-center justify-between pt-4 border-t">
        <div className="flex items-center gap-4">
          <button
            className="btn btn-primary px-8"
            onClick={save}
            disabled={saving}
          >
            {saving ? '💾 Menyimpan…' : '💾 Simpan Pengaturan'}
          </button>

          {message && (
            <span
              className={`text-sm font-medium ${message.includes('✅') ? 'text-green-600' : 'text-red-600'
                }`}
            >
              {message}
            </span>
          )}
        </div>

        <div className="text-xs text-neutral-gray">Pengaturan akan otomatis diterapkan setelah disimpan</div>
      </div>
    </div>
  );
}
