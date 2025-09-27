## Operational Runbook (Draft)

### Overview
This document guides routine operations, incident response, and scaling for Yuki Yaki Corner.

### 1. Health & Probes
- Liveness: `GET /api/health/liveness` (no DB). Expect `{ ok: true, status: 'alive' }`.
- Readiness: `GET /api/health` (DB + optional Redis). 503 if DB degraded or startup incomplete.

### 2. Deploy Flow
1. Run migrations: `prisma migrate deploy` (handled in CI).
2. Seed (optional on first deploy): `npm run db:seed`.
3. Confirm readiness returns 200 within expected warmup (<10s typical).

### 3. Configuration Changes
All non-secret toggles live in DB tables `SystemSettings`, `SiteContent`.
Use admin settings API or SQL update (prefer API).

### 4. Session Security
- Rotate session: `POST /api/auth/rotate` (Bearer token).
- Revoke-all: `POST /api/auth/revoke-all` → invalidates all old sessions.

### 5. Rate Limiting & Quotas
- IP layer: enforced in middleware; view headers `X-RateLimit-*`.
- User quota: `UsageRecord` table (hour buckets). Premium logic multiplies limits (future expansion).

### 6. Logging & Tracing
- Logs: JSON lines stdout (ingest by platform). Sensitive keys redacted automatically.
- Tracing: lightweight spans (enable with `TRACING_ENABLED=1`). Future OTEL exporter can hook into `lib/tracing.ts`.

### 7. Monitoring & Alerts (Future Suggestions)
- Integrate Sentry DSN via DB setting or env for error alerting.
- Add OTEL collector for latency & error ratio dashboards.
- Create alert thresholds: readiness 503 spike >2m, rate-limit 429 >5% of total, processing error rate >3%.

### 8. Backup & Recovery
- Database: daily logical dump (e.g., `pg_dump`). Validate restore monthly.
- Settings & Content: included inside DB; no external config drift.
- Disaster recovery: restore DB → deploy fresh container → readiness should pass.

### 9. Scaling
- Horizontal scale prerequisite: Redis for shared rate limits.
- Sharp image processing CPU-bound; consider worker separation if queue introduced.
- Add CDN for processed images if persistence layer added (currently ephemeral response only).

### 10. Security Hardening Checklist
- Enforce strong JWT secret rotation (quarterly); after rotate, force logout via revoke-all.
- Enable HSTS preload (already set for prod) & confirm domain in preload list if public.
- Run dependency audit monthly.

### 11. Incident Playbook (Examples)
| Symptom | Check | Action |
|---------|-------|--------|
| 503 on readiness | DB connectivity | Restart DB pod / check network; verify prisma logs |
| High 429 user complaints | Inspect rate headers/IP concentration | Raise limits in DB or enable Redis scaling |
| Image processing latency spike | CPU saturation | Scale out workers / reduce quality factors via settings |
| Token reuse after revoke-all | Sessions table rows remain | Force delete by userId & rotate secret |

### 12. Maintenance Windows
- Announce (if public) when deploying major schema changes.
- Use traffic shadowing (future) for high-risk changes.

### 13. Future Enhancements
- Outbox or event log for image processing metrics.
- Structured metrics endpoint (Prometheus) `/metrics`.
- Multi-tenant isolation policies.

---
Keep this runbook versioned; update after each major infra or security change.
