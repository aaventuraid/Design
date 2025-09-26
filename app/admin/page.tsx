'use client';

import AdminLayout from '@/components/AdminLayout';
import { StatsCard, PageHeader, Card } from '@/components/admin/AdminComponents';
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface DashboardStats {
  totalUsers: number;
  totalImages: number;
  totalContent: number;
  totalApiCalls: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalImages: 0,
    totalContent: 0,
    totalApiCalls: 0
  });
  const [, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState<Array<{
    id: string;
    type: string;
    description: string;
    timestamp: string;
    user?: string;
  }>>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch stats dari berbagai API endpoints
        const [usersRes, imagesRes, contentRes] = await Promise.all([
          fetch('/api/admin/users/stats'),
          fetch('/api/admin/analytics/images'),
          fetch('/api/admin/content?section=all')
        ]);

        const usersData = await usersRes.json().catch(() => ({ count: 0 }));
        const imagesData = await imagesRes.json().catch(() => ({ count: 0 }));
        const contentData = await contentRes.json().catch(() => ({ data: [] }));

        setStats({
          totalUsers: usersData.count || 0,
          totalImages: imagesData.count || 0,
          totalContent: contentData.data?.length || 0,
          totalApiCalls: 1250 // Mock data
        });

        // Mock recent activity
        setRecentActivity([
          { id: '1', type: 'user', description: 'User registered', user: 'john@example.com', timestamp: '2 minutes ago' },
          { id: '2', type: 'image', description: 'Image processed', user: 'jane@example.com', timestamp: '5 minutes ago' },
          { id: '3', type: 'content', description: 'Content updated', user: 'admin', timestamp: '10 minutes ago' },
          { id: '4', type: 'user', description: 'User login', user: 'bob@example.com', timestamp: '15 minutes ago' },
        ]);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const quickActions = [
    { href: '/admin/content', icon: '📝', title: 'Edit Content', description: 'Manage website content' },
    { href: '/admin/media', icon: '🖼️', title: 'Media Library', description: 'Upload and manage files' },
    { href: '/admin/users', icon: '👥', title: 'Manage Users', description: 'View and edit users' },
    { href: '/admin/settings', icon: '⚙️', title: 'System Settings', description: 'Configure system' },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        <PageHeader 
          title="Dashboard"
          description="Overview of your Yuki Yaki Corner admin panel"
        />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Users"
            value={stats.totalUsers}
            change="+12% from last month"
            changeType="positive"
            icon="👥"
            description="Registered users"
          />
          <StatsCard
            title="Images Processed"
            value={stats.totalImages}
            change="+8% from last week"
            changeType="positive"
            icon="🖼️"
            description="Total processed images"
          />
          <StatsCard
            title="Content Items"
            value={stats.totalContent}
            change="No change"
            changeType="neutral"
            icon="📝"
            description="Dynamic content pieces"
          />
          <StatsCard
            title="API Calls"
            value={stats.totalApiCalls}
            change="+15% from yesterday"
            changeType="positive"
            icon="📊"
            description="Total API requests"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Quick Actions */}
          <Card title="Quick Actions" description="Common admin tasks">
            <div className="grid grid-cols-1 gap-4">
              {quickActions.map((action) => (
                <Link
                  key={action.href}
                  href={action.href}
                  className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:border-primary-orange hover:shadow-sm transition-all group"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-primary-orange to-primary-blue rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                    <span className="text-white text-lg">{action.icon}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-dark group-hover:text-primary-orange transition-colors">
                      {action.title}
                    </h3>
                    <p className="text-sm text-neutral-gray">{action.description}</p>
                  </div>
                  <div className="ml-auto">
                    <svg className="w-5 h-5 text-neutral-gray group-hover:text-primary-orange transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          </Card>

          {/* Recent Activity */}
          <Card title="Recent Activity" description="Latest system activities">
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-primary-blue/10 rounded-full flex items-center justify-center">
                    <span className="text-primary-blue text-sm">
                      {activity.type === 'user' ? '👤' : activity.type === 'image' ? '🖼️' : '📝'}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-neutral-dark">{activity.description}</p>
                    <p className="text-xs text-neutral-gray">{activity.user} • {activity.timestamp}</p>
                  </div>
                </div>
              ))}
              {recentActivity.length === 0 && (
                <p className="text-center text-neutral-gray py-8">No recent activity</p>
              )}
            </div>
          </Card>
        </div>

        {/* System Status */}
        <Card title="System Status" description="Current system health">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <div>
                <p className="text-sm font-medium text-neutral-dark">Server Status</p>
                <p className="text-xs text-neutral-gray">Online and healthy</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <div>
                <p className="text-sm font-medium text-neutral-dark">Database</p>
                <p className="text-xs text-neutral-gray">Connected</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
              <div>
                <p className="text-sm font-medium text-neutral-dark">Storage</p>
                <p className="text-xs text-neutral-gray">78% used</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}
