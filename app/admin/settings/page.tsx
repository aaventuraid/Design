'use client';

import AdminLayout from '@/components/AdminLayout';
import { PageHeader, Card, Button, Input, Textarea, LoadingSpinner } from '@/components/admin/AdminComponents';
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { formatDate } from '@/lib/utils';

interface Settings {
  general: {
    siteName: string;
    siteDescription: string;
    adminEmail: string;
    timezone: string;
    language: string;
    maintenance: boolean;
  };
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string;
    googleAnalytics: string;
    googleSearchConsole: string;
    facebookPixel: string;
  };
  email: {
    smtpHost: string;
    smtpPort: string;
    smtpUsername: string;
    smtpPassword: string;
    fromEmail: string;
    fromName: string;
    encryption: string;
  };
  security: {
    passwordMinLength: number;
    requireSpecialChars: boolean;
    sessionTimeout: number;
    maxLoginAttempts: number;
    enableTwoFactor: boolean;
    allowRegistration: boolean;
  };
  api: {
    rateLimit: number;
    enableCors: boolean;
    corsOrigins: string;
    apiKey: string;
    webhookUrl: string;
  };
  backup: {
    autoBackup: boolean;
    backupFrequency: string;
    backupRetention: number;
    backupLocation: string;
    lastBackup?: string;
  };
}

const timezones = [
  { value: 'Asia/Jakarta', label: 'Asia/Jakarta (WIB)' },
  { value: 'Asia/Makassar', label: 'Asia/Makassar (WITA)' },
  { value: 'Asia/Jayapura', label: 'Asia/Jayapura (WIT)' },
  { value: 'UTC', label: 'UTC' },
];

const languages = [
  { value: 'id', label: 'Bahasa Indonesia' },
  { value: 'en', label: 'English' },
];

const encryptionTypes = [
  { value: 'tls', label: 'TLS' },
  { value: 'ssl', label: 'SSL' },
  { value: 'none', label: 'None' },
];

