#!/bin/bash
# Coolify v4 Debug Script
# Use this to troubleshoot deployment issues

echo "🔧 Coolify v4 Debug Information"
echo "================================="
echo "📅 Current time: $(date)"
echo "🖥️  Hostname: $(hostname)"
echo "👤 Current user: $(whoami)"
echo "📍 Working directory: $(pwd)"
echo ""

echo "🌍 Environment Variables:"
echo "-------------------------"
echo "NODE_ENV: $NODE_ENV"
echo "PORT: $PORT"
echo "HOSTNAME: $HOSTNAME"
echo "COOLIFY_URL: $COOLIFY_URL"
echo "COOLIFY_FQDN: $COOLIFY_FQDN"
echo "COOLIFY_BRANCH: $COOLIFY_BRANCH"
echo "DATABASE_URL: ${DATABASE_URL:0:20}..." # Show only first 20 chars for security
echo "NEXTAUTH_SECRET: ${NEXTAUTH_SECRET:+SET}" # Show SET if exists
echo "GEMINI_API_KEY: ${GEMINI_API_KEY:+SET}"
echo ""

echo "📂 File System Check:"
echo "---------------------"
echo "Current directory contents:"
ls -la

echo ""
echo "Data directory:"
ls -la data/ 2>/dev/null || echo "Data directory not found"

echo ""
echo "Next.js build check:"
ls -la .next/ 2>/dev/null || echo ".next directory not found"
ls -la server.js 2>/dev/null || echo "server.js not found"

echo ""
echo "Prisma setup:"
ls -la prisma/ 2>/dev/null || echo "Prisma directory not found"
ls -la node_modules/.prisma/ 2>/dev/null || echo "Prisma client not found"

echo ""
echo "📦 Node.js Information:"
echo "----------------------"
echo "Node.js version: $(node --version)"
echo "NPM version: $(npm --version)"

echo ""
echo "💾 System Resources:"
echo "-------------------"
echo "Memory usage:"
free -m 2>/dev/null || echo "Memory info not available"

echo ""
echo "Disk usage:"
df -h . 2>/dev/null || echo "Disk info not available"

echo ""
echo "🐳 Docker Information:"
echo "---------------------"
echo "Docker processes:"
ps aux | grep -E "(docker|node)" | grep -v grep

echo ""
echo "🌐 Network Check:"
echo "----------------"
echo "Port 3000 status:"
netstat -tlnp 2>/dev/null | grep :3000 || echo "Port 3000 not listening"

echo ""
echo "🔍 Process Check:"
echo "----------------"
echo "Node.js processes:"
ps aux | grep node | grep -v grep

echo ""
echo "📋 Recent Logs (if available):"
echo "-----------------------------"
if [ -f /var/log/application.log ]; then
    tail -20 /var/log/application.log
else
    echo "No application logs found"
fi

echo ""
echo "🧪 Database Connection Test:"
echo "---------------------------"
if [ ! -z "$DATABASE_URL" ]; then
    node -e "
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    
    async function testConnection() {
      try {
        await prisma.$connect();
        console.log('✅ Database connection successful');
        await prisma.$disconnect();
      } catch (error) {
        console.log('❌ Database connection failed:', error.message);
      }
    }
    
    testConnection();
    " 2>/dev/null || echo "❌ Could not test database connection"
else
    echo "❌ DATABASE_URL not set"
fi

echo ""
echo "🎯 Health Check Test:"
echo "--------------------"
if command -v wget >/dev/null 2>&1; then
    timeout 10 wget --spider -q http://localhost:3000/api/health && echo "✅ Health endpoint responsive" || echo "❌ Health endpoint not responding"
elif command -v curl >/dev/null 2>&1; then
    timeout 10 curl -f http://localhost:3000/api/health >/dev/null 2>&1 && echo "✅ Health endpoint responsive" || echo "❌ Health endpoint not responding"
else
    echo "❌ No HTTP client available for testing"
fi

echo ""
echo "================================="
echo "🔧 Debug information complete!"