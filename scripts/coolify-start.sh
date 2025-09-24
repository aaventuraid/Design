#!/bin/bash
# Coolify Deployment Script
# Run this after first deployment to setup database

set -e

echo "🚀 Setting up Yuki Yaki Corner on Coolify..."

# Wait for database to be ready
echo "⏳ Waiting for database connection..."
timeout 60 sh -c 'until nc -z yuki-yaki-db 5432; do sleep 1; done' || {
    echo "❌ Database connection timeout"
    exit 1
}

echo "✅ Database connection established"

# Run database migrations
echo "📊 Running database migrations..."
npx prisma migrate deploy

# Check if we need to seed
ADMIN_EXISTS=$(npx prisma db seed --preview-feature 2>&1 | grep -o "Admin user already exists" || echo "")

if [ -z "$ADMIN_EXISTS" ]; then
    echo "🌱 Seeding database with initial data..."
    npx prisma db seed
else
    echo "ℹ️ Database already seeded, skipping..."
fi

echo "✅ Database setup completed successfully!"
echo "🎉 Application is ready!"

# Start the Next.js server
echo "🚀 Starting application server..."
exec node server.js