const backupFrequencies = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'disabled', label: 'Disabled' },
];

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('general');

  const tabs = [
    { id: 'general', label: 'General', icon: '⚙️' },
    { id: 'seo', label: 'SEO & Analytics', icon: '📈' },
    { id: 'email', label: 'Email Settings', icon: '📧' },
    { id: 'security', label: 'Security', icon: '🔒' },
    { id: 'api', label: 'API Settings', icon: '🔌' },
    { id: 'backup', label: 'Backup', icon: '💾' },
  ];

  // Fetch settings
  const fetchSettings = async () => {
    setLoading(true);
    try {
      // Simulasi API call - replace dengan actual API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data - replace dengan actual API response
      const mockSettings: Settings = {
        general: {
          siteName: 'My Website',
          siteDescription: 'A powerful business website built with Next.js',
          adminEmail: 'admin@example.com',
          timezone: 'Asia/Jakarta',
          language: 'id',
          maintenance: false,
        },
        seo: {
          metaTitle: 'My Website - Professional Business Solutions',
          metaDescription: 'We provide professional business solutions with cutting-edge technology',
          keywords: 'business, technology, solutions, professional',
          googleAnalytics: 'G-XXXXXXXXXX',
          googleSearchConsole: '',
          facebookPixel: '',
        },
        email: {
          smtpHost: 'smtp.gmail.com',
          smtpPort: '587',
          smtpUsername: '',
          smtpPassword: '',
          fromEmail: 'noreply@example.com',
          fromName: 'My Website',
          encryption: 'tls',
        },
        security: {
          passwordMinLength: 8,
          requireSpecialChars: true,
          sessionTimeout: 30,
          maxLoginAttempts: 5,
          enableTwoFactor: false,
          allowRegistration: true,
        },
        api: {
          rateLimit: 100,
          enableCors: true,
          corsOrigins: '*',
          apiKey: 'sk-xxxxxxxxxxxxxxxxxx',
          webhookUrl: '',
        },
        backup: {
          autoBackup: true,
          backupFrequency: 'daily',
          backupRetention: 30,
          backupLocation: '/backups',
          lastBackup: '2024-01-15T10:30:00Z',
        },
      };
      
      setSettings(mockSettings);
    } catch (error) {
      toast.error('Error fetching settings');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Save settings
  const saveSettings = async (section: keyof Settings) => {
    if (!settings) return;
    
    setSaving(section);
    
    try {
      // Simulasi API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success(`${section.charAt(0).toUpperCase() + section.slice(1)} settings saved successfully`);
    } catch (error) {
      toast.error('Error saving settings');
      console.error('Error:', error);
    } finally {
      setSaving(null);
    }
  };

  // Update settings
  const updateSettings = (section: keyof Settings, key: string, value: any) => {
    if (!settings) return;
    
    setSettings(prev => ({
      ...prev!,
      [section]: {
        ...prev![section],
        [key]: value
      }
    }));
  };

  // Generate new API key
  const generateApiKey = () => {
    const newKey = 'sk-' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    updateSettings('api', 'apiKey', newKey);
    toast.success('New API key generated');
  };

  // Manual backup
  const createBackup = async () => {
    try {
      setSaving('backup');
      // Simulasi backup process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      updateSettings('backup', 'lastBackup', new Date().toISOString());
      toast.success('Backup created successfully');
    } catch (error) {
      toast.error('Error creating backup');
      console.error('Error:', error);
    } finally {
      setSaving(null);
    }
  };

  // formatDate imported from utils

  useEffect(() => {
    fetchSettings();
  }, []);

  if (loading || !settings) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[500px]">
          <div className="text-center">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-neutral-gray">Loading settings...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-dark mb-2">
                  Site Name
                </label>
                <Input
                  value={settings.general.siteName}
                  onChange={(value) => updateSettings('general', 'siteName', value)}
                  placeholder="Enter site name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-dark mb-2">
                  Admin Email
                </label>
                <Input
                  value={settings.general.adminEmail}
                  onChange={(value) => updateSettings('general', 'adminEmail', value)}
                  placeholder="Enter admin email"
                  type="email"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-neutral-dark mb-2">
                Site Description
              </label>
              <Textarea
                value={settings.general.siteDescription}
                onChange={(value) => updateSettings('general', 'siteDescription', value)}
                placeholder="Enter site description"
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-dark mb-2">
                  Timezone
                </label>
                <select
                  value={settings.general.timezone}
                  onChange={(e) => updateSettings('general', 'timezone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-orange"
                >
                  {timezones.map(tz => (
                    <option key={tz.value} value={tz.value}>{tz.label}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-dark mb-2">
                  Language
                </label>
                <select
                  value={settings.general.language}
                  onChange={(e) => updateSettings('general', 'language', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-orange"
                >
                  {languages.map(lang => (
                    <option key={lang.value} value={lang.value}>{lang.label}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={settings.general.maintenance}
                  onChange={(e) => updateSettings('general', 'maintenance', e.target.checked)}
                  className="rounded border-gray-300 focus:ring-2 focus:ring-primary-orange"
                />
                <span className="text-sm font-medium text-neutral-dark">Enable Maintenance Mode</span>
              </label>
              <p className="text-sm text-neutral-gray mt-1">
                When enabled, only administrators can access the website
              </p>
            </div>
          </div>
        );

      case 'seo':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-neutral-dark mb-2">
                Meta Title
              </label>
              <Input
                value={settings.seo.metaTitle}
                onChange={(value) => updateSettings('seo', 'metaTitle', value)}
                placeholder="Enter meta title"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-neutral-dark mb-2">
                Meta Description
              </label>
              <Textarea
                value={settings.seo.metaDescription}
                onChange={(value) => updateSettings('seo', 'metaDescription', value)}
                placeholder="Enter meta description"
                rows={3}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-neutral-dark mb-2">
                Keywords
              </label>
              <Input
                value={settings.seo.keywords}
                onChange={(value) => updateSettings('seo', 'keywords', value)}
                placeholder="Enter keywords separated by commas"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-dark mb-2">
                  Google Analytics ID
                </label>
                <Input
                  value={settings.seo.googleAnalytics}
                  onChange={(value) => updateSettings('seo', 'googleAnalytics', value)}
                  placeholder="G-XXXXXXXXXX"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-dark mb-2">
                  Google Search Console
                </label>
                <Input
                  value={settings.seo.googleSearchConsole}
                  onChange={(value) => updateSettings('seo', 'googleSearchConsole', value)}
                  placeholder="Enter verification code"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-neutral-dark mb-2">
                Facebook Pixel ID
              </label>
              <Input
                value={settings.seo.facebookPixel}
                onChange={(value) => updateSettings('seo', 'facebookPixel', value)}
                placeholder="Enter Facebook Pixel ID"
              />
            </div>
          </div>
        );

      case 'email':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-dark mb-2">
                  SMTP Host
                </label>
                <Input
                  value={settings.email.smtpHost}
                  onChange={(value) => updateSettings('email', 'smtpHost', value)}
                  placeholder="smtp.gmail.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-dark mb-2">
                  SMTP Port
                </label>
                <Input
                  value={settings.email.smtpPort}
                  onChange={(value) => updateSettings('email', 'smtpPort', value)}
                  placeholder="587"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-dark mb-2">
                  SMTP Username
                </label>
                <Input
                  value={settings.email.smtpUsername}
                  onChange={(value) => updateSettings('email', 'smtpUsername', value)}
                  placeholder="Enter SMTP username"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-dark mb-2">
                  SMTP Password
                </label>
                <Input
                  value={settings.email.smtpPassword}
                  onChange={(value) => updateSettings('email', 'smtpPassword', value)}
                  placeholder="Enter SMTP password"
                  type="password"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-dark mb-2">
                  From Email
                </label>
                <Input
                  value={settings.email.fromEmail}
                  onChange={(value) => updateSettings('email', 'fromEmail', value)}
                  placeholder="noreply@example.com"
                  type="email"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-dark mb-2">
                  From Name
                </label>
                <Input
                  value={settings.email.fromName}
                  onChange={(value) => updateSettings('email', 'fromName', value)}
                  placeholder="Your Website Name"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-neutral-dark mb-2">
                Encryption
              </label>
              <select
                value={settings.email.encryption}
                onChange={(e) => updateSettings('email', 'encryption', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-orange"
              >
                {encryptionTypes.map(enc => (
                  <option key={enc.value} value={enc.value}>{enc.label}</option>
                ))}
              </select>
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-dark mb-2">
                  Password Min Length
                </label>
                <Input
                  value={settings.security.passwordMinLength.toString()}
                  onChange={(value) => updateSettings('security', 'passwordMinLength', parseInt(value) || 8)}
                  placeholder="8"
                  type="number"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-dark mb-2">
                  Session Timeout (minutes)
                </label>
                <Input
                  value={settings.security.sessionTimeout.toString()}
                  onChange={(value) => updateSettings('security', 'sessionTimeout', parseInt(value) || 30)}
                  placeholder="30"
                  type="number"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-neutral-dark mb-2">
                Max Login Attempts
              </label>
              <Input
                value={settings.security.maxLoginAttempts.toString()}
                onChange={(value) => updateSettings('security', 'maxLoginAttempts', parseInt(value) || 5)}
                placeholder="5"
                type="number"
              />
            </div>
            
            <div className="space-y-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={settings.security.requireSpecialChars}
                  onChange={(e) => updateSettings('security', 'requireSpecialChars', e.target.checked)}
                  className="rounded border-gray-300 focus:ring-2 focus:ring-primary-orange"
                />
                <span className="text-sm font-medium text-neutral-dark">Require Special Characters in Password</span>
              </label>
              
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={settings.security.enableTwoFactor}
                  onChange={(e) => updateSettings('security', 'enableTwoFactor', e.target.checked)}
                  className="rounded border-gray-300 focus:ring-2 focus:ring-primary-orange"
                />
                <span className="text-sm font-medium text-neutral-dark">Enable Two-Factor Authentication</span>
              </label>
              
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={settings.security.allowRegistration}
                  onChange={(e) => updateSettings('security', 'allowRegistration', e.target.checked)}
                  className="rounded border-gray-300 focus:ring-2 focus:ring-primary-orange"
                />
                <span className="text-sm font-medium text-neutral-dark">Allow User Registration</span>
              </label>
            </div>
          </div>
        );

      case 'api':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-dark mb-2">
                  Rate Limit (requests/hour)
                </label>
                <Input
                  value={settings.api.rateLimit.toString()}
                  onChange={(value) => updateSettings('api', 'rateLimit', parseInt(value) || 100)}
                  placeholder="100"
                  type="number"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-dark mb-2">
                  CORS Origins
                </label>
                <Input
                  value={settings.api.corsOrigins}
                  onChange={(value) => updateSettings('api', 'corsOrigins', value)}
                  placeholder="* or specific origins"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-neutral-dark mb-2">
                API Key
              </label>
              <div className="flex gap-2">
                <Input
                  value={settings.api.apiKey}
                  onChange={(value) => updateSettings('api', 'apiKey', value)}
                  placeholder="Enter API key"
                  type="password"
                  className="flex-1"
                />
                <Button
                  variant="secondary"
                  onClick={generateApiKey}
                >
                  🔄 Generate
                </Button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-neutral-dark mb-2">
                Webhook URL
              </label>
              <Input
                value={settings.api.webhookUrl}
                onChange={(value) => updateSettings('api', 'webhookUrl', value)}
                placeholder="https://example.com/webhook"
              />
            </div>
            
            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={settings.api.enableCors}
                  onChange={(e) => updateSettings('api', 'enableCors', e.target.checked)}
                  className="rounded border-gray-300 focus:ring-2 focus:ring-primary-orange"
                />
                <span className="text-sm font-medium text-neutral-dark">Enable CORS</span>
              </label>
            </div>
          </div>
        );

      case 'backup':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-dark mb-2">
                  Backup Frequency
                </label>
                <select
                  value={settings.backup.backupFrequency}
                  onChange={(e) => updateSettings('backup', 'backupFrequency', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-orange"
                >
                  {backupFrequencies.map(freq => (
                    <option key={freq.value} value={freq.value}>{freq.label}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-dark mb-2">
                  Retention Days
                </label>
                <Input
                  value={settings.backup.backupRetention.toString()}
                  onChange={(value) => updateSettings('backup', 'backupRetention', parseInt(value) || 30)}
                  placeholder="30"
                  type="number"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-neutral-dark mb-2">
                Backup Location
              </label>
              <Input
                value={settings.backup.backupLocation}
                onChange={(value) => updateSettings('backup', 'backupLocation', value)}
                placeholder="/backups"
              />
            </div>
            
            <div>
              <label className="flex items-center gap-2 mb-4">
                <input
                  type="checkbox"
                  checked={settings.backup.autoBackup}
                  onChange={(e) => updateSettings('backup', 'autoBackup', e.target.checked)}
                  className="rounded border-gray-300 focus:ring-2 focus:ring-primary-orange"
                />
                <span className="text-sm font-medium text-neutral-dark">Enable Automatic Backups</span>
              </label>
              
              {settings.backup.lastBackup && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-neutral-dark">
                    <strong>Last Backup:</strong> {formatDate(settings.backup.lastBackup)}
                  </p>
                </div>
              )}
              
              <div className="flex gap-3 mt-4">
                <Button
                  onClick={createBackup}
                  disabled={saving === 'backup'}
                >
                  {saving === 'backup' ? (
                    <span className="flex items-center gap-2">
                      <LoadingSpinner size="sm" />
                      Creating Backup...
                    </span>
                  ) : (
                    '💾 Create Backup Now'
                  )}
                </Button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <PageHeader 
          title="System Settings"
          description="Configure your website settings and preferences"
        />

        {/* Tabs */}
        <Card>
          <div className="flex flex-wrap gap-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary-blue text-white'
                    : 'bg-gray-100 text-neutral-gray hover:bg-gray-200'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </Card>

        {/* Tab Content */}
        <Card>
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-neutral-dark">
              {tabs.find(tab => tab.id === activeTab)?.icon} {tabs.find(tab => tab.id === activeTab)?.label}
            </h3>
          </div>
          
          {renderTabContent()}
          
          <div className="flex justify-end mt-6 pt-6 border-t border-gray-200">
            <Button
              onClick={() => saveSettings(activeTab as keyof Settings)}
              disabled={saving === activeTab}
            >
              {saving === activeTab ? (
                <span className="flex items-center gap-2">
                  <LoadingSpinner size="sm" />
                  Saving...
                </span>
              ) : (
                '💾 Save Settings'
              )}
            </Button>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}