'use client';

import { useState } from 'react';

interface AuthFormProps {
  onLogin: (token: string, user: any) => void;
}

export default function AuthForm({ onLogin }: AuthFormProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
      const body =
        mode === 'login'
          ? { email: formData.email, password: formData.password }
          : { email: formData.email, username: formData.username, password: formData.password };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        // Map known codes to richer Indonesian messages
        if (data?.code) {
          const map: Record<string, string> = {
            NOT_FOUND: 'Akun tidak ditemukan. Pastikan email benar atau hubungi admin.',
            INACTIVE: 'Akun Anda nonaktif. Silakan hubungi administrator.',
            INVALID_PASSWORD: 'Password salah. Periksa kembali atau reset jika lupa.',
          };
          setError(map[data.code] || data.error || 'Terjadi kesalahan');
        } else {
          setError(data.error || 'Terjadi kesalahan');
        }
        return;
      }

      // Store token dan user data
      localStorage.setItem('auth-token', data.token);
      localStorage.setItem('user-data', JSON.stringify(data.user));

      onLogin(data.token, data.user);
    } catch {
      setError('Terjadi kesalahan jaringan');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-blue/5 via-white to-primary-orange/5 py-12 px-4 sm:px-6 lg:px-8 pattern-sakura">
      <div className="max-w-lg w-full space-y-10">
        {/* Header */}
        <div className="text-center space-y-6">
          <div className="inline-block">
            <div className="w-20 h-20 bg-gradient-to-br from-primary-orange to-primary-blue rounded-brand-xl mx-auto flex items-center justify-center shadow-brand-hover">
              <span className="text-white text-3xl">🍜</span>
            </div>
          </div>
          <div className="space-y-2">
            <h2 className="text-title text-4xl text-brand-gradient">
              {mode === 'login' ? 'Masuk ke Akun' : 'Daftar Akun Baru'}
            </h2>
            <p className="text-body">
              {mode === 'login' 
                ? 'Selamat datang kembali di studio foto F&B profesional' 
                : 'Bergabunglah dengan komunitas F&B Indonesia'}
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="card-elevated p-8 bg-white/80 backdrop-blur-sm">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-brand border-l-4 border-l-red-500">
                <div className="flex items-center gap-2">
                  <span className="text-red-500">⚠️</span>
                  <span className="font-medium">Error:</span>
                </div>
                <p className="mt-1 text-sm">{error}</p>
              </div>
            )}

            <div className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="email" className="text-subtitle text-sm">
                  Alamat Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="input"
                  placeholder="contoh@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              {mode === 'register' && (
                <div className="space-y-2">
                  <label htmlFor="username" className="text-subtitle text-sm">
                    Username (Opsional)
                  </label>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    className="input"
                    placeholder="username_anda"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  />
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="password" className="text-subtitle text-sm">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="input"
                  placeholder="Masukkan password yang kuat"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-4">
              <button
                type="submit"
                disabled={isLoading}
                className={`btn-primary w-full h-14 text-lg ${isLoading ? 'loading-brand' : ''}`}
              >
                {isLoading ? (
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Memproses...
                  </div>
                ) : (
                  mode === 'login' ? 'Masuk ke Akun' : 'Daftar Sekarang'
                )}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => {
                    setMode(mode === 'login' ? 'register' : 'login');
                    setError('');
                    setFormData({ email: '', username: '', password: '' });
                  }}
                  className="text-body hover:text-primary-orange transition-colors font-medium"
                >
                  {mode === 'login' 
                    ? 'Belum punya akun? Daftar di sini' 
                    : 'Sudah punya akun? Masuk di sini'}
                </button>
              </div>
            </div>
          </form>

          {/* Additional Info */}
          <div className="mt-6 p-4 bg-gradient-to-r from-primary-orange/5 to-primary-blue/5 rounded-brand border border-primary-orange/20">
            <p className="text-caption text-center">
              🔒 Data Anda aman dan terenkripsi dengan standar industri
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
