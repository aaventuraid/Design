'use client';
import AdminForm from '@/components/AdminForm';

export default function AdminPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Admin Panel</h1>
      <AdminForm />
    </div>
  );
}
