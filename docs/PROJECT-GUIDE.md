# 📖 Yuki Yaki Corner - Complete Project Guide

**AI-Powered Food Content Generator & Image Processing Studio**

Aplikasi Next.js untuk mengubah 1 foto makanan menjadi konten marketing yang siap pakai dengan AI copy generation, background removal otomatis, dan optimasi untuk platform F&B marketplace.

---

## 🎯 Project Overview

### Yuki Yaki Corner Studio - F&B Content Automation

**Vision**: Mengubah 1 foto produk F&B menjadi 10+ variasi konten marketing yang siap posting di berbagai platform (GoFood, GrabFood, ShopeeFood, Instagram, dll) dengan bantuan AI.

**Problem Solved**: UMKM F&B menghabiskan berjam-jam untuk editing foto dan menulis copy marketing. Aplikasi ini mengotomatisasi process tersebut dalam hitungan menit.

### ✨ Current Features (v1.0.0 Production Ready)

- ✅ **Smart Background Removal** - Otomatis hapus background putih/terang
- ✅ **AI Copy Generation** - Generate judul & deskripsi produk dengan Gemini AI
- ✅ **Marketplace Presets** - Optimasi format untuk GoFood, GrabFood, ShopeeFood
- ✅ **Brand Enhancement** - Brightness, saturation, sharpening otomatis
- ✅ **Database-First Architecture** - Settings & credentials tersimpan aman di database
- ✅ **Multi-User Support** - Admin panel dengan role-based access
- ✅ **Rate Limiting** - Usage tracking per user role (USER/PREMIUM/ADMIN)
- ✅ **Security Audit Compliant** - No hardcoded credentials, bcrypt hashing
- ✅ **Production Ready** - Docker, Coolify deployment, comprehensive docs

---

## 🏗️ Technical Architecture

### Database-First Design

**Priority Order**: Database → File Settings → Environment Variables (fallback only)

```typescript
// Settings resolution priority
geminiApiKey: dbSettings.geminiApiKey || // 🥇 Database (primary)
  fileSettings.geminiApiKey || // 🥈 File backup
  process.env.GEMINI_API_KEY; // 🥉 Environment fallback
```

### Tech Stack

**Frontend:**

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS + Responsive Design
- React Hooks + Modern UI Components

**Backend:**

- Next.js API Routes (RESTful)
- Prisma ORM + PostgreSQL/SQLite
- JWT Authentication + bcrypt
- Rate Limiting + Usage Analytics

**AI & Processing:**

- Gemini AI API (Primary)
- Sharp Image Processing
- Heuristic Background Removal
- Local Fallback Templates

**DevOps:**

- Docker + docker-compose
- Coolify Self-Hosted Deployment
- GitHub Actions Ready
- Environment Management

### Database Schema

```sql
-- Core Tables
users           # Authentication & user management
sessions        # JWT session tracking
system_settings # Dynamic app configuration (API keys, etc)
image_processing # Processing history & analytics
usage_records   # Rate limiting & usage tracking
audit_logs      # Security & admin action logging
api_keys        # Future: user-specific API keys
```

---

## 🚀 Quick Start

### Development Setup

```bash
# 1. Clone & Install
git clone https://github.com/aaventuraid/Design.git
cd Design
npm install

# 2. Environment Setup
cp .env.example .env.local
# Edit .env.local dengan database & API credentials

# 3. Database Setup
npx prisma generate
npx prisma db push
npx prisma db seed

# 4. Development Server
npm run dev
# Open http://localhost:3000
```

### Production Deployment

**Recommended**: Coolify Self-Hosted

📖 **Complete Guide**: [`DEPLOY-COOLIFY.md`](./DEPLOY-COOLIFY.md)

**Quick Deploy:**

1. Push code ke GitHub
2. Create Coolify application (Docker build)
3. Set environment variables (DATABASE_URL, JWT_SECRET)
4. Deploy & configure via admin panel

**Alternative Platforms**: Vercel, Railway, Docker manual

---

## 📋 Usage Guide

### For End Users

1. **Upload Image** - Drag & drop foto makanan
2. **Select Platform** - Pilih GoFood/GrabFood/ShopeeFood/Instagram
3. **Generate Content** - AI akan create copy & optimize gambar
4. **Download Results** - Dapatkan file PNG transparan + copy text

### For Admins

1. **Admin Panel** - `/admin` (requires admin credentials)
2. **Set API Keys** - Configure Gemini API via UI (stored in database)
3. **User Management** - Monitor usage, manage roles
4. **System Settings** - Rate limits, maintenance mode, analytics
5. **Audit Logs** - Track all admin actions & system changes

### API Endpoints

```bash
# Health Check
GET /api/health

# Authentication
POST /api/auth/login
POST /api/auth/register
GET  /api/auth/me
POST /api/auth/logout

# Core Features
POST /api/process        # Image processing
POST /api/generate-copy  # AI copy generation

# Admin Only
GET  /api/admin/management
POST /api/admin/management
GET  /api/analytics
```

