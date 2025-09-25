'use client';
import AdminForm from '@/components/AdminForm';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function AdminPage() {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch('/api/admin/auth', { method: 'DELETE' });
      router.push('/admin/login');
      router.refresh();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <div className="flex justify-between items-center">
          <div></div>
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-gradient-to-r from-primary-orange to-primary-blue rounded-2xl flex items-center justify-center">
              <span className="text-white text-2xl">⚙️</span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
          >
            {loggingOut ? 'Logging out...' : 'Logout'}
          </button>
        </div>
        <h1 className="text-3xl font-bold text-neutral-dark">Panel Pengaturan</h1>
        <p className="text-neutral-gray max-w-2xl mx-auto">
          Kelola konfigurasi AI, pengaturan sistem, dan preferensi aplikasi Yuki Yaki Corner Studio
          Foto F&B
        </p>
      </div>

      <AdminForm />
    </div>
  );
}
