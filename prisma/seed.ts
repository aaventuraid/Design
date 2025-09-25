import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create default admin user only if no users exist
  const userCount = await prisma.user.count();

  if (userCount === 0) {
    console.log('🔐 Creating default admin user...');

    // Use default credentials that must be changed after first login
    const defaultEmail = 'admin@localhost';
    const defaultPassword = 'admin123';
    const passwordHash = await bcrypt.hash(defaultPassword, 12);

    const admin = await prisma.user.create({
      data: {
        email: defaultEmail,
        username: 'admin',
        passwordHash,
        role: 'ADMIN',
        isActive: true,
        preferences: {
          theme: 'light',
          language: 'id',
          notifications: true,
        },
      },
    });

    console.log(`✅ Default admin user created`);
    console.log(`⚠️  IMPORTANT: Change default credentials after first login!`);
  } else {
    console.log(`ℹ️  Database already has ${userCount} user(s), skipping admin creation`);
  }

  // Create some default system settings (admin akan set API key nanti)
  const defaultSettings = [
    {
      key: 'geminiApiKey',
      value: '', // Will be set by admin through admin panel
      description: 'Gemini API key for AI features - Set this in Admin Panel',
      category: 'ai',
    },
    {
      key: 'defaultAIProvider',
      value: 'gemini',
      description: 'Default AI provider (gemini | local)',
      category: 'ai',
    },
    {
      key: 'maintenanceMode',
      value: false,
      description: 'Enable maintenance mode',
      category: 'system',
    },
    {
      key: 'maxFileSize',
      value: 10485760, // 10MB
      description: 'Maximum file size for uploads in bytes',
      category: 'uploads',
    },
  ];

  for (const setting of defaultSettings) {
    await prisma.systemSettings.upsert({
      where: { key: setting.key },
      update: {},
      create: setting,
    });
  }

  console.log('✅ System settings initialized');

  // Create sample premium user - only in development
  if (process.env.NODE_ENV === 'development' || process.env.CREATE_DEMO_USER === 'true') {
    const premiumEmail = 'premium@example.com';
    const existingPremium = await prisma.user.findUnique({
      where: { email: premiumEmail },
    });

    if (!existingPremium) {
      const passwordHash = await bcrypt.hash(process.env.DEMO_USER_PASSWORD || 'premium123', 12);

      const premium = await prisma.user.create({
        data: {
          email: premiumEmail,
          username: 'premium_user',
          passwordHash,
          role: 'PREMIUM',
          preferences: {
            theme: 'dark',
            language: 'id',
            notifications: true,
          },
        },
      });

      console.log(`✅ Premium user created`);
    } else {
      console.log(`ℹ️  Premium user already exists`);
    }
  } else {
    console.log('ℹ️  Skipping demo user creation in production');
  }

  console.log('🎉 Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
