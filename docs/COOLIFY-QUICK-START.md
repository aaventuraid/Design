# 📋 Coolify Database Deployment - Quick Start Guide

## TL;DR - Step-by-Step untuk Coolify

### 1. Setup Database di Coolify

```bash
# 1. Buat PostgreSQL Service
Services > New Service > PostgreSQL
Name: yuki-yaki-db
Database: yuki_yaki_production
Username: yuki_admin
Password: [generate strong password]

# 2. Catat connection string:
postgresql://yuki_admin:your_password@yuki-yaki-db:5432/yuki_yaki_production
```

### 2. Deploy App dari GitHub

```bash
# 1. New Resource > Git Repository
Repository: https://github.com/aaventuraid/AAVENTURA
Branch: main
Build Pack: Docker

# 2. Set Environment Variables:
DATABASE_URL=postgresql://yuki_admin:password@yuki-yaki-db:5432/yuki_yaki_production
JWT_SECRET=[generate 32+ char secret]
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=[secure password]
GEMINI_API_KEY=[your api key]
NODE_ENV=production

# 3. Configure Port: 3000
# 4. Set Domain: your-app.yourdomain.com
# 5. Deploy!
```

### 3. Verify Deployment

```bash
# 1. Check health:
curl https://your-app.com/api/health

# 2. Login admin:
https://your-app.com/auth

# 3. Access admin panel:
https://your-app.com/admin
```

---

## 🔧 Key Files Updated for Database Support

### Dockerfile

- ✅ Multi-stage build dengan Prisma support
- ✅ Database migration otomatis saat startup
- ✅ Proper user permissions
- ✅ Production optimized

### Environment Variables

- ✅ DATABASE_URL untuk PostgreSQL connection
- ✅ JWT_SECRET untuk secure authentication
- ✅ Admin credentials untuk initial setup
- ✅ Production configuration

### Database Schema

- ✅ User management (users, sessions)
- ✅ Analytics tracking (image_processings, usage_records)
- ✅ System settings (system_settings)
- ✅ Audit logging (audit_logs)

---

## ⚡ Benefits Database Version

### Scalability

- **Multi-user support**: Unlimited registered users
- **Role-based access**: USER, PREMIUM, ADMIN tiers
- **Analytics**: Complete usage tracking dan insights
- **Rate limiting**: Per-user limits, tidak lagi per-IP

### Business Features

- **User retention**: Account system dengan history
- **Premium tiers**: Enhanced limits untuk paying users
- **Business intelligence**: User behavior analytics
- **Revenue tracking**: Usage-based pricing ready

### Enterprise Ready

- **Audit compliance**: Complete action logging
- **Security**: JWT authentication, bcrypt passwords
- **Monitoring**: Performance tracking, error logging
- **Backup**: Database-backed, standard backup procedures

---

## 🚨 Important Notes

### Database Migration

- **Otomatis**: Migration runs saat container startup
- **Aman**: Preserves existing data
- **Rollback**: Prisma migration system

### User Accounts

- **Admin**: Created automatically dari environment variables
- **Users**: Can register via `/auth` page
- **Backward compatible**: Anonymous usage masih works

### Performance

- **Connection pooling**: Prisma built-in
- **Optimized queries**: Database indexed properly
- **Caching ready**: Redis integration ready

---

## 🎯 Production Checklist

- [ ] PostgreSQL service running
- [ ] Environment variables set
- [ ] Domain dengan SSL configured
- [ ] Admin user created
- [ ] Database backup enabled
- [ ] Monitoring active

**🚀 Ready untuk production dengan unlimited scale!**
