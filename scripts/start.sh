#!/bin/sh
set -e

echo "[COOLIFY] Starting application container..."
echo "[COOLIFY] Environment: NODE_ENV=${NODE_ENV}, PORT=${PORT}"

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "[COOLIFY] WARNING: DATABASE_URL is not set. Database operations will fail."
    echo "[COOLIFY] Starting server without database operations..."
    exec node server.js
fi

# Wait for database with timeout and retry limit
echo "[COOLIFY] Waiting for database to be ready..."
MAX_ATTEMPTS=10
ATTEMPT=1

while [ $ATTEMPT -le $MAX_ATTEMPTS ]; do
    echo "[COOLIFY] Database connection attempt $ATTEMPT/$MAX_ATTEMPTS..."
    
    if echo "SELECT 1;" | npx prisma db execute --stdin >/dev/null 2>&1; then
        echo "[COOLIFY] Database connection successful!"
        break
    else
        if [ $ATTEMPT -eq $MAX_ATTEMPTS ]; then
            echo "[COOLIFY] Database connection failed after $MAX_ATTEMPTS attempts. Starting server anyway..."
            break
        fi
        echo "[COOLIFY] Database not ready, waiting 5 seconds..."
        sleep 5
        ATTEMPT=$((ATTEMPT + 1))
    fi
done

# Run migrations
echo "[COOLIFY] Running database migrations..."
npx prisma migrate deploy 2>/dev/null || echo "[COOLIFY] Migrations failed or not needed, continuing..."

# Run seed if database is empty (optional)
echo "[COOLIFY] Checking if seeding is needed..."
npx prisma db seed 2>/dev/null || echo "[COOLIFY] Seed not needed or failed, continuing..."

echo "[COOLIFY] Starting Next.js server..."
echo "[COOLIFY] Health check available at http://localhost:${PORT:-3000}/api/health"
echo "[COOLIFY] Default admin - Email: admin@localhost, Password: admin123"

# Start the application
exec node server.js