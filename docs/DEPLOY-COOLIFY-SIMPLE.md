# 🚀 Deploy ke Coolify v4: Panduan Lengkap & Troubleshooting

**Panduan deploy Next.js + Prisma ke Coolify v4 dengan optimasi khusus untuk environment production.**

---

## ⚡ Quick Fix untuk Error Deployment

### 🔧 **Perbaikan yang Sudah Diterapkan:**

1. ✅ **Docker optimization** - Multi-stage build dengan Alpine Linux
2. ✅ **Health check endpoint** - `/api/health` dengan database validation
3. ✅ **Standalone mode** - Next.js output dioptimasi untuk production
4. ✅ **Prisma optimization** - Client generation dan migration handling
5. ✅ **Environment validation** - Automatic validation untuk environment variables
6. ✅ **Error handling** - Graceful failure dengan proper logging

---

## 🎯 Yang Anda Butuhkan

- ✅ Server dengan Coolify v4 sudah terinstall
- ✅ Repository GitHub (public atau private)
- ✅ PostgreSQL database service di Coolify
- ✅ Domain yang sudah pointing ke server Coolify
- ✅ API key Gemini dari Google AI Studio

---

## 📋 **Langkah 1: Setup Database di Coolify**

### 1.1 Buat PostgreSQL Service

1. **Login ke Coolify Dashboard**
2. **Create New Service** → **Database** → **PostgreSQL**
3. **Configuration:**
   ```
   Service Name: design-db
   PostgreSQL Version: 15
   Database Name: designDB
   Username: designDB
   Password: [Generate Strong Password]
   ```
4. **Deploy database** dan tunggu hingga status **Running**
5. **Copy Database URL** dari service detail

### 1.2 Verifikasi Database Connection

Test connection via Coolify terminal:

```bash
psql $DATABASE_URL -c "SELECT version();"
```

---

## 📋 **Langkah 2: Deploy Aplikasi**

### 2.1 Create Application di Coolify

1. **New Application** → **Docker Compose**
2. **Repository Settings:**
   ```
   Repository: https://github.com/aaventuraid/Design
   Branch: main
   Build Pack: Docker Compose
   ```

### 2.2 Environment Variables (CRITICAL)

Set environment variables berikut di Coolify:

```bash
# Database (Required)
DATABASE_URL=postgres://designDB:YOUR_PASSWORD@SERVICE_NAME:5432/designDB

# Authentication & Security (Required)
NEXTAUTH_SECRET=your-super-secret-jwt-key-minimum-32-characters
NEXTAUTH_URL=https://your-domain.com

# Optional Settings
IMAGE_BG_PROVIDER=internal
```

### 📝 **AI Configuration**

❌ **TIDAK PERLU** `GEMINI_API_KEY` di environment variables!

✅ **Set melalui Admin Panel** setelah deployment:

1. Login ke aplikasi dengan `admin@localhost` / `admin123`
2. Masuk ke **Admin Panel**
3. Set **Gemini API Key** di bagian **AI Configuration**
4. Save dan test AI features

### 2.3 Domain Configuration

1. **Set Domain** di application settings
2. **SSL Certificate** - Enable automatic SSL
3. **Redirect** - Enable HTTPS redirect

---

## 🐛 **Troubleshooting Guide**

### Issue 1: Build Failed - Dependencies

**Symptom:** npm install fails atau timeout  
**Solution:**

```bash
# Check di Coolify logs, jika ada timeout, rebuild dengan:
# Clear cache dan rebuild
```

### Issue 2: Database Connection Error

**Symptom:** `Cannot connect to database`
**Diagnosis:**

```bash
# Test via health endpoint
curl https://your-domain.com/api/health

# Check response: database.status should be "connected"
```

**Solution:**

1. Verify `DATABASE_URL` format exactly matches:
   ```
   postgres://username:password@service_name:5432/database_name
   ```
2. Ensure database service is running
3. Check network connectivity between services

### Issue 3: Application Starts but 500 Errors

**Symptom:** Container runs but API returns errors
**Diagnosis:**

```bash
# Use debug script
docker exec CONTAINER_ID /app/scripts/debug-coolify.sh
```

**Common causes:**

- Missing `NEXTAUTH_SECRET`
- Invalid `GEMINI_API_KEY`
- Prisma client not generated
- File permission issues

### Issue 4: Health Check Fails

