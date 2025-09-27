/**
 * Fresh reset helper for Coolify without deleting the project resource.
 *
 * Actions:
 * 1. Optionally drop/recreate schema (only if ALLOW_DB_RESET=true)
 * 2. Run prisma migrate deploy
 * 3. Run seed (ensures admin, system settings, site content)
 * 4. Optionally force admin password reset if ADMIN_FORCE_RESET=true
 *
 * Usage (local):
 *   ALLOW_DB_RESET=true tsx scripts/fresh-reset.ts
 *
 * In Coolify (one-off exec / SSH into container):
 *   export ADMIN_FORCE_RESET=true && node dist/scripts/fresh-reset.js
 */
import { execSync } from 'node:child_process';
import { PrismaClient } from '@prisma/client';

async function main() {
  const allowReset = (process.env.ALLOW_DB_RESET || 'false').toLowerCase() === 'true';
  const forceAdminReset = (process.env.ADMIN_FORCE_RESET || 'false').toLowerCase() === 'true';
  const prisma = new PrismaClient();

  console.log('🚀 Fresh reset starting...');

  if (allowReset) {
    const url = process.env.DATABASE_URL;
    if (!url) {
      console.error('❌ DATABASE_URL not set. Aborting reset.');
      process.exit(1);
    }
    console.log('⚠️  ALLOW_DB_RESET=true -> Dropping all tables (Prisma migrate reset simulation)');
    // Safer than prisma migrate reset (which is interactive). We manually truncate.
    // Postgres only: disable FK constraints, truncate, re-enable.
    await prisma.$executeRawUnsafe(`DO $$ DECLARE r RECORD; BEGIN EXECUTE 'TRUNCATE TABLE ' ||
      (SELECT string_agg(format('%I.%I', schemaname, tablename), ',') FROM pg_tables WHERE schemaname = 'public') || ' CASCADE'; END $$;`);
    console.log('🧹 All tables truncated.');
  } else {
    console.log('ℹ️  Skipping destructive wipe (set ALLOW_DB_RESET=true to enable).');
  }

  console.log('📦 Applying migrations...');
  execSync('npx prisma migrate deploy', { stdio: 'inherit' });

  console.log('🌱 Running seed...');
  execSync('node --loader tsx ./prisma/seed.ts', { stdio: 'inherit' });

  if (forceAdminReset) {
    console.log('🔐 ADMIN_FORCE_RESET=true -> Admin password will have been reset by seed.');
  }

  console.log('✅ Fresh reset complete.');
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error('❌ Fresh reset failed:', e);
  process.exit(1);
});
