#!/bin/bash
# Coolify v4 optimized startup script

set -e  # Exit on any error

echo "🚀 Starting Yuki Yaki Corner application..."
echo "📅 $(date)"
echo "🔧 Node.js version: $(node --version)"
echo "📦 NPM version: $(npm --version)"

# Environment validation
echo "🔍 Validating environment variables..."
if [ -z "$DATABASE_URL" ]; then
    echo "❌ ERROR: DATABASE_URL is not set"
    exit 1
fi

if [ -z "$NEXTAUTH_SECRET" ]; then
    echo "❌ ERROR: NEXTAUTH_SECRET is not set"
    exit 1
fi

echo "✅ Environment variables validated"

# Database setup
echo "📊 Setting up database..."
echo "� Running Prisma migrations..."
if npx prisma migrate deploy --schema=./prisma/schema.prisma; then
    echo "✅ Database migrations completed successfully"
else
    echo "⚠️  Database migration failed, but continuing..."
fi

# Optional: Generate Prisma client if not exists
if [ ! -d "./node_modules/.prisma" ]; then
    echo "🔄 Generating Prisma client..."
    npx prisma generate
fi

# Database seed (if needed)
# Create default admin user if no users exist
if [ "$NODE_ENV" = "production" ]; then
  echo "🔐 Checking for default admin user setup..."
  node -e "
    const { PrismaClient } = require('@prisma/client');
    const bcrypt = require('bcryptjs');

    async function setupDefaultAdmin() {
      const prisma = new PrismaClient();
      try {
        const userCount = await prisma.user.count();

        if (userCount === 0) {
          const defaultPassword = await bcrypt.hash('admin123', 10);
          
          await prisma.user.create({
            data: {
              email: 'admin@localhost',
              username: 'admin',
              passwordHash: defaultPassword,
              role: 'ADMIN',
              isActive: true,
              preferences: {
                theme: 'light',
                language: 'id',
                notifications: true
              }
            }
          });
          echo '[COOLIFY] ✅ Default admin user created successfully'
          echo '[COOLIFY] ⚠️  IMPORTANT: Change default credentials after first login!'
        } else {
          console.log('ℹ️  Users already exist, skipping default admin setup...');
        }
      } catch (error) {
        console.error('❌ Failed to setup default admin user:', error.message);
      } finally {
        await prisma.\$disconnect();
      }
    }

    setupDefaultAdmin();
  " || echo "⚠️  Admin setup failed, continuing..."
fi

# Create necessary directories
echo "📁 Creating data directories..."
mkdir -p /app/data /app/.data
chown -R nextjs:nodejs /app/data /app/.data 2>/dev/null || true

# Health check endpoint validation
echo "🏥 Validating health check endpoint..."
timeout 30 sh -c 'until nc -z localhost 3000; do sleep 1; done' 2>/dev/null || true

echo "� Application setup completed!"
echo "� Starting Next.js server on port 3000..."

# Start the application
exec node server.js