**Symptom:** Container restarts frequently
**Solution:**

1. Check health endpoint manually:
   ```bash
   wget -O- http://localhost:3000/api/health
   ```
2. Verify response contains `"ok": true`
3. Check database connectivity within container

### Issue 5: Static Files Not Loading

**Symptom:** Pages load but no CSS/JS
**Solution:**

1. Verify `output: 'standalone'` in `next.config.mjs`
2. Check static files copied correctly:
   ```bash
   ls -la .next/static/
   ```

---

## 🔍 **Debug Commands untuk Coolify**

### Check Application Status

```bash
# Health check
curl https://your-domain.com/api/health | jq

# Detailed debug info (dalam container)
./scripts/debug-coolify.sh

# Database connection test
node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.\$connect().then(() => console.log('DB OK')).catch(console.error);
"
```

### Check Logs

```bash
# Application logs di Coolify dashboard
# Atau via terminal:
docker logs CONTAINER_ID --tail=100
```

### Performance Check

```bash
# Memory usage
free -m

# Disk space
df -h

# Process check
ps aux | grep node
```

---

## ✅ **Verification Checklist**

Setelah deployment, verify:

- [ ] **Database connected** - Health endpoint shows `database.status: "connected"`
- [ ] **Admin login works** - Can login dengan INITIAL_ADMIN_EMAIL
- [ ] **Copy generation works** - Test generate copy dengan Gemini
- [ ] **File upload works** - Test image upload functionality
- [ ] **SSL certificate** - HTTPS working correctly
- [ ] **Performance** - Response time < 3s untuk health check

---

## 🎯 **Post-Deployment Setup**

### 1. Admin Configuration

1. Login dengan `INITIAL_ADMIN_EMAIL`
2. Go to `/admin` page
3. Configure Gemini API key jika belum di environment
4. Test copy generation functionality

### 2. Monitoring Setup

- **Health monitoring** - Monitor `/api/health` endpoint
- **Error tracking** - Check Coolify logs regularly
- **Performance** - Monitor response times
- **Database** - Monitor database performance

### 3. Backup Strategy

```bash
# Database backup (setup cron job)
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql

# File backup (data directory)
tar -czf data_backup_$(date +%Y%m%d).tar.gz /app/data
```

---

## � **Performance Optimization**

### 1. Application Level

- **Caching** - Implement Redis untuk session storage
- **CDN** - Use Cloudinary atau similar untuk images
- **Compression** - Enable gzip compression

### 2. Database Level

- **Connection pooling** - Configure Prisma connection pool
- **Indexing** - Add database indexes untuk frequent queries
- **Monitoring** - Setup database performance monitoring

### 3. Infrastructure Level

- **Resource limits** - Set appropriate CPU/memory limits
- **Health checks** - Fine-tune health check intervals
- **Load balancing** - Setup multiple instances jika perlu

---

## 📞 **Support & Debugging**

### Error Reporting

Jika masih ada issues setelah mengikuti guide ini:

1. **Jalankan debug script:**

   ```bash
   ./scripts/debug-coolify.sh > debug_output.txt
   ```

2. **Check health endpoint:**

   ```bash
   curl https://your-domain.com/api/health | jq > health_check.json
   ```

3. **Collect logs:**
   - Coolify deployment logs
   - Application runtime logs
   - Database connection logs

### Ready untuk Production! 🎉

Dengan setup ini, aplikasi seharusnya berjalan stabil di Coolify v4 dengan:

- ✅ Automatic health monitoring
- ✅ Database connection resilience
- ✅ Proper error handling
- ✅ Performance optimization
- ✅ Security best practices

---

## 🔄 **Update & Maintenance**

### Rolling Updates

```bash
# Deploy update (via Coolify UI atau webhook)
# Health check akan memverifikasi deployment berhasil
# Rollback otomatis jika health check fail
```

### Database Migrations

```bash
# Migrations run automatically saat container start
# Monitor logs untuk memastikan migration berhasil
```

Aplikasi sekarang siap untuk production workload! 🚀
✅ prisma/schema.prisma (sudah ada)

````

### 1.2 Push ke GitHub

```bash
# Di folder project
git add .
git commit -m "ready for production deploy"
git push origin main
````

**Selesai!** Kode sudah siap.

---

## 🐳 Langkah 2: Buat Aplikasi di Coolify

### 2.1 Login ke Coolify Dashboard

1. Buka browser → `https://coolify-anda.com`
2. Login dengan akun admin Coolify

