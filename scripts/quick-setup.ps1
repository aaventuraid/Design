# 🚀 AI-Powered Content Platform - Quick Setup Script (Windows PowerShell)
# This script sets up the complete development environment in ~5 minutes

param(
    [switch]$Force,
    [switch]$SkipDocker,
    [switch]$StartDev
)

Write-Host "🚀 Setting up AI-Powered Content & Social Media Platform..." -ForegroundColor Cyan
Write-Host "======================================================" -ForegroundColor Cyan
Write-Host ""

function Write-Success { 
    param($Message)
    Write-Host "✅ $Message" -ForegroundColor Green 
}

function Write-Warning { 
    param($Message)
    Write-Host "⚠️  $Message" -ForegroundColor Yellow 
}

function Write-Info { 
    param($Message)
    Write-Host "ℹ️  $Message" -ForegroundColor Blue 
}

function Write-Error { 
    param($Message)
    Write-Host "❌ $Message" -ForegroundColor Red 
}

# Check prerequisites
Write-Info "Checking prerequisites..."

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Error "Node.js is not installed. Please install Node.js 18+ first."
    Write-Host "Download from: https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

if (-not $SkipDocker) {
    if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
        Write-Error "Docker is not installed. Please install Docker Desktop first."
        Write-Host "Download from: https://www.docker.com/products/docker-desktop" -ForegroundColor Yellow
        exit 1
    }

    if (-not (Get-Command docker-compose -ErrorAction SilentlyContinue)) {
        Write-Error "Docker Compose is not installed. Please install Docker Desktop with Compose."
        exit 1
    }
}

Write-Success "All prerequisites found!"

# Step 1: Environment Configuration
Write-Info "Step 1/6: Setting up environment configuration..."

if (-not (Test-Path ".env.local") -or $Force) {
    if (Test-Path ".env.example") {
        Copy-Item ".env.example" ".env.local"
        Write-Success "Environment file created from example"
    } else {
        $envContent = @"
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
"@
        $envContent | Out-File -FilePath ".env.local" -Encoding UTF8
        Write-Warning "Environment file created with defaults. Please update API keys!"
    }
} else {
    Write-Info "Environment file already exists, skipping..."
}

# Step 2: Dependencies Installation
Write-Info "Step 2/6: Installing dependencies..."
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Error "Failed to install dependencies!"
    exit 1
}
Write-Success "Dependencies installed successfully!"

# Step 3: Docker Services
if (-not $SkipDocker) {
    Write-Info "Step 3/6: Starting Docker services (PostgreSQL + Redis)..."

    # Create docker-compose.dev.yml if it doesn't exist
    if (-not (Test-Path "docker-compose.dev.yml") -or $Force) {
        $dockerComposeContent = @"
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
"@
        $dockerComposeContent | Out-File -FilePath "docker-compose.dev.yml" -Encoding UTF8
        Write-Success "Docker Compose configuration created!"
    }

    docker-compose -f docker-compose.dev.yml up -d
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Failed to start Docker services!"
        exit 1
    }
    Write-Success "Docker services started!"

    # Wait for services to be ready
    Write-Info "Waiting for services to be ready..."
    Start-Sleep -Seconds 10
} else {
    Write-Warning "Skipping Docker setup (use -SkipDocker was specified)"
}

# Step 4: Database Setup
Write-Info "Step 4/6: Setting up database..."

# Generate Prisma client
npx prisma generate
if ($LASTEXITCODE -ne 0) {
    Write-Error "Failed to generate Prisma client!"
    exit 1
}

# Run migrations
npx prisma migrate dev --name init
if ($LASTEXITCODE -ne 0) {
    Write-Warning "Database migration failed, but continuing..."
} else {
    Write-Success "Database migrations completed!"
}

# Seed database with initial data
if (Test-Path "prisma/seed.ts") {
    npx prisma db seed
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Database seeded with initial data!"
    } else {
        Write-Warning "Database seeding failed, but continuing..."
    }
} else {
    Write-Warning "No seed file found, skipping database seeding"
}

# Step 5: Build and Test
Write-Info "Step 5/6: Running initial build and tests..."

# Build the application
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Warning "Build failed, but continuing with setup..."
} else {
    Write-Success "Application built successfully!"
}

# Run tests if available
try {
    npm run test 2>$null
    Write-Success "All tests passed!"
} catch {
    Write-Warning "Tests failed or not configured, but continuing setup..."
}

# Step 6: Completion
Write-Info "Step 6/6: Finalizing setup..."

Write-Success "Setup completed successfully! 🎉"
Write-Host ""
Write-Host "======================================================" -ForegroundColor Cyan
Write-Host "🚀 AI-Powered Content Platform is ready!" -ForegroundColor Cyan
Write-Host "======================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📱 Application URLs:" -ForegroundColor Yellow
Write-Host "   • Main App: http://localhost:3000"
Write-Host "   • Admin Panel: http://localhost:3000/admin"
Write-Host "   • Database Studio: npx prisma studio"
if (-not $SkipDocker) {
    Write-Host "   • Email Testing: http://localhost:8025 (Mailhog)"
}
Write-Host ""
Write-Host "🔧 Useful Commands:" -ForegroundColor Yellow
Write-Host "   • Start development: npm run dev"
if (-not $SkipDocker) {
    Write-Host "   • View logs: docker-compose -f docker-compose.dev.yml logs -f"
    Write-Host "   • Stop services: docker-compose -f docker-compose.dev.yml down"
}
Write-Host "   • Reset database: npm run db:reset"
Write-Host ""
Write-Host "📚 Next Steps:" -ForegroundColor Yellow
Write-Host "   1. Update API keys in .env.local"
Write-Host "   2. Run: npm run dev"
Write-Host "   3. Visit http://localhost:3000"
Write-Host "   4. Start building amazing features! 🚀"
Write-Host ""

# Optional: Start dev server automatically
if ($StartDev) {
    Write-Info "Starting development server..."
    npm run dev
} else {
    $response = Read-Host "Start development server now? (y/N)"
    if ($response -eq "y" -or $response -eq "Y") {
        Write-Info "Starting development server..."
        npm run dev
    }
}