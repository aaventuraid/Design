# Panduan Deploy Yuki Yaki Corner di Coolify v4

Dokumentasi lengkap untuk instalasi dan konfigurasi aplikasi Yuki Yaki Corner (Next.js 15) di Coolify v4 dengan PostgreSQL database.

## 📋 Daftar Isi

1. [Prasyarat](#prasyarat)
2. [Persiapan Environment](#persiapan-environment)
3. [Setup Database PostgreSQL](#setup-database-postgresql)
4. [Konfigurasi Coolify](#konfigurasi-coolify)
5. [Deployment Process](#deployment-process)
6. [Post-Deployment Setup](#post-deployment-setup)
7. [Monitoring & Maintenance](#monitoring--maintenance)
8. [Troubleshooting](#troubleshooting)

## 🔧 Prasyarat

### Server Requirements

- **OS**: Ubuntu 20.04+ atau Debian 11+
- **RAM**: Minimum 2GB, Recommended 4GB+
- **Storage**: Minimum 20GB SSD
- **CPU**: 2 vCPU minimum
- **Network**: Port 80, 443, 8080 (Coolify), 5432 (PostgreSQL)

### Software Prerequisites

```bash
# Update sistem
sudo apt update && sudo apt upgrade -y

# Install Docker & Docker Compose
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
sudo systemctl enable docker
sudo systemctl start docker

# Install Coolify v4
curl -fsSL https://cdn.coolify.io/install.sh | bash
```

### Domain & DNS Setup

- Domain yang sudah dikonfigurasi (contoh: `app.yourdomain.com`)
- SSL Certificate (Coolify bisa auto-generate via Let's Encrypt)
- DNS A Record pointing ke server IP

## 🌍 Persiapan Environment

### 1. Environment Variables Required

Konfigurasi environment variables ini melalui **Coolify Panel** (bukan file `.env`):

```bash
# === DATABASE CONFIGURATION ===
DATABASE_URL=postgres://designDB:keoYPvVy5FgC9v7isPycTjbTMHTMOqBSv7FHuCzMzpamHP9QDvutlm2nQDT2PZMN@sw8cgooww404sgkswgswg08o:5432/designDB

# === AUTHENTICATION & SECURITY ===
NEXTAUTH_SECRET=w3p/GGNL9lg2qKEoiQIQuq7kqWuUXxEUEFPvgYJCWrU=
JWT_SECRET=S0UDaqKj5oH1OcEz4RcjqyR5dGgWt55sQqft/MdNjfk=
NEXTAUTH_URL=https://your-domain.com

# === APPLICATION SETTINGS ===
NODE_ENV=production
```

**⚠️ PENTING**:

- **Semua environment variables** dikonfigurasi manual melalui **Coolify Panel** → Application → Environment
- **Gemini API Key** dikonfigurasi melalui Admin Panel setelah deployment (bukan env variable)
- **Admin credentials** dibuat otomatis: `admin@localhost` / `admin123`
- **NEXTAUTH_URL** harus diubah sesuai domain Anda yang sebenarnya

### 2. Cara Konfigurasi di Coolify Panel

1. **Login ke Coolify Dashboard** → Pilih Application
2. **Environment Variables** → Add New Variable
3. **Copy-paste** setiap variable dari daftar di atas
4. **Save Configuration** dan restart application

**Catatan**: Gemini API key dikonfigurasi terpisah melalui Admin Panel setelah deployment berhasil.

## 🗄️ Setup Database PostgreSQL

### Option 1: PostgreSQL di Coolify (Recommended)

1. **Login ke Coolify Dashboard**
   - Akses `http://your-server-ip:8080`
   - Login dengan kredensial Coolify

2. **Create New Database**

   ```
   Services → Add New Service → Database → PostgreSQL
   ```

3. **Database Configuration**

   ```
   Name: yuki-yaki-db
   Version: 15 (recommended)
   Username: yukiyaki_user
   Password: [generate secure password]
   Database: yukiyaki_production
   Port: 5432
   ```

4. **Get Connection String**
   ```
   postgresql://yukiyaki_user:password@postgres-service:5432/yukiyaki_production?sslmode=require
   ```

### Option 2: External PostgreSQL

```sql
-- Create database dan user
CREATE DATABASE yukiyaki_production;
CREATE USER yukiyaki_user WITH ENCRYPTED PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE yukiyaki_production TO yukiyaki_user;

-- Grant schema permissions
\c yukiyaki_production
GRANT ALL ON SCHEMA public TO yukiyaki_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO yukiyaki_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO yukiyaki_user;
```

### Database Schema Migration

Setelah database setup, aplikasi akan otomatis menjalankan:

1. **Database Migration** - Membuat semua table yang diperlukan
2. **Database Seeding** - Setup data awal termasuk:
   - Default admin user (`admin@localhost` / `admin123`)
   - System settings default
   - Demo user (jika development mode)

**Database Schema Overview:**

- **Users**: Authentication, roles, preferences
- **Sessions**: User sessions management
- **ImageProcessing**: Image processing records
- **UsageRecord**: Usage analytics
- **ApiKey**: API key management
- **AuditLog**: System audit trails
- **SystemSettings**: App configuration (database-first approach)

**Proses Otomatis:**

```bash
# Yang terjadi saat first deployment:
1. npx prisma migrate deploy  # Create tables
2. npx prisma db seed        # Create default admin & settings
```

## ⚙️ Konfigurasi Coolify

### 1. Create New Project

1. **Login ke Coolify Dashboard**
2. **Create New Project**
   ```
   Projects → Add New → Enter Project Name: "Yuki Yaki Corner"
   ```

### 2. Add Git Repository

```
Source → Add New → Git Repository
Repository URL: https://github.com/your-username/your-repo.git
Branch: main
Build Pack: Docker
```

### 3. Application Configuration

#### Basic Settings

```
Name: yuki-yaki-corner
Port: 3000
Health Check Path: /api/health
Build Command: (leave empty - using Dockerfile)
Start Command: (leave empty - using Dockerfile)
```

#### Environment Variables

Konfigurasi manual di **Coolify Dashboard → Your App → Environment**:

```bash
DATABASE_URL=postgres://designDB:keoYPvVy5FgC9v7isPycTjbTMHTMOqBSv7FHuCzMzpamHP9QDvutlm2nQDT2PZMN@sw8cgooww404sgkswgswg08o:5432/designDB
NEXTAUTH_SECRET=w3p/GGNL9lg2qKEoiQIQuq7kqWuUXxEUEFPvgYJCWrU=
JWT_SECRET=S0UDaqKj5oH1OcEz4RcjqyR5dGgWt55sQqft/MdNjfk=
NEXTAUTH_URL=https://your-domain.com
NODE_ENV=production
```

**⚠️ CATATAN PENTING**:

- **Ubah NEXTAUTH_URL** sesuai domain Anda yang sebenarnya
- **Gemini API Key** dikonfigurasi melalui Admin Panel setelah deployment

#### Build Settings

```
Dockerfile Path: ./Dockerfile
Docker Context: .
Build Arguments: (optional)
SOURCE_COMMIT=${COOLIFY_COMMIT_SHA}
```

### 4. Domain & SSL Configuration

```
Domains → Add Domain
Domain: your-domain.com
SSL: Enable (Let's Encrypt Auto)
Redirect HTTP to HTTPS: Yes
```

### 5. Volume Mounts (Optional)

Untuk persistent storage:

```
Volumes → Add Volume
Source: /app/data
Destination: /var/coolify/data/yuki-yaki
```

## 🚀 Deployment Process

### 1. Pre-deployment Checklist

- [ ] Database PostgreSQL running
- [ ] All environment variables set
- [ ] Domain DNS configured
- [ ] SSL certificate ready
- [ ] Repository access configured

### 2. First Deployment

```bash
# Di Coolify Dashboard
1. Go to your application
2. Click "Deploy" button
3. Monitor build logs
4. Wait for deployment completion
```

### 3. Build Process Overview

Aplikasi menggunakan multi-stage Docker build:

```dockerfile
# Stage 1: Dependencies installation
# Stage 2: Application build
# Stage 3: Production runtime
```

**Build Time**: ~5-10 menit untuk first build, ~2-3 menit untuk subsequent builds

### 4. Health Check Verification

Setelah deployment, verifikasi:

```bash
# Health check endpoint
curl https://your-domain.com/api/health

# Expected response:
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "database": "connected",
  "version": "0.1.0"
}
```

## 🔧 Post-Deployment Setup

### 1. Database Migration & Seeding

Migration dan seeding berjalan otomatis saat first deployment. Verifikasi dengan:

```bash
# Check di Coolify application logs:
# ✅ "Migration completed successfully"
# ✅ "🌱 Seeding database..."
# ✅ "🔐 Creating default admin user..."
# ✅ "✅ Default admin user created: admin@localhost"
# ✅ "🎉 Seeding completed!"

# Atau connect ke database dan cek:
SELECT email, role FROM users WHERE role = 'ADMIN';
SELECT key, value FROM system_settings;
```

**Jika seeding gagal**, jalankan manual:

```bash
# Di container atau terminal Coolify
npx prisma db seed
```

### 2. Admin User Setup

Database seeding akan otomatis membuat admin user default saat pertama kali deploy:

```bash
# Access admin panel
https://your-domain.com/admin/login

# Login dengan default credentials:
Email: admin@localhost
Password: admin123
```

**⚠️ PENTING**:

- Credentials ini adalah **default** yang dibuat otomatis oleh sistem
- **WAJIB** mengubah email dan password setelah login pertama kali
- Gunakan Admin Panel untuk mengupdate credentials yang aman

### 3. Initial Configuration

1. **Admin Dashboard Setup (WAJIB)**
   - Login dengan default credentials (`admin@localhost` / `admin123`)
   - **Segera ubah email dan password admin** ke credentials yang aman
   - **Setup Gemini API Key** melalui Admin Settings panel
   - Konfigurasi sistem settings sesuai kebutuhan

2. **AI Service Configuration**
   - Di Admin Panel → Settings
   - Masukkan **Gemini API Key** yang valid
   - Test AI service dengan upload gambar
   - Verifikasi response generation berfungsi

3. **System Verification**
   - Test image processing workflow
   - Verify file storage dan permissions
   - Create test user account untuk memastikan registration berfungsi
   - Test user dashboard dan authentication flow

**Prioritas Keamanan:**

1. Ubah admin credentials ✅
2. Setup Gemini API key ✅
3. Test semua fitur ✅
4. Setup monitoring ✅

### 4. Gemini API Key Configuration (Database-First)

Sistem menggunakan **database-first approach** untuk konfigurasi AI:

#### Step-by-Step Setup:

1. **Login Admin Panel**: `https://your-domain.com/admin/login`
2. **Navigate ke Settings**: Klik tab "Settings"
3. **Input Gemini API Key**:
   ```
   Gemini API Key: [paste your API key here]
   AI Provider: Gemini (default)
   ```
4. **Save Configuration**: Settings tersimpan ke database `system_settings` table
5. **Test AI Function**: Upload gambar untuk test generation

#### Verification:

```bash
# Check di database apakah API key tersimpan:
SELECT key, LEFT(value, 10) || '...' as masked_value
FROM system_settings
WHERE key = 'geminiApiKey';

# Test endpoint AI:
curl -X POST https://your-domain.com/api/generate-copy \
  -H "Content-Type: application/json" \
  -d '{"prompt":"test","imageUrl":"https://example.com/test.jpg"}'
```

#### Fallback Mechanism:

```
Priority Order:
1. Database (system_settings.geminiApiKey) - PRIMARY
2. File (.data/settings.json) - FALLBACK
3. Environment (GEMINI_API_KEY) - EMERGENCY FALLBACK
```

### 5. Backup Strategy Setup

```bash
# PostgreSQL backup script
#!/bin/bash
pg_dump $DATABASE_URL > backup-$(date +%Y%m%d-%H%M%S).sql

# Schedule in crontab
0 2 * * * /path/to/backup-script.sh
```

## 📊 Monitoring & Maintenance

### 1. Coolify Built-in Monitoring

- **Resource Usage**: CPU, Memory, Disk
- **Application Logs**: Real-time log streaming
- **Health Checks**: Automated endpoint monitoring
- **Deployment History**: Track all deployments

### 2. Application-Level Monitoring

#### Performance Metrics

```javascript
// Built-in analytics endpoint
GET / api / analytics;
```

#### Log Monitoring

```bash
# Access logs via Coolify
# Or check specific log files:
/var/log/coolify/applications/yuki-yaki-corner/
```

### 3. Database Monitoring

```sql
-- Check database performance
SELECT datname, numbackends, xact_commit, xact_rollback
FROM pg_stat_database
WHERE datname = 'yukiyaki_production';

-- Monitor table sizes
SELECT schemaname,tablename,attname,n_distinct,correlation
FROM pg_stats
WHERE schemaname = 'public';
```

### 4. Automated Updates

```yaml
# Update strategy in Coolify
Auto-deploy: Yes
Branch: main
Build on push: Yes
Health check after deploy: Yes
Rollback on failure: Yes
```

## 🐛 Troubleshooting

### Common Issues & Solutions

#### 1. Database Connection Failed

**Symptoms:**

```
Error: Can't reach database server at `postgres-service`:`5432`
```

**Solutions:**

```bash
# Check database service status
docker ps | grep postgres

# Verify connection string format
postgresql://user:password@host:port/database?sslmode=require

# Test connection manually
pg_isready -h hostname -p 5432 -U username
```

#### 2. Build Failed - Dependencies

**Symptoms:**

```
npm ERR! peer dep missing: react@^18.0.0
```

**Solutions:**

```dockerfile
# In Dockerfile, ensure proper dependency installation
RUN npm ci --omit=dev --ignore-scripts
RUN npm install --save effect@^3.9.2 fast-check@^4.3.0
```

#### 3. SSL Certificate Issues

**Symptoms:**

```
SSL_CONNECT_ERROR or certificate validation failed
```

**Solutions:**

```bash
# Regenerate SSL certificate in Coolify
# Or check domain DNS configuration
dig your-domain.com

# Verify Let's Encrypt renewal
certbot renew --dry-run
```

#### 4. Memory Issues

**Symptoms:**

```
FATAL ERROR: Ineffective mark-compacts near heap limit
```

**Solutions:**

```bash
# Increase Node.js memory limit
NODE_OPTIONS="--max-old-space-size=2048"

# Or upgrade server resources in Coolify
```

#### 5. File Permission Issues

**Symptoms:**

```
EACCES: permission denied, open '/app/data/file.json'
```

**Solutions:**

```dockerfile
# In Dockerfile, ensure proper permissions
RUN mkdir -p /app/data && chown -R node:node /app/data
USER node
```

#### 6. Admin Login Issues

**Symptoms:**

```
Invalid credentials atau admin not found
```

**Solutions:**

```bash
# Check if admin user exists in database:
docker exec -it coolify-app-container npx prisma db seed

# Or manually create admin user:
docker exec -it coolify-postgres-container psql -U yukiyaki_user -d yukiyaki_production
# Then run:
SELECT email, role FROM users WHERE role = 'ADMIN';
```

#### 7. Gemini API Key Issues

**Symptoms:**

```
AI generation failed atau API key not configured
```

**Solutions:**

```bash
# Check if API key is set in database:
SELECT key, LENGTH(value) as key_length
FROM system_settings
WHERE key = 'geminiApiKey';

# If empty, set via Admin Panel or directly:
UPDATE system_settings
SET value = 'your-api-key-here'
WHERE key = 'geminiApiKey';
```

### Debug Commands

```bash
# Check application logs
docker logs coolify-app-container

# Check database logs
docker logs coolify-postgres-container

# Enter container for debugging
docker exec -it coolify-app-container sh

# Check environment variables
docker exec coolify-app-container printenv

# Test database connection from container
docker exec -it coolify-app-container npx prisma db push
```

### Performance Tuning

#### Database Optimization

```sql
-- Create indexes for better performance
CREATE INDEX CONCURRENTLY idx_users_email ON users(email);
CREATE INDEX CONCURRENTLY idx_sessions_token ON sessions(token);
CREATE INDEX CONCURRENTLY idx_processing_status ON image_processing(status);
```

#### Application Optimization

```javascript
// Enable caching for static assets
// In next.config.mjs
const nextConfig = {
  experimental: {
    optimizeCss: true,
  },
  compress: true,
  poweredByHeader: false,
};
```

## 🔐 Security Best Practices

### 1. Environment Security

- Gunakan strong passwords (minimum 32 characters)
- Enable 2FA untuk Coolify admin
- Regular security updates

### 2. Database Security

```sql
-- Restrict database permissions
REVOKE ALL ON SCHEMA public FROM PUBLIC;
GRANT USAGE ON SCHEMA public TO yukiyaki_user;
```

### 3. Application Security

- HTTPS only (redirect HTTP)
- Security headers configured
- Input validation & sanitization
- Rate limiting enabled

### 4. Backup & Recovery

```bash
# Automated daily backups
#!/bin/bash
DATE=$(date +%Y%m%d-%H%M%S)
pg_dump $DATABASE_URL > /backup/yuki-yaki-$DATE.sql
aws s3 cp /backup/yuki-yaki-$DATE.sql s3://your-backup-bucket/
```

## � Quick Reference

### Environment Variables Summary

**✅ REQUIRED Environment Variables:**

```bash
DATABASE_URL=postgres://designDB:keoYPvVy5FgC9v7isPycTjbTMHTMOqBSv7FHuCzMzpamHP9QDvutlm2nQDT2PZMN@sw8cgooww404sgkswgswg08o:5432/designDB
NEXTAUTH_SECRET=w3p/GGNL9lg2qKEoiQIQuq7kqWuUXxEUEFPvgYJCWrU=
JWT_SECRET=S0UDaqKj5oH1OcEz4RcjqyR5dGgWt55sQqft/MdNjfk=
NEXTAUTH_URL=https://your-domain.com
NODE_ENV=production
```

**📝 CATATAN:**

- **Semua konfigurasi** melalui Coolify Panel → Environment Variables
- **Gemini API Key** dikonfigurasi via Admin Panel (bukan env variable)
- **Admin user** auto-created: `admin@localhost` / `admin123`

### Default Credentials

**Admin Access:**

```
URL: https://your-domain.com/admin/login
Email: admin@localhost
Password: admin123
⚠️ Change immediately after first login!
```

### Configuration Priority

**Gemini API Key:**

```
1. Database (system_settings) ← PRIMARY
2. File (.data/settings.json) ← Fallback
3. Environment (GEMINI_API_KEY) ← Emergency
```

## �📚 Additional Resources

### Useful Commands

```bash
# Restart application
curl -X POST https://coolify-api/restart

# Scale application
curl -X POST https://coolify-api/scale -d '{"replicas": 2}'

# View real-time logs
curl -s https://coolify-api/logs/stream
```

### Documentation Links

- [Coolify v4 Documentation](https://coolify.io/docs)
- [Next.js 15 Deployment Guide](https://nextjs.org/docs/deployment)
- [Prisma Production Guide](https://www.prisma.io/docs/guides/deployment)
- [PostgreSQL Tuning](https://pgtune.leopard.in.ua/)

### Support

- **Project Issues**: [GitHub Issues](https://github.com/your-repo/issues)
- **Coolify Support**: [Coolify Discord](https://discord.gg/coolify)
- **Documentation**: `/docs` folder in repository

---

## 📝 Update Log

| Date       | Version | Changes                                                                |
| ---------- | ------- | ---------------------------------------------------------------------- |
| 2024-12-25 | 1.0.0   | Initial comprehensive documentation                                    |
| 2024-12-25 | 1.0.1   | Added troubleshooting section                                          |
| 2024-12-25 | 1.0.2   | Enhanced security best practices                                       |
| 2024-12-25 | 1.1.0   | **MAJOR UPDATE**: Database-first architecture                          |
|            |         | - Removed GEMINI_API_KEY, ADMIN_USERNAME, ADMIN_PASSWORD env vars      |
|            |         | - Added database seeding with default admin (admin@localhost/admin123) |
|            |         | - Gemini API key now configured via Admin Panel                        |
|            |         | - Added JWT_SECRET requirement                                         |
|            |         | - Updated all configuration workflows                                  |

---

**Catatan**: Dokumentasi ini dibuat berdasarkan struktur proyek terkini dengan Next.js 15, Prisma 6, dan PostgreSQL. Pastikan untuk selalu menggunakan versi terbaru dari dependencies dan mengikuti security best practices.
