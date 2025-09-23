'use client';
import AdminForm from '@/components/AdminForm';

export default function AdminPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-gradient-to-r from-primary-orange to-primary-blue rounded-2xl flex items-center justify-center">
            <span className="text-white text-2xl">⚙️</span>
          </div>
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
