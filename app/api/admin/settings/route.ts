import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database';
import { z } from 'zod';
import jwt from 'jsonwebtoken';

// Authentication middleware
async function authenticateAdmin(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any;
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });
    
    if (!user || user.role !== 'ADMIN') {
      return null;
    }
    
    return user;
  } catch {
    return null;
  }
}

// Schema for settings validation
const SettingsSchema = z.object({
  section: z.string(),
  settings: z.record(z.any())
});

// GET - Get all settings
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const user = await authenticateAdmin(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get all system settings
  const systemSettings = await prisma.systemSettings.findMany({
      orderBy: { category: 'asc' }
    });

    // Transform to grouped format
    const settingsGroup: Record<string, any> = {
      general: {},
      seo: {},
      email: {},
      security: {},
      api: {},
      backup: {}
    };

    systemSettings.forEach(setting => {
      const section = setting.category || 'general';
      if (settingsGroup[section]) {
        settingsGroup[section][setting.key] = setting.value;
      }
    });

    // Add default values for missing settings
    const defaultSettings = {
      general: {
        siteName: 'Yuki Yaki Corner',
        siteDescription: 'AI-Powered Food Content Platform',
        adminEmail: 'admin@yukiyaki.id',
        timezone: 'Asia/Jakarta',
        language: 'id',
        maintenance: false,
        ...settingsGroup.general
      },
      seo: {
        metaTitle: 'Yuki Yaki Corner - AI Food Content Platform',
        metaDescription: 'Generate engaging social media content for food businesses with AI',
        keywords: 'AI, food content, social media, marketing, optimization',
        googleAnalytics: '',
        googleSearchConsole: '',
        facebookPixel: '',
        ...settingsGroup.seo
      },
      email: {
        smtpHost: '',
        smtpPort: '587',
        smtpUsername: '',
        smtpPassword: '',
        fromEmail: 'noreply@yukiyaki.id',
        fromName: 'Yuki Yaki Corner',
        encryption: 'tls',
        ...settingsGroup.email
      },
      security: {
        passwordMinLength: 8,
        requireSpecialChars: true,
        sessionTimeout: 30,
        maxLoginAttempts: 5,
        enableTwoFactor: false,
        allowRegistration: false,
        ...settingsGroup.security
      },
      api: {
        rateLimit: 100,
        enableCors: true,
        corsOrigins: '*',
        apiKey: settingsGroup.api?.apiKey || '',
        webhookUrl: '',
        ...settingsGroup.api
      },
      backup: {
        autoBackup: false,
        backupFrequency: 'daily',
        backupRetention: 30,
        backupLocation: '/backups',
        lastBackup: null,
        ...settingsGroup.backup
      }
    };

    return NextResponse.json({
      success: true,
      data: defaultSettings
    });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch settings'
    }, { status: 500 });
  }
}

// PUT - Update settings for a specific section
export async function PUT(request: NextRequest) {
  try {
    // Check authentication
    const user = await authenticateAdmin(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { section, settings } = SettingsSchema.parse(body);

    // Update or create each setting
    for (const [key, value] of Object.entries(settings)) {
  await prisma.systemSettings.upsert({
        where: { key },
        update: {
          value: typeof value === 'object' ? value : { value },
          category: section,
          updatedAt: new Date()
        },
        create: {
          key,
          value: typeof value === 'object' ? value : { value },
          category: section,
          description: `${section} setting: ${key}`
        }
      });
    }

    return NextResponse.json({
      success: true,
      message: `${section} settings updated successfully`
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: 'Invalid data format',
        details: error.errors
      }, { status: 400 });
    }

    console.error('Error updating settings:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update settings'
    }, { status: 500 });
  }
}

// POST - Generate new API key
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const user = await authenticateAdmin(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { action } = body;

    if (action === 'generateApiKey') {
      const newApiKey = 'yk_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      
  await prisma.systemSettings.upsert({
        where: { key: 'apiKey' },
        update: {
          value: { value: newApiKey },
          category: 'api',
          updatedAt: new Date()
        },
        create: {
          key: 'apiKey',
          value: { value: newApiKey },
          category: 'api',
          description: 'API key for external access'
        }
      });

      return NextResponse.json({
        success: true,
        data: { apiKey: newApiKey },
        message: 'New API key generated successfully'
      });
    }

    return NextResponse.json({
      success: false,
      error: 'Invalid action'
    }, { status: 400 });
  } catch (error) {
    console.error('Error in settings action:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to perform action'
    }, { status: 500 });
  }
}