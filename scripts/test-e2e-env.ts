// Lightweight in-memory / test bootstrap for E2E without docker-compose
// Usage: tsx scripts/test-e2e-env.ts & then run Playwright pointing to BASE_URL

import { spawn } from 'child_process';

if (!process.env.DATABASE_URL) {
  // Default local dev database (user must have postgres running locally)
  process.env.DATABASE_URL = 'postgresql://postgres:postgres@localhost:5432/yuki_yaki_db';
}
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'test-secret-please-change';
}

console.log('Starting Next.js dev server for E2E with DATABASE_URL=', process.env.DATABASE_URL);

const child = spawn('npm', ['run', 'dev'], {
  stdio: 'inherit',
  shell: process.platform === 'win32'
});

child.on('exit', (code) => {
  console.log('Dev server exited with code', code);
});