### 2.2 Buat Project Baru

1. Klik **"+ New"**
2. Pilih **"Project"**
3. Nama project: `yuki-yaki-production`
4. Klik **"Continue"**

### 2.3 Tambah Aplikasi

1. Dalam project, klik **"+ New Resource"**
2. Pilih **"Application"**
3. Pilih **"Public Repository"** (atau Private jika repo private)

### 2.4 Konfigurasi Repository

**Isi form ini:**

```
Repository URL: https://github.com/username/repo-name
Branch: main
```

**Build Settings:**

```
Build Pack: Docker
Port: 3000
```

**Klik "Save"**

---

## 🗄 Langkah 3: Setup Database

### 3.1 Tambah Database

1. Di project yang sama, klik **"+ New Resource"**
2. Pilih **"Database"**
3. Pilih **"PostgreSQL"** (recommended) atau **"SQLite"** (simple)

### 3.2 Konfigurasi Database

**PostgreSQL Settings:**

```
Name: yuki-yaki-db
Version: 15 (default)
Database Name: yuki_yaki_prod
Username: yuki_admin
Password: [buat password kuat]
```

**Klik "Deploy"**

### 3.3 Catat Connection String

Setelah database running, copy **DATABASE_URL**:

```
postgresql://yuki_admin:password@yuki-yaki-db:5432/yuki_yaki_prod
```

---

## 🔐 Langkah 4: Environment Variables

### 4.1 Set Variables di Aplikasi

1. Ke aplikasi Anda di Coolify
2. Tab **"Environment Variables"**
3. Tambah variable satu per satu:

**Variables yang WAJIB:**

```
DATABASE_URL=postgresql://yuki_admin:password@yuki-yaki-db:5432/yuki_yaki_prod
NEXTAUTH_SECRET=K8mJ9vN2pQ4rS7wX1aB6cE9fH3kL8mP5qR7tU0vY2zA4bC6dF9gH1jK3mN6pQ8sT
NEXTAUTH_URL=https://design.yukiyaki.id
NODE_ENV=production
```

**⚠️ DEPRECATION NOTICE:**

```
# DEPRECATED - No longer needed as environment variables:
# GEMINI_API_KEY=... # Set via Admin Panel
# ADMIN credentials   # Auto-created: admin@localhost/admin123
```

**Optional untuk development:**

```
CREATE_DEMO_USER=true
DEMO_USER_PASSWORD=premium123
```

### 📝 **ADMIN USER SETUP (Otomatis)**

❌ **TIDAK PERLU** environment variables untuk admin setup!

✅ **Admin default** akan dibuat otomatis saat deployment pertama:

- 📧 **Email**: `admin@localhost`
- 🔑 **Password**: `admin123`

⚠️ **PENTING**: Segera login dan ganti email + password setelah deployment!

### 4.2 Generate NEXTAUTH_SECRET

```bash
# Di terminal/command prompt
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Copy hasilnya ke `NEXTAUTH_SECRET`

**Catatan:** Gemini API key akan diatur nanti melalui admin panel, bukan di environment variables.

---

## 🌐 Langkah 5: Setup Domain

### 5.1 Tambah Domain

1. Di aplikasi Coolify, tab **"Domains"**
2. Klik **"+ Add"**
3. Masukkan domain: `domain-anda.com`
4. Enable **"Generate SSL"**
5. Klik **"Save"**

### 5.2 Setting DNS

Di provider domain Anda (Cloudflare, Namecheap, dll):

```
Type: A
Name: @ (atau subdomain)
Value: [IP address server Coolify]
TTL: 300 (atau Auto)
```

**Tunggu 5-15 menit** untuk propagasi DNS.

---

## 🚀 Langkah 6: Deploy!

### 6.1 Deploy Aplikasi

1. Di aplikasi Coolify, klik **"Deploy"**
2. Monitor logs di tab **"Deployments"**
3. Tunggu sampai status **"Running"** (5-10 menit)

### 6.2 Cek Build Logs

Jika ada error, lihat di **"Deployment Logs"**:

**Log yang Normal:**

```
✅ Building Docker image
✅ Installing dependencies
✅ Building Next.js app
✅ Starting server
✅ Health check passed
```

**Jika Error:**

- Cek environment variables
- Pastikan DATABASE_URL benar
- Cek API key Gemini valid

---

## ✅ Langkah 7: Verifikasi

### 7.1 Test Website

1. Buka `https://domain-anda.com`
2. Website harus loading normal
3. Test upload gambar
4. Test generate copy

