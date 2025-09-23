# 📚 Panduan Deploy Yuki Yaki Corner ke Netlify

Panduan lengkap untuk mengunggah dan menjalankan aplikasi Yuki Yaki Corner di Netlify, ditujukan untuk pemula yang belum pernah menggunakan platform hosting sebelumnya.

## 📋 Apa itu Netlify?

Netlify adalah platform hosting gratis yang memungkinkan Anda mengunggah website/aplikasi web langsung dari kode sumber. Cocok untuk aplikasi Next.js seperti Yuki Yaki Corner.

**Keunggulan Netlify:**
- ✅ Gratis untuk penggunaan personal
- ✅ Deploy otomatis dari GitHub
- ✅ HTTPS gratis
- ✅ CDN global untuk performa cepat
- ✅ Environment variables untuk API keys

---

## 🚀 Langkah 1: Persiapan Akun

### 1.1 Buat Akun Netlify
1. Kunjungi [netlify.com](https://www.netlify.com)
2. Klik **"Sign up"**
3. Pilih **"GitHub"** untuk sign up (recommended)
4. Login dengan akun GitHub Anda
5. Authorize Netlify untuk mengakses GitHub

### 1.2 Persiapan Repository GitHub
Pastikan kode Yuki Yaki Corner sudah di-upload ke GitHub:

1. **Jika belum ada repository GitHub:**
   - Kunjungi [github.com](https://github.com)
   - Klik **"New repository"**
   - Nama repository: `yuki-yaki-corner`
   - Pilih **"Public"** atau **"Private"**
   - Klik **"Create repository"**

2. **Upload kode ke GitHub:**
   ```bash
   # Di folder project (D:\2AI)
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/USERNAME/yuki-yaki-corner.git
   git push -u origin main
   ```
   
   *Ganti `USERNAME` dengan username GitHub Anda*

---

## 🔧 Langkah 2: Deploy ke Netlify

### 2.1 Import Project
1. Login ke dashboard Netlify
2. Klik **"Add new site"** → **"Import an existing project"**
3. Pilih **"Deploy with GitHub"**
4. Cari dan pilih repository `yuki-yaki-corner`
5. Klik repository tersebut

### 2.2 Konfigurasi Build Settings
Netlify akan mendeteksi Next.js secara otomatis. Pastikan pengaturan berikut:

- **Branch to deploy:** `main` (atau `master`)
- **Build command:** `npm run build`
- **Publish directory:** `.next`
- **Functions directory:** `netlify/functions` (opsional)

### 2.3 Advanced Settings (Penting!)
Sebelum deploy, klik **"Show advanced"** dan tambahkan environment variables:

**Environment Variables yang Diperlukan:**
```
NODE_ENV = production
ADMIN_PASSWORD = password_admin_anda
GEMINI_API_KEY = gemini_key_anda (opsional)
GITHUB_MODELS_API_KEY = github_models_key_anda (opsional)
```

**Cara menambah environment variables:**
1. Klik **"New variable"**
2. Masukkan **Key** dan **Value**
3. Ulangi untuk setiap variable

### 2.4 Deploy
1. Klik **"Deploy site"**
2. Tunggu proses build (biasanya 2-5 menit)
3. Jika berhasil, Anda akan mendapat URL seperti `https://random-name-123.netlify.app`

---

## ⚙️ Langkah 3: Konfigurasi Lanjutan

### 3.1 Custom Domain (Opsional)
Jika punya domain sendiri:
1. Di dashboard Netlify → **"Domain settings"**
2. Klik **"Add custom domain"**
3. Masukkan domain Anda (contoh: `yukiyaki.com`)
4. Ikuti instruksi untuk mengatur DNS

### 3.2 Environment Variables Management
Untuk mengubah API keys nanti:
1. Dashboard Netlify → **"Site settings"**
2. **"Environment variables"**
3. Edit/tambah variables sesuai kebutuhan
4. **"Redeploy"** site setelah perubahan

### 3.3 Automatic Deployments
Setiap kali Anda push code baru ke GitHub, Netlify akan otomatis deploy ulang.

**Untuk disable auto-deploy:**
1. **"Site settings"** → **"Build & deploy"**
2. **"Continuous deployment"** → **"Edit settings"**
3. Matikan **"Auto publishing"**

---

## 🔍 Langkah 4: Testing & Troubleshooting

### 4.1 Test Aplikasi
Setelah deploy berhasil:
1. Buka URL Netlify Anda
2. Test upload gambar
3. Test generate AI copy
4. Test admin panel di `/admin`

### 4.2 Common Issues & Solutions

#### ❌ Build Failed
**Solusi:**
1. Cek **"Deploy logs"** di dashboard Netlify
2. Pastikan `package.json` memiliki semua dependencies
3. Pastikan tidak ada error di kode lokal

#### ❌ API Routes Not Working
**Solusi:**
1. Pastikan menggunakan Next.js App Router (bukan Pages Router)
2. Cek environment variables sudah benar
3. Netlify mendukung Serverless Functions untuk API routes

#### ❌ Images Not Loading
**Solusi:**
1. Pastikan gambar ada di folder `public/`
2. Gunakan relative paths (`/logo.svg` bukan `./logo.svg`)

#### ❌ Admin Panel 401 Unauthorized
**Solusi:**
1. Cek environment variable `ADMIN_PASSWORD` sudah di-set
2. Pastikan menggunakan password yang benar

### 4.3 Monitoring
Dashboard Netlify menyediakan:
- **Usage statistics** (bandwidth, build minutes)
- **Deploy history**
- **Error logs**
- **Performance metrics**

---

## 📈 Langkah 5: Optimization

### 5.1 Performance
Untuk performa lebih baik:
1. Enable **"Asset optimization"** di Netlify
2. Gunakan Next.js Image Optimization
3. Enable **"Pretty URLs"** untuk SEO

### 5.2 Security
1. Enable **"HTTPS redirect"**
2. Set **"Content Security Policy"** headers
3. Gunakan strong password untuk admin panel

### 5.3 Analytics (Opsional)
1. Enable **"Netlify Analytics"** (berbayar)
2. Atau integrasikan Google Analytics
3. Monitor usage dan performance

---

## 💡 Tips untuk Pemula

### ✅ Do's:
- Selalu test di local sebelum push ke GitHub
- Gunakan environment variables untuk API keys
- Backup konfigurasi penting
- Monitor usage agar tidak exceed limits gratis

### ❌ Don'ts:
- Jangan hardcode API keys di kode
- Jangan push file `.env` ke GitHub
- Jangan lupa update dependencies secara berkala

### 🆘 Butuh Bantuan?
- **Netlify Docs:** [docs.netlify.com](https://docs.netlify.com)
- **Community Forum:** [community.netlify.com](https://community.netlify.com)
- **Next.js on Netlify:** [docs.netlify.com/frameworks/next-js](https://docs.netlify.com/frameworks/next-js)

---

## 🎯 Checklist Deploy

- [ ] ✅ Akun Netlify sudah dibuat
- [ ] ✅ Repository GitHub sudah siap
- [ ] ✅ Environment variables sudah di-set
- [ ] ✅ Build berhasil tanpa error
- [ ] ✅ Aplikasi bisa diakses via URL Netlify
- [ ] ✅ Upload gambar berfungsi
- [ ] ✅ Admin panel bisa login
- [ ] ✅ AI copy generation bekerja (jika API keys sudah di-set)

**Selamat! Aplikasi Yuki Yaki Corner Anda sudah live di internet! 🎉**

---

*Panduan ini ditulis untuk Yuki Yaki Corner v0.1.0 - September 2025*