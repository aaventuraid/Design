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
    <footer className="bg-gradient-to-br from-primary-blue/5 to-primary-orange/5 border-t border-primary-orange/20 mt-20 pattern-sakura">
      <div className="container-brand section-padding">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Company Info */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-title text-2xl text-brand-gradient">{footerContent.company_name}</h3>
              <div className="w-16 h-1 bg-gradient-to-r from-primary-orange to-primary-blue rounded-full"></div>
            </div>
            <p className="text-body leading-relaxed">{footerContent.description}</p>
            <div className="space-y-3">
              {footerContent.address && (
                <div className="flex items-center gap-3 text-body">
                  <div className="w-8 h-8 bg-primary-orange/10 rounded-brand flex items-center justify-center">
                    <span className="text-primary-orange">📍</span>
                  </div>
                  {footerContent.address}
                </div>
              )}
              {footerContent.email && (
                <div className="flex items-center gap-3 text-body">
                  <div className="w-8 h-8 bg-primary-blue/10 rounded-brand flex items-center justify-center">
                    <span className="text-primary-blue">✉️</span>
                  </div>
                  <a href={`mailto:${footerContent.email}`} className="hover:text-primary-orange transition-colors">
                    {footerContent.email}
                  </a>
                </div>
              )}
              {footerContent.phone && (
                <div className="flex items-center gap-3 text-body">
                  <div className="w-8 h-8 bg-primary-orange/10 rounded-brand flex items-center justify-center">
                    <span className="text-primary-orange">📞</span>
                  </div>
                  <a href={`tel:${footerContent.phone}`} className="hover:text-primary-blue transition-colors">
                    {footerContent.phone}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Social Links */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h4 className="text-title text-xl">Ikuti Kami</h4>
              <div className="w-12 h-1 bg-gradient-to-r from-primary-blue to-primary-orange rounded-full"></div>
            </div>
            <div className="flex flex-col space-y-4">
              {footerContent.social_instagram && (
                <a 
                  href={footerContent.social_instagram} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-brand hover:bg-white/50 transition-all duration-300 group"
                >
                  <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-orange-500 rounded-brand flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span className="text-white">📷</span>
                  </div>
                  <span className="text-body group-hover:text-primary-orange transition-colors">Instagram</span>
                </a>
              )}
              {footerContent.social_tiktok && (
                <a 
                  href={footerContent.social_tiktok} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-brand hover:bg-white/50 transition-all duration-300 group"
                >
                  <div className="w-10 h-10 bg-gradient-to-r from-black to-red-500 rounded-brand flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span className="text-white">🎵</span>
                  </div>
                  <span className="text-body group-hover:text-primary-blue transition-colors">TikTok</span>
                </a>
              )}
              {footerContent.social_facebook && (
                <a 
                  href={footerContent.social_facebook} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-brand hover:bg-white/50 transition-all duration-300 group"
                >
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-brand flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span className="text-white">👥</span>
                  </div>
                  <span className="text-body group-hover:text-primary-orange transition-colors">Facebook</span>
                </a>
              )}
            </div>
          </div>

          {/* Status */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h4 className="text-title text-xl">Status Sistem</h4>
              <div className="w-12 h-1 bg-gradient-to-r from-primary-orange to-primary-blue rounded-full"></div>
            </div>
            <div className="card p-6 bg-white/70 backdrop-blur-sm border border-primary-orange/20">
              <div className="flex items-center gap-4 mb-4">
                <StatusIndicator />
                <span className="text-body font-medium">Semua sistem normal</span>
              </div>
              <div className="space-y-2 text-caption">
                <div className="flex justify-between">
                  <span>Server Status:</span>
                  <span className="text-green-600 font-medium">Online</span>
                </div>
                <div className="flex justify-between">
                  <span>AI Processing:</span>
                  <span className="text-green-600 font-medium">Ready</span>
                </div>
                <div className="flex justify-between">
                  <span>Response Time:</span>
                  <span className="text-primary-orange font-medium">&lt; 2s</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-primary-blue/20">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-caption text-center md:text-left">
              {footerContent.copyright}
            </p>
            <div className="flex items-center gap-4 text-caption">
              <span>Made with</span>
              <span className="text-primary-orange text-lg">❤️</span>
              <span>for Indonesian F&B</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
