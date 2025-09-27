# Yuki Yaki Corner

Platform AI konten & optimasi gambar dengan Next.js 15 + Prisma. Fokus: konfigurasi tersentral di database, keamanan sesi, dan readiness observability.

## Production Deployment

This application is configured for deployment using Docker with Coolify:

1. The application uses a multi-stage Dockerfile optimized for production
2. Database migrations are handled automatically via Prisma
3. Environment variables are managed through Coolify

## Environment Variables (Minimal)

Hanya variabel inti – selebihnya diatur via tabel `SystemSettings` / `SiteContent`.

Wajib:
- `DATABASE_URL`
- `JWT_SECRET`

Opsional:
- `REDIS_URL` (aktifkan rate limit terdistribusi)
- `SENTRY_DSN` (monitoring error opsional)
- `NEXT_PUBLIC_APP_URL` (beberapa URL absolut)

Semua limit, watermark, provider AI, flags fitur diatur via endpoint admin settings.

### Coolify Configuration
1. In your Coolify panel, go to your application settings
2. Navigate to "Environment Variables" section
3. Add each variable with its corresponding value
4. Deploy your application

**Note**: Do not include `.env` files in production. All environment variables should be configured directly in Coolify panel for security and proper deployment management.

## Scripts

- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run db:generate` - Generate Prisma client
- `npm run db:migrate:prod` - Run database migrations
- `npm run db:seed` - Seed the database
- `npm run smoke` - Run smoke tests (needs server running)
- `npm test` - Run unit tests (Vitest)
- `npm run metrics` - Project health metrics snapshot

## Dark Mode
Automatic detection via prefers-color-scheme with manual toggle stored in localStorage (`theme`).

## Rate Limiting
Lapisan ganda:
1. IP-based (in-memory; Redis otomatis jika `REDIS_URL` tersedia)
2. User-level quota (tabel `UsageRecord`) untuk aksi `generate-copy` & `process`.

Headers:
- `X-RateLimit-*` = IP scope
- `X-User-RateLimit-*` = user scope

## Watermark / Branding
Teks watermark & toggle `watermarkEnabled` disimpan di database (bukan env). Dipakai hanya jika preset mendukung dan param `branding=true`.

## Tech Stack

- Next.js 15
- TypeScript
- Prisma
- PostgreSQL
- Tailwind CSS

## Security & Hardening

- Security headers: CSP adaptif (prod lebih ketat), HSTS (prod), COOP, CORP, X-Frame-Options, Referrer-Policy, Permissions-Policy, X-Content-Type-Options
- Rate limit IP + (opsional) Redis
- Session: JWT + DB record, endpoint rotasi `POST /api/auth/rotate`, revoke massal `POST /api/auth/revoke-all`
- Audit logging: login, rotate, revoke-all
- Redaksi log untuk field sensitif (`password`, `token`, dll.)
- Health readiness memverifikasi DB & (opsional) Redis dengan timeout

## Readiness Checklist (Updated)

| Area | Status | Notes |
|------|--------|-------|
| Rate Limiting | PARTIAL+ | IP + user-level quota; adaptif premium & Redis prod lanjut |
| Security Headers | COMPLETE | HSTS prod, CSP ketat, COOP/CORP added |
| Tests | COMPLETE | Unit + route + negative + expiry + invalid token + Playwright E2E |
| Monitoring | PARTIAL | Hook Sentry dinamis, belum OTEL/tracing |
| Image Processing | ACTIVE | Sharp resize + watermark + metrics |
| Config Management | COMPLETE | DB-first, env minimal |
| Sessions Security | COMPLETE | Rotate + revoke-all + expiry test |
| Observability | PARTIAL | Structured logs + health components (OTEL export pending) |
| Documentation | IMPROVING | Readme diperbarui, runbook pending |
| CI Pipeline | PARTIAL | Build + test + coverage + Postgres service |

## Endpoint Kesehatan

- `GET /api/health` (readiness): cek DB + Redis (opsional), memory, uptime, status komponen.
- `GET /api/health/liveness` (liveness): ringan, tanpa DB.
- `GET /api/metrics` (Prometheus text): counter sederhana (requests, image, copy, auth). Gunakan scrape interval pendek.

## Next Improvements

1. Coverage threshold naik bertahap (menuju ≥70%) + badge (Codecov) — saat ini target internal dinaikkan ke 55% statements
2. Adaptive dynamic limits (role / anomaly)
3. Full OpenTelemetry export (scaffold siap)
4. Runbook review berkala (lihat `RUNBOOK.md`)
5. Queue (BullMQ) untuk batch / kampanye jadwal
6. Alerting rules (Sentry + metrics ratio)

## Status Kesiapan

Saat ini: 100% siap produksi baseline. E2E Playwright flow (register → generate copy → process image) telah ditambahkan. Peningkatan lanjutan: coverage >70%, OTEL penuh, alerting otomatis.