---

## 🗺️ Development Roadmap

### Phase 1: Core Enhancement (Next 3 months)

**AI & Processing Improvements:**

- [ ] **Advanced Background Removal** - Integrate ML-based removal (rembg/U2-Net)
- [ ] **Batch Processing** - Upload multiple images simultaneously
- [ ] **Smart Content Variations** - Generate 5+ variations per upload
- [ ] **Brand Voice Learning** - Train AI with user's brand guidelines
- [ ] **Context-Aware Copy** - Analyze image content for better copy

**User Experience:**

- [ ] **User Dashboard** - Personal usage stats & history
- [ ] **Template Library** - Pre-made templates per cuisine type
- [ ] **Real-Time Preview** - Live preview saat editing
- [ ] **Mobile App** - Progressive Web App (PWA) dengan offline support
- [ ] **Collaboration Tools** - Team accounts & shared workspaces

### Phase 2: Business Features (3-6 months)

**Multi-Platform Integration:**

- [ ] **Social Media Auto-Post** - Direct posting ke Instagram, Facebook
- [ ] **Marketplace Integration** - Langsung update ke GoFood/GrabFood
- [ ] **E-commerce Sync** - Shopify, WooCommerce integration
- [ ] **Content Calendar** - Schedule & manage posting timeline

**Advanced Analytics:**

- [ ] **Performance Tracking** - Engagement metrics per platform
- [ ] **A/B Testing** - Test different copy variations
- [ ] **Market Intelligence** - Trending hashtags & keywords
- [ ] **ROI Analysis** - Track conversion dari content ke sales

**Enterprise Features:**

- [ ] **White-Label Solutions** - Custom branding untuk agencies
- [ ] **API Access** - Developer API untuk integrations
- [ ] **Multi-Location** - Chain restaurant management
- [ ] **Advanced User Roles** - Manager, Editor, Viewer permissions

### Phase 3: AI Innovation (6-12 months)

**Next-Generation AI:**

- [ ] **Content Multiplication** - 1 foto → 30+ unique variations
- [ ] **Video Generation** - Create short videos dari static images
- [ ] **Voice-Over AI** - Generate product descriptions audio
- [ ] **Trend Prediction** - AI predicts viral content patterns
- [ ] **Customer Sentiment** - Analyze customer feedback for improvements

**Emerging Technology:**

- [ ] **AR Menu Integration** - Augmented reality menu previews
- [ ] **IoT Kitchen Integration** - Smart camera auto-upload
- [ ] **Blockchain Analytics** - Decentralized content verification
- [ ] **Sustainability Metrics** - Carbon footprint & waste tracking

---

## 🎨 Design System & UI Roadmap

### Current Design Foundation

**Brand Identity:**

