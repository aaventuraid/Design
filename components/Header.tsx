'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/components/AuthProvider';
import { useState, useEffect } from 'react';

export default function Header() {
  const { user, logout } = useAuth();
  const [headerContent, setHeaderContent] = useState({
    site_title: 'Yuki Yaki Corner',
    site_subtitle: 'Studio Foto F&B',
    logo_url: '/logo.svg',
    nav_home: 'Studio',
    nav_auth: 'Login',
    nav_dashboard: 'Dashboard',
    nav_admin: 'Admin'
  });

  useEffect(() => {
    // Fetch header content dari API
    const fetchHeaderContent = async () => {
      try {
        const response = await fetch('/api/admin/content?section=header');
        const data = await response.json();
        
        if (data.success) {
          const content: Record<string, string> = {};
          data.data.forEach((item: any) => {
            content[item.key] = item.value;
          });
          setHeaderContent(prev => ({ ...prev, ...content }));
        }
      } catch (error) {
        console.error('Error fetching header content:', error);
      }
    };

    fetchHeaderContent();
  }, []);

  return (
    <header className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="w-10 h-10 bg-gradient-to-r from-primary-orange to-primary-blue rounded-lg p-2">
            <Image
              src={headerContent.logo_url}
              alt={headerContent.site_title}
              width={24}
              height={24}
              className="w-full h-full"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg text-neutral-dark">{headerContent.site_title}</span>
            <span className="text-xs text-neutral-gray">{headerContent.site_subtitle}</span>
          </div>
        </Link>

        <nav className="flex items-center gap-1">
          <Link
            href="/"
            className="px-4 py-2 text-sm font-medium text-neutral-dark hover:text-primary-orange hover:bg-primary-orange/5 rounded-lg transition-all duration-200"
          >
            {headerContent.nav_home}
          </Link>

          {user ? (
            <>
              {user.role === 'ADMIN' && (
                <Link
                  href="/admin"
                  className="px-4 py-2 text-sm font-medium text-neutral-gray hover:text-primary-blue hover:bg-primary-blue/5 rounded-lg transition-all duration-200"
                >
                  {headerContent.nav_admin}
                </Link>
              )}
              <Link
                href="/dashboard"
                className="px-4 py-2 text-sm font-medium text-neutral-gray hover:text-primary-blue hover:bg-primary-blue/5 rounded-lg transition-all duration-200"
              >
                {headerContent.nav_dashboard}
              </Link>
              <div className="flex items-center gap-2 ml-2">
                <span className="text-sm text-neutral-gray">
                  {user.username || user.email}
                  {user.role === 'PREMIUM' && (
                    <span className="ml-1 px-1.5 py-0.5 bg-yellow-100 text-yellow-800 text-xs rounded">
                      Premium
                    </span>
                  )}
                </span>
                <button
                  onClick={logout}
                  className="px-3 py-1.5 text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-all duration-200"
                >
                  Keluar
                </button>
              </div>
            </>
          ) : (
            <Link
              href="/auth"
              className="px-4 py-2 text-sm font-medium text-white bg-primary-blue hover:bg-primary-blue/90 rounded-lg transition-all duration-200"
            >
              {headerContent.nav_auth}
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
