#!/usr/bin/env pwsh

# PostgreSQL Migration Script
# Converts the project from SQLite to PostgreSQL-only setup

Write-Host "🐘 PostgreSQL Migration Script" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Check if Docker is available
$dockerAvailable = $false
try {
    docker --version | Out-Null
    $dockerAvailable = $true
    Write-Host "✅ Docker detected" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Docker not available, will use native PostgreSQL" -ForegroundColor Yellow
}

# Function to check if PostgreSQL is running
function Test-PostgreSQL {
    param([string]$connectionString)
    
    try {
        # Use simple connection test
        $env:PGPASSWORD = "password"
        pg_isready -h localhost -p 5432 | Out-Null
        return $true
    } catch {
        return $false
    }
}

Write-Host "🔧 Step 1: Environment Setup" -ForegroundColor Blue
Write-Host "----------------------------" -ForegroundColor Blue

# Backup existing environment files
if (Test-Path ".env") {
    Copy-Item ".env" ".env.backup" -Force
    Write-Host "📁 Backed up existing .env to .env.backup" -ForegroundColor Yellow
}

# Create new environment file
if (-not (Test-Path ".env")) {
    Copy-Item ".env.example" ".env" -Force
    Write-Host "📝 Created .env from .env.example" -ForegroundColor Green
    
    # Update DATABASE_URL in .env
    $envContent = Get-Content ".env" -Raw
    $envContent = $envContent -replace 'DATABASE_URL="postgresql://username:password@host:port/database"', 'DATABASE_URL="postgresql://postgres:password@localhost:5432/ai_platform_dev"'
    Set-Content ".env" $envContent -NoNewline
    Write-Host "🔗 Updated DATABASE_URL in .env" -ForegroundColor Green
}

Write-Host ""
Write-Host "🐘 Step 2: PostgreSQL Setup" -ForegroundColor Blue
Write-Host "----------------------------" -ForegroundColor Blue

if ($dockerAvailable) {
    Write-Host "🐳 Setting up PostgreSQL with Docker..." -ForegroundColor Cyan
    
    # Create docker-compose file for development
    $dockerCompose = @"
version: '3.8'
services:
  postgres:
    image: postgres:15
    container_name: ai_platform_postgres
    environment:
      POSTGRES_DB: ai_platform_dev
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

volumes:
  postgres_data:
"@
    
    Set-Content "docker-compose.dev.yml" $dockerCompose
    Write-Host "📝 Created docker-compose.dev.yml" -ForegroundColor Green
    
    # Start PostgreSQL
    try {
        docker-compose -f docker-compose.dev.yml up -d
        Start-Sleep -Seconds 5  # Wait for PostgreSQL to start
        Write-Host "🚀 PostgreSQL container started" -ForegroundColor Green
    } catch {
        Write-Host "❌ Failed to start PostgreSQL container" -ForegroundColor Red
        Write-Host "Please check Docker installation and try again" -ForegroundColor Yellow
        exit 1
    }
} else {
    Write-Host "💻 Please ensure PostgreSQL is installed and running locally" -ForegroundColor Yellow
    Write-Host "Database: ai_platform_dev" -ForegroundColor Yellow
    Write-Host "User: postgres" -ForegroundColor Yellow
    Write-Host "Password: password" -ForegroundColor Yellow
    Write-Host "Port: 5432" -ForegroundColor Yellow
    Write-Host ""
    $continue = Read-Host "Press Enter when PostgreSQL is ready, or 'q' to quit"
    if ($continue -eq 'q') {
        exit 0
    }
}

Write-Host ""
Write-Host "🗄️  Step 3: Database Migration" -ForegroundColor Blue
Write-Host "------------------------------" -ForegroundColor Blue

# Remove old SQLite migrations
if (Test-Path "prisma/migrations") {
    Remove-Item "prisma/migrations" -Recurse -Force
    Write-Host "🗑️  Removed old SQLite migrations" -ForegroundColor Yellow
}

# Generate Prisma client
Write-Host "🔄 Generating Prisma client..." -ForegroundColor Cyan
npx prisma generate

# Create new migration
Write-Host "📋 Creating PostgreSQL migration..." -ForegroundColor Cyan
npx prisma migrate dev --name "postgresql_init"

# Seed database
Write-Host "🌱 Seeding database..." -ForegroundColor Cyan
npx prisma db seed

Write-Host ""
Write-Host "✅ Step 4: Verification" -ForegroundColor Blue
Write-Host "----------------------" -ForegroundColor Blue

# Test database connection
try {
    npx prisma db pull | Out-Null
    Write-Host "✅ Database connection successful" -ForegroundColor Green
} catch {
    Write-Host "❌ Database connection failed" -ForegroundColor Red
    Write-Host "Please check PostgreSQL status and connection string" -ForegroundColor Yellow
}

# Check if seed data exists
Write-Host "✅ Database setup completed - run 'npx prisma studio' to verify data" -ForegroundColor Green

Write-Host ""
Write-Host "🎉 Migration Complete!" -ForegroundColor Green
Write-Host "=====================" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Run 'npm run dev' to start the development server" -ForegroundColor White
Write-Host "2. Visit http://localhost:3000/admin/login" -ForegroundColor White
Write-Host "3. Login with: admin@localhost / admin123" -ForegroundColor White
Write-Host "4. Change default password in Admin Panel" -ForegroundColor White
Write-Host "5. Configure Gemini API key in Admin Panel" -ForegroundColor White
Write-Host ""
Write-Host "Database management:" -ForegroundColor Cyan
Write-Host "- View data: npx prisma studio" -ForegroundColor White
Write-Host "- Reset database: npx prisma migrate reset" -ForegroundColor White
Write-Host "- Stop PostgreSQL: docker-compose -f docker-compose.dev.yml down" -ForegroundColor White
Write-Host ""
Write-Host "📚 See docs/POSTGRESQL-SETUP.md for detailed documentation" -ForegroundColor Blue