'use client';
import AdminForm from '@/components/AdminForm';
import ContentManagement from '@/components/ContentManagement';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function AdminPage() {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);
  const [activeTab, setActiveTab] = useState<'settings' | 'content'>('content');

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
    <div className="max-w-6xl mx-auto space-y-8">
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
          Kelola konten website dan konfigurasi sistem Yuki Yaki Corner Studio Foto F&B
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex justify-center">
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('content')}
            className={`px-6 py-2 rounded-md font-medium transition-colors ${
              activeTab === 'content'
                ? 'bg-white text-primary-orange shadow-sm'
                : 'text-neutral-gray hover:text-neutral-dark'
            }`}
          >
            Content Management
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-6 py-2 rounded-md font-medium transition-colors ${
              activeTab === 'settings'
                ? 'bg-white text-primary-orange shadow-sm'
                : 'text-neutral-gray hover:text-neutral-dark'
            }`}
          >
            System Settings
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-gray-50 rounded-lg p-6">
        {activeTab === 'content' && <ContentManagement />}
        {activeTab === 'settings' && <AdminForm />}
      </div>
    </div>
  );
}
