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
    echo "[COOLIFY] Testing DATABASE_URL: ${DATABASE_URL}"
    
    # Test connection with more detailed error output
    if npx prisma db execute --stdin --schema=./prisma/schema.prisma < /dev/null 2>/tmp/db_error.log; then
        echo "[COOLIFY] Database connection successful!"
        break
    else
        echo "[COOLIFY] Database connection failed. Error details:"
        cat /tmp/db_error.log 2>/dev/null || echo "[COOLIFY] No error details available"
        
        if [ $ATTEMPT -eq $MAX_ATTEMPTS ]; then
            echo "[COOLIFY] Database connection failed after $MAX_ATTEMPTS attempts."
            echo "[COOLIFY] Will start server anyway, but database features will not work."
            break
        fi
        echo "[COOLIFY] Database not ready, waiting 5 seconds..."
        sleep 5
        ATTEMPT=$((ATTEMPT + 1))
    fi
done

# Parse DATABASE_URL for connectivity test
DB_HOST=$(echo $DATABASE_URL | sed -n 's/.*@\([^:]*\):.*/\1/p')
DB_PORT=$(echo $DATABASE_URL | sed -n 's/.*:\([0-9]*\)\/.*/\1/p')

if [ -n "$DB_HOST" ] && [ -n "$DB_PORT" ]; then
    echo "[COOLIFY] Testing network connectivity to $DB_HOST:$DB_PORT..."
    if nc -z "$DB_HOST" "$DB_PORT" 2>/dev/null; then
        echo "[COOLIFY] Network connectivity to database server: OK"
    else
        echo "[COOLIFY] Network connectivity to database server: FAILED"
        echo "[COOLIFY] This might be a network/firewall issue"
    fi
fi

# Run migrations
echo "[COOLIFY] Running database migrations..."
if npx prisma migrate deploy 2>/tmp/migrate_error.log; then
    echo "[COOLIFY] Migrations completed successfully"
else
    echo "[COOLIFY] Migrations failed. Error details:"
    cat /tmp/migrate_error.log 2>/dev/null || echo "[COOLIFY] No migration error details available"
fi

# Run seed if database is empty (optional)
echo "[COOLIFY] Checking if seeding is needed..."
if npx prisma db seed 2>/tmp/seed_error.log; then
    echo "[COOLIFY] Database seeding completed"
else
    echo "[COOLIFY] Seed not needed or failed. Error details:"
    cat /tmp/seed_error.log 2>/dev/null || echo "[COOLIFY] No seed error details available"
fi

echo "[COOLIFY] Starting Next.js server..."
echo "[COOLIFY] Health check available at http://localhost:${PORT:-3000}/api/health"
echo "[COOLIFY] Default admin - Email: admin@localhost, Password: admin123"

# Start the application
exec node server.js