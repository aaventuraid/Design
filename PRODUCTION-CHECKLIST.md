# 🚀 Production Deployment Checklist

Pastikan semua item berikut sudah dicek sebelum deploy ke production:

## ✅ Security Checklist

### Authentication & Credentials

- [ ] Default admin credentials sudah diubah
- [ ] NEXTAUTH_SECRET dan JWT_SECRET menggunakan values yang secure (32+ chars)
- [ ] Semua environment variables production sudah dikonfigurasi
- [ ] Tidak ada hardcoded credentials di codebase
- [ ] API keys tidak di-commit ke repository

### Code Security

- [ ] Tidak ada console.log yang expose sensitive data
- [ ] Semua test/debug code sudah dihapus
- [ ] Development files sudah dihapus (verify-database.js, smoke tests, dll)
- [ ] File .env.production tidak di-commit
- [ ] File credentials/secrets tidak di-commit

### Database Security

- [ ] Database menggunakan secure password
- [ ] Database connection menggunakan SSL (sslmode=require)
- [ ] Database tidak accessible dari public internet
- [ ] Database backup strategy sudah disetup

## ✅ Application Checklist

### Environment Configuration

- [ ] NODE_ENV=production
- [ ] DATABASE_URL pointing ke production database
- [ ] NEXTAUTH_URL menggunakan production domain
- [ ] Gemini API key dikonfigurasi via Admin Panel (bukan env var)

### Performance & Monitoring

- [ ] Application health check endpoint berfungsi (/api/health)
- [ ] Error handling sudah proper
- [ ] Logging hanya untuk production-appropriate messages
- [ ] Rate limiting enabled

### Deployment Ready

- [ ] Docker build berhasil
- [ ] Database migrations berjalan lancar
- [ ] Admin panel accessible dan secure
- [ ] File upload functionality tested
- [ ] AI generation functionality tested

## ⚠️ Security Warnings

### NEVER COMMIT:

- .env.production
- credentials.json
- api-keys.json
- Files dengan hardcoded passwords/secrets

### ALWAYS CHANGE:

- Default admin credentials (admin@localhost / admin123)
- Default database passwords
- Generated secrets untuk production use

### PRODUCTION-ONLY:

- Disable development logging
- Remove test endpoints
- Use secure cookies
- Enable HTTPS only

## 🔧 Post-Deployment Actions

1. **Immediately After Deploy:**
   - Login dan ganti admin credentials
   - Setup Gemini API key via Admin Panel
   - Test critical functionality
   - Verify security headers

2. **Within 24 Hours:**
   - Setup monitoring/alerting
   - Test backup/restore procedures
   - Performance monitoring
   - Security audit

3. **Ongoing Maintenance:**
   - Regular security updates
   - Database maintenance
   - Monitor logs for issues
   - Regular backups verification

---

**Remember**: Production security is not optional. Every item in this checklist should be ✅ before going live.
