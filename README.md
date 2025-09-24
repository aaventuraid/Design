# 🍽️ Yuki Yaki Corner - AI-Powered F&B Content Generator

**Production-Ready**: Next.js application yang mengubah 1 foto makanan menjadi konten marketing siap pakai dengan AI copy generation, background removal otomatis, dan optimasi untuk platform F&B marketplace.

## 📋 **Complete Documentation**

🎯 **[PROJECT-GUIDE.md](./PROJECT-GUIDE.md)** - **PANDUAN LENGKAP** project overview, architecture, roadmap, dan development guide

🚀 **[docs/DEPLOY-COOLIFY-SIMPLE.md](./docs/DEPLOY-COOLIFY-SIMPLE.md)** - **DEPLOYMENT GUIDE** untuk production

## ✨ Current Features (v1.0.0)

- ✅ **Smart Background Removal** - Otomatis hapus background putih/terang
- ✅ **AI Copy Generation** - Generate judul & deskripsi produk dengan Gemini AI
- ✅ **Marketplace Presets** - GoFood, GrabFood, ShopeeFood, Instagram optimization
- ✅ **Database-First Architecture** - Settings & credentials aman di database
- ✅ **Multi-User Support** - Admin panel dengan role-based access (USER/PREMIUM/ADMIN)
- ✅ **Production Ready** - Docker, security audit compliant, comprehensive documentation

## ⚡ Quick Start

### Development Setup

```bash
# 1. Install dependencies
npm install

# 2. Setup environment
cp .env.example .env.local
# Edit .env.local dengan database credentials

# 3. Database setup
npx prisma generate
npx prisma db push
npx prisma db seed

# 4. Start development
npm run dev
# Open http://localhost:3000
```

### Production Deployment

```bash
# 1. Build application
npm run build

# 2. Deploy to Coolify (recommended)
# See complete guide in docs/DEPLOY-COOLIFY-SIMPLE.md
```

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
