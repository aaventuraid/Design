#!/bin/sh
set -e

echo "[COOLIFY] Starting application container..."
echo "[COOLIFY] Environment: NODE_ENV=${NODE_ENV}, PORT=${PORT}"

# Check database connection with a simpler approach
echo "[COOLIFY] Checking database connection..."
echo "SELECT 1;" | npx prisma db execute --stdin > /dev/null 2>&1 || {
    echo "[COOLIFY] Database not ready, waiting 5 seconds..."
    sleep 5
}

# Run migrations only if needed
echo "[COOLIFY] Running database migrations..."
npx prisma migrate deploy --schema=./prisma/schema.prisma

# Run seed if database is empty (optional)
echo "[COOLIFY] Checking if seeding is needed..."
npx prisma db seed 2>/dev/null || echo "[COOLIFY] Seed not needed or failed, continuing..."

echo "[COOLIFY] Starting Next.js server..."
echo "[COOLIFY] Health check available at https://design.yukiyaki.id:${PORT:-3000}/api/health"
echo "[COOLIFY] Default admin - Email: admin@localhost, Password: admin123"

# Start the application
exec node server.js