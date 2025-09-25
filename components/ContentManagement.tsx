'use client';

import { useState, useEffect } from 'react';
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

export default function ContentManagement() {
  const [contents, setContents] = useState<SiteContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [selectedSection, setSelectedSection] = useState<string>('all');
  const [uploading, setUploading] = useState<string | null>(null);

  // Ambil semua content
  const fetchContents = async () => {
    try {
      const params = selectedSection !== 'all' ? `?section=${selectedSection}` : '';
      const response = await fetch(`/api/admin/content${params}`);
      const data = await response.json();
      
      if (data.success) {
        setContents(data.data);
      } else {
        toast.error('Gagal mengambil data content');
      }
    } catch (error) {
      toast.error('Error mengambil data');
    } finally {
      setLoading(false);
    }
  };

  // Update content
  const updateContent = async (section: string, key: string, value: string) => {
    setSaving(`${section}.${key}`);
    try {
      const response = await fetch(`/api/admin/content?section=${section}&key=${key}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value })
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success('Content berhasil diupdate');
        setContents(prev => prev.map(content => 
          content.section === section && content.key === key 
            ? { ...content, value } 
            : content
        ));
      } else {
        toast.error(data.error || 'Gagal update content');
      }
    } catch (error) {
      toast.error('Error updating content');
    } finally {
      setSaving(null);
    }
  };

  // Upload file untuk image content
  const uploadFile = async (file: File, section: string, key: string) => {
    setUploading(`${section}.${key}`);
    
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
        toast.success('File berhasil diupload');
      } else {
        toast.error(data.error || 'Gagal upload file');
      }
    } catch (error) {
      toast.error('Error uploading file');
    } finally {
      setUploading(null);
    }
  };

  useEffect(() => {
    fetchContents();
  }, [selectedSection]);

  // Group content berdasarkan section
  const groupedContents = contents.reduce((acc, content) => {
    if (!acc[content.section]) {
      acc[content.section] = [];
    }
    acc[content.section].push(content);
    return acc;
  }, {} as Record<string, SiteContent[]>);

  const sections = ['all', ...Object.keys(groupedContents)];

  const renderContentInput = (content: SiteContent) => {
    const isImage = content.valueType === 'IMAGE' || content.key.includes('url') || content.key.includes('image');
    const isLongText = content.key.includes('desc') || content.key.includes('subtitle') || content.key.includes('address');
    const contentId = `${content.section}.${content.key}`;
    
    if (isImage) {
      return (
        <div className="space-y-2">
          <div className="flex items-center gap-4">
            <input
              type="text"
              value={content.value}
              onChange={(e) => updateContent(content.section, content.key, e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-orange"
              placeholder="URL gambar..."
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) uploadFile(file, content.section, content.key);
              }}
              className="hidden"
              id={`file-${contentId}`}
            />
            <label
              htmlFor={`file-${contentId}`}
              className="px-4 py-2 bg-primary-blue text-white rounded-md cursor-pointer hover:opacity-90 text-sm"
            >
              {uploading === contentId ? 'Uploading...' : 'Upload'}
            </label>
          </div>
          {content.value && (
            <div className="mt-2">
              <img
                src={content.value}
                alt="Preview"
                className="w-20 h-20 object-cover rounded-md border"
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
        <textarea
          value={content.value}
          onChange={(e) => updateContent(content.section, content.key, e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-orange"
          rows={3}
          placeholder={content.description || `Enter ${content.label || content.key}...`}
        />
      );
    }
    
    return (
      <input
        type="text"
        value={content.value}
        onChange={(e) => updateContent(content.section, content.key, e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-orange"
        placeholder={content.description || `Enter ${content.label || content.key}...`}
      />
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-orange"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-neutral-dark">Content Management</h1>
        <select
          value={selectedSection}
          onChange={(e) => setSelectedSection(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-orange"
        >
          {sections.map(section => (
            <option key={section} value={section}>
              {section === 'all' ? 'All Sections' : section.charAt(0).toUpperCase() + section.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {Object.entries(groupedContents).map(([section, sectionContents]) => (
        <div key={section} className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-neutral-dark mb-4 capitalize flex items-center gap-2">
            <span className="w-3 h-3 bg-primary-orange rounded-full"></span>
            {section} Section
          </h2>
          
          <div className="grid gap-4">
            {sectionContents
              .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
              .map(content => (
                <div key={content.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <label className="block text-sm font-medium text-neutral-dark mb-1">
                        {content.label || content.key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </label>
                      {content.description && (
                        <p className="text-sm text-neutral-gray mb-2">{content.description}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {content.valueType}
                      </span>
                      {saving === `${content.section}.${content.key}` && (
                        <div className="w-4 h-4 border-2 border-primary-orange border-t-transparent rounded-full animate-spin"></div>
                      )}
                    </div>
                  </div>
                  
                  {renderContentInput(content)}
                </div>
              ))}
          </div>
        </div>
      ))}

      {Object.keys(groupedContents).length === 0 && (
        <div className="text-center py-12">
          <p className="text-neutral-gray">Tidak ada content yang ditemukan</p>
        </div>
      )}
    </div>
  );
}