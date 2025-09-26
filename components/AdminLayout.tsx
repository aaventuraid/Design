'use client';

import { ReactNode, useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

interface AdminLayoutProps {
  children: ReactNode;
}

interface NavItem {
  href: string;
  icon: string;
  label: string;
  badge?: string;
}

const navigation: NavItem[] = [
  { href: '/admin', icon: '📊', label: 'Dashboard' },
  { href: '/admin/content', icon: '📝', label: 'Content Management' },
  { href: '/admin/media', icon: '🖼️', label: 'Media Library' },
  { href: '/admin/users', icon: '👥', label: 'Users' },
  { href: '/admin/analytics', icon: '📈', label: 'Analytics' },
  { href: '/admin/settings', icon: '⚙️', label: 'Settings' },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Check admin authentication
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/admin/auth');
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        } else {
          router.push('/admin/login');
        }
      } catch {
        router.push('/admin/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth', { method: 'DELETE' });
      toast.success('Logged out successfully');
      router.push('/admin/login');
    } catch {
      toast.error('Error logging out');
    }
  };

  const getBreadcrumbs = () => {
    const segments = pathname.split('/').filter(Boolean);
    return segments.map((segment, index) => {
      const href = '/' + segments.slice(0, index + 1).join('/');
      const label = segment.charAt(0).toUpperCase() + segment.slice(1);
      return { href, label };
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-orange"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75"></div>
        </div>
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 px-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-primary-orange to-primary-blue rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-bold">YY</span>
              </div>
              <span className="text-lg font-bold text-neutral-dark">Admin Panel</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary-orange text-white shadow-sm'
                      : 'text-neutral-gray hover:bg-gray-100 hover:text-neutral-dark'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="ml-auto bg-primary-blue text-white text-xs px-2 py-1 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User info */}
          <div className="px-4 py-4 border-t border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-primary-blue to-primary-orange rounded-full flex items-center justify-center">
                <span className="text-white font-medium">
                  {user?.username?.charAt(0)?.toUpperCase() || 'A'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-neutral-dark truncate">
                  {user?.username || 'Admin'}
                </p>
                <p className="text-xs text-neutral-gray truncate">
                  {user?.email}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors text-left"
            >
              🚪 Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:ml-64">
        {/* Top header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-4 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md text-neutral-gray hover:text-neutral-dark hover:bg-gray-100"
              >
                <span className="sr-only">Open sidebar</span>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              {/* Breadcrumbs */}
              <nav className="flex" aria-label="Breadcrumb">
                <ol className="flex items-center space-x-2">
                  {getBreadcrumbs().map((crumb, index) => (
                    <li key={crumb.href} className="flex items-center">
                      {index > 0 && (
                        <svg className="w-4 h-4 text-neutral-gray mx-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                      <Link
                        href={crumb.href}
                        className={`text-sm font-medium ${
                          index === getBreadcrumbs().length - 1
                            ? 'text-neutral-dark'
                            : 'text-neutral-gray hover:text-neutral-dark'
                        }`}
                      >
                        {crumb.label}
                      </Link>
                    </li>
                  ))}
                </ol>
              </nav>
            </div>

            {/* Quick actions */}
            <div className="flex items-center gap-3">
              <Link
                href="/"
                target="_blank"
                className="px-3 py-2 text-sm text-neutral-gray hover:text-neutral-dark rounded-lg hover:bg-gray-100 transition-colors"
              >
                🌐 View Site
              </Link>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}