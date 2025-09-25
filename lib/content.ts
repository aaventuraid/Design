import { database } from './database';

export interface SiteContent {
  id: string;
  section: string;
  key: string;
  value: string;
  valueType: 'TEXT' | 'HTML' | 'URL' | 'IMAGE' | 'JSON';
  label?: string;
  description?: string;
  category?: string;
  sortOrder?: number;
  createdAt: Date;
  updatedAt: Date;
}

// Cache untuk content agar tidak query database terus menerus
let contentCache: Map<string, SiteContent> = new Map();
let cacheExpiry: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 menit

export class ContentManager {
  private static async refreshCache() {
    try {
      const contents = await database.prisma.siteContent.findMany();
      contentCache.clear();
      
      contents.forEach(content => {
        const cacheKey = `${content.section}.${content.key}`;
        contentCache.set(cacheKey, content);
      });
      
      cacheExpiry = Date.now() + CACHE_DURATION;
    } catch (error) {
      console.error('Error refreshing content cache:', error);
    }
  }

  private static async ensureCacheValid() {
    if (Date.now() > cacheExpiry || contentCache.size === 0) {
      await this.refreshCache();
    }
  }

  static async get(section: string, key: string, defaultValue: string = ''): Promise<string> {
    await this.ensureCacheValid();
    
    const cacheKey = `${section}.${key}`;
    const content = contentCache.get(cacheKey);
    
    return content?.value || defaultValue;
  }

  static async getBySection(section: string): Promise<Record<string, string>> {
    await this.ensureCacheValid();
    
    const result: Record<string, string> = {};
    
    contentCache.forEach((content, cacheKey) => {
      if (cacheKey.startsWith(`${section}.`)) {
        const key = cacheKey.replace(`${section}.`, '');
        result[key] = content.value;
      }
    });
    
    return result;
  }

  static async getAll(): Promise<SiteContent[]> {
    await this.ensureCacheValid();
    return Array.from(contentCache.values());
  }

  static async set(section: string, key: string, value: string, options?: {
    valueType?: 'TEXT' | 'HTML' | 'URL' | 'IMAGE' | 'JSON';
    label?: string;
    description?: string;
    category?: string;
    sortOrder?: number;
  }): Promise<void> {
    try {
      await database.prisma.siteContent.upsert({
        where: {
          section_key: { section, key }
        },
        create: {
          section,
          key,
          value,
          valueType: options?.valueType || 'TEXT',
          label: options?.label,
          description: options?.description,
          category: options?.category,
          sortOrder: options?.sortOrder,
        },
        update: {
          value,
          ...(options?.valueType && { valueType: options.valueType }),
          ...(options?.label && { label: options.label }),
          ...(options?.description && { description: options.description }),
          ...(options?.category && { category: options.category }),
          ...(options?.sortOrder !== undefined && { sortOrder: options.sortOrder }),
        }
      });

      // Update cache
      const cacheKey = `${section}.${key}`;
      const content = contentCache.get(cacheKey);
      if (content) {
        content.value = value;
        if (options?.valueType) content.valueType = options.valueType;
        if (options?.label) content.label = options.label;
        if (options?.description) content.description = options.description;
        if (options?.category) content.category = options.category;
        if (options?.sortOrder !== undefined) content.sortOrder = options.sortOrder;
        content.updatedAt = new Date();
      }
    } catch (error) {
      console.error('Error setting content:', error);
      throw error;
    }
  }

  static invalidateCache(): void {
    contentCache.clear();
    cacheExpiry = 0;
  }
}

// Default content untuk aplikasi
export const defaultContent = {
  header: {
    site_title: 'Yuki Yaki Corner',
    site_subtitle: 'Studio Foto F&B',
    logo_url: '/logo.svg',
    nav_home: 'Beranda',
    nav_auth: 'Login',
    nav_dashboard: 'Dashboard',
    nav_admin: 'Admin'
  },
  footer: {
    company_name: 'Yuki Yaki Corner',
    description: 'Platform AI untuk mengoptimalkan foto makanan Anda untuk berbagai marketplace',
    address: 'Jakarta, Indonesia',
    email: 'hello@yukiyakicorner.com',
    phone: '+62 21 1234 5678',
    copyright: '© 2025 Yuki Yaki Corner. All rights reserved.',
    social_instagram: 'https://instagram.com/yukiyakicorner',
    social_tiktok: 'https://tiktok.com/@yukiyakicorner',
    social_facebook: 'https://facebook.com/yukiyakicorner'
  },
  homepage: {
    hero_title: 'Studio Foto F&B Profesional',
    hero_subtitle: 'Transformasi foto makanan Yuki Yaki Corner menjadi background transparan dengan kualitas profesional. Dioptimalkan khusus untuk platform marketplace terpopuler.',
    hero_cta: 'Mulai Sekarang',
    hero_image: '/hero-image.jpg',
    
    features_title: 'Fitur Unggulan',
    feature1_title: 'Hapus Background',
    feature1_desc: 'Otomatis menghilangkan background dengan presisi tinggi',
    feature2_title: 'Preset Marketplace',
    feature2_desc: 'Penyesuaian khusus untuk setiap platform marketplace',
    feature3_title: 'Generator Copy AI',
    feature3_desc: 'Buat judul dan deskripsi menarik secara otomatis',
    
    stats_title: 'Dipercaya Ribuan UMKM',
    stat1_number: '10,000+',
    stat1_label: 'Foto Diproses',
    stat2_number: '5,000+',
    stat2_label: 'Penjual Aktif',
    stat3_number: '98%',
    stat3_label: 'Tingkat Kepuasan'
  }
};

// Fungsi untuk inisialisasi default content
export async function initializeDefaultContent(): Promise<void> {
  for (const [section, contents] of Object.entries(defaultContent)) {
    for (const [key, value] of Object.entries(contents)) {
      try {
        // Cek apakah content sudah ada
        const existing = await database.prisma.siteContent.findUnique({
          where: {
            section_key: { section, key }
          }
        });

        // Jika belum ada, buat yang baru
        if (!existing) {
          await ContentManager.set(
            section, 
            key, 
            value, 
            {
              valueType: key.includes('url') || key.includes('image') ? 'URL' : 'TEXT',
              category: section,
              label: key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
            }
          );
        }
      } catch (error) {
        console.error(`Error initializing ${section}.${key}:`, error);
      }
    }
  }
}