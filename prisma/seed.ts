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
    const defaultEmail = 'admin@yukiyaki.id';
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

    let premiumUser;
    if (!existingPremium) {
      const passwordHash = await bcrypt.hash(process.env.DEMO_USER_PASSWORD || 'premium123', 12);

      premiumUser = await prisma.user.create({
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
      premiumUser = existingPremium;
      console.log(`ℹ️  Premium user already exists`);
    }

    // Create sample FoodImage
    const existingFoodImage = await prisma.foodImage.findFirst({
      where: { userId: premiumUser.id },
    });

    if (!existingFoodImage) {
      await prisma.foodImage.create({
        data: {
          userId: premiumUser.id,
          originalUrl: 'https://example.com/food-original.jpg',
          optimizedUrls: {
            grabfood: 'https://example.com/food-grabfood.jpg',
            shopee: 'https://example.com/food-shopee.jpg',
            gofood: 'https://example.com/food-gofood.jpg',
          },
          foodCategory: 'Indonesian',
          aiAnalysis: {
            categories: ['nasi', 'ayam', 'sambal'],
            confidence: 0.95,
            colors: ['red', 'white', 'brown'],
          },
          optimizationLog: {
            steps: [
              { step: 'resize', duration: 120, success: true },
              { step: 'background_enhancement', duration: 800, success: true },
              { step: 'text_overlay', duration: 300, success: true },
            ],
          },
        },
      });
      console.log(`✅ Sample FoodImage created`);
    }

    // Create sample Campaign
    const existingCampaign = await prisma.campaign.findFirst({
      where: { userId: premiumUser.id },
    });

    if (!existingCampaign) {
      const campaign = await prisma.campaign.create({
        data: {
          userId: premiumUser.id,
          name: 'Sample Food Campaign',
          description: 'Promosi ayam geprek spesial bulan ini',
          seedData: {
            keyword: 'ayam geprek',
            targetAudience: 'food_lovers',
            budget: 500000,
          },
          strategy: {
            themes: ['spicy_food', 'comfort_food', 'budget_friendly'],
            contentMix: { posts: 0.6, stories: 0.3, reels: 0.1 },
            postingTimes: ['12:00', '18:00', '20:00'],
          },
          duration: 30,
          objective: 'SALES',
          status: 'DRAFT',
          platforms: ['INSTAGRAM', 'TIKTOK'],
          targetAudience: {
            age: '18-35',
            interests: ['food', 'delivery', 'indonesian_cuisine'],
            location: 'Jakarta',
          },
        },
      });

      // Create sample ScheduledContent for the campaign
      await prisma.scheduledContent.createMany({
        data: [
          {
            campaignId: campaign.id,
            title: 'Ayam Geprek Juara!',
            caption:
              'Siapa yang kangen ayam geprek super pedas? 🔥 Cuma hari ini promo spesial! #AyamGeprek #Pedas #Delivery',
            hashtags: ['AyamGeprek', 'Pedas', 'Delivery', 'Food', 'Jakarta'],
            contentType: 'POST',
            platform: 'INSTAGRAM',
            day: 1,
            scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // tomorrow
            status: 'DRAFT',
            aiGenerated: true,
          },
          {
            campaignId: campaign.id,
            title: 'Geprek Challenge!',
            caption:
              'Challenge makan geprek level 5! Berani coba? 😈 #GeprekChallenge #Viral #FoodChallenge',
            hashtags: ['GeprekChallenge', 'Viral', 'FoodChallenge', 'Spicy', 'TikTok'],
            contentType: 'VIDEO',
            platform: 'TIKTOK',
            day: 3,
            scheduledAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
            status: 'DRAFT',
            aiGenerated: true,
          },
        ],
      });

      console.log(`✅ Sample Campaign and ScheduledContent created`);
    }
  } else {
    console.log('ℹ️  Skipping demo user and sample data creation in production');
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
