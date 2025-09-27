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
      className={`backdrop-blur supports-[backdrop-filter]:bg-white/90 bg-white/95 border-b border-gray-100 sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? 'shadow-brand border-primary-orange/10' : ''
      }`}
    >
      <div className="container-brand h-18 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 min-w-0">
          <Link
            href="/"
            onClick={closeMobile}
            className="flex items-center gap-3 p-2 -m-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-orange/50 rounded-brand group"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-primary-orange to-primary-blue rounded-brand p-2.5 flex-shrink-0 group-hover:scale-105 transition-transform duration-300 shadow-brand">
              <Image
                src={headerContent.logo_url}
                alt={headerContent.site_title}
                width={28}
                height={28}
                className="w-full h-full filter brightness-0 invert"
              />
            </div>
            <div className="hidden sm:flex flex-col leading-tight">
              <span className="text-title text-lg truncate group-hover:text-primary-orange transition-colors">
                {headerContent.site_title}
              </span>
              <span className="text-caption text-neutral-gray/80">{headerContent.site_subtitle}</span>
            </div>
          </Link>
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-2">
          {navItems.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="px-4 py-2.5 text-sm font-poppins font-medium text-neutral-dark/80 hover:text-primary-orange hover:bg-primary-orange/8 rounded-brand transition-all duration-200 relative before:absolute before:bottom-0 before:left-1/2 before:w-0 before:h-0.5 before:bg-primary-orange before:transition-all before:duration-300 hover:before:w-full hover:before:left-0"
            >
              {n.label}
            </Link>
          ))}
          {user ? (
            <div className="flex items-center gap-3 ml-4 pl-4 border-l border-gray-200">
              <div className="flex flex-col">
                <span className="text-sm font-medium text-neutral-dark max-w-[160px] truncate" title={user.username || user.email}>
                  {user.username || user.email}
                </span>
                {user.role === 'PREMIUM' && (
                  <span className="text-xs px-2 py-0.5 bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-full w-fit">
                    Premium
                  </span>
                )}
              </div>
              <button
                onClick={logout}
                className="px-3 py-1.5 text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-brand transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400/50"
              >
                Keluar
              </button>
            </div>
          ) : (
            <Link
              href="/auth"
              className="btn-primary ml-4 btn-sm"
            >
              {headerContent.nav_auth}
            </Link>
          )}
        </nav>

        {/* Mobile actions */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => { const el = document.documentElement; const dark = el.classList.toggle('dark'); try { localStorage.setItem('theme', dark ? 'dark' : 'light'); } catch {} }}
            className="p-2.5 rounded-brand border border-gray-200 bg-white hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-orange/50 transition-colors"
            aria-label="Toggle theme"
          >
            <span className="text-lg">🌓</span>
          </button>
          {user ? (
            <button
              onClick={logout}
              className="px-3 py-2 text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-brand focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400/50 transition-colors"
              aria-label="Keluar"
            >
              Keluar
            </button>
          ) : (
            <Link
              href="/auth"
              className="btn-secondary btn-sm"
            >
              {headerContent.nav_auth}
            </Link>
          )}
          <button
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Buka navigasi"
            className="p-2.5 rounded-brand border border-gray-200 bg-white hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-orange/50 transition-all duration-300"
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
          >
            <svg
              className={`w-5 h-5 transition-transform duration-300 ${mobileOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile nav panel */}
      <div
        id="mobile-nav"
        className={`md:hidden origin-top overflow-hidden transition-all duration-500 ease-out ${
          mobileOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <nav className="px-6 py-4 flex flex-col gap-2 border-t border-primary-orange/20 bg-gradient-to-b from-white/98 to-white/95 backdrop-blur-sm">
          <div className="mb-2">
            <button
              onClick={() => { const el = document.documentElement; const dark = el.classList.toggle('dark'); try { localStorage.setItem('theme', dark ? 'dark' : 'light'); } catch {} }}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-brand text-sm font-medium text-neutral-dark/80 hover:bg-primary-orange/8 hover:text-primary-orange focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-orange/50 transition-all duration-200"
            >
              <span className="text-lg">🌓</span>
              Theme
            </button>
          </div>
          {navItems.map((n, index) => (
            <Link
              key={n.href}
              href={n.href}
              onClick={closeMobile}
              className={`block px-4 py-3 rounded-brand text-sm font-poppins font-medium text-neutral-dark/80 hover:text-primary-orange hover:bg-primary-orange/8 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-orange/50 transition-all duration-200 animate-slide-up`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {n.label}
            </Link>
          ))}
          {user && (
            <div className="mt-4 px-4 py-3 text-xs text-neutral-gray/80 border-t border-gray-100 bg-gray-50/50 rounded-brand">
              <span className="text-neutral-gray">Masuk sebagai</span>
              <div className="font-medium text-neutral-dark mt-1">{user.username || user.email}</div>
              {user.role === 'PREMIUM' && (
                <span className="inline-block mt-2 text-xs px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-full">
                  Premium
                </span>
              )}
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
