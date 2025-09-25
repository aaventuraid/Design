'use client';
import { useEffect, useState } from 'react';

// Types
interface Settings {
  // AI Configuration
  geminiApiKey?: string;
  defaultAIProvider?: 'gemini' | 'local';
  hasGeminiKey?: boolean;

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

  // Admin settings
  adminEmail?: string;
  maintenanceMode?: boolean;
}

interface AdminInfo {
  email: string;
  role: string;
}

const defaultSettings: Settings = {
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
};

export default function AdminForm() {
  // State management
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [adminInfo, setAdminInfo] = useState<AdminInfo | null>(null);
  const [password, setPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('credentials');

  // Credential management
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);

  // Load admin info and settings
  const loadAdminInfo = async () => {
    try {
      const res = await fetch('/api/admin/management');
      if (res.ok) {
        const data = await res.json();
        setAdminInfo(data.admin);
        setNewAdminEmail(data.admin?.email || '');
        setSettings((prev) => ({ ...prev, ...data.settings }));
      }
    } catch (error) {
      console.error('Failed to load admin info:', error);
    }
  };

  useEffect(() => {
    loadAdminInfo();
  }, []);

  // Update admin credentials
  const saveCredentials = async () => {
    setSaving(true);
    setMessage(null);

    try {
      if (!password.trim()) {
        setMessage('❌ Masukkan kata sandi admin saat ini');
        return;
      }

      if (newAdminPassword && newAdminPassword !== confirmPassword) {
        setMessage('❌ Konfirmasi password tidak cocok');
        return;
      }

      // Validate password strength if changing
      if (newAdminPassword) {
        if (newAdminPassword.length < 8) {
          setMessage('❌ Password baru minimal 8 karakter');
          return;
        }
        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(newAdminPassword)) {
          setMessage('❌ Password harus mengandung huruf besar, kecil, dan angka');
          return;
        }
      }

      const payload: any = {
        type: 'admin_credentials',
        currentPassword: password,
      };

      if (newAdminEmail && newAdminEmail !== adminInfo?.email) {
        payload.adminEmail = newAdminEmail;
      }
      if (newAdminPassword) {
        payload.adminPassword = newAdminPassword;
      }

      if (!payload.adminEmail && !payload.adminPassword) {
        setMessage('❌ Tidak ada perubahan untuk disimpan');
        return;
      }

      const res = await fetch('/api/admin/management', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      if (res.status === 401) {
        setMessage('❌ Kata sandi admin salah');
        return;
      }

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Gagal mengupdate kredensial admin');
      }

      setMessage('✅ Kredensial admin berhasil diperbarui!');
      setNewAdminPassword('');
      setConfirmPassword('');
      setTimeout(() => setMessage(null), 3000);
      loadAdminInfo();
    } catch (e: any) {
      setMessage('❌ ' + (e.message || 'Gagal mengupdate kredensial admin'));
    } finally {
      setSaving(false);
    }
  };

  // Save system settings
  const saveSettings = async () => {
    setSaving(true);
    setMessage(null);

    try {
      // Validate settings
      if (settings.maxFileSize && (settings.maxFileSize < 1 || settings.maxFileSize > 50)) {
        setMessage('❌ Ukuran file maksimal harus antara 1-50 MB');
        return;
      }

      if (settings.rateLimit && (settings.rateLimit < 10 || settings.rateLimit > 10000)) {
        setMessage('❌ Rate limit harus antara 10-10000 per jam');
        return;
      }

      const res = await fetch('/api/admin/management', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ type: 'system_settings', ...settings }),
      });

      if (res.status === 401) {
        setMessage('❌ Kata sandi admin salah');
        return;
      }

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Gagal menyimpan pengaturan');
      }

      setMessage('✅ Pengaturan sistem berhasil disimpan!');
      setTimeout(() => setMessage(null), 3000);
      loadAdminInfo();
    } catch (e: any) {
      setMessage('❌ ' + (e.message || 'Gagal menyimpan pengaturan'));
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'credentials', label: '👤 Admin Credentials', icon: '👤' },
    { id: 'ai', label: '🤖 AI & API', icon: '🤖' },
    { id: 'system', label: '⚙️ System', icon: '⚙️' },
    { id: 'marketplace', label: '🏪 Marketplace', icon: '🏪' },
    { id: 'branding', label: '🎨 Branding', icon: '🎨' },
  ];

  return (
    <div className="space-y-6">
      {/* Message Display */}
      {message && (
        <div
          className={`p-3 rounded-lg text-sm ${
            message.includes('✅')
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}
        >
          {message}
        </div>
      )}

      {/* Tab Navigation */}
      <div className="border-b">
        <div className="flex flex-wrap gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-t-lg text-sm font-medium transition-colors ${
                activeTab === tab.id
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
        {/* Admin Credentials Tab */}
        {activeTab === 'credentials' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-neutral-dark">Manajemen Kredensial Admin</h3>

            {adminInfo && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-800 mb-2">Info Admin Saat Ini</h4>
                <div className="text-sm text-blue-700">
                  <p>
                    <strong>Email:</strong> {adminInfo.email}
                  </p>
                  <p>
                    <strong>Role:</strong> {adminInfo.role}
                  </p>
                </div>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium text-neutral-dark">Update Email Admin</h4>
                <div>
                  <label className="block text-sm font-medium mb-2">Email Baru</label>
                  <input
                    type="email"
                    className="border rounded-lg p-3 w-full focus:ring-2 focus:ring-primary-orange/20"
                    value={newAdminEmail}
                    onChange={(e) => setNewAdminEmail(e.target.value)}
                    placeholder="admin@yourdomain.com"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-neutral-dark">Update Password Admin</h4>
                <div>
                  <label className="block text-sm font-medium mb-2">Password Baru</label>
                  <input
                    type={showPasswords ? 'text' : 'password'}
                    className="border rounded-lg p-3 w-full focus:ring-2 focus:ring-primary-orange/20"
                    value={newAdminPassword}
                    onChange={(e) => setNewAdminPassword(e.target.value)}
                    placeholder="Password baru (kosongkan jika tidak berubah)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Konfirmasi Password</label>
                  <input
                    type={showPasswords ? 'text' : 'password'}
                    className="border rounded-lg p-3 w-full focus:ring-2 focus:ring-primary-orange/20"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Konfirmasi password baru"
                  />
                </div>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={showPasswords}
                    onChange={(e) => setShowPasswords(e.target.checked)}
                    className="rounded"
                  />
                  Tampilkan password
                </label>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-medium text-yellow-800 mb-2">⚠️ Peringatan Keamanan</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Gunakan password yang kuat dan unik</li>
                <li>• Pastikan email admin dapat diakses untuk recovery</li>
                <li>• Perubahan akan menimpa environment variables</li>
              </ul>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <label className="block text-sm font-medium mb-2">
                🔐 Konfirmasi Kata Sandi Saat Ini
              </label>
              <input
                type="password"
                className="border rounded-lg p-3 w-full max-w-xs focus:ring-2 focus:ring-primary-orange/20"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan kata sandi admin saat ini"
              />
              <p className="text-xs text-neutral-gray mt-2">
                Diperlukan untuk mengubah kredensial admin
              </p>
            </div>

            <button
              onClick={saveCredentials}
              disabled={saving || !password}
              className="px-6 py-3 bg-primary-orange text-white rounded-lg hover:bg-primary-orange/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Menyimpan...' : 'Update Kredensial Admin'}
            </button>
          </div>
        )}

        {/* AI & API Tab */}
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
                  placeholder={
                    settings.hasGeminiKey
                      ? 'API Key tersimpan (••••••••)'
                      : 'Masukkan Gemini API key'
                  }
                />
                {settings.hasGeminiKey && (
                  <p className="text-xs text-green-600 mt-1">✅ API Key sudah dikonfigurasi</p>
                )}
                <p className="text-xs text-neutral-gray mt-1">
                  Untuk fitur generator copy AI. Akan tersimpan di database.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Default AI Provider</label>
                <select
                  className="border rounded-lg p-3 w-full focus:ring-2 focus:ring-primary-orange/20"
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

            <button
              onClick={saveSettings}
              disabled={saving}
              className="px-6 py-3 bg-primary-orange text-white rounded-lg hover:bg-primary-orange/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Menyimpan...' : 'Simpan Pengaturan AI'}
            </button>
          </div>
        )}

        {/* System Tab */}
        {activeTab === 'system' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-neutral-dark">System Configuration</h3>

            <div className="grid md:grid-cols-2 gap-6">
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
                  <option value="external">External API (Future)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Max File Size (MB)</label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  className="border rounded-lg p-3 w-full focus:ring-2 focus:ring-primary-orange/20"
                  value={settings.maxFileSize || 8}
                  onChange={(e) =>
                    setSettings({ ...settings, maxFileSize: parseInt(e.target.value) })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Rate Limit (requests/hour)</label>
                <input
                  type="number"
                  min="10"
                  max="1000"
                  className="border rounded-lg p-3 w-full focus:ring-2 focus:ring-primary-orange/20"
                  value={settings.rateLimit || 100}
                  onChange={(e) =>
                    setSettings({ ...settings, rateLimit: parseInt(e.target.value) })
                  }
                />
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={settings.analyticsEnabled !== false}
                    onChange={(e) =>
                      setSettings({ ...settings, analyticsEnabled: e.target.checked })
                    }
                    className="rounded"
                  />
                  <span className="text-sm font-medium">Enable Analytics</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={settings.maintenanceMode || false}
                    onChange={(e) =>
                      setSettings({ ...settings, maintenanceMode: e.target.checked })
                    }
                    className="rounded"
                  />
                  <span className="text-sm font-medium">Maintenance Mode</span>
                </label>
              </div>
            </div>

            <button
              onClick={saveSettings}
              disabled={saving}
              className="px-6 py-3 bg-primary-orange text-white rounded-lg hover:bg-primary-orange/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Menyimpan...' : 'Simpan Pengaturan System'}
            </button>
          </div>
        )}

        {/* Marketplace Tab */}
        {activeTab === 'marketplace' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-neutral-dark">Marketplace Settings</h3>

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
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={settings.brandingEnabled || false}
                  onChange={(e) => setSettings({ ...settings, brandingEnabled: e.target.checked })}
                  className="rounded"
                />
                <span className="text-sm font-medium">Enable Branding by Default</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={settings.watermarkEnabled || false}
                  onChange={(e) => setSettings({ ...settings, watermarkEnabled: e.target.checked })}
                  className="rounded"
                />
                <span className="text-sm font-medium">Enable Watermark</span>
              </label>
            </div>

            <button
              onClick={saveSettings}
              disabled={saving}
              className="px-6 py-3 bg-primary-orange text-white rounded-lg hover:bg-primary-orange/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Menyimpan...' : 'Simpan Pengaturan Marketplace'}
            </button>
          </div>
        )}

        {/* Branding Tab */}
        {activeTab === 'branding' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-neutral-dark">Brand Assets & Colors</h3>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Primary Brand Color</label>
                <div className="flex gap-3">
                  <input
                    type="color"
                    className="w-16 h-12 rounded border"
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
                    className="border rounded-lg p-3 flex-1 focus:ring-2 focus:ring-primary-orange/20"
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
                <div className="flex gap-3">
                  <input
                    type="color"
                    className="w-16 h-12 rounded border"
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
                    className="border rounded-lg p-3 flex-1 focus:ring-2 focus:ring-primary-orange/20"
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

            <button
              onClick={saveSettings}
              disabled={saving}
              className="px-6 py-3 bg-primary-orange text-white rounded-lg hover:bg-primary-orange/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Menyimpan...' : 'Simpan Pengaturan Brand'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
