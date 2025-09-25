# 🗄️ Database-First Architecture

## Arsitektur Prioritas Penyimpanan

Sistem ini menerapkan **Database-First Architecture** untuk semua konfigurasi dinamis dan kredensial:

### 1. 🔑 Login Credentials (100% Database)

**User Authentication:**

- ✅ **Primary**: Database `users` table
- ❌ **No Fallback**: Environment variables tidak digunakan untuk login
- 🔐 **Security**: Password di-hash dengan bcrypt (12 rounds)

**Admin Credentials:**

- ✅ **Primary**: Database `users` table dengan `role = 'ADMIN'`
- ⚠️ **Setup Only**: Environment variables hanya untuk initial seeding
- 🔄 **Management**: Dapat diubah melalui admin panel

### 2. 🤖 AI Configuration (Database-First)

**Gemini API Key Priority:**

```
1. Database `system_settings.geminiApiKey` 👈 PRIMARY
2. File-based settings (.data/settings.json)
3. Environment variable GEMINI_API_KEY (fallback only)
```

**Implementation Flow:**

```typescript
// lib/settings.ts - Database-first approach
geminiApiKey: dbSettingsObj.geminiApiKey || // 🥇 Database priority
  fileSettings.geminiApiKey || // 🥈 File fallback
  process.env.GEMINI_API_KEY || // 🥉 Env fallback
  '';
```

### 3. 📊 Admin Panel Settings

**Semua settings disimpan di database:**

- `geminiApiKey` - AI API key
- `defaultAIProvider` - 'gemini' | 'local'
- `imageBgProvider` - 'internal' | 'external'
- `maintenanceMode` - boolean
- `maxFileSize` - bytes limit
- `analyticsEnabled` - tracking enabled

### 4. 🔄 Migration Path

**Setup Awal (Development):**

```bash
# 1. Database seeding runs automatically with default values:
#    Admin: admin@localhost / admin123
#    Gemini API: Empty (set via Admin Panel)

# 2. Manual seeding (if needed):
npm run db:seed

# 3. ✅ NO environment variables needed for seeding
#    Everything uses built-in defaults
```

**Setup Produksi:**

```bash
# 1. Deploy dengan minimal env vars (NO admin credentials needed)
DATABASE_URL="postgresql://..."
JWT_SECRET="your-jwt-secret"
NEXTAUTH_SECRET="your-nextauth-secret"

# 2. Database seeding creates admin automatically:
#    Email: admin@localhost
#    Password: admin123

# 3. Login ke admin panel dengan default credentials
# 4. Change admin credentials & set Gemini API Key via UI
# 5. ✅ NO environment variables needed for credentials
```

### 5. 🛡️ Security Benefits

**Database-First Advantages:**

- ✅ **Dynamic Configuration**: Settings dapat diubah tanpa redeploy
- ✅ **Audit Trail**: Semua perubahan tercatat di `audit_logs`
- ✅ **Role-Based Access**: Hanya admin yang dapat mengubah settings
- ✅ **Encrypted Storage**: API keys aman di database
- ✅ **No Environment Leaks**: Credentials tidak ada di environment

**Security Implementation:**

```typescript
// Admin panel - API key disembunyikan
geminiApiKey: settings.geminiApiKey ? '••••••••' : '';

// Database audit untuk setiap perubahan
await DatabaseService.logAudit({
  action: 'SYSTEM_SETTINGS_UPDATE',
  resource: 'admin_settings',
  details: { updatedKeys: Object.keys(data) },
});
```

### 6. 🔧 Development vs Production

**Development:**

- Environment variables untuk kemudahan development
- Demo users dengan credentials terlihat (optional)
- File-based fallback settings

**Production:**

- Database-only untuk semua dynamic settings
- Environment variables minimal (infrastructure only)
- No demo users atau visible credentials

### 7. 📋 Configuration Checklist

**✅ Database Configuration (Production Ready):**

- [ ] Admin user seeded via environment variables
- [ ] Gemini API key set melalui admin panel
- [ ] Default AI provider configured in database
- [ ] Rate limits configured per user role
- [ ] Maintenance mode settings in database
- [ ] Analytics settings in database

**⚠️ Environment Variables (Infrastructure Only):**

- [ ] `DATABASE_URL` - Database connection
- [ ] `JWT_SECRET` - Session encryption
- [ ] `NEXTAUTH_SECRET` - NextAuth encryption
- [ ] `NODE_ENV=production` - Runtime environment
- [ ] ~~`ADMIN_EMAIL`~~ - ❌ Not needed (auto-seeding)
- [ ] ~~`ADMIN_PASSWORD`~~ - ❌ Not needed (auto-seeding)
- [ ] ~~`GEMINI_API_KEY`~~ - ❌ Set via Admin Panel

### 8. 🔍 Verification Commands

```bash
# Verify database settings
npm run db:studio
# Check system_settings table for geminiApiKey

# Test admin login (database authentication)
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@yourdomain.com","password":"your-password"}'

# Check settings priority
curl -X GET http://localhost:3000/api/admin/management \
  -H "x-admin-password: your-admin-password"
```

---

## 📚 Related Documentation

- [Security Audit Report](./SECURITY-AUDIT.md)
- [Deployment Guide](./DEPLOY-COOLIFY-SIMPLE.md)
- [Database Schema](../prisma/schema.prisma)

**Status**: 🟢 Database-First Implementation Complete
