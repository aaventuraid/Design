import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash(adminPassword, 12);

    const admin = await prisma.user.create({
      data: {
        email: adminEmail,
        passwordHash,
        role: 'ADMIN',
        preferences: {
          theme: 'light',
          language: 'id',
        },
      },
    });

    console.log(`✅ Admin user created: ${admin.email}`);
  } else {
    console.log(`ℹ️  Admin user already exists: ${existingAdmin.email}`);
  }

  // Create some system settings
  const defaultSettings = [
    {
      key: 'geminiApiKey',
      value: process.env.GEMINI_API_KEY || '',
      description: 'Gemini API key for AI features',
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

  // Create sample premium user for testing
  const premiumEmail = 'premium@example.com';
  const existingPremium = await prisma.user.findUnique({
    where: { email: premiumEmail },
  });

  if (!existingPremium) {
    const passwordHash = await bcrypt.hash('premium123', 12);

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

    console.log(`✅ Premium user created: ${premium.email}`);
  } else {
    console.log(`ℹ️  Premium user already exists: ${existingPremium.email}`);
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
