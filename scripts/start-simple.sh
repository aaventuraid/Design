#!/bin/sh

echo "Starting Yuki Yaki Corner application..."
echo "Environment: NODE_ENV=${NODE_ENV}, PORT=${PORT}"

# Wait for database
if [ -n "$DATABASE_URL" ]; then
    echo "Waiting for database..."
    sleep 10
    
    # Run migrations
    echo "Running migrations..."
    npx prisma migrate deploy || echo "Migration failed, continuing..."
    
    # Seed database
    echo "Seeding database..."
    npx prisma db seed || echo "Seeding failed or not needed, continuing..."
fi

echo "Starting Next.js server..."
exec node server.js
</acosta:parameter>
</invoke>