// Global test setup for Vitest (runs before any tests)
// Ensures DATABASE_URL (Postgres) is set, migrations applied, and Prisma client generated.
import { execSync } from 'node:child_process';

// Provide defaults for local docker-compose Postgres if not supplied
if (!process.env.DATABASE_URL) {
  // Matches docker-compose credentials (host-mapped port)
  process.env.DATABASE_URL = 'postgresql://yuki_user:yuki_password_2025@localhost:5432/yuki_yaki_db';
}
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'test-secret-jwt';
}

// Assume migrations + generate already run once externally (faster, avoids partial writes during parallel test init)
// If client missing (first run), do a quick generate (single attempt)
try { require.resolve('@prisma/client'); } catch { try { execSync('npx prisma generate', { stdio: 'ignore' }); } catch {} }
