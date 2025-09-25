#!/bin/bash

# 🚀 AI-Powered Content Platform - Quick Setup Script
# This script sets up the complete development environment in ~5 minutes

set -e

echo "🚀 Setting up AI-Powered Content & Social Media Platform..."
echo "======================================================"

# Color codes for better output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check prerequisites
print_info "Checking prerequisites..."

if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker first."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

print_status "All prerequisites found!"

# Step 1: Environment Configuration (30 seconds)
print_info "Step 1/6: Setting up environment configuration..."

if [ ! -f .env.local ]; then
    if [ -f .env.example ]; then
        cp .env.example .env.local
        print_status "Environment file created from example"
    else
        cat > .env.local << EOF
# Development Environment Configuration
DATABASE_URL="postgresql://postgres:password@localhost:5432/ai2_dev"
REDIS_URL="redis://localhost:6379"
JWT_SECRET="dev-jwt-secret-change-in-production"
ADMIN_EMAIL="admin@example.com" 
ADMIN_PASSWORD="admin123"
GEMINI_API_KEY="your-gemini-api-key-here"
NEXT_PUBLIC_APP_ENV="development"
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
EOF
        print_warning "Environment file created with defaults. Please update API keys!"
    fi
else
    print_info "Environment file already exists, skipping..."
fi

# Step 2: Dependencies Installation (2 minutes)
print_info "Step 2/6: Installing dependencies..."
npm install
print_status "Dependencies installed successfully!"

# Step 3: Docker Services (1 minute)
print_info "Step 3/6: Starting Docker services (PostgreSQL + Redis)..."

# Create docker-compose.dev.yml if it doesn't exist
if [ ! -f docker-compose.dev.yml ]; then
    cat > docker-compose.dev.yml << EOF
version: '3.8'
services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: ai2_dev
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 3s
      retries: 3

  mailhog:
    image: mailhog/mailhog:latest
    ports:
      - "1025:1025"  # SMTP port
      - "8025:8025"  # Web interface
    environment:
      MH_STORAGE: maildir
      MH_MAILDIR_PATH: /tmp

volumes:
  postgres_data:
  redis_data:
EOF
    print_status "Docker Compose configuration created!"
fi

docker-compose -f docker-compose.dev.yml up -d
print_status "Docker services started!"

# Wait for services to be ready
print_info "Waiting for services to be ready..."
sleep 10

# Step 4: Database Setup (1 minute)
print_info "Step 4/6: Setting up database..."

# Install Prisma CLI if not present
if ! command -v prisma &> /dev/null; then
    npm install -g prisma
fi

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init
print_status "Database migrations completed!"

# Seed database with initial data
if [ -f prisma/seed.ts ]; then
    npx prisma db seed
    print_status "Database seeded with initial data!"
else
    print_warning "No seed file found, skipping database seeding"
fi

# Step 5: Build and Test (1 minute)
print_info "Step 5/6: Running initial build and tests..."

# Build the application
npm run build
print_status "Application built successfully!"

# Run tests if available
if npm run test --silent; then
    print_status "All tests passed!"
else
    print_warning "Some tests failed, but continuing setup..."
fi

# Step 6: Start Development Server (30 seconds)
print_info "Step 6/6: Starting development server..."

print_status "Setup completed successfully! 🎉"
echo ""
echo "======================================================"
echo "🚀 AI-Powered Content Platform is ready!"
echo "======================================================"
echo ""
echo "📱 Application URLs:"
echo "   • Main App: http://localhost:3000"
echo "   • Admin Panel: http://localhost:3000/admin"
echo "   • Database Studio: npx prisma studio"
echo "   • Email Testing: http://localhost:8025 (Mailhog)"
echo ""
echo "🔧 Useful Commands:"
echo "   • Start development: npm run dev"
echo "   • View logs: docker-compose -f docker-compose.dev.yml logs -f"
echo "   • Reset database: npm run db:reset"
echo "   • Stop services: docker-compose -f docker-compose.dev.yml down"
echo ""
echo "📚 Next Steps:"
echo "   1. Update API keys in .env.local"
echo "   2. Run: npm run dev"
echo "   3. Visit http://localhost:3000"
echo "   4. Start building amazing features! 🚀"
echo ""

# Optional: Start dev server automatically
read -p "Start development server now? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    print_info "Starting development server..."
    npm run dev
fi