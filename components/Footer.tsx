'use client';

import StatusIndicator from './StatusIndicator';
import { useState, useEffect } from 'react';

export default function Footer() {
  const [footerContent, setFooterContent] = useState({
    company_name: 'Yuki Yaki Corner',
    description: 'Platform AI untuk mengoptimalkan foto makanan Anda untuk berbagai marketplace',
    address: 'Jakarta, Indonesia',
    email: 'hello@yukiyakicorner.com',
    phone: '+62 21 1234 5678',
    copyright: '© 2025 Yuki Yaki Corner. All rights reserved.',
    social_instagram: '',
    social_tiktok: '',
    social_facebook: ''
  });

  useEffect(() => {
    const fetchFooterContent = async () => {
      try {
        const response = await fetch('/api/admin/content?section=footer');
        const data = await response.json();
        
        if (data.success) {
          const content: Record<string, string> = {};
          data.data.forEach((item: any) => {
            content[item.key] = item.value;
          });
          setFooterContent(prev => ({ ...prev, ...content }));
        }
      } catch (error) {
        console.error('Error fetching footer content:', error);
      }
    };

    fetchFooterContent();
  }, []);

  return (
    <footer className="bg-gray-50 border-t border-gray-100 mt-16">
      <div className="container mx-auto px-4 py-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-neutral-dark">{footerContent.company_name}</h3>
            <p className="text-sm text-neutral-gray">{footerContent.description}</p>
            <div className="space-y-2 text-sm text-neutral-gray">
              {footerContent.address && <p>📍 {footerContent.address}</p>}
              {footerContent.email && <p>✉️ {footerContent.email}</p>}
              {footerContent.phone && <p>📞 {footerContent.phone}</p>}
            </div>
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <h4 className="text-md font-medium text-neutral-dark">Ikuti Kami</h4>
            <div className="flex flex-col space-y-2">
              {footerContent.social_instagram && (
                <a 
                  href={footerContent.social_instagram} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-neutral-gray hover:text-primary-orange transition-colors"
                >
                  📷 Instagram
                </a>
              )}
              {footerContent.social_tiktok && (
                <a 
                  href={footerContent.social_tiktok} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-neutral-gray hover:text-primary-orange transition-colors"
                >
                  🎵 TikTok
                </a>
              )}
              {footerContent.social_facebook && (
                <a 
                  href={footerContent.social_facebook} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-neutral-gray hover:text-primary-orange transition-colors"
                >
                  👥 Facebook
                </a>
              )}
            </div>
          </div>

          {/* Status */}
          <div className="space-y-4">
            <h4 className="text-md font-medium text-neutral-dark">Status Sistem</h4>
            <div className="flex items-center gap-4">
              <StatusIndicator />
              <span className="text-sm text-neutral-gray">Semua sistem normal</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-gray-200 text-center">
          <p className="text-sm text-neutral-gray">
            {footerContent.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
}
