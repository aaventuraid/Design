'use client';

import { useAuth } from '@/components/AuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function DashboardPage() {
  const { user, token, isLoading } = useAuth();
  const router = useRouter();
  const [analytics, setAnalytics] = useState<any>(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth');
    }
  }, [user, isLoading, router]);

  const fetchAnalytics = async () => {
    if (!token) return;

    setLoadingAnalytics(true);
    try {
      const response = await fetch('/api/analytics', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setAnalytics(data.analytics);
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoadingAnalytics(false);
    }
  };

  useEffect(() => {
    if (user && token) {
      fetchAnalytics();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, token]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="max-w-6xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Dashboard {user.username || user.email}
        </h1>
        <p className="text-gray-600">
          Selamat datang di dashboard pribadi Anda
          {user.role === 'PREMIUM' && (
            <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-sm rounded">
              ✨ Premium User
            </span>
          )}
        </p>
      </div>

      {/* User Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Akun</h3>
          <div className="space-y-1 text-sm text-gray-600">
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Role:</strong> {user.role}
            </p>
            {user.createdAt && (
              <p>
                <strong>Bergabung:</strong> {new Date(user.createdAt).toLocaleDateString('id-ID')}
              </p>
            )}
            {user.lastLoginAt && (
              <p>
                <strong>Login terakhir:</strong>{' '}
                {new Date(user.lastLoginAt).toLocaleDateString('id-ID')}
              </p>
            )}
          </div>
        </div>

        {loadingAnalytics ? (
          <div className="col-span-2 bg-white rounded-lg shadow p-6 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Memuat statistik...</p>
            </div>
          </div>
        ) : analytics ? (
          <>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Pemrosesan Gambar</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total:</span>
                  <span className="font-medium">{analytics.totalProcessings}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Hari ini:</span>
                  <span className="font-medium">{analytics.todayProcessings}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Rata-rata waktu:</span>
                  <span className="font-medium">{Math.round(analytics.avgProcessingTimeMs)}ms</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Platform Favorit</h3>
              <div className="space-y-2">
                {analytics.presetStats?.slice(0, 3).map((stat: any) => (
                  <div key={stat.preset} className="flex justify-between">
                    <span className="text-gray-600 capitalize">{stat.preset}:</span>
                    <span className="font-medium">{stat._count}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="col-span-2 bg-white rounded-lg shadow p-6">
            <p className="text-gray-500">Tidak ada data analytics tersedia</p>
          </div>
        )}
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-medium text-blue-900 mb-2">Proses Gambar</h3>
          <p className="text-blue-700 mb-4">
            Ubah foto makanan Anda menjadi profesional untuk platform marketplace
          </p>
          <a
            href="/"
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Mulai Proses
          </a>
        </div>

        <div className="bg-green-50 rounded-lg p-6">
          <h3 className="text-lg font-medium text-green-900 mb-2">Generate Copy</h3>
          <p className="text-green-700 mb-4">
            Buat deskripsi produk yang menarik dengan bantuan AI
          </p>
          <a
            href="/#copy-generator"
            className="inline-block px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Generate Copy
          </a>
        </div>
      </div>

      {user.role === 'ADMIN' && (
        <div className="mt-8 bg-red-50 rounded-lg p-6">
          <h3 className="text-lg font-medium text-red-900 mb-2">Admin Panel</h3>
          <p className="text-red-700 mb-4">Akses pengaturan sistem dan analytics global</p>
          <a
            href="/admin"
            className="inline-block px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Buka Admin Panel
          </a>
        </div>
      )}
    </div>
  );
}
