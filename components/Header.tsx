'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/components/AuthProvider';
import { useState, useEffect } from 'react';

interface NavItem {
  href: string;
  label: string;
  roles?: string[]; // empty or undefined => public
  adminOnly?: boolean;
}

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
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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

  // Setup scroll listener for subtle shadow/blur effect
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navItems: NavItem[] = [
    { href: '/', label: headerContent.nav_home },
    ...(user
      ? [
          ...(user.role === 'ADMIN'
            ? [{ href: '/admin', label: headerContent.nav_admin, roles: ['ADMIN'] }]
            : []),
          { href: '/dashboard', label: headerContent.nav_dashboard },
        ]
      : []),
  ];

  const closeMobile = () => setMobileOpen(false);

  return (
    <header
      className={`backdrop-blur supports-[backdrop-filter]:bg-white/80 bg-white/95 border-b border-gray-100 sticky top-0 z-50 transition-shadow ${
        scrolled ? 'shadow-sm' : ''
      }`}
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href="/"
            onClick={closeMobile}
            className="flex items-center gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-orange/50 rounded-lg"
          >
            <div className="w-10 h-10 bg-gradient-to-r from-primary-orange to-primary-blue rounded-lg p-2 flex-shrink-0">
              <Image
                src={headerContent.logo_url}
                alt={headerContent.site_title}
                width={24}
                height={24}
                className="w-full h-full"
              />
            </div>
            <div className="hidden sm:flex flex-col leading-tight">
              <span className="font-bold text-base text-neutral-dark truncate">
                {headerContent.site_title}
              </span>
              <span className="text-[11px] text-neutral-gray">{headerContent.site_subtitle}</span>
            </div>
          </Link>
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="px-4 py-2 text-sm font-medium text-neutral-dark/80 hover:text-primary-orange hover:bg-primary-orange/5 rounded-lg transition-colors"
            >
              {n.label}
            </Link>
          ))}
          {user ? (
            <div className="flex items-center gap-2 ml-2">
              <span className="text-sm text-neutral-gray max-w-[160px] truncate" title={user.username || user.email}>
                {user.username || user.email}
                {user.role === 'PREMIUM' && (
                  <span className="ml-1 px-1.5 py-0.5 bg-yellow-100 text-yellow-800 text-xs rounded">
                    Premium
                  </span>
                )}
              </span>
              <button
                onClick={logout}
                className="px-3 py-1.5 text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
              >
                Keluar
              </button>
            </div>
          ) : (
            <Link
              href="/auth"
              className="ml-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-primary-blue to-primary-orange hover:opacity-90 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-orange/50"
            >
              {headerContent.nav_auth}
            </Link>
          )}
        </nav>

        {/* Mobile actions */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => { const el = document.documentElement; const dark = el.classList.toggle('dark'); try { localStorage.setItem('theme', dark ? 'dark' : 'light'); } catch {} }}
            className="p-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-orange/50"
            aria-label="Toggle theme"
          >🌓</button>
          {user ? (
            <button
              onClick={logout}
              className="px-3 py-1.5 text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400/50"
              aria-label="Keluar"
            >
              Keluar
            </button>
          ) : (
            <Link
              href="/auth"
              className="px-3 py-1.5 text-xs font-medium text-white bg-primary-blue rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-orange/50"
            >
              {headerContent.nav_auth}
            </Link>
          )}
          <button
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Buka navigasi"
            className="p-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-orange/50"
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
          >
            <svg
              className={`w-5 h-5 transition-transform ${mobileOpen ? 'rotate-90' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile nav panel */}
      <div
        id="mobile-nav"
        className={`md:hidden origin-top overflow-hidden transition-all duration-300 ${
          mobileOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <nav className="px-4 pb-4 flex flex-col gap-1 border-t border-gray-100 bg-white/95 dark:bg-neutral-900/95">
          <button
            onClick={() => { const el = document.documentElement; const dark = el.classList.toggle('dark'); try { localStorage.setItem('theme', dark ? 'dark' : 'light'); } catch {} }}
            className="block px-4 py-2 mb-1 rounded-lg text-sm font-medium text-neutral-dark/80 dark:text-gray-200 hover:bg-primary-orange/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-orange/50"
          >🌓 Theme</button>
          {navItems.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              onClick={closeMobile}
              className="block px-4 py-2 rounded-lg text-sm font-medium text-neutral-dark/80 hover:text-primary-orange hover:bg-primary-orange/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-orange/50"
            >
              {n.label}
            </Link>
          ))}
          {user && (
            <div className="mt-2 px-4 py-2 text-xs text-neutral-gray/80 border-t border-gray-100">
              Masuk sebagai{' '}
              <span className="font-medium text-neutral-dark">{user.username || user.email}</span>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
