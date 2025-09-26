import { NextRequest } from 'next/server';
import { DatabaseService } from '@/lib/database';
import { getSettings, saveSettings } from '@/lib/settings';
import { extractAuthToken } from '@/lib/utils';
import jwt from 'jsonwebtoken';

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

async function verifyAdminSession(
  req: NextRequest,
): Promise<{ valid: boolean; userId?: string; error?: string }> {
  try {
    // Get token from cookie or Authorization header
    let token = req.cookies.get('admin-session')?.value;
    if (!token) {
      token = extractAuthToken(req) || undefined;
    }

    if (!token) {
      return { valid: false, error: 'No authentication token provided' };
    }

    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any;

    if (decoded.sessionType !== 'admin') {
      return { valid: false, error: 'Invalid session type' };
    }

    // Verify session still exists and user is admin
    const user = await DatabaseService.validateSession(token);
    if (!user || user.role !== 'ADMIN') {
      return { valid: false, error: 'Invalid or expired session' };
    }

    return { valid: true, userId: user.id };
  } catch {
    return { valid: false, error: 'Invalid authentication token' };
  }
}

export async function POST(req: NextRequest) {
  try {
    // Verify admin session instead of password in header
    const sessionCheck = await verifyAdminSession(req);
    if (!sessionCheck.valid) {
      await DatabaseService.logAudit({
        action: 'ADMIN_UNAUTHORIZED_ACCESS',
        resource: 'admin_management',
        details: { reason: sessionCheck.error },
        ipAddress: req.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown',
        userAgent: req.headers.get('user-agent') || 'unknown',
      });

      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json().catch(() => null);
    if (!body) {
      return Response.json({ error: 'Invalid JSON' }, { status: 400 });
    }

    // Validate input
    if (!body.type) {
      return Response.json({ error: 'Operation type is required' }, { status: 400 });
    }

    // Handle different types of updates
    const { type, currentPassword, ...data } = body;

    switch (type) {
      case 'admin_credentials':
        // Verify current password for credential changes
        if (!currentPassword) {
          return Response.json(
            { error: 'Current password is required for credential changes' },
            { status: 400 },
          );
        }

        // Additional verification for credential changes
        const adminInfo = await DatabaseService.getAdminInfo();
        if (!adminInfo) {
          return Response.json({ error: 'Admin user not found' }, { status: 404 });
        }

        const isValidCurrentPassword = await DatabaseService.authenticateUser(
          adminInfo.email,
          currentPassword,
        );
        if (!isValidCurrentPassword) {
          return Response.json({ error: 'Current password is incorrect' }, { status: 401 });
        }

        // Update admin email/password
        const result = await DatabaseService.updateAdminCredentials({
          email: data.adminEmail,
          password: data.adminPassword,
          currentPassword: currentPassword,
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
