import { PrismaClient } from '@prisma/client';
import type { User, Session } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

declare global {
  var __prisma: PrismaClient | undefined;
}

// Singleton Prisma instance untuk mencegah multiple connections
export const prisma = globalThis.__prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalThis.__prisma = prisma;
}

// Database service untuk operasi umum
export class DatabaseService {
  // User management
  static async createUser(data: {
    email: string;
    username?: string;
    password: string;
    role?: 'ADMIN' | 'USER' | 'PREMIUM';
    preferences?: any;
  }): Promise<User> {
    const passwordHash = await bcrypt.hash(data.password, 12);

    return prisma.user.create({
      data: {
        email: data.email,
        username: data.username,
        passwordHash,
        role: data.role || 'USER',
        preferences: data.preferences || {},
      },
    });
  }

  static async authenticateUser(email: string, password: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.isActive) {
      return null;
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return null;
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    return user;
  }

  static async createSession(userId: string): Promise<Session> {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET || 'fallback-secret', {
      expiresIn: '7d',
    });

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    return prisma.session.create({
      data: {
        token,
        userId,
        expiresAt,
      },
    });
  }

  static async validateSession(token: string): Promise<User | null> {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any;

      const session = await prisma.session.findUnique({
        where: { token },
        include: { user: true },
      });

      if (!session || session.expiresAt < new Date() || !session.user.isActive) {
        return null;
      }

      return session.user;
    } catch {
      return null;
    }
  }

  static async deleteSession(token: string): Promise<void> {
    await prisma.session
      .delete({
        where: { token },
      })
      .catch(() => {}); // Ignore if not found
  }

  // Usage tracking dan rate limiting
  static async trackUsage(data: {
    userId?: string;
    action: 'IMAGE_PROCESS' | 'COPY_GENERATE' | 'API_CALL';
    ipAddress?: string;
  }): Promise<void> {
    const now = new Date();
    const periodStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours());
    const periodEnd = new Date(periodStart.getTime() + 60 * 60 * 1000); // 1 hour

    // Check existing usage record for this period
    const existing = await prisma.usageRecord.findFirst({
      where: {
        userId: data.userId || null,
        action: data.action,
        periodStart,
        periodEnd,
      },
    });

    if (existing) {
      await prisma.usageRecord.update({
        where: { id: existing.id },
        data: { count: existing.count + 1 },
      });
    } else {
      await prisma.usageRecord.create({
        data: {
          userId: data.userId || null,
          action: data.action,
          periodStart,
          periodEnd,
          count: 1,
        },
      });
    }
  }

  static async checkRateLimit(
    userId: string | null,
    action: 'IMAGE_PROCESS' | 'COPY_GENERATE' | 'API_CALL',
  ): Promise<{ allowed: boolean; remaining: number; resetTime: Date }> {
    const now = new Date();
    const periodStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours());
    const periodEnd = new Date(periodStart.getTime() + 60 * 60 * 1000);

    // Default rate limits
    const limits = {
      IMAGE_PROCESS: 100, // 100 per hour
      COPY_GENERATE: 50, // 50 per hour
      API_CALL: 1000, // 1000 per hour
    };

    // Get user's custom rate limit if exists
    let userLimit = limits[action];
    if (userId) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      // Premium users get 10x limits
      if (user?.role === 'PREMIUM') {
        userLimit *= 10;
      }
    }

    const usage = await prisma.usageRecord.findFirst({
      where: {
        userId: userId || null,
        action,
        periodStart,
        periodEnd,
      },
    });

    const currentCount = usage?.count || 0;
    const remaining = Math.max(0, userLimit - currentCount);
    const allowed = currentCount < userLimit;

    return {
      allowed,
      remaining,
      resetTime: periodEnd,
    };
  }

  // Image processing tracking
  static async trackImageProcessing(data: {
    userId?: string;
    originalName: string;
    fileSize: number;
    dimensions: { width: number; height: number };
    preset: string;
    outputFormat: string;
    outputSize: number;
    processingTimeMs: number;
    userAgent?: string;
    ipAddress?: string;
  }): Promise<void> {
    await prisma.imageProcessing.create({
      data: {
        userId: data.userId || null,
        originalName: data.originalName,
        fileSize: data.fileSize,
        dimensions: data.dimensions,
        preset: data.preset,
        outputFormat: data.outputFormat,
        outputSize: data.outputSize,
        processingTimeMs: data.processingTimeMs,
        userAgent: data.userAgent,
        ipAddress: data.ipAddress,
      },
    });
  }

  // Settings management (database-backed)
  static async getSettings(): Promise<Record<string, any>> {
    const settings = await prisma.systemSettings.findMany();

    const result: Record<string, any> = {};
    for (const setting of settings) {
      result[setting.key] = setting.value;
    }

    return result;
  }

  static async setSetting(key: string, value: any, description?: string): Promise<void> {
    await prisma.systemSettings.upsert({
      where: { key },
      update: {
        value,
        description,
        updatedAt: new Date(),
      },
      create: {
        key,
        value,
        description,
      },
    });
  }

  // User preferences
  static async getUserPreferences(userId: string): Promise<Record<string, any>> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    return (user?.preferences as Record<string, any>) || {};
  }

  static async setUserPreferences(userId: string, preferences: Record<string, any>): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: { preferences },
    });
  }

  // Audit logging
  static async logAudit(data: {
    userId?: string;
    action: string;
    resource: string;
    details?: any;
    ipAddress?: string;
    userAgent?: string;
  }): Promise<void> {
    await prisma.auditLog.create({
      data: {
        userId: data.userId || null,
        action: data.action,
        resource: data.resource,
        details: data.details || {},
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
      },
    });
  }

  // Analytics
  static async getAnalytics(userId?: string) {
    const where = userId ? { userId } : {};

    const [totalProcessings, todayProcessings, avgProcessingTime, formatStats, presetStats] =
      await Promise.all([
        prisma.imageProcessing.count({ where }),
        prisma.imageProcessing.count({
          where: {
            ...where,
            createdAt: {
              gte: new Date(new Date().setHours(0, 0, 0, 0)),
            },
          },
        }),
        prisma.imageProcessing.aggregate({
          where,
          _avg: {
            processingTimeMs: true,
          },
        }),
        prisma.imageProcessing.groupBy({
          by: ['outputFormat'],
          where,
          _count: true,
        }),
        prisma.imageProcessing.groupBy({
          by: ['preset'],
          where,
          _count: true,
        }),
      ]);

    return {
      totalProcessings,
      todayProcessings,
      avgProcessingTimeMs: avgProcessingTime._avg.processingTimeMs || 0,
      formatStats,
      presetStats,
    };
  }
}
