# 🍽️ Yuki Yaki Corner - AI-Powered F&B Content Generator

**Production-Ready**: Next.js application yang mengubah 1 foto makanan menjadi konten marketing siap pakai dengan AI copy generation, background removal otomatis, dan optimasi untuk platform F&B marketplace.

## 📋 **Complete Documentation**

🎯 **[docs/PROJECT-GUIDE.md](./docs/PROJECT-GUIDE.md)** - **PANDUAN LENGKAP** project overview, architecture, roadmap, dan development guide

🚀 **[docs/DEPLOY-COOLIFY.md](./docs/DEPLOY-COOLIFY.md)** - **DEPLOYMENT GUIDE** untuk production

## ✨ Current Features (v1.0.0)

- ✅ **Smart Background Removal** - Otomatis hapus background putih/terang
- ✅ **AI Copy Generation** - Generate judul & deskripsi produk dengan Gemini AI
- ✅ **Marketplace Presets** - GoFood, GrabFood, ShopeeFood, Instagram optimization
- ✅ **Database-First Architecture** - Settings & credentials aman di database
- ✅ **Multi-User Support** - Admin panel dengan role-based access (USER/PREMIUM/ADMIN)
- ✅ **Production Ready** - Docker, security audit compliant, comprehensive documentation

## 🚀 Quick Start

1. **Clone & Install**

   ```bash
   git clone <repo-url>
   cd yuki-yaki-corner
   npm install
   ```

2. **Setup Environment**

   ```bash
   cp .env.template .env.local
   # Edit .env.local dengan database dan API keys
   ```

3. **PostgreSQL Setup**

   ```bash
   # Option 1: Use Docker (Recommended)
   npm run postgres:start

   # Option 2: Use migration script
   ./scripts/migrate-to-postgresql.ps1

   # Option 3: Manual setup
   npm run db:setup
   ```

4. **Run Development**

   ```bash
   npm run dev
   ```

5. **First Login**
   - Open http://localhost:3000/auth
   - Login dengan default credentials (see deployment documentation)
   - **PENTING**: Segera ganti email dan password setelah login pertama!

## 🏗️ Architecture

**Database-First Design**: Settings & API keys stored securely in database
**Tech Stack**: Next.js 14 + TypeScript + Tailwind + Prisma + PostgreSQL
**AI Integration**: Gemini API (primary) dengan local fallback
**Security**: JWT auth, bcrypt hashing, rate limiting, audit logs
**DevOps**: Docker ready, Coolify optimized, comprehensive monitoring

## 🔗 Links & Resources

**Repository**: https://github.com/aaventuraid/Design.git  
**Documentation**: Complete guides in [`docs/`](./docs/) folder  
**Admin Panel**: `/admin` (post-deployment)  
**API Health**: `/api/health` (monitoring endpoint)

## 📄 License

Proprietary – Internal Yuki Yaki Corner Studio  
© 2025 - AI-Powered F&B Content Generation Platform
