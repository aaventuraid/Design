# 🚀 Deploy ke Coolify: Panduan Praktis untuk Pemula

**Panduan sederhana deploy aplikasi Next.js ke Coolify self-hosted dalam langkah mudah.**

---

## ⚡ Langkah Cepat (TL;DR)

1. **Push kode ke GitHub** → 2. **Buat aplikasi di Coolify** → 3. **Set environment variables** → 4. **Deploy!**

---

## 🎯 Yang Anda Butuhkan

- ✅ Server dengan Coolify sudah terinstall
- ✅ Repository GitHub (public atau private)
- ✅ Domain yang sudah pointing ke server Coolify
- ✅ API key Gemini dari Google AI Studio

---

## 📋 Langkah 1: Persiapan Kode

### 1.1 Pastikan File Penting Ada

Cek apakah file ini sudah ada di repository:

```
✅ Dockerfile (sudah ada)
✅ package.json (sudah ada)
✅ prisma/schema.prisma (sudah ada)
```

### 1.2 Push ke GitHub

```bash
# Di folder project
git add .
git commit -m "ready for production deploy"
git push origin main
```

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
GEMINI_API_KEY=your_gemini_api_key_here
NEXTAUTH_SECRET=random_string_minimal_32_karakter
NEXTAUTH_URL=https://domain-anda.com
NODE_ENV=production
```

**Variables opsional:**

```
INITIAL_ADMIN_EMAIL=admin@domain-anda.com
INITIAL_ADMIN_PASSWORD=AdminPassword123!
```

### 4.2 Cara Dapat API Key Gemini

1. Buka [Google AI Studio](https://aistudio.google.com/)
2. Login dengan akun Google
3. Klik **"Get API Key"**
4. Klik **"Create API Key"**
5. Copy API key yang dihasilkan

### 4.3 Generate NEXTAUTH_SECRET

```bash
# Di terminal/command prompt
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Copy hasilnya ke `NEXTAUTH_SECRET`

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

### 7.3 Test Admin Panel

1. Buka: `https://domain-anda.com/admin`
2. Login dengan `INITIAL_ADMIN_EMAIL` dan `INITIAL_ADMIN_PASSWORD`
3. Harus bisa masuk ke dashboard admin

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

1. Cek GEMINI_API_KEY valid
2. Cek NEXTAUTH_SECRET ada (min 32 karakter)
3. Lihat logs aplikasi di Coolify

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
- [ ] Features utama berjalan normal

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
