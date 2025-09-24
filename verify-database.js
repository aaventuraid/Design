const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function verifyDatabaseSettings() {
  try {
    console.log('🔍 Verifying database settings...');

    const settings = await prisma.systemSettings.findMany();
    console.log('\n📊 Database Settings:');
    settings.forEach((s) => {
      if (s.key === 'geminiApiKey') {
        console.log(`✅ ${s.key}: ${s.value.substring(0, 15)}... (${s.value.length} chars)`);
      } else {
        console.log(`✅ ${s.key}: ${s.value}`);
      }
    });

    // Test admin user
    const adminUsers = await prisma.user.findMany({
      where: { role: 'ADMIN' },
    });

    console.log('\n👤 Admin Users:');
    adminUsers.forEach((user) => {
      console.log(`✅ ${user.email} (${user.role}) - Created: ${user.createdAt}`);
    });

    console.log('\n🎉 Database verification complete!');
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

verifyDatabaseSettings();
