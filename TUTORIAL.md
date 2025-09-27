# Tutorial: Reset Database & Manual Seeding di Coolify

Panduan lengkap untuk menghapus data database dan melakukan seeding ulang melalui terminal Coolify.

## 📋 Prasyarat

- Akses ke dashboard Coolify
- Aplikasi sudah ter-deploy dengan database PostgreSQL
- Mengetahui nama resource/container dari aplikasi Anda

## 🔍 Langkah 1: Identifikasi Container

### 1.1 Cari Nama Container Database
Dari `DATABASE_URL` di environment variables:
```
postgres://postgres:password@gk0s0kso4ow884gc0ggowsgo:5432/postgres
                              ^^^^^^^^^^^^^^^^^^^^^^^^^^
                              Ini nama container database
```

### 1.2 Cari Nama Container Aplikasi
- Buka Coolify Dashboard → Application → Deployment Logs
- Cari baris yang menyebutkan container ID, contoh:
  ```
  dsok8s8wsk00sc0kocwows0g-073701130031
  ```

### 1.3 Verifikasi Container Aktif
Di terminal server/Coolify execute command:
```bash
# List semua container
docker ps --format "table {{.Names}}\t{{.Image}}\t{{.Status}}"

# Filter container aplikasi (ganti dengan UUID Anda)
docker ps --filter "name=dsok8s8wsk00sc0kocwows0g"

# Filter container database
docker ps --filter "name=gk0s0kso4ow884gc0ggowsgo"
```

## 🗑️ Langkah 2: Backup Database (Opsional tapi Disarankan)

### 2.1 Backup Full Database
```bash
# Masuk ke container database
docker exec -it gk0s0kso4ow884gc0ggowsgo sh

# Buat backup
pg_dump -U postgres -d postgres > /tmp/backup-$(date +%Y%m%d-%H%M%S).sql

# Keluar dari container
exit

# Copy backup ke host (opsional)
docker cp gk0s0kso4ow884gc0ggowsgo:/tmp/backup-*.sql ./
```

### 2.2 Backup Data Penting Saja
```bash
# Backup hanya user admin
docker exec -it gk0s0kso4ow884gc0ggowsgo psql -U postgres -d postgres -c "COPY (SELECT * FROM users WHERE role='ADMIN') TO '/tmp/admin-backup.csv' WITH CSV HEADER;"
```

## 🧹 Langkah 3: Reset Database

### 3.1 Metode 1: Truncate Semua Tabel (Cepat)
```bash
# Jalankan langsung dari host
docker exec -it gk0s0kso4ow884gc0ggowsgo psql -U postgres -d postgres -c "
DO \$\$ 
DECLARE r RECORD; 
BEGIN 
  EXECUTE 'TRUNCATE TABLE ' || 
  (SELECT string_agg(format('%I.%I', schemaname, tablename), ',') 
   FROM pg_tables WHERE schemaname = 'public') || 
  ' CASCADE'; 
END \$\$;"
```

### 3.2 Metode 2: Drop dan Recreate Schema
```bash
# Masuk ke container database
docker exec -it gk0s0kso4ow884gc0ggowsgo psql -U postgres -d postgres

# Di dalam psql:
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;

# Keluar
\q
```

### 3.3 Verifikasi Database Kosong
```bash
docker exec -it gk0s0kso4ow884gc0ggowsgo psql -U postgres -d postgres -c "\dt"
```
Seharusnya output: "No relations found."

## 🔄 Langkah 4: Jalankan Migrasi Ulang

### 4.1 Dari Container Aplikasi
```bash
# Cari nama container aplikasi yang aktif
APP_CONTAINER=$(docker ps --filter "name=dsok8s8wsk00sc0kocwows0g" --format "{{.Names}}" | head -1)

# Jalankan migrasi
docker exec -it $APP_CONTAINER npx prisma migrate deploy
```

### 4.2 Verifikasi Tabel Terbuat
```bash
docker exec -it gk0s0kso4ow884gc0ggowsgo psql -U postgres -d postgres -c "\dt"
```
Seharusnya muncul tabel: users, sessions, system_settings, site_contents, dll.

## 🌱 Langkah 5: Seeding Manual

### 5.1 Persiapan: Pindahkan tsx ke Dependencies (Sekali Saja)

**⚠️ PENTING**: Script seed menggunakan TypeScript dan membutuhkan `tsx`. Karena di production `tsx` ada di `devDependencies`, perlu dipindah dulu.

#### Edit package.json:
```bash
# Masuk ke container aplikasi
docker exec -it $APP_CONTAINER sh

# Cek apakah tsx tersedia
which tsx || echo "tsx tidak tersedia"

# Keluar dulu
exit
```

**Jika tsx tidak tersedia**, lakukan ini di local development:

1. Edit `package.json`:
```json
"dependencies": {
  // ... dependencies lain
  "tsx": "^4.20.5"
},
"devDependencies": {
  // hapus "tsx": "^4.20.5" dari sini
}
```

2. Deploy ulang aplikasi:
```bash
git add package.json
git commit -m "move tsx to production dependencies for seeding"
git push origin main
```

3. Tunggu deploy selesai, lalu lanjut ke langkah berikutnya.

### 5.2 Jalankan Seed

