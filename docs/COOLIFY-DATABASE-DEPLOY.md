# 🚀 Deploy Database-Ready App ke Coolify Self-Host

Panduan lengkap untuk deploy aplikasi dengan database ke Coolify self-hosted instance.

## 📋 Prerequisites

### 1. Coolify Server Requirements

- ✅ Ubuntu/Debian server dengan Docker installed
- ✅ Minimum 2GB RAM, 20GB storage
- ✅ Domain/subdomain yang di-point ke server
- ✅ SSL certificate (Let's Encrypt otomatis)

### 2. Database Options untuk Coolify

- **Option A**: PostgreSQL service di Coolify (Recommended)
- **Option B**: External PostgreSQL database
- **Option C**: SQLite (single instance only)

---

## 🗄️ Database Setup di Coolify

### Option A: PostgreSQL Service (Recommended)

1. **Buat PostgreSQL Service di Coolify**

   ```bash
   # Di Coolify Dashboard:
   Services > New Service > PostgreSQL

   Name: yuki-yaki-db
   Database: yuki_yaki_production
   Username: yuki_admin
   Password: [generate secure password]
   Port: 5432 (internal)
   ```

2. **Note Connection Details**
   ```bash
   # Coolify akan generate:
   Internal URL: postgresql://yuki_admin:password@yuki-yaki-db:5432/yuki_yaki_production
   External URL: postgresql://yuki_admin:password@your-server.com:54321/yuki_yaki_production
   ```

### Option B: External Database

```bash
# Gunakan database provider seperti:
- Supabase (Free tier: 500MB)
- Railway (Free tier: 1GB)
- Aiven (Free tier: 1 month)
- DigitalOcean Managed Database
```

---

## 🔧 Environment Configuration

### 1. Update Environment Variables

Buat file `.env.production` untuk Coolify:

```bash
# Database Configuration
DATABASE_URL="postgresql://yuki_admin:your_password@yuki-yaki-db:5432/yuki_yaki_production"

# JWT Secret (PENTING: Generate secure secret)
JWT_SECRET="your-super-secure-jwt-secret-32-chars-min"

# Admin Setup
ADMIN_EMAIL="admin@yourdomain.com"
ADMIN_PASSWORD="secure-admin-password"

# AI Configuration
GEMINI_API_KEY="your-gemini-api-key"
IMAGE_BG_PROVIDER="internal"

# Next.js Configuration
NODE_ENV="production"
NEXT_TELEMETRY_DISABLED=1

# Optional: Data directory fallback
DATA_DIR="/app/data"
```

### 2. Generate Secure JWT Secret

```bash
# Generate 32+ character random string
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Or use online generator:
# https://www.allkeysgenerator.com/Random/Security-Encryption-Key-Generator.aspx
```

---

## 🐳 Docker Configuration untuk Database

### 1. Update Dockerfile

```dockerfile
# Dockerfile optimized untuk database dan Coolify
FROM node:18-alpine AS base

# Install dependencies for Prisma and Sharp
FROM base AS deps
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./
COPY prisma ./prisma/

# Install dependencies
RUN npm ci --only=production --ignore-scripts

# Generate Prisma client
RUN npm run db:generate

# Build stage
FROM base AS builder
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma client for build
RUN npm run db:generate

# Build Next.js app
ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production
RUN npm run build

# Runtime stage
FROM base AS runner
WORKDIR /app

# Install runtime dependencies
RUN apk add --no-cache libc6-compat openssl

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Create nextjs user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built application
COPY --from=builder /app/next.config.mjs ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

# Copy standalone build
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copy Prisma
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# Create data directory
RUN mkdir -p /app/data && chown nextjs:nodejs /app/data

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Start with database migration
CMD ["sh", "-c", "npx prisma migrate deploy && node server.js"]
```

### 2. Update next.config.mjs

```javascript
/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
  distDir: isProd ? '.next' : '.next-dev',
  output: isProd ? 'standalone' : undefined,
  trailingSlash: false,
  poweredByHeader: false,
  experimental: {
    // Optimize for Docker
    outputFileTracingRoot: process.cwd(),
  },
  // Image optimization for production
  images: {
    remotePatterns: [],
    minimumCacheTTL: 60,
  },
};

export default nextConfig;
```

---

## 🚀 Deployment Steps di Coolify

### 1. Create New Project di Coolify

```bash
1. Login ke Coolify Dashboard
2. Projects > New Project
3. Name: "yuki-yaki-corner"
4. Description: "Food Image Processing Platform"
```

### 2. Add GitHub Repository

```bash
1. Resources > New Resource > Git Repository
2. Repository URL: https://github.com/aaventuraid/AAVENTURA
3. Branch: main
4. Build Pack: Docker
5. Dockerfile Path: ./Dockerfile
```

### 3. Configure Environment Variables

```bash
# Di Coolify Environment Settings:
DATABASE_URL=postgresql://yuki_admin:password@yuki-yaki-db:5432/yuki_yaki_production
JWT_SECRET=your-generated-32-char-secret
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=secure-admin-password
GEMINI_API_KEY=your-gemini-api-key
IMAGE_BG_PROVIDER=internal
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
```

### 4. Configure Networking

```bash
# Ports Configuration:
Container Port: 3000
Public Port: 80/443 (auto SSL)

# Domain Configuration:
Domain: your-app.yourdomain.com
SSL: Let's Encrypt (auto)
```

### 5. Database Migration Strategy

Option A - **Automatic Migration** (dalam Dockerfile):

```dockerfile
CMD ["sh", "-c", "npx prisma migrate deploy && node server.js"]
```

Option B - **Manual Migration** (lebih aman):

```bash
# Connect ke container:
docker exec -it container-name sh

# Run migration manually:
npx prisma migrate deploy
npx prisma db seed
```

---

## 📊 Database Management di Production

### 1. Backup Strategy

```bash
# Setup automatic backups di Coolify:
Services > PostgreSQL > Backups
- Enable daily backups
- Retention: 7 days minimum
- Export to S3/external storage
```

### 2. Database Access

```bash
# Via Coolify console:
Services > PostgreSQL > Console

# Via external client:
psql postgresql://yuki_admin:password@your-server.com:54321/yuki_yaki_production
```

### 3. Monitoring

```bash
# Database metrics di Coolify:
- Connection count
- Query performance
- Storage usage
- Backup status

# Application metrics:
- Response times
- Error rates
- User growth
- Processing volume
```

---

## 🔧 Post-Deployment Configuration

### 1. Initial Setup

```bash
# 1. Verify database connection
curl https://your-app.com/api/health

# 2. Create admin user
curl -X POST https://your-app.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@yourdomain.com","password":"secure-password","role":"ADMIN"}'

# 3. Test image processing
curl -X POST https://your-app.com/api/process \
  -F "image=@test-image.jpg" \
  -F "preset=gofood"
```

### 2. Admin Panel Access

```bash
# Access admin panel:
https://your-app.com/admin

# Login dengan credentials dari environment variables
```

### 3. User Registration

```bash
# Allow user registration:
https://your-app.com/auth

# Or disable public registration dan create users manually via admin
```

---

## 🚨 Troubleshooting Common Issues

### Database Connection Errors

```bash
# Check logs:
docker logs container-name

# Common issues:
1. Wrong DATABASE_URL format
2. Database service not started
3. Network connectivity between containers
4. Missing Prisma client generation

# Solutions:
- Verify environment variables
- Check Coolify service status
- Regenerate Prisma client
- Test database connectivity
```

### Migration Failures

```bash
# Manual migration:
docker exec -it container-name sh
npx prisma migrate status
npx prisma migrate deploy --accept-data-loss

# Reset database (DESTRUCTIVE):
npx prisma migrate reset
npx prisma db seed
```

### Performance Issues

```bash
# Database optimization:
- Add database indexes
- Enable connection pooling
- Monitor slow queries
- Optimize image processing limits

# Application optimization:
- Enable Next.js caching
- Optimize Docker layers
- Use CDN for static assets
- Implement Redis caching
```

---

## 🎯 Production Checklist

### Before Deployment

- [ ] Database service running di Coolify
- [ ] Environment variables configured
- [ ] JWT secret generated (32+ chars)
- [ ] Admin credentials set
- [ ] Gemini API key added
- [ ] Domain configured dengan SSL

### After Deployment

- [ ] Health check returns 200
- [ ] Database migrations completed
- [ ] Admin user created
- [ ] Image processing works
- [ ] Copy generation works
- [ ] User registration works
- [ ] Analytics tracking works

### Security Checklist

- [ ] Strong admin password
- [ ] Secure JWT secret
- [ ] Database access restricted
- [ ] SSL certificate active
- [ ] Rate limiting enabled
- [ ] Audit logging active

---

## 📈 Scaling Considerations

### Horizontal Scaling

```bash
# Multiple app instances:
- Load balancer di Coolify
- Shared database connection
- Session storage di database (sudah implemented)
- File storage di external service (S3/MinIO)
```

### Performance Optimization

```bash
# Database scaling:
- Connection pooling (Prisma built-in)
- Read replicas untuk analytics
- Database indexing optimization
- Query performance monitoring

# Application scaling:
- CDN untuk static assets
- Redis untuk caching
- Queue system untuk heavy processing
- Monitoring dan alerting
```

### Cost Optimization

```bash
# Resource management:
- Container resource limits
- Database size monitoring
- Image optimization
- Unused data cleanup
- Backup retention policies
```

---

## 🎉 Success!

Sekarang aplikasi Anda running di Coolify dengan:

- ✅ **Multi-user database system**
- ✅ **Scalable authentication**
- ✅ **Analytics dan monitoring**
- ✅ **Professional image processing**
- ✅ **AI-powered copy generation**
- ✅ **Enterprise-ready features**

**🚀 Ready untuk production traffic dengan unlimited scalability!**