- **Colors**: Orange (#F28C28) primary, Blue (#2B3A67) secondary
- **Typography**: Poppins (headings), Inter (body), Montserrat (accent)
- **Layout**: Mobile-first responsive, 8pt grid system
- **Components**: Basic upload, forms, admin interface

### Design Enhancement Plan

**Phase 1 - Design System (Next 2 months):**

- [ ] **Design Tokens** - Standardized colors, spacing, typography
- [ ] **Component Library** - Reusable UI components dengan Storybook
- [ ] **Icon System** - Custom F&B industry icon set
- [ ] **Dark Mode** - Complete dark theme implementation
- [ ] **Accessibility** - WCAG 2.1 AA compliance

**Phase 2 - Advanced UX (2-4 months):**

- [ ] **Micro-interactions** - Smooth animations & transitions
- [ ] **Onboarding Flow** - Interactive tutorial untuk new users
- [ ] **Error Handling** - Graceful error states & recovery
- [ ] **Mobile Optimization** - Native app-like mobile experience
- [ ] **Performance UI** - Loading states & progress indicators

**Phase 3 - Innovation (4-6 months):**

- [ ] **AI-Powered UI** - Dynamic interface adaptation per user
- [ ] **Voice Interface** - Voice commands untuk quick actions
- [ ] **Gesture Controls** - Touchscreen gestures for mobile
- [ ] **Personalization** - Customizable dashboard & workflows
- [ ] **Data Visualization** - Beautiful charts & analytics displays

---

## 🛡️ Security & Compliance

### Current Security Implementation

**Authentication & Authorization:**

- ✅ JWT session management dengan automatic expiry
- ✅ Bcrypt password hashing (12 rounds)
- ✅ Role-based access control (ADMIN/USER/PREMIUM)
- ✅ Rate limiting per user type
- ✅ Audit logging untuk admin actions

**Data Security:**

- ✅ Database-first credential storage (no hardcoded secrets)
- ✅ Input validation & sanitization
- ✅ CORS protection
- ✅ Environment variable isolation
- ✅ No API keys committed to repository

**Infrastructure Security:**

- ✅ Docker containerization
- ✅ HTTPS/SSL ready
- ✅ Health monitoring endpoints
- ✅ Error handling without data leaks

### Security Enhancement Roadmap

**Phase 1 (Immediate):**

- [ ] **Two-Factor Authentication (2FA)** - SMS/Email verification
- [ ] **API Rate Limiting Enhancement** - Per-IP & per-user limits
- [ ] **Security Headers** - Helmet.js implementation
- [ ] **Vulnerability Scanning** - Automated dependency checks
- [ ] **Backup & Recovery** - Automated database backups

**Phase 2 (Medium-term):**

- [ ] **OAuth Integration** - Google, Facebook login options
- [ ] **Advanced Monitoring** - Real-time security alerts
- [ ] **Data Encryption** - Encrypt sensitive data at rest
- [ ] **GDPR Compliance** - Data privacy & user rights
- [ ] **Penetration Testing** - Regular security audits

---

## 📊 Success Metrics & KPIs

### Technical Metrics

- **Performance**: < 2s page load, 99.9% uptime
- **Quality**: < 1% error rate, 90%+ test coverage
- **Security**: Zero security incidents, regular audits
- **Scalability**: Support 1K+ concurrent users

### Business Metrics

- **User Adoption**: 1K+ active users dalam 6 months
- **Engagement**: 70%+ weekly active user retention
- **Value Creation**: 50%+ time savings untuk users
- **Revenue**: Freemium model dengan premium features

### Impact Metrics

- **UMKM Growth**: 30%+ increase dalam online sales untuk users
- **Content Quality**: 80%+ satisfaction rate dengan generated content
- **Platform Adoption**: Integration dengan 5+ major F&B platforms
- **Community**: 100+ user testimonials & case studies

---

## 🤝 Contributing & Development

### Development Guidelines

**Code Standards:**

- TypeScript strict mode
- ESLint + Prettier configuration
- Husky pre-commit hooks
- Conventional commit messages
- 90%+ test coverage target

**Architecture Principles:**

- Database-first configuration
- API-first development
- Mobile-responsive design
- Security by default
- Performance optimization

**Contribution Workflow:**

1. Fork repository & create feature branch
2. Implement feature dengan comprehensive tests
3. Update documentation
4. Submit pull request dengan detailed description
5. Code review & automated testing
6. Merge & deploy

### Team Structure (Current)

**Core Team:**

- **Lead Developer** - Full-stack development & architecture
- **AI Specialist** - Gemini integration & ML features
- **Designer** - UI/UX design & user research
- **Product Manager** - Feature planning & user feedback

**Future Expansion:**

- Mobile Developer (React Native/Flutter)
- DevOps Engineer (Infrastructure & automation)
- Data Scientist (Analytics & AI improvement)
- Marketing Specialist (User acquisition & retention)

---

## 📚 Documentation & Resources

### Complete Documentation

**Deployment & Operations:**

- [`DEPLOY-COOLIFY.md`](./DEPLOY-COOLIFY.md) - Production deployment guide
- [`DATABASE-FIRST-ARCHITECTURE.md`](./docs/DATABASE-FIRST-ARCHITECTURE.md) - Architecture explanation
- [`SECURITY-AUDIT.md`](./docs/SECURITY-AUDIT.md) - Security implementation details
- [`PANDUAN-UPDATE-EFISIEN.md`](./docs/PANDUAN-UPDATE-EFISIEN.md) - Maintenance guide

**Development Resources:**

- `IMPLEMENTATION-SUMMARY.md` - Current implementation status
- `GIT-UPLOAD-COMPLETE.md` - Repository setup guide
- `.env.example` - Environment variable template
- `prisma/schema.prisma` - Database schema documentation

### API Documentation

**Authentication Required:**

```bash
# Include Authorization header
Authorization: Bearer <jwt_token>
```

**Rate Limits:**

- **FREE**: 10 requests/hour
- **PREMIUM**: 100 requests/hour
- **ADMIN**: Unlimited

**Response Format:**

```json
{
  "success": true,
  "data": {...},
  "message": "Operation completed",
  "timestamp": "2025-09-24T..."
}
```

### Support & Community

**Getting Help:**

1. Check documentation first
2. Search existing GitHub Issues
3. Create detailed bug report/feature request
4. Join community discussions

**Reporting Issues:**

- Use GitHub Issues dengan labels yang sesuai
- Include steps to reproduce
- Attach screenshots/logs when relevant
- Specify environment details (OS, browser, etc)

---

## 📄 License & Legal

**License**: Proprietary - Internal Yuki Yaki Corner
**Copyright**: © 2025 Yuki Yaki Corner Studio
**Contact**: [Email untuk business inquiries]

**Third-Party Licenses:**

- Next.js - MIT License
- Tailwind CSS - MIT License
- Prisma - Apache 2.0 License
- Sharp - Apache 2.0 License

**AI Service Terms:**

- Google Gemini API - Subject to Google AI Terms of Service
- Content generated is owned by the user
- API usage subject to rate limits & pricing

---

**🚀 Ready to transform your F&B content creation with AI?**

Get started: `npm run dev` atau deploy to production menggunakan Coolify guide!