### 7.2 Test API Health

Buka: `https://domain-anda.com/api/health`

**Response yang benar:**

```json
{
  "ok": true,
  "version": "0.1.0",
  "hasGeminiKey": true,
  "serverTime": "2025-09-24T..."
}
```

### 7.3 Setup Admin Panel & Gemini API

1. Buka: `https://domain-anda.com/admin`
2. Login dengan `INITIAL_ADMIN_EMAIL` dan `INITIAL_ADMIN_PASSWORD`
3. Harus bisa masuk ke dashboard admin
4. **Setup Gemini API Key:**
   - Buka [Google AI Studio](https://aistudio.google.com/)
   - Login dengan akun Google
   - Klik "Get API Key" → "Create API Key"
   - Copy API key yang dihasilkan
   - Kembali ke admin panel aplikasi
   - Di section "AI Settings", masukkan Gemini API key
   - Klik "Save Settings"
   - Test generate copy untuk memastikan API berfungsi

---

## 🆘 Troubleshooting Cepat

### ❌ Website Tidak Bisa Diakses

**Solusi:**

1. Cek DNS sudah propagasi: `nslookup domain-anda.com`
2. Cek status aplikasi di Coolify: harus "Running"
3. Cek domain settings di Coolify

### ❌ Build Error

**Solusi:**

1. Cek environment variables lengkap
2. Cek DATABASE_URL format benar
3. Restart build: klik "Redeploy"

### ❌ Database Connection Error

**Solusi:**

1. Pastikan database status "Running"
2. Cek DATABASE_URL sesuai dengan database yang dibuat
3. Format: `postgresql://user:pass@db-name:5432/dbname`

### ❌ API Error (500)

**Solusi:**

1. Cek Gemini API key sudah diset di admin panel
2. Cek NEXTAUTH_SECRET ada (min 32 karakter)
3. Lihat logs aplikasi di Coolify
4. Test Gemini API key di admin settings

### ❌ SSL Error

**Solusi:**

1. Tunggu 15 menit untuk SSL generation
2. Cek domain pointing benar ke IP server
3. Di Coolify, regenerate SSL certificate

---

## 🔄 Update Aplikasi

Untuk update di masa depan:

1. **Update kode** di GitHub
2. **Push** perubahan
3. Di Coolify, klik **"Redeploy"**
4. Tunggu build selesai

**Otomatis!** Coolify akan pull kode terbaru dan deploy.

---

## 📋 Checklist Deployment

**Sebelum Deploy:**

- [ ] Kode sudah di GitHub
- [ ] File Dockerfile ada
- [ ] Environment variables sudah disiapkan
- [ ] Domain sudah pointing ke server

**Saat Deploy:**

- [ ] Database dibuat dan running
- [ ] Aplikasi terkonfigurasi benar
- [ ] Environment variables diset
- [ ] Domain dan SSL dikonfigurasi

**Setelah Deploy:**

- [ ] Website bisa diakses
- [ ] API health returns OK
- [ ] Database terkoneksi
- [ ] Admin panel berfungsi
- [ ] Gemini API key diset di admin panel
- [ ] Test generate copy berfungsi
- [ ] Test upload gambar berfungsi

---

## 🎉 Selamat!

Aplikasi Anda sudah **LIVE di production**!

**URL Penting:**

- Website: `https://domain-anda.com`
- Admin: `https://domain-anda.com/admin`
- API Health: `https://domain-anda.com/api/health`

**Tips Maintenance:**

- Monitor aplikasi via Coolify dashboard
- Backup database secara berkala
- Update dependencies secara rutin
- Monitor resource usage server

---

## 📞 Bantuan

**Jika masih ada masalah:**

1. **Cek logs** di Coolify dashboard
2. **Restart** aplikasi di Coolify
3. **Redeploy** jika perlu
4. **Kontak** admin server Coolify

**Remember:** Coolify adalah **self-hosted**, jadi maintenance server adalah tanggung jawab Anda atau tim DevOps.

---

**🚀 Happy Deploying!**
