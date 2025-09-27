'use client';

import AdminLayout from '@/components/AdminLayout';
import { PageHeader, Card, LoadingSpinner } from '@/components/admin/AdminComponents';
import { useState, useEffect } from 'react';
import { showToast } from '@/lib/toast';
import { formatNumber, formatPercentage, formatDuration, formatTimeAgo } from '@/lib/utils';

interface AnalyticsData {
  overview: {
    totalVisitors: number;
    pageViews: number;
    bounceRate: number;
    avgSessionDuration: number;
    visitorGrowth: number;
    pageViewGrowth: number;
    bounceRateChange: number;
    sessionGrowth: number;
  };
  topPages: Array<{
    path: string;
    title: string;
    views: number;
    uniqueViews: number;
    change: number;
  }>;
  trafficSources: Array<{
    source: string;
    visitors: number;
    percentage: number;
    change: number;
  }>;
  deviceStats: Array<{
    device: string;
    visitors: number;
    percentage: number;
  }>;
  recentActivity: Array<{
    id: string;
    type: 'visit' | 'signup' | 'contact';
    description: string;
    timestamp: string;
    location?: string;
  }>;
}

const timeRanges = [
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: '90d', label: 'Last 90 days' },
  { value: '1y', label: 'Last year' },
];

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');

  // Fetch analytics data
  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      // Simulasi API call - replace dengan actual API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock data - replace dengan actual analytics API
      const mockData: AnalyticsData = {
        overview: {
          totalVisitors: 12547,
          pageViews: 28934,
          bounceRate: 42.5,
          avgSessionDuration: 245,
          visitorGrowth: 12.5,
          pageViewGrowth: 8.3,
          bounceRateChange: -5.2,
          sessionGrowth: 15.7
        },
        topPages: [
          { path: '/', title: 'Homepage', views: 8932, uniqueViews: 6421, change: 12.3 },
          { path: '/about', title: 'About Us', views: 3451, uniqueViews: 2876, change: -2.1 },
          { path: '/services', title: 'Services', views: 2876, uniqueViews: 2234, change: 18.7 },
          { path: '/contact', title: 'Contact', views: 1967, uniqueViews: 1654, change: 5.4 },
          { path: '/blog', title: 'Blog', views: 1432, uniqueViews: 1123, change: 25.6 }
        ],
        trafficSources: [
          { source: 'Organic Search', visitors: 6273, percentage: 50.0, change: 8.5 },
          { source: 'Direct', visitors: 3136, percentage: 25.0, change: 15.2 },
          { source: 'Social Media', visitors: 1883, percentage: 15.0, change: -3.7 },
          { source: 'Referral', visitors: 940, percentage: 7.5, change: 22.1 },
          { source: 'Email', visitors: 315, percentage: 2.5, change: 45.3 }
        ],
        deviceStats: [
          { device: 'Desktop', visitors: 7528, percentage: 60.0 },
          { device: 'Mobile', visitors: 4389, percentage: 35.0 },
          { device: 'Tablet', visitors: 630, percentage: 5.0 }
        ],
        recentActivity: [
          {
            id: '1',
            type: 'visit',
            description: 'New visitor from organic search',
            timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
            location: 'Jakarta, Indonesia'
          },
          {
            id: '2',
            type: 'signup',
            description: 'User signed up for newsletter',
            timestamp: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
            location: 'Surabaya, Indonesia'
          },
          {
            id: '3',
            type: 'contact',
            description: 'Contact form submission',
            timestamp: new Date(Date.now() - 23 * 60 * 1000).toISOString(),
            location: 'Bandung, Indonesia'
          },
          {
            id: '4',
            type: 'visit',
            description: 'Returning visitor via direct traffic',
            timestamp: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
            location: 'Medan, Indonesia'
          },
          {
            id: '5',
            type: 'visit',
            description: 'New visitor from social media',
            timestamp: new Date(Date.now() - 47 * 60 * 1000).toISOString(),
            location: 'Yogyakarta, Indonesia'
          }
        ]
      };
      
      setData(mockData);
    } catch (error) {
      showToast('Error fetching analytics data', 'error');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Utility functions imported from utils

  // Get activity icon
  const getActivityIcon = (type: string): string => {
    switch (type) {
      case 'visit': return '👁️';
      case 'signup': return '✉️';
      case 'contact': return '📞';
      default: return '📊';
    }
  };

  // Get change color
  const getChangeColor = (change: number): string => {
    if (change > 0) return 'text-green-600';
    if (change < 0) return 'text-red-600';
    return 'text-neutral-gray';
  };

  // Get change icon
  const getChangeIcon = (change: number): string => {
    if (change > 0) return '↗️';
    if (change < 0) return '↘️';
    return '➡️';
  };

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  if (loading || !data) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[500px]">
          <div className="text-center">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-neutral-gray">Loading analytics data...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <PageHeader 
          title="Analytics Dashboard"
          description="Website traffic and user behavior insights"
          action={
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-orange"
            >
              {timeRanges.map(range => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>
          }
        />

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-gray">Total Visitors</p>
                <p className="text-2xl font-bold text-neutral-dark">
                  {formatNumber(data.overview.totalVisitors)}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-xl">👥</span>
              </div>
            </div>
            <div className={`mt-2 flex items-center gap-1 text-sm ${getChangeColor(data.overview.visitorGrowth)}`}>
              <span>{getChangeIcon(data.overview.visitorGrowth)}</span>
              <span>{formatPercentage(Math.abs(data.overview.visitorGrowth))} vs last period</span>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-gray">Page Views</p>
                <p className="text-2xl font-bold text-neutral-dark">
                  {formatNumber(data.overview.pageViews)}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-xl">📄</span>
              </div>
            </div>
            <div className={`mt-2 flex items-center gap-1 text-sm ${getChangeColor(data.overview.pageViewGrowth)}`}>
              <span>{getChangeIcon(data.overview.pageViewGrowth)}</span>
              <span>{formatPercentage(Math.abs(data.overview.pageViewGrowth))} vs last period</span>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-gray">Bounce Rate</p>
                <p className="text-2xl font-bold text-neutral-dark">
                  {formatPercentage(data.overview.bounceRate)}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <span className="text-xl">⚡</span>
              </div>
            </div>
            <div className={`mt-2 flex items-center gap-1 text-sm ${getChangeColor(data.overview.bounceRateChange)}`}>
              <span>{getChangeIcon(data.overview.bounceRateChange)}</span>
              <span>{formatPercentage(Math.abs(data.overview.bounceRateChange))} vs last period</span>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-gray">Avg. Session</p>
                <p className="text-2xl font-bold text-neutral-dark">
                  {formatDuration(data.overview.avgSessionDuration)}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-xl">⏱️</span>
              </div>
            </div>
            <div className={`mt-2 flex items-center gap-1 text-sm ${getChangeColor(data.overview.sessionGrowth)}`}>
              <span>{getChangeIcon(data.overview.sessionGrowth)}</span>
              <span>{formatPercentage(Math.abs(data.overview.sessionGrowth))} vs last period</span>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Pages */}
          <Card title="Top Pages" description="Most viewed pages on your website">
            <div className="space-y-4">
              {data.topPages.map((page, index) => (
                <div key={page.path} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary-blue text-white rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-neutral-dark">{page.title}</p>
                      <p className="text-sm text-neutral-gray">{page.path}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatNumber(page.views)} views</p>
                    <div className={`text-sm flex items-center gap-1 ${getChangeColor(page.change)}`}>
                      <span>{getChangeIcon(page.change)}</span>
                      <span>{formatPercentage(Math.abs(page.change))}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Traffic Sources */}
          <Card title="Traffic Sources" description="Where your visitors are coming from">
            <div className="space-y-4">
              {data.trafficSources.map((source) => (
                <div key={source.source} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-primary-blue rounded-full"></div>
                    <span className="font-medium">{source.source}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatNumber(source.visitors)}</p>
                    <div className="flex items-center gap-2 text-sm text-neutral-gray">
                      <span>{formatPercentage(source.percentage)}</span>
                      <span className={getChangeColor(source.change)}>
                        {getChangeIcon(source.change)} {formatPercentage(Math.abs(source.change))}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Device Stats */}
          <Card title="Device Breakdown" description="Visitor device preferences">
            <div className="space-y-4">
              {data.deviceStats.map((device) => (
                <div key={device.device} className="flex items-center justify-between">
                  <span className="font-medium">{device.device}</span>
                  <div className="text-right">
                    <p className="font-medium">{formatNumber(device.visitors)}</p>
                    <p className="text-sm text-neutral-gray">{formatPercentage(device.percentage)}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Recent Activity */}
          <Card title="Real-time Activity" description="Latest visitor interactions" className="lg:col-span-2">
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {data.recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm">{getActivityIcon(activity.type)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-neutral-dark">{activity.description}</p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-neutral-gray">
                      <span>{formatTimeAgo(activity.timestamp)}</span>
                      {activity.location && (
                        <>
                          <span>•</span>
                          <span>📍 {activity.location}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}