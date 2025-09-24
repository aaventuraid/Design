import { NextRequest } from 'next/server';
import { DatabaseService } from '@/lib/database';
import { getSettings, saveSettings } from '@/lib/settings';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  try {
    // Get current admin info
    const adminInfo = await DatabaseService.getAdminInfo();

    // Get system settings
    const dbSettings = await DatabaseService.getSettings();
    const fileSettings = await getSettings();

    // Merge settings with precedence: DB > File > Environment (database-first)
    const settings = {
      ...fileSettings,
      ...dbSettings,
      // Database-first approach: only fallback to env if database is empty
      geminiApiKey:
        dbSettings.geminiApiKey || fileSettings.geminiApiKey || process.env.GEMINI_API_KEY,
    };

    return Response.json({
      admin: adminInfo,
      settings: {
        // Core settings
        geminiApiKey: settings.geminiApiKey ? '••••••••' : '', // Masked for security
        hasGeminiKey: Boolean(settings.geminiApiKey),
        defaultAIProvider: settings.defaultAIProvider || 'local',
        imageBgProvider: settings.imageBgProvider || 'internal',

        // System settings from database
        maintenanceMode: dbSettings.maintenanceMode || false,
        maxFileSize: dbSettings.maxFileSize || 10485760, // 10MB
        analyticsEnabled: dbSettings.analyticsEnabled !== false, // Default true

        // Admin settings
        adminEmail: adminInfo?.email || process.env.ADMIN_EMAIL || null,
      },
    });
  } catch (error) {
    console.error('Admin settings GET error:', error);
    return Response.json({ error: 'Failed to load admin settings' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    // Verify admin password - database first, env as fallback for initial setup
    const providedPassword = req.headers.get('x-admin-password') || '';

    if (!providedPassword) {
      return Response.json({ error: 'Admin password required' }, { status: 401 });
    }

    // Try database first - this is the primary method
    const adminEmail = process.env.ADMIN_EMAIL;
    if (!adminEmail) {
      return Response.json({ error: 'Admin email not configured' }, { status: 500 });
    }

    let adminUser = await DatabaseService.authenticateUser(adminEmail, providedPassword);
    let isValidPassword = !!adminUser && adminUser.role === 'ADMIN';

    // Fallback to environment variable only if no database admin exists (initial setup)
    if (!isValidPassword) {
      const dbAdminExists = await DatabaseService.getAdminInfo();
      if (!dbAdminExists) {
        const envAdminPass = process.env.ADMIN_PASSWORD || 'admin';
        isValidPassword = providedPassword === envAdminPass;
      }
    }

    if (!isValidPassword) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json().catch(() => null);
    if (!body) {
      return Response.json({ error: 'Invalid JSON' }, { status: 400 });
    }

    // Handle different types of updates
    const { type, ...data } = body;

    switch (type) {
      case 'admin_credentials':
        // Update admin email/password
        const result = await DatabaseService.updateAdminCredentials({
          email: data.adminEmail,
          password: data.adminPassword,
          currentPassword: providedPassword, // Use current admin password
        });

        if (!result.success) {
          return Response.json({ error: result.error }, { status: 400 });
        }

        // Log the change
        await DatabaseService.logAudit({
          action: 'ADMIN_CREDENTIALS_UPDATE',
          resource: 'admin_settings',
          details: { emailChanged: !!data.adminEmail, passwordChanged: !!data.adminPassword },
          ipAddress: req.headers.get('x-forwarded-for') || 'unknown',
          userAgent: req.headers.get('user-agent') || 'unknown',
        });

        return Response.json({ success: true, message: 'Admin credentials updated successfully' });

      case 'system_settings':
        // Update system settings in database
        const updates = [
          { key: 'geminiApiKey', value: data.geminiApiKey, description: 'Gemini AI API Key' },
          {
            key: 'defaultAIProvider',
            value: data.defaultAIProvider,
            description: 'Default AI Provider',
          },
          {
            key: 'imageBgProvider',
            value: data.imageBgProvider,
            description: 'Image Background Provider',
          },
          { key: 'maintenanceMode', value: data.maintenanceMode, description: 'Maintenance Mode' },
          { key: 'maxFileSize', value: data.maxFileSize, description: 'Maximum File Size (bytes)' },
          {
            key: 'analyticsEnabled',
            value: data.analyticsEnabled,
            description: 'Analytics Enabled',
          },
        ];

        for (const update of updates) {
          if (update.value !== undefined) {
            await DatabaseService.setSetting(update.key, update.value, update.description);
          }
        }

        // Also update file-based settings for backward compatibility
        const fileUpdates: any = {};
        if (data.defaultAIProvider) fileUpdates.defaultAIProvider = data.defaultAIProvider;
        if (data.imageBgProvider) fileUpdates.imageBgProvider = data.imageBgProvider;
        if (data.geminiApiKey) fileUpdates.geminiApiKey = data.geminiApiKey;

        if (Object.keys(fileUpdates).length > 0) {
          await saveSettings(fileUpdates);
        }

        // Log the change
        await DatabaseService.logAudit({
          action: 'SYSTEM_SETTINGS_UPDATE',
          resource: 'admin_settings',
          details: { updatedKeys: Object.keys(data) },
          ipAddress: req.headers.get('x-forwarded-for') || 'unknown',
          userAgent: req.headers.get('user-agent') || 'unknown',
        });

        return Response.json({ success: true, message: 'System settings updated successfully' });

      default:
        // Legacy support - update file-based settings
        const updated = await saveSettings(data);

        // Also save to database for persistence
        for (const [key, value] of Object.entries(data)) {
          await DatabaseService.setSetting(key, value, `Legacy setting: ${key}`);
        }

        return Response.json({ settings: updated });
    }
  } catch (error: any) {
    console.error('Admin settings POST error:', error);
    return Response.json({ error: error?.message || 'Failed to save settings' }, { status: 500 });
  }
}
