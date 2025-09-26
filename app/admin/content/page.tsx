'use client';

import AdminLayout from '@/components/AdminLayout';
import { PageHeader, Card, Input, Textarea, LoadingSpinner } from '@/components/admin/AdminComponents';
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';

interface SiteContent {
  id: string;
  section: string;
  key: string;
  value: string;
  valueType: 'TEXT' | 'HTML' | 'URL' | 'IMAGE' | 'JSON';
  label?: string;
  description?: string;
  category?: string;
  sortOrder?: number;
}

export default function ContentManagementPage() {
  const [contents, setContents] = useState<SiteContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [selectedSection, setSelectedSection] = useState<string>('header');
  const [uploading, setUploading] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const sections = [
    { value: 'header', label: 'Header', icon: '🔝' },
    { value: 'footer', label: 'Footer', icon: '🔻' },
    { value: 'homepage', label: 'Homepage', icon: '🏠' },
  ];

  // Fetch content berdasarkan section
  const fetchContents = useCallback(async () => {
    setLoading(true);
    try {
      const params = selectedSection !== 'all' ? `?section=${selectedSection}` : '';
      const response = await fetch(`/api/admin/content${params}`);
      const data = await response.json();
      
      if (data.success) {
        setContents(data.data);
      } else {
        toast.error('Failed to fetch content');
      }
    } catch (error) {
      toast.error('Error fetching content');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedSection]);

  // Update content
  const updateContent = async (section: string, key: string, value: string) => {
    const contentId = `${section}.${key}`;
    setSaving(contentId);
    
    try {
      const response = await fetch(`/api/admin/content?section=${section}&key=${key}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value })
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success('Content updated successfully');
        setContents(prev => prev.map(content => 
          content.section === section && content.key === key 
            ? { ...content, value, updatedAt: new Date() as any } 
            : content
        ));
      } else {
        toast.error(data.error || 'Failed to update content');
      }
    } catch (error) {
      toast.error('Error updating content');
      console.error('Error:', error);
    } finally {
      setSaving(null);
    }
  };

  // Upload file
  const uploadFile = async (file: File, section: string, key: string) => {
    const contentId = `${section}.${key}`;
    setUploading(contentId);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', key.includes('logo') ? 'logo' : 'image');
      
      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      
      if (data.success) {
        await updateContent(section, key, data.data.url);
        toast.success('File uploaded successfully');
      } else {
        toast.error(data.error || 'Failed to upload file');
      }
    } catch (error) {
      toast.error('Error uploading file');
      console.error('Error:', error);
    } finally {
      setUploading(null);
    }
  };

  useEffect(() => {
    fetchContents();
  }, [fetchContents]);

  // Filter content berdasarkan search
  const filteredContents = contents.filter(content =>
    content.label?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    content.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
    content.value.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderContentInput = (content: SiteContent) => {
    const isImage = content.valueType === 'IMAGE' || content.key.includes('url') || content.key.includes('image');
    const isLongText = content.key.includes('desc') || content.key.includes('subtitle') || content.key.includes('address');
    const contentId = `${content.section}.${content.key}`;
    const isSaving = saving === contentId;
    const isUploading = uploading === contentId;
    
    if (isImage) {
      return (
        <div className="space-y-4">
          <Input
            value={content.value}
            onChange={(value) => updateContent(content.section, content.key, value)}
            placeholder="Enter image URL..."
            disabled={isSaving}
          />
          
          <div className="flex items-center gap-4">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) uploadFile(file, content.section, content.key);
              }}
              className="hidden"
              id={`file-${contentId}`}
              disabled={isUploading}
            />
            <label
              htmlFor={`file-${contentId}`}
              className={`px-4 py-2 bg-primary-blue text-white rounded-lg cursor-pointer hover:opacity-90 text-sm transition-opacity ${
                isUploading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isUploading ? (
                <span className="flex items-center gap-2">
                  <LoadingSpinner size="sm" />
                  Uploading...
                </span>
              ) : (
                'Upload New Image'
              )}
            </label>
            
            {isSaving && (
              <div className="flex items-center gap-2 text-sm text-neutral-gray">
                <LoadingSpinner size="sm" />
                Saving...
              </div>
            )}
          </div>
          
          {content.value && (
            <div className="mt-4">
              <img
                src={content.value}
                alt="Preview"
                className="w-32 h-32 object-cover rounded-lg border border-gray-200"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          )}
        </div>
      );
    }
    
    if (isLongText) {
      return (
        <div className="space-y-2">
          <Textarea
            value={content.value}
            onChange={(value) => updateContent(content.section, content.key, value)}
            placeholder={content.description || `Enter ${content.label || content.key}...`}
            rows={4}
            disabled={isSaving}
          />
          {isSaving && (
            <div className="flex items-center gap-2 text-sm text-neutral-gray">
              <LoadingSpinner size="sm" />
              Saving...
            </div>
          )}
        </div>
      );
    }
    
    return (
      <div className="space-y-2">
        <Input
          value={content.value}
          onChange={(value) => updateContent(content.section, content.key, value)}
          placeholder={content.description || `Enter ${content.label || content.key}...`}
          disabled={isSaving}
        />
        {isSaving && (
          <div className="flex items-center gap-2 text-sm text-neutral-gray">
            <LoadingSpinner size="sm" />
            Saving...
          </div>
        )}
      </div>
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <PageHeader 
          title="Content Management"
          description="Manage all website content and media"
        />

        {/* Section Selector & Search */}
        <Card>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-neutral-dark mb-2">
                Content Section
              </label>
              <select
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-orange"
              >
                {sections.map(section => (
                  <option key={section.value} value={section.value}>
                    {section.icon} {section.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex-1">
              <label className="block text-sm font-medium text-neutral-dark mb-2">
                Search Content
              </label>
              <Input
                value={searchTerm}
                onChange={setSearchTerm}
                placeholder="Search by label, key, or value..."
              />
            </div>
          </div>
        </Card>

        {/* Content Items */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <div className="space-y-6">
            {filteredContents.length > 0 ? (
              filteredContents
                .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
                .map(content => (
                  <Card
                    key={content.id}
                    title={content.label || content.key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    description={content.description}
                    actions={
                      <div className="flex items-center gap-2">
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded font-mono">
                          {content.valueType}
                        </span>
                        <span className="text-xs text-neutral-gray">
                          {content.section}.{content.key}
                        </span>
                      </div>
                    }
                  >
                    {renderContentInput(content)}
                  </Card>
                ))
            ) : (
              <Card>
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">📝</span>
                  </div>
                  <h3 className="text-lg font-medium text-neutral-dark mb-2">No content found</h3>
                  <p className="text-neutral-gray">
                    {searchTerm 
                      ? `No content matches "${searchTerm}"`
                      : `No content available for ${selectedSection} section`
                    }
                  </p>
                </div>
              </Card>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}