# 🔐 Default Login Credentials

Setelah deployment berhasil, gunakan kredensial default berikut untuk login:

## Default Admin Account

- **Email:** `admin@localhost`
- **Password:** `admin123`

## ⚠️ Penting - Keamanan

1. **Segera ganti password** setelah login pertama kali
2. **Ganti email admin** melalui halaman admin panel
3. **Buat user account terpisah** untuk penggunaan sehari-hari
4. **Admin account hanya untuk management** sistem

## 🚀 Langkah Setelah Deployment

1. **Access aplikasi** di URL Coolify: `https://design.yukiyaki.id`
2. **Login** menggunakan credentials di atas
3. **Navigasi ke halaman Admin** (`/admin`)
4. **Update profile admin:**
   - Ganti email ke email valid Anda
   - Ganti password yang kuat
   - Update informasi profile

## 🔧 Troubleshooting

### Jika Login Gagal

1. Pastikan database migration sudah berhasil
2. Cek logs container untuk error
3. Pastikan database seed sudah berjalan

### Jika Lupa Password

```bash
# Reset ke default credentials
docker exec <container-name> npx prisma db seed --preview-feature
```

### Health Check

- Endpoint: `/api/health`
- Status: `healthy` setelah startup selesai (10-60 detik)

## 📊 Monitoring

Aplikasi akan menampilkan status deployment di health endpoint:

- Memory usage
- Uptime
- Database connection status
- Environment info

---

**📝 Note:** Semua konfigurasi lainnya (API keys, branding, etc.) dapat diatur melalui Admin Panel setelah login.
