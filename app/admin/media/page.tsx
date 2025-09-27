'use client';

import AdminLayout from '@/components/AdminLayout';
import { PageHeader, Card, Button, LoadingSpinner } from '@/components/admin/AdminComponents';
import { useState, useEffect } from 'react';
import { showToast } from '@/lib/toast';
import { formatDate, formatFileSize } from '@/lib/utils';

interface MediaFile {
  id: string;
  filename: string;
  url: string;
  type: string;
  size: number;
  uploadedAt: string;
  category?: string;
}

export default function MediaManagementPage() {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const categories = [
    { value: 'all', label: 'All Files', icon: '📁' },
    { value: 'images', label: 'Images', icon: '🖼️' },
    { value: 'logos', label: 'Logos', icon: '🎨' },
    { value: 'documents', label: 'Documents', icon: '📄' },
  ];

  // Fetch media files
  const fetchFiles = async () => {
    setLoading(true);
    try {
      // Simulasi API call - replace dengan actual API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data - replace dengan actual API response
      const mockFiles: MediaFile[] = [
        {
          id: '1',
          filename: 'logo.svg',
          url: '/logo.svg',
          type: 'image/svg+xml',
          size: 15420,
          uploadedAt: '2024-01-15T10:30:00Z',
          category: 'logos'
        },
        {
          id: '2',
          filename: 'hero-image.jpg',
          url: '/hero-image.jpg',
          type: 'image/jpeg',
          size: 245760,
          uploadedAt: '2024-01-14T15:20:00Z',
          category: 'images'
        },
        {
          id: '3',
          filename: 'about-us.pdf',
          url: '/about-us.pdf',
          type: 'application/pdf',
          size: 512000,
          uploadedAt: '2024-01-13T09:45:00Z',
          category: 'documents'
        }
      ];
      
      setFiles(mockFiles);
    } catch (error) {
      showToast('Error fetching media files', 'error');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Upload files
  const uploadFiles = async (fileList: FileList) => {
    setUploading(true);
    
    try {
      const uploadPromises = Array.from(fileList).map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('category', getFileCategory(file.type));
        
        const response = await fetch('/api/admin/upload', {
          method: 'POST',
          body: formData
        });
        
        return response.json();
      });
      
      const results = await Promise.all(uploadPromises);
      const successCount = results.filter(r => r.success).length;
      
      if (successCount > 0) {
        showToast(`${successCount} file(s) uploaded successfully`, 'success');
        fetchFiles(); // Refresh file list
      }
      
      const failCount = results.length - successCount;
      if (failCount > 0) {
        showToast(`${failCount} file(s) failed to upload`, 'error');
      }
      
    } catch (error) {
      showToast('Error uploading files', 'error');
      console.error('Error:', error);
    } finally {
      setUploading(false);
    }
  };

  // Delete files
  const deleteFiles = async (fileIds: string[]) => {
    if (!confirm(`Are you sure you want to delete ${fileIds.length} file(s)?`)) {
      return;
    }
    
    try {
      // Simulasi API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setFiles(prev => prev.filter(file => !fileIds.includes(file.id)));
      setSelectedFiles([]);
      showToast(`${fileIds.length} file(s) deleted successfully`, 'success');
    } catch (error) {
      showToast('Error deleting files', 'error');
      console.error('Error:', error);
    }
  };

  // Get file category based on type
  const getFileCategory = (type: string): string => {
    if (type.startsWith('image/')) return 'images';
    if (type === 'application/pdf') return 'documents';
    return 'other';
  };

  // formatFileSize and formatDate imported from utils

  // Toggle file selection
  const toggleFileSelection = (fileId: string) => {
    setSelectedFiles(prev =>
      prev.includes(fileId)
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    );
  };

  // Filter files
  const filteredFiles = files.filter(file => {
    if (selectedCategory === 'all') return true;
    return file.category === selectedCategory;
  });

  useEffect(() => {
    fetchFiles();
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <PageHeader 
          title="Media Management"
          description="Upload and manage media files"
          action={
            <div className="flex items-center gap-3">
              <input
                type="file"
                multiple
                accept="image/*,.pdf,.doc,.docx"
                onChange={(e) => {
                  if (e.target.files?.length) {
                    uploadFiles(e.target.files);
                  }
                }}
                className="hidden"
                id="file-upload"
                disabled={uploading}
              />
              <label
                htmlFor="file-upload"
                className={`px-4 py-2 bg-primary-blue text-white rounded-lg cursor-pointer hover:opacity-90 transition-opacity ${
                  uploading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {uploading ? (
                  <span className="flex items-center gap-2">
                    <LoadingSpinner size="sm" />
                    Uploading...
                  </span>
                ) : (
                  '📁 Upload Files'
                )}
              </label>
            </div>
          }
        />

        {/* Toolbar */}
        <Card>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-dark mb-1">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-orange"
                >
                  {categories.map(category => (
                    <option key={category.value} value={category.value}>
                      {category.icon} {category.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-dark mb-1">
                  View
                </label>
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`px-3 py-1 rounded text-sm transition-colors ${
                      viewMode === 'grid' 
                        ? 'bg-white text-neutral-dark shadow-sm' 
                        : 'text-neutral-gray hover:text-neutral-dark'
                    }`}
                  >
                    🔲 Grid
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`px-3 py-1 rounded text-sm transition-colors ${
                      viewMode === 'list' 
                        ? 'bg-white text-neutral-dark shadow-sm' 
                        : 'text-neutral-gray hover:text-neutral-dark'
                    }`}
                  >
                    📋 List
                  </button>
                </div>
              </div>
            </div>
            
            {selectedFiles.length > 0 && (
              <div className="flex items-center gap-3">
                <span className="text-sm text-neutral-gray">
                  {selectedFiles.length} selected
                </span>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => deleteFiles(selectedFiles)}
                >
                  🗑️ Delete Selected
                </Button>
              </div>
            )}
          </div>
        </Card>

        {/* File List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <div className="space-y-4">
            {filteredFiles.length > 0 ? (
              viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filteredFiles.map(file => (
                    <Card key={file.id} className="overflow-hidden">
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={selectedFiles.includes(file.id)}
                          onChange={() => toggleFileSelection(file.id)}
                          className="absolute top-2 left-2 z-10"
                        />
                        
                        {file.type.startsWith('image/') ? (
                          <img
                            src={file.url}
                            alt={file.filename}
                            className="w-full h-32 object-cover"
                          />
                        ) : (
                          <div className="w-full h-32 bg-gray-100 flex items-center justify-center">
                            <span className="text-4xl">
                              {file.type.includes('pdf') ? '📄' : '📁'}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <div className="p-3 space-y-2">
                        <h4 className="font-medium text-sm truncate" title={file.filename}>
                          {file.filename}
                        </h4>
                        <div className="flex justify-between text-xs text-neutral-gray">
                          <span>{formatFileSize(file.size)}</span>
                          <span>{formatDate(file.uploadedAt)}</span>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => navigator.clipboard.writeText(file.url)}
                            className="flex-1 px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-xs transition-colors"
                          >
                            📋 Copy URL
                          </button>
                          <button
                            onClick={() => deleteFiles([file.id])}
                            className="px-2 py-1 bg-red-100 hover:bg-red-200 text-red-600 rounded text-xs transition-colors"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-2">
                            <input
                              type="checkbox"
                              checked={selectedFiles.length === filteredFiles.length}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedFiles(filteredFiles.map(f => f.id));
                                } else {
                                  setSelectedFiles([]);
                                }
                              }}
                            />
                          </th>
                          <th className="text-left py-3 px-2 font-medium">File</th>
                          <th className="text-left py-3 px-2 font-medium">Type</th>
                          <th className="text-left py-3 px-2 font-medium">Size</th>
                          <th className="text-left py-3 px-2 font-medium">Uploaded</th>
                          <th className="text-left py-3 px-2 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredFiles.map(file => (
                          <tr key={file.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-3 px-2">
                              <input
                                type="checkbox"
                                checked={selectedFiles.includes(file.id)}
                                onChange={() => toggleFileSelection(file.id)}
                              />
                            </td>
                            <td className="py-3 px-2">
                              <div className="flex items-center gap-3">
                                {file.type.startsWith('image/') ? (
                                  <img
                                    src={file.url}
                                    alt={file.filename}
                                    className="w-10 h-10 object-cover rounded"
                                  />
                                ) : (
                                  <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
                                    <span className="text-lg">
                                      {file.type.includes('pdf') ? '📄' : '📁'}
                                    </span>
                                  </div>
                                )}
                                <span className="font-medium">{file.filename}</span>
                              </div>
                            </td>
                            <td className="py-3 px-2 text-sm text-neutral-gray">
                              {file.type}
                            </td>
                            <td className="py-3 px-2 text-sm">
                              {formatFileSize(file.size)}
                            </td>
                            <td className="py-3 px-2 text-sm text-neutral-gray">
                              {formatDate(file.uploadedAt)}
                            </td>
                            <td className="py-3 px-2">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => navigator.clipboard.writeText(file.url)}
                                  className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-xs transition-colors"
                                  title="Copy URL"
                                >
                                  📋
                                </button>
                                <button
                                  onClick={() => deleteFiles([file.id])}
                                  className="px-2 py-1 bg-red-100 hover:bg-red-200 text-red-600 rounded text-xs transition-colors"
                                  title="Delete"
                                >
                                  🗑️
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              )
            ) : (
              <Card>
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">📁</span>
                  </div>
                  <h3 className="text-lg font-medium text-neutral-dark mb-2">No files found</h3>
                  <p className="text-neutral-gray mb-4">
                    {selectedCategory === 'all' 
                      ? 'No media files have been uploaded yet'
                      : `No files in ${categories.find(c => c.value === selectedCategory)?.label} category`
                    }
                  </p>
                  <label
                    htmlFor="file-upload"
                    className="inline-block px-4 py-2 bg-primary-blue text-white rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                  >
                    📁 Upload Your First File
                  </label>
                </div>
              </Card>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}