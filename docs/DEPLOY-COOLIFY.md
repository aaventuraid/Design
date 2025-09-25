# 🚀 Deploy ke Coolify v4 — Panduan Resmi (2025)

Panduan tunggal, ringkas, dan akurat untuk deploy aplikasi ini ke Coolify v4. Fokus: variabel environment yang benar, koneksi database, seeding, healthcheck, dan update otomatis via webhook.

---

## ✅ Prasyarat

- Coolify v4 sudah berjalan di server Anda (dengan domain/SSL siap pakai)
- Repository GitHub publik/privat terhubung ke Coolify
- Layanan database PostgreSQL (bisa dari Coolify Service atau eksternal)

---

## 🔐 Environment Variables (Minimal Wajib)

Set ini di Coolify → Application → Environment.

- DATABASE_URL: postgresql://USER:PASSWORD@HOST:5432/DB?schema=public
- JWT_SECRET: string rahasia panjang untuk JWT
- GEMINI_API_KEY: optional, atau isi via Admin Panel setelah deploy
- NODE_ENV: production
- PORT: 3000
- HOSTNAME: 0.0.0.0

Catatan:

- Aplikasi ini menerapkan Database-first untuk settings. Jika GEMINI_API_KEY tidak di-set sebagai env, Anda bisa mengisinya dari Admin Panel setelah deploy.
- Tidak ada NextAuth di project ini; gunakan JWT_SECRET untuk auth internal.

---

## 🐘 Database PostgreSQL

Prisma datasource: postgresql (lihat `prisma/schema.prisma`). Pastikan `DATABASE_URL` valid dan dapat diakses dari container aplikasi.

Contoh DATABASE_URL:

- postgresql://yuki:supersecret@postgres:5432/yuki_db?schema=public

---

## 🧱 Build & Runtime (Dockerfile sudah siap Coolify)

Container saat start akan menjalankan:

- npx prisma migrate deploy
- npx prisma db seed (idempotent; hanya membuat admin default jika kosong)
- Menjalankan Next.js standalone server (server.js)

Healthcheck: GET /api/health (otomatis dipanggil oleh Dockerfile)

---

## 🚦 Verifikasi Koneksi Database & Seeding

1. Cek Health API:

- Buka https://<domain-anda>/api/health → harus status 200 setelah ~10 detik initial startup

2. Cek Log Deploy di Coolify:

- Pastikan ada log:
  - "[COOLIFY] Running database migrations..."
  - "[COOLIFY] Running database seed (if needed)..."
  - "🎉 Seeding completed!" atau pesan skip jika user sudah ada

3. Uji Koneksi DB dari Container (opsional):

- Jalankan script di container: scripts/debug-coolify.sh
  - Output akan menampilkan "✅ Database connection successful" jika koneksi OK

4. Validasi Admin Default:

- Login ke /admin dengan:
  - Email: admin@localhost
  - Password: admin123
- Segera ganti kredensial di Admin Panel setelah berhasil login.

---

## 🔁 Update Otomatis via GitHub Actions (opsional)

Workflow ada di `.github/workflows/deploy-coolify.yml` yang memanggil webhook Coolify.

Langkah:

1. Buat secret repo: COOLIFY_WEBHOOK_URL → dari Coolify (Application → Webhook)
2. Setiap push ke branch main akan trigger deploy; bisa juga manual via workflow_dispatch.

Payload branch ditentukan otomatis, tidak perlu checkout source di workflow.

---

## 🧪 Troubleshooting Cepat

- 502/starting terus: tunggu >60 detik; healthcheck butuh waktu selama warmup dan migrasi.
- Gagal konek DB:
  - Cek `DATABASE_URL` (host, port, db, user, password)
  - Pastikan network container Coolify bisa reach database service
  - Jalankan scripts/debug-coolify.sh di container untuk test `$connect()`
- Seed tidak jalan:
  - Seed hanya membuat admin jika tidak ada user sama sekali
  - Cek log "Database already has N user(s), skipping admin creation"
- AI key kosong:
  - Isi GEMINI_API_KEY via Admin Panel atau set env di Coolify

---

## 📋 Ringkasan Variabel Penting

- DATABASE_URL: wajib
- JWT_SECRET: wajib
- GEMINI_API_KEY: disarankan (atau lewat Admin Panel)
- NODE_ENV=production, PORT=3000, HOSTNAME=0.0.0.0

---

## 🔐 Keamanan

- Jangan commit API key ke repo
- Gunakan Coolify Env untuk semua rahasia
- Ganti password admin default setelah login pertama

---

Terakhir diperbarui: September 2025
Referensi file: `Dockerfile`, `prisma/schema.prisma`, `prisma/seed.ts`, `lib/database.ts`