#### Metode A: Script Seed Lengkap
```bash
# Update APP_CONTAINER jika perlu setelah redeploy
APP_CONTAINER=$(docker ps --filter "name=dsok8s8wsk00sc0kocwows0g" --format "{{.Names}}" | head -1)

# Jalankan seed
docker exec -it $APP_CONTAINER npm run db:seed
```

#### Metode B: Fresh Reset Script (dengan opsi reset total)
```bash
# Reset total + seed
docker exec -it $APP_CONTAINER sh -c '
export ALLOW_DB_RESET=true
export ADMIN_FORCE_RESET=true
export ADMIN_EMAIL=admin@yukiyaki.id
export ADMIN_PASSWORD=admin123
npm run reset:fresh
'
```

#### Metode C: Manual Step-by-Step
```bash
# 1. Generate Prisma client
docker exec -it $APP_CONTAINER npx prisma generate

# 2. Jalankan seed dengan environment custom
docker exec -it $APP_CONTAINER sh -c '
export ADMIN_EMAIL=admin@yukiyaki.id
export ADMIN_PASSWORD=YourStrongPassword123
export CREATE_DEMO_USER=false
npx tsx prisma/seed.ts
'
```

### 5.3 Verifikasi Seeding Berhasil
```bash
# Cek user admin terbuat
docker exec -it gk0s0kso4ow884gc0ggowsgo psql -U postgres -d postgres -c "
SELECT email, role, is_active, created_at 
FROM users 
WHERE role='ADMIN';"

# Cek system settings
docker exec -it gk0s0kso4ow884gc0ggowsgo psql -U postgres -d postgres -c "
SELECT key, category, description 
FROM system_settings 
ORDER BY category, key 
LIMIT 10;"

# Cek site content
docker exec -it gk0s0kso4ow884gc0ggowsgo psql -U postgres -d postgres -c "
SELECT section, key, value 
FROM site_contents 
ORDER BY section, sort_order 
LIMIT 10;"
```

## 🧪 Langkah 6: Test Aplikasi

### 6.1 Health Check
```bash
# Dari dalam container aplikasi
docker exec -it $APP_CONTAINER curl -s http://localhost:3000/api/health
```

### 6.2 Test Login Admin
Buka browser → aplikasi Anda → halaman login:
- Email: admin@yukiyaki.id (atau sesuai ADMIN_EMAIL)
- Password: (sesuai yang Anda set di environment)

### 6.3 Cek Log Aplikasi
```bash
docker logs -f $APP_CONTAINER --tail 50
```

## 🚨 Troubleshooting

### Problem: "tsx: command not found"
**Solusi**: tsx masih di devDependencies. Ikuti langkah 5.1 untuk memindahkannya.

### Problem: "Cannot find module '@prisma/client'"
**Solusi**: 
```bash
docker exec -it $APP_CONTAINER npx prisma generate
```

### Problem: Migration gagal - "relation already exists"
**Solusi**: Reset total dengan drop schema (metode 3.2), lalu ulangi dari langkah 4.

### Problem: Seed gagal - "connect ECONNREFUSED"
**Solusi**: Pastikan DATABASE_URL benar dan database container running:
```bash
docker exec -it $APP_CONTAINER env | grep DATABASE_URL
docker ps --filter "name=gk0s0kso4ow884gc0ggowsgo"
```

### Problem: Login tetap gagal setelah seed
**Solusi**: 
1. Cek password hash tersimpan: 
```bash
docker exec -it gk0s0kso4ow884gc0ggowsgo psql -U postgres -d postgres -c "SELECT email, length(password_hash) FROM users WHERE role='ADMIN';"
```
2. Force reset via environment:
```bash
export ADMIN_FORCE_RESET=true
docker exec -it $APP_CONTAINER npm run db:seed
```

## 🔒 Security Notes

1. **Jangan expose DATABASE_URL** di log atau output publik.
2. **Gunakan password kuat** untuk admin pertama kali.
3. **Hapus backup sensitive** setelah tidak diperlukan.
4. **Audit login attempt** via log setelah reset.

## 📝 Environment Variables Penting

```bash
# Admin setup
ADMIN_EMAIL=admin@yukiyaki.id
ADMIN_PASSWORD=YourStrongPassword123
ADMIN_FORCE_RESET=true  # hanya untuk reset paksa

# Database reset
ALLOW_DB_RESET=true  # untuk fresh-reset script

# Development
CREATE_DEMO_USER=false  # false untuk production
NODE_ENV=production
```

## 🎯 Quick Reference Commands

```bash
# Identifikasi container
APP=$(docker ps --filter "name=dsok8s8wsk00sc0kocwows0g" --format "{{.Names}}" | head -1)
DB=gk0s0kso4ow884gc0ggowsgo

# Reset database (HATI-HATI!)
docker exec -it $DB psql -U postgres -d postgres -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"

# Migrate + seed
docker exec -it $APP npx prisma migrate deploy
docker exec -it $APP npm run db:seed

# Verifikasi
docker exec -it $DB psql -U postgres -d postgres -c "SELECT email, role FROM users;"
```

---

**📧 Need Help?**
Jika mengalami masalah, periksa:
1. Container logs: `docker logs $APP_CONTAINER`
2. Database connectivity: `docker exec -it $APP_CONTAINER nc -zv $DB_HOST 5432`
3. Environment variables: `docker exec -it $APP_CONTAINER env | grep -E "(DATABASE|ADMIN)"`

**⚠️ Disclaimer**: Tutorial ini akan menghapus semua data. Pastikan backup penting sudah dilakukan.