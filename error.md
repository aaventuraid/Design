[COOLIFY] Starting application container...
[COOLIFY] Environment: NODE_ENV=${NODE_ENV}, PORT=${PORT}, HOSTNAME=${HOSTNAME}
[COOLIFY] Database URL: ${DATABASE_URL}
[COOLIFY] Running database migrations...
[COOLIFY] Seed not needed or failed, continuing...
[COOLIFY] Starting Next.js server on ${HOSTNAME}:${PORT}...
[COOLIFY] Health check will be available at http://${HOSTNAME}:${PORT}/api/health
[COOLIFY] Default login - Email: admin@localhost, Password: admin123
▲ Next.js 15.5.4

- Local: http://localhost:3000
  node:internal/modules/cjs/loader:1210
  throw err;
  ^

Error: Cannot find module 'empathic/package'
Require stack:

- /app/node_modules/@prisma/config/dist/index.js
- /app/node_modules/prisma/build/index.js
  at Module.\_resolveFilename (node:internal/modules/cjs/loader:1207:15)
  at Module.\_load (node:internal/modules/cjs/loader:1038:27)
  at Module.require (node:internal/modules/cjs/loader:1289:19)
  at require (node:internal/modules/helpers:182:18)
  at Object.<anonymous> (/app/node_modules/@prisma/config/dist/index.js:489:22)
  at Module.\_compile (node:internal/modules/cjs/loader:1521:14)
  at Module.\_extensions..js (node:internal/modules/cjs/loader:1623:10)
  at Module.load (node:internal/modules/cjs/loader:1266:32)
  at Module.\_load (node:internal/modules/cjs/loader:1091:12)
  at Module.require (node:internal/modules/cjs/loader:1289:19) {
  code: 'MODULE_NOT_FOUND',
  requireStack: [
  '/app/node_modules/@prisma/config/dist/index.js',
  '/app/node_modules/prisma/build/index.js'
  ]
  }

Node.js v20.19.5
npm notice
npm notice New major version of npm available! 10.8.2 -> 11.6.1
npm notice Changelog: https://github.com/npm/cli/releases/tag/v11.6.1
npm notice To up
ate run: npm install -g npm@11.6.1
npm notice

- Network: http://0.0.0.0:3000

✓ Starting...
✓ Ready in 152ms

PostgreSQL Database directory appears to contain a database; Skipping initialization

2025-09-24 10:53:08.131 UTC [1] LOG: starting PostgreSQL 17.6 on x86_64-pc-linux-musl, compiled by gcc (Alpine 14.2.0) 14.2.0, 64-bit
2025-09-24 10:53:08.132 UTC [1] LOG: listening on IPv4 address "0.0.0.0", port 5432
2025-09-24 10:53:08.132 UTC [1] LOG: listening on IPv6 address "::", port 5432
2025-09-24 10:53:08.136 UTC [1] LOG: listening on Unix socket "/var/run/postgresql/.s.PGSQL.5432"
2025-09-24 10:53:08.147 UTC [28] LOG: database system was shut down at 2025-09-24 10:49:28 UTC
2025-09-24 10:53:08.182 UTC [1] LOG: database system is ready to accept connections
2025-09-24 10:58:08.200 UTC [26] LOG: checkpoint starting: time
2025-09-24 10:58:08.227 UTC [26] LOG: checkpoint complete: wrote 3 buffers (0.0%); 0 WAL file(s) added, 0 removed, 0 recycled; write=0.003 s, sync=0.001 s, total=0.028 s; sync files=2, longest=0.001 s, average=0.001 s; distance=0 kB, estimate=0 kB; lsn=0/1958BD8, redo lsn=0/1958B80
2025-09-25 06:19:33.747 UTC [117361] ERROR: relation "public.users" does not exist at character 307
2025-09-25 06:19:33.747 UTC [117361] STATEMENT: SELECT "public"."users"."id", "public"."users"."email", "public"."users"."username", "public"."users"."passwordHash", "public"."users"."role"::text, "public"."users"."isActive", "public"."users"."preferences", "public"."users"."createdAt", "public"."users"."updatedAt", "public"."users"."lastLoginAt" FROM "public"."users" WHERE ("public"."users"."email" = $1 AND 1=1) LIMIT $2 OFFSET $3
2025-09-25 06:19:46.070 UTC [117361] ERROR: relation "public.users" does not exist at character 307
2025-09-25 06:19:46.070 UTC [117361] STATEMENT: SELECT "public"."users"."id", "public"."users"."email", "public"."users"."username", "public"."users"."passwordHash", "public"."users"."role"::text, "public"."users"."isActive", "public"."users"."preferences", "public"."users"."createdAt", "public"."users"."updatedAt", "public"."users"."lastLoginAt" FROM "public"."users" WHERE ("public"."users"."email" = $1 AND 1=1) LIMIT $2 OFFSET $3

Deployment Log
Hide Debug Logs
Deployment is Finished.

2025-Sep-25 06:16:50.115064
Starting deployment of aaventuraid/Design:main to localhost.
2025-Sep-25 06:16:50.297132
Preparing container with helper image: ghcr.io/coollabsio/coolify-helper:1.0.11.
2025-Sep-25 06:16:50.416183
[CMD]: docker stop --time=30 xs8sk84k0g4oo4g048c0os8c
2025-Sep-25 06:16:50.416183
Flag --time has been deprecated, use --timeout instead
2025-Sep-25 06:16:50.417870
Error response from daemon: No such container: xs8sk84k0g4oo4g048c0os8c
2025-Sep-25 06:16:50.516426
[CMD]: docker rm -f xs8sk84k0g4oo4g048c0os8c
2025-Sep-25 06:16:50.516426
Error response from daemon: No such container: xs8sk84k0g4oo4g048c0os8c
2025-Sep-25 06:16:50.641502
[CMD]: docker run -d --network coolify --name xs8sk84k0g4oo4g048c0os8c --rm -v /var/run/docker.sock:/var/run/docker.sock ghcr.io/coollabsio/coolify-helper:1.0.11
2025-Sep-25 06:16:50.641502
5a7ee4795c7ce764729a31045b7e29422702285566ce538d4a2e22a7565f0648
2025-Sep-25 06:16:54.040981
[CMD]: docker exec xs8sk84k0g4oo4g048c0os8c bash -c 'GIT_SSH_COMMAND="ssh -o ConnectTimeout=30 -p 22 -o Port=22 -o LogLevel=ERROR -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null" git ls-remote https://x-access-token:<REDACTED>@github.com/aaventuraid/Design.git refs/heads/main'
2025-Sep-25 06:16:54.040981
7d117056900ce8c8a08cb670da82e74b508db18c refs/heads/main
2025-Sep-25 06:16:54.531264

---

2025-Sep-25 06:16:54.554942
Importing aaventuraid/Design:main (commit sha HEAD) to /artifacts/xs8sk84k0g4oo4g048c0os8c.
2025-Sep-25 06:16:54.707112
[CMD]: docker exec xs8sk84k0g4oo4g048c0os8c bash -c 'git clone --depth=1 --recurse-submodules --shallow-submodules -b 'main' 'https://x-access-token:<REDACTED>@github.com/aaventuraid/Design.git' '/artifacts/xs8sk84k0g4oo4g048c0os8c' && cd /artifacts/xs8sk84k0g4oo4g048c0os8c && if [ -f .gitmodules ]; then git submodule sync && GIT_SSH_COMMAND="ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null" git submodule update --init --recursive --depth=1; fi && cd /artifacts/xs8sk84k0g4oo4g048c0os8c && GIT_SSH_COMMAND="ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null" git lfs pull'
2025-Sep-25 06:16:54.707112
Cloning into '/artifacts/xs8sk84k0g4oo4g048c0os8c'...
2025-Sep-25 06:16:56.773309
[CMD]: docker exec xs8sk84k0g4oo4g048c0os8c bash -c 'cd /artifacts/xs8sk84k0g4oo4g048c0os8c && git log -1 7d117056900ce8c8a08cb670da82e74b508db18c --pretty=%B'
2025-Sep-25 06:16:56.773309
fix: add empathic dependency required by Prisma 6.x for Coolify deployment
2025-Sep-25 06:16:56.773309
2025-Sep-25 06:16:56.773309
🐛 Missing Dependency Fix:
2025-Sep-25 06:16:56.773309

- Add empathic@^2.0.0 package to dependencies
  2025-Sep-25 06:16:56.773309
- Update Dockerfile to install empathic in production stage
  2025-Sep-25 06:16:56.773309
- Resolve MODULE_NOT_FOUND error for 'empathic/package'
  2025-Sep-25 06:16:56.773309
  2025-Sep-25 06:16:56.773309
  ✅ Prisma 6.x Dependencies Complete:
  2025-Sep-25 06:16:56.773309
- effect: ^3.9.2 ✓
  2025-Sep-25 06:16:56.773309
- fast-check: ^4.3.0 ✓
  2025-Sep-25 06:16:56.773309
- empathic: ^2.0.0 ✓
  2025-Sep-25 06:16:56.773309
  2025-Sep-25 06:16:56.773309
  🚀 Runtime Error Resolution:
  2025-Sep-25 06:16:56.773309
- Fixes Prisma config module loading issues
  2025-Sep-25 06:16:56.773309
- Ensures all @prisma/config dependencies are satisfied
  2025-Sep-25 06:16:56.773309
- Maintains Next.js server startup stability
  2025-Sep-25 06:16:56.773309
  2025-Sep-25 06:16:56.773309
  Server should start successfully after migrations complete
  2025-Sep-25 06:16:56.890126
  Image not found (xg04ckg0goo80oc0gkkcoc0w:7d117056900ce8c8a08cb670da82e74b508db18c). Building new image.
  2025-Sep-25 06:16:57.731771
  [CMD]: docker exec xs8sk84k0g4oo4g048c0os8c bash -c 'cat /artifacts/xs8sk84k0g4oo4g048c0os8c/Dockerfile'
  2025-Sep-25 06:16:57.731771

# Multi-stage Dockerfile optimized for Coolify v4 deployment

2025-Sep-25 06:16:57.731771

# Allow overriding the base image (useful if Docker Hub is rate-limited in CI/CD)

2025-Sep-25 06:16:57.731771
ARG BASE_IMAGE=node:20-alpine
2025-Sep-25 06:16:57.731771
FROM ${BASE_IMAGE} AS base
2025-Sep-25 06:16:57.731771
2025-Sep-25 06:16:57.731771

# Install system dependencies for Prisma, Sharp, and wget (for health checks)

2025-Sep-25 06:16:57.731771
RUN apk add --no-cache \
2025-Sep-25 06:16:57.731771
libc6-compat \
2025-Sep-25 06:16:57.731771
openssl \
2025-Sep-25 06:16:57.731771
wget \
2025-Sep-25 06:16:57.731771
curl \
2025-Sep-25 06:16:57.731771
&& rm -rf /var/cache/apk/\*
2025-Sep-25 06:16:57.731771
2025-Sep-25 06:16:57.731771

# Set timezone

2025-Sep-25 06:16:57.731771
RUN apk add --no-cache tzdata
2025-Sep-25 06:16:57.731771
ENV TZ=Asia/Jakarta
2025-Sep-25 06:16:57.731771
2025-Sep-25 06:16:57.731771

# ----------------------

2025-Sep-25 06:16:57.731771

# Dependencies stage

2025-Sep-25 06:16:57.731771

# ----------------------

2025-Sep-25 06:16:57.731771
FROM base AS deps
2025-Sep-25 06:16:57.731771
WORKDIR /app
2025-Sep-25 06:16:57.731771
ARG SOURCE_COMMIT
2025-Sep-25 06:16:57.731771
RUN echo "Building commit: ${SOURCE_COMMIT}" || true
2025-Sep-25 06:16:57.731771
2025-Sep-25 06:16:57.731771

# Copy package files and prisma schema

2025-Sep-25 06:16:57.731771
COPY package.json package-lock.json\* ./
2025-Sep-25 06:16:57.731771
COPY prisma ./prisma/
2025-Sep-25 06:16:57.731771
2025-Sep-25 06:16:57.731771

# Install production dependencies with retry mechanism

2025-Sep-25 06:16:57.731771
RUN npm ci --omit=dev --ignore-scripts --no-audit --no-fund && \
2025-Sep-25 06:16:57.731771
npm cache clean --force
2025-Sep-25 06:16:57.731771
2025-Sep-25 06:16:57.731771

# Install additional dependencies required by Prisma 6.x and effect package

2025-Sep-25 06:16:57.731771
RUN npm install --save effect@^3.9.2 fast-check@^4.3.0 empathic@^2.0.0
2025-Sep-25 06:16:57.731771
2025-Sep-25 06:16:57.731771

# Install Sharp for Alpine Linux musl compatibility (production deps)

2025-Sep-25 06:16:57.731771
RUN npm install --platform=linux --arch=x64 --libc=musl sharp
2025-Sep-25 06:16:57.731771
2025-Sep-25 06:16:57.731771

# Generate Prisma client

2025-Sep-25 06:16:57.731771
RUN npx prisma generate
2025-Sep-25 06:16:57.731771

# ----------------------

2025-Sep-25 06:16:57.731771

# Build stage

2025-Sep-25 06:16:57.731771

# ----------------------

2025-Sep-25 06:16:57.731771
FROM base AS builder
2025-Sep-25 06:16:57.731771
WORKDIR /app
2025-Sep-25 06:16:57.731771
2025-Sep-25 06:16:57.731771

# Disable telemetry and husky during build

2025-Sep-25 06:16:57.731771
ENV NEXT_TELEMETRY_DISABLED=1
2025-Sep-25 06:16:57.731771
ENV HUSKY=0
2025-Sep-25 06:16:57.731771
ENV CI=true
2025-Sep-25 06:16:57.731771
2025-Sep-25 06:16:57.731771

# Install all dependencies (including dev) for build

2025-Sep-25 06:16:57.731771
COPY package.json package-lock.json\* ./
2025-Sep-25 06:16:57.731771
COPY prisma ./prisma/
2025-Sep-25 06:16:57.731771
2025-Sep-25 06:16:57.731771

# Install with retry mechanism and proper error handling

2025-Sep-25 06:16:57.731771
RUN npm ci --no-audit --no-fund --prefer-offline --no-optional || \
2025-Sep-25 06:16:57.731771
(npm cache clean --force && npm ci --no-audit --no-fund)
2025-Sep-25 06:16:57.731771
2025-Sep-25 06:16:57.731771

# Install Sharp for Alpine Linux musl compatibility

2025-Sep-25 06:16:57.731771
RUN npm install --platform=linux --arch=x64 --libc=musl sharp
2025-Sep-25 06:16:57.731771
2025-Sep-25 06:16:57.731771

# Generate Prisma client for build

2025-Sep-25 06:16:57.731771
RUN npx prisma generate
2025-Sep-25 06:16:57.731771
2025-Sep-25 06:16:57.731771

# Copy source code (excluding node_modules and .next)

2025-Sep-25 06:16:57.731771
COPY . .
2025-Sep-25 06:16:57.731771
2025-Sep-25 06:16:57.731771

# Build the application with production environment

2025-Sep-25 06:16:57.731771
ENV NODE_ENV=production
2025-Sep-25 06:16:57.731771
RUN npm run build
2025-Sep-25 06:16:57.731771
2025-Sep-25 06:16:57.731771

# Verify build output

2025-Sep-25 06:16:57.731771
RUN ls -la .next/ && \
2025-Sep-25 06:16:57.731771
test -f .next/standalone/server.js && \
2025-Sep-25 06:16:57.731771
echo "Build successful: standalone server.js found"
2025-Sep-25 06:16:57.731771
2025-Sep-25 06:16:57.731771

# ----------------------

2025-Sep-25 06:16:57.731771

# Production runtime

2025-Sep-25 06:16:57.731771

# ----------------------

2025-Sep-25 06:16:57.731771
FROM base AS runner
2025-Sep-25 06:16:57.731771
WORKDIR /app
2025-Sep-25 06:16:57.731771
2025-Sep-25 06:16:57.731771

# Environment variables for production

2025-Sep-25 06:16:57.731771
ENV NODE_ENV=production
2025-Sep-25 06:16:57.731771
ENV NEXT_TELEMETRY_DISABLED=1
2025-Sep-25 06:16:57.731771
ENV PORT=3000
2025-Sep-25 06:16:57.731771
ENV HOSTNAME="0.0.0.0"
2025-Sep-25 06:16:57.731771
2025-Sep-25 06:16:57.731771

# Create system user and group

2025-Sep-25 06:16:57.731771
RUN addgroup --system --gid 1001 nodejs && \
2025-Sep-25 06:16:57.731771
adduser --system --uid 1001 nextjs
2025-Sep-25 06:16:57.731771
2025-Sep-25 06:16:57.731771

# Copy application files with proper ownership

2025-Sep-25 06:16:57.731771
COPY --from=builder /app/next.config.mjs ./
2025-Sep-25 06:16:57.731771
COPY --from=builder /app/public ./public
2025-Sep-25 06:16:57.731771
COPY --from=builder /app/package.json ./package.json
2025-Sep-25 06:16:57.731771
2025-Sep-25 06:16:57.731771

# Copy built Next.js application

2025-Sep-25 06:16:57.731771
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
2025-Sep-25 06:16:57.731771
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
2025-Sep-25 06:16:57.731771
2025-Sep-25 06:16:57.731771

# Copy Prisma files (client and schema)

2025-Sep-25 06:16:57.731771
COPY --from=deps --chown=nextjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma
2025-Sep-25 06:16:57.731771
COPY --from=deps --chown=nextjs:nodejs /app/node_modules/@prisma ./node_modules/@prisma
2025-Sep-25 06:16:57.731771
COPY --from=deps --chown=nextjs:nodejs /app/node_modules/prisma ./node_modules/prisma
2025-Sep-25 06:16:57.731771
COPY --from=deps --chown=nextjs:nodejs /app/node_modules/.bin ./node_modules/.bin
2025-Sep-25 06:16:57.731771
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
2025-Sep-25 06:16:57.731771
2025-Sep-25 06:16:57.731771

# Create data directory for persistent storage

2025-Sep-25 06:16:57.731771
RUN mkdir -p /app/data /app/.data && \
2025-Sep-25 06:16:57.731771
chown -R nextjs:nodejs /app/data /app/.data
2025-Sep-25 06:16:57.731771
2025-Sep-25 06:16:57.731771

# Switch to non-root user

2025-Sep-25 06:16:57.731771
USER nextjs
2025-Sep-25 06:16:57.731771
2025-Sep-25 06:16:57.731771

# Expose port

2025-Sep-25 06:16:57.731771
EXPOSE 3000
2025-Sep-25 06:16:57.731771
2025-Sep-25 06:16:57.731771

# Health check endpoint with extended startup period for Coolify v4

2025-Sep-25 06:16:57.731771
HEALTHCHECK --interval=30s --timeout=15s --start-period=60s --retries=5 \
2025-Sep-25 06:16:57.731771
CMD wget --no-verbose --tries=2 --timeout=10 --spider http://localhost:3000/api/health || exit 1
2025-Sep-25 06:16:57.731771
2025-Sep-25 06:16:57.731771

# Startup script with enhanced logging and error handling for Coolify v4

2025-Sep-25 06:16:57.731771
CMD ["sh", "-c", "\
2025-Sep-25 06:16:57.731771
echo '[COOLIFY] Starting application container...' && \
2025-Sep-25 06:16:57.731771
echo '[COOLIFY] Environment: NODE_ENV=${NODE_ENV}, PORT=${PORT}, HOSTNAME=${HOSTNAME}' && \
2025-Sep-25 06:16:57.731771
echo '[COOLIFY] Database URL: ${DATABASE_URL}' && \
2025-Sep-25 06:16:57.731771
echo '[COOLIFY] Running database migrations...' && \
2025-Sep-25 06:16:57.731771
npx prisma migrate deploy --schema=./prisma/schema.prisma && \
2025-Sep-25 06:16:57.731771
echo '[COOLIFY] Running database seed (if needed)...' && \
2025-Sep-25 06:16:57.731771
npx prisma db seed || echo '[COOLIFY] Seed not needed or failed, continuing...' && \
2025-Sep-25 06:16:57.731771
echo '[COOLIFY] Starting Next.js server on ${HOSTNAME}:${PORT}...' && \
2025-Sep-25 06:16:57.731771
echo '[COOLIFY] Health check will be available at http://${HOSTNAME}:${PORT}/api/health' && \
2025-Sep-25 06:16:57.731771
echo '[COOLIFY] Default login - Email: admin@localhost, Password: admin123' && \
2025-Sep-25 06:16:57.731771
node server.js \
2025-Sep-25 06:16:57.731771
"]
2025-Sep-25 06:16:57.922442

---

2025-Sep-25 06:16:57.927883
⚠️ Build-time environment variable warning: NODE_ENV=production
2025-Sep-25 06:16:57.933212
Affects: Node.js/npm/yarn/bun/pnpm
2025-Sep-25 06:16:57.938529
Issue: Skips devDependencies installation which are often required for building (webpack, typescript, etc.)
2025-Sep-25 06:16:57.943835
Recommendation: Uncheck "Available at Buildtime" or use "development" during build
2025-Sep-25 06:16:57.949126
2025-Sep-25 06:16:57.954576
💡 Tips to resolve build issues:
2025-Sep-25 06:16:57.959892

1. Set these variables as "Runtime only" in the environment variables settings
   2025-Sep-25 06:16:57.965148
2. Use different values for build-time (e.g., NODE_ENV=development for build)
   2025-Sep-25 06:16:57.970467
3. Consider using multi-stage Docker builds to separate build and runtime environments
   2025-Sep-25 06:16:58.126042
   [CMD]: docker exec xs8sk84k0g4oo4g048c0os8c bash -c 'cat /artifacts/xs8sk84k0g4oo4g048c0os8c/Dockerfile'
   2025-Sep-25 06:16:58.126042

# Multi-stage Dockerfile optimized for Coolify v4 deployment

2025-Sep-25 06:16:58.126042

# Allow overriding the base image (useful if Docker Hub is rate-limited in CI/CD)

2025-Sep-25 06:16:58.126042
ARG BASE_IMAGE=node:20-alpine
2025-Sep-25 06:16:58.126042
FROM ${BASE_IMAGE} AS base
2025-Sep-25 06:16:58.126042
2025-Sep-25 06:16:58.126042

# Install system dependencies for Prisma, Sharp, and wget (for health checks)

2025-Sep-25 06:16:58.126042
RUN apk add --no-cache \
2025-Sep-25 06:16:58.126042
libc6-compat \
2025-Sep-25 06:16:58.126042
openssl \
2025-Sep-25 06:16:58.126042
wget \
2025-Sep-25 06:16:58.126042
curl \
2025-Sep-25 06:16:58.126042
&& rm -rf /var/cache/apk/\*
2025-Sep-25 06:16:58.126042
2025-Sep-25 06:16:58.126042

# Set timezone

2025-Sep-25 06:16:58.126042
RUN apk add --no-cache tzdata
2025-Sep-25 06:16:58.126042
ENV TZ=Asia/Jakarta
2025-Sep-25 06:16:58.126042
2025-Sep-25 06:16:58.126042

# ----------------------

2025-Sep-25 06:16:58.126042

# Dependencies stage

2025-Sep-25 06:16:58.126042

# ----------------------

2025-Sep-25 06:16:58.126042
FROM base AS deps
2025-Sep-25 06:16:58.126042
WORKDIR /app
2025-Sep-25 06:16:58.126042
ARG SOURCE_COMMIT
2025-Sep-25 06:16:58.126042
RUN echo "Building commit: ${SOURCE_COMMIT}" || true
2025-Sep-25 06:16:58.126042
2025-Sep-25 06:16:58.126042

# Copy package files and prisma schema

2025-Sep-25 06:16:58.126042
COPY package.json package-lock.json\* ./
2025-Sep-25 06:16:58.126042
COPY prisma ./prisma/
2025-Sep-25 06:16:58.126042
2025-Sep-25 06:16:58.126042

# Install production dependencies with retry mechanism

2025-Sep-25 06:16:58.126042
RUN npm ci --omit=dev --ignore-scripts --no-audit --no-fund && \
2025-Sep-25 06:16:58.126042
npm cache clean --force
2025-Sep-25 06:16:58.126042
2025-Sep-25 06:16:58.126042

# Install additional dependencies required by Prisma 6.x and effect package

2025-Sep-25 06:16:58.126042
RUN npm install --save effect@^3.9.2 fast-check@^4.3.0 empathic@^2.0.0
2025-Sep-25 06:16:58.126042
2025-Sep-25 06:16:58.126042

# Install Sharp for Alpine Linux musl compatibility (production deps)

2025-Sep-25 06:16:58.126042
RUN npm install --platform=linux --arch=x64 --libc=musl sharp
2025-Sep-25 06:16:58.126042
2025-Sep-25 06:16:58.126042

# Generate Prisma client

2025-Sep-25 06:16:58.126042
RUN npx prisma generate
2025-Sep-25 06:16:58.126042

# ----------------------

2025-Sep-25 06:16:58.126042

# Build stage

2025-Sep-25 06:16:58.126042

# ----------------------

2025-Sep-25 06:16:58.126042
FROM base AS builder
2025-Sep-25 06:16:58.126042
WORKDIR /app
2025-Sep-25 06:16:58.126042
2025-Sep-25 06:16:58.126042

# Disable telemetry and husky during build

2025-Sep-25 06:16:58.126042
ENV NEXT_TELEMETRY_DISABLED=1
2025-Sep-25 06:16:58.126042
ENV HUSKY=0
2025-Sep-25 06:16:58.126042
ENV CI=true
2025-Sep-25 06:16:58.126042
2025-Sep-25 06:16:58.126042

# Install all dependencies (including dev) for build

2025-Sep-25 06:16:58.126042
COPY package.json package-lock.json\* ./
2025-Sep-25 06:16:58.126042
COPY prisma ./prisma/
2025-Sep-25 06:16:58.126042
2025-Sep-25 06:16:58.126042

# Install with retry mechanism and proper error handling

2025-Sep-25 06:16:58.126042
RUN npm ci --no-audit --no-fund --prefer-offline --no-optional || \
2025-Sep-25 06:16:58.126042
(npm cache clean --force && npm ci --no-audit --no-fund)
2025-Sep-25 06:16:58.126042
2025-Sep-25 06:16:58.126042

# Install Sharp for Alpine Linux musl compatibility

2025-Sep-25 06:16:58.126042
RUN npm install --platform=linux --arch=x64 --libc=musl sharp
2025-Sep-25 06:16:58.126042
2025-Sep-25 06:16:58.126042

# Generate Prisma client for build

2025-Sep-25 06:16:58.126042
RUN npx prisma generate
2025-Sep-25 06:16:58.126042
2025-Sep-25 06:16:58.126042

# Copy source code (excluding node_modules and .next)

2025-Sep-25 06:16:58.126042
COPY . .
2025-Sep-25 06:16:58.126042
2025-Sep-25 06:16:58.126042

# Build the application with production environment

2025-Sep-25 06:16:58.126042
ENV NODE_ENV=production
2025-Sep-25 06:16:58.126042
RUN npm run build
2025-Sep-25 06:16:58.126042
2025-Sep-25 06:16:58.126042

# Verify build output

2025-Sep-25 06:16:58.126042
RUN ls -la .next/ && \
2025-Sep-25 06:16:58.126042
test -f .next/standalone/server.js && \
2025-Sep-25 06:16:58.126042
echo "Build successful: standalone server.js found"
2025-Sep-25 06:16:58.126042
2025-Sep-25 06:16:58.126042

# ----------------------

2025-Sep-25 06:16:58.126042

# Production runtime

2025-Sep-25 06:16:58.126042

# ----------------------

2025-Sep-25 06:16:58.126042
FROM base AS runner
2025-Sep-25 06:16:58.126042
WORKDIR /app
2025-Sep-25 06:16:58.126042
2025-Sep-25 06:16:58.126042

# Environment variables for production

2025-Sep-25 06:16:58.126042
ENV NODE_ENV=production
2025-Sep-25 06:16:58.126042
ENV NEXT_TELEMETRY_DISABLED=1
2025-Sep-25 06:16:58.126042
ENV PORT=3000
2025-Sep-25 06:16:58.126042
ENV HOSTNAME="0.0.0.0"
2025-Sep-25 06:16:58.126042
2025-Sep-25 06:16:58.126042

# Create system user and group

2025-Sep-25 06:16:58.126042
RUN addgroup --system --gid 1001 nodejs && \
2025-Sep-25 06:16:58.126042
adduser --system --uid 1001 nextjs
2025-Sep-25 06:16:58.126042
2025-Sep-25 06:16:58.126042

# Copy application files with proper ownership

2025-Sep-25 06:16:58.126042
COPY --from=builder /app/next.config.mjs ./
2025-Sep-25 06:16:58.126042
COPY --from=builder /app/public ./public
2025-Sep-25 06:16:58.126042
COPY --from=builder /app/package.json ./package.json
2025-Sep-25 06:16:58.126042
2025-Sep-25 06:16:58.126042

# Copy built Next.js application

2025-Sep-25 06:16:58.126042
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
2025-Sep-25 06:16:58.126042
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
2025-Sep-25 06:16:58.126042
2025-Sep-25 06:16:58.126042

# Copy Prisma files (client and schema)

2025-Sep-25 06:16:58.126042
COPY --from=deps --chown=nextjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma
2025-Sep-25 06:16:58.126042
COPY --from=deps --chown=nextjs:nodejs /app/node_modules/@prisma ./node_modules/@prisma
2025-Sep-25 06:16:58.126042
COPY --from=deps --chown=nextjs:nodejs /app/node_modules/prisma ./node_modules/prisma
2025-Sep-25 06:16:58.126042
COPY --from=deps --chown=nextjs:nodejs /app/node_modules/.bin ./node_modules/.bin
2025-Sep-25 06:16:58.126042
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
2025-Sep-25 06:16:58.126042
2025-Sep-25 06:16:58.126042

# Create data directory for persistent storage

2025-Sep-25 06:16:58.126042
RUN mkdir -p /app/data /app/.data && \
2025-Sep-25 06:16:58.126042
chown -R nextjs:nodejs /app/data /app/.data
2025-Sep-25 06:16:58.126042
2025-Sep-25 06:16:58.126042

# Switch to non-root user

2025-Sep-25 06:16:58.126042
USER nextjs
2025-Sep-25 06:16:58.126042
2025-Sep-25 06:16:58.126042

# Expose port

2025-Sep-25 06:16:58.126042
EXPOSE 3000
2025-Sep-25 06:16:58.126042
2025-Sep-25 06:16:58.126042

# Health check endpoint with extended startup period for Coolify v4

2025-Sep-25 06:16:58.126042
HEALTHCHECK --interval=30s --timeout=15s --start-period=60s --retries=5 \
2025-Sep-25 06:16:58.126042
CMD wget --no-verbose --tries=2 --timeout=10 --spider http://localhost:3000/api/health || exit 1
2025-Sep-25 06:16:58.126042
2025-Sep-25 06:16:58.126042

# Startup script with enhanced logging and error handling for Coolify v4

2025-Sep-25 06:16:58.126042
CMD ["sh", "-c", "\
2025-Sep-25 06:16:58.126042
echo '[COOLIFY] Starting application container...' && \
2025-Sep-25 06:16:58.126042
echo '[COOLIFY] Environment: NODE_ENV=${NODE_ENV}, PORT=${PORT}, HOSTNAME=${HOSTNAME}' && \
2025-Sep-25 06:16:58.126042
echo '[COOLIFY] Database URL: ${DATABASE_URL}' && \
2025-Sep-25 06:16:58.126042
echo '[COOLIFY] Running database migrations...' && \
2025-Sep-25 06:16:58.126042
npx prisma migrate deploy --schema=./prisma/schema.prisma && \
2025-Sep-25 06:16:58.126042
echo '[COOLIFY] Running database seed (if needed)...' && \
2025-Sep-25 06:16:58.126042
npx prisma db seed || echo '[COOLIFY] Seed not needed or failed, continuing...' && \
2025-Sep-25 06:16:58.126042
echo '[COOLIFY] Starting Next.js server on ${HOSTNAME}:${PORT}...' && \
2025-Sep-25 06:16:58.126042
echo '[COOLIFY] Health check will be available at http://${HOSTNAME}:${PORT}/api/health' && \
2025-Sep-25 06:16:58.126042
echo '[COOLIFY] Default login - Email: admin@localhost, Password: admin123' && \
2025-Sep-25 06:16:58.126042
node server.js \
2025-Sep-25 06:16:58.126042
"]
2025-Sep-25 06:16:58.321325

---

2025-Sep-25 06:16:58.327132
Building docker image started.
2025-Sep-25 06:16:58.332910
To check the current progress, click on Show Debug Logs.
2025-Sep-25 06:16:58.652256
[CMD]: docker exec xs8sk84k0g4oo4g048c0os8c bash -c 'cat /artifacts/build.sh'
2025-Sep-25 06:16:58.652256
docker build --add-host coolify:10.0.1.6 --add-host coolify-db:10.0.1.4 --add-host coolify-realtime:10.0.1.3 --add-host coolify-redis:10.0.1.2 --add-host sw8cgooww404sgkswgswg08o:10.0.1.8 --network host -f /artifacts/xs8sk84k0g4oo4g048c0os8c/Dockerfile --build-arg SOURCE_COMMIT='7d117056900ce8c8a08cb670da82e74b508db18c' --build-arg DATABASE_URL='postgres://designDB:keoYPvVy5FgC9v7isPycTjbTMHTMOqBSv7FHuCzMzpamHP9QDvutlm2nQDT2PZMN@sw8cgooww404sgkswgswg08o:5432/designDB' --build-arg NEXTAUTH_SECRET='K8mJ9vN2pQ4rS7wX1aB6cE9fH3kL8mP5qR7tU0vY2zA4bC6dF9gH1jK3mN6pQ8sT' --build-arg NODE_ENV='production' --build-arg COOLIFY_BUILD_SECRETS_HASH=5dca975f8bbf81ee90de831727b1e769afad4bbb159cbc903e4ca77d07a0ed6a --build-arg 'COOLIFY_URL=https://design.yukiyaki.id' --build-arg 'COOLIFY_FQDN=design.yukiyaki.id' --build-arg 'COOLIFY_BRANCH=main' --build-arg 'COOLIFY_RESOURCE_UUID=xg04ckg0goo80oc0gkkcoc0w' --build-arg 'COOLIFY_CONTAINER_NAME=xg04ckg0goo80oc0gkkcoc0w-061648577280' --progress plain -t xg04ckg0goo80oc0gkkcoc0w:7d117056900ce8c8a08cb670da82e74b508db18c /artifacts/xs8sk84k0g4oo4g048c0os8c
2025-Sep-25 06:16:59.108628
[CMD]: docker exec xs8sk84k0g4oo4g048c0os8c bash -c 'bash /artifacts/build.sh'
2025-Sep-25 06:16:59.108628
#0 building with "default" instance using docker driver
2025-Sep-25 06:16:59.108628
2025-Sep-25 06:16:59.108628
#1 [internal] load build definition from Dockerfile
2025-Sep-25 06:16:59.108628
#1 transferring dockerfile: 5.05kB done
2025-Sep-25 06:16:59.108628
#1 DONE 0.0s
2025-Sep-25 06:16:59.108628
2025-Sep-25 06:16:59.108628
#2 [internal] load metadata for docker.io/library/node:20-alpine
2025-Sep-25 06:17:00.726707
#2 DONE 1.8s
2025-Sep-25 06:17:00.832588
#3 [internal] load .dockerignore
2025-Sep-25 06:17:00.832588
#3 transferring context: 1.15kB done
2025-Sep-25 06:17:00.832588
#3 DONE 0.1s
2025-Sep-25 06:17:00.832588
2025-Sep-25 06:17:00.832588
#4 [base 1/3] FROM docker.io/library/node:20-alpine@sha256:eabac870db94f7342d6c33560d6613f188bbcf4bbe1f4eb47d5e2a08e1a37722
2025-Sep-25 06:17:00.832588
#4 DONE 0.0s
2025-Sep-25 06:17:00.832588
2025-Sep-25 06:17:00.832588
#5 [base 2/3] RUN apk add --no-cache libc6-compat openssl wget curl && rm -rf /var/cache/apk/_
2025-Sep-25 06:17:00.832588
#5 CACHED
2025-Sep-25 06:17:00.832588
2025-Sep-25 06:17:00.832588
#6 [base 3/3] RUN apk add --no-cache tzdata
2025-Sep-25 06:17:00.832588
#6 CACHED
2025-Sep-25 06:17:00.832588
2025-Sep-25 06:17:00.832588
#7 [deps 1/8] WORKDIR /app
2025-Sep-25 06:17:00.832588
#7 CACHED
2025-Sep-25 06:17:00.832588
2025-Sep-25 06:17:00.832588
#8 [internal] load build context
2025-Sep-25 06:17:00.832588
#8 transferring context: 496.35kB 0.0s done
2025-Sep-25 06:17:00.933254
#8 DONE 0.0s
2025-Sep-25 06:17:00.933254
2025-Sep-25 06:17:00.933254
#9 [builder 2/9] COPY package.json package-lock.json_ ./
2025-Sep-25 06:17:00.933254
#9 DONE 0.0s
2025-Sep-25 06:17:00.933254
2025-Sep-25 06:17:00.933254
#10 [deps 2/8] RUN echo "Building commit: 7d117056900ce8c8a08cb670da82e74b508db18c" || true
2025-Sep-25 06:17:00.933254
#10 0.073 Building commit: 7d117056900ce8c8a08cb670da82e74b508db18c
2025-Sep-25 06:17:00.933254
#10 DONE 0.1s
2025-Sep-25 06:17:00.933254
2025-Sep-25 06:17:00.933254
#11 [builder 3/9] COPY prisma ./prisma/
2025-Sep-25 06:17:00.933254
#11 DONE 0.0s
2025-Sep-25 06:17:00.933254
2025-Sep-25 06:17:00.933254
#12 [deps 3/8] COPY package.json package-lock.json\* ./
2025-Sep-25 06:17:00.933254
#12 DONE 0.0s
2025-Sep-25 06:17:00.933254
2025-Sep-25 06:17:00.933254
#13 [deps 4/8] COPY prisma ./prisma/
2025-Sep-25 06:17:00.933254
#13 DONE 0.0s
2025-Sep-25 06:17:00.933254
2025-Sep-25 06:17:00.933254
#14 [builder 4/9] RUN npm ci --no-audit --no-fund --prefer-offline --no-optional || (npm cache clean --force && npm ci --no-audit --no-fund)
2025-Sep-25 06:17:01.117827
#14 0.218 npm warn config optional Use `--omit=optional` to exclude optional dependencies, or
2025-Sep-25 06:17:01.117827
#14 0.218 npm warn config `--include=optional` to include them.
2025-Sep-25 06:17:01.117827
#14 0.218 npm warn config
2025-Sep-25 06:17:01.117827
#14 0.218 npm warn config Default value does install optional deps unless otherwise omitted.
2025-Sep-25 06:17:11.018588
#14 ...
2025-Sep-25 06:17:11.018588
2025-Sep-25 06:17:11.018588
#15 [deps 5/8] RUN npm ci --omit=dev --ignore-scripts --no-audit --no-fund && npm cache clean --force
2025-Sep-25 06:18:24.987207
#15 84.02
2025-Sep-25 06:18:24.987207
#15 84.02 added 96 packages in 1m
2025-Sep-25 06:18:25.118512
#15 84.03 npm notice
2025-Sep-25 06:18:25.118512
#15 84.03 npm notice New major version of npm available! 10.8.2 -> 11.6.1
2025-Sep-25 06:18:25.118512
#15 84.03 npm notice Changelog: https://github.com/npm/cli/releases/tag/v11.6.1
2025-Sep-25 06:18:25.118512
#15 84.03 npm notice To update run: npm install -g npm@11.6.1
2025-Sep-25 06:18:25.118512
#15 84.03 npm notice
2025-Sep-25 06:18:25.151229
#15 84.22 npm warn using --force Recommended protections disabled.
2025-Sep-25 06:18:25.710759
#15 DONE 84.8s
2025-Sep-25 06:18:25.715046
#14 [builder 4/9] RUN npm ci --no-audit --no-fund --prefer-offline --no-optional || (npm cache clean --force && npm ci --no-audit --no-fund)
2025-Sep-25 06:18:25.865728
#14 ...
2025-Sep-25 06:18:25.865728
2025-Sep-25 06:18:25.865728
#16 [deps 6/8] RUN npm install --save effect@^3.9.2 fast-check@^4.3.0 empathic@^2.0.0
2025-Sep-25 06:18:37.878660
#16 ...
2025-Sep-25 06:18:37.878660
2025-Sep-25 06:18:37.878660
#14 [builder 4/9] RUN npm ci --no-audit --no-fund --prefer-offline --no-optional || (npm cache clean --force && npm ci --no-audit --no-fund)
2025-Sep-25 06:18:37.878660
#14 96.98
2025-Sep-25 06:18:37.878660
#14 96.98 > yuki-yaki-corner@0.1.0 prepare
2025-Sep-25 06:18:37.878660
#14 96.98 > husky
2025-Sep-25 06:18:37.878660
#14 96.98
2025-Sep-25 06:18:38.118275
#14 97.04 HUSKY=0 skip install
2025-Sep-25 06:18:38.128732
#14 97.07 added 491 packages in 2m
2025-Sep-25 06:18:38.409695
#14 DONE 97.5s
2025-Sep-25 06:18:38.409695
2025-Sep-25 06:18:38.409695
#16 [deps 6/8] RUN npm install --save effect@^3.9.2 fast-check@^4.3.0 empathic@^2.0.0
2025-Sep-25 06:18:38.562130
#16 ...
2025-Sep-25 06:18:38.562130
2025-Sep-25 06:18:38.562130
#17 [builder 5/9] RUN npm install --platform=linux --arch=x64 --libc=musl sharp
2025-Sep-25 06:18:52.357830
#17 ...
2025-Sep-25 06:18:52.362231
#16 [deps 6/8] RUN npm install --save effect@^3.9.2 fast-check@^4.3.0 empathic@^2.0.0
2025-Sep-25 06:18:52.362231
#16 26.64
2025-Sep-25 06:18:52.362231
#16 26.64 added 415 packages, changed 1 package, and audited 512 packages in 26s
2025-Sep-25 06:18:52.511735
#16 26.64
2025-Sep-25 06:18:52.511735
#16 26.64 197 packages are looking for funding
2025-Sep-25 06:18:52.511735
#16 26.64 run `npm fund` for details
2025-Sep-25 06:18:52.511735
#16 26.64
2025-Sep-25 06:18:52.511735
#16 26.64 found 0 vulnerabilities
2025-Sep-25 06:18:52.618290
#16 DONE 26.9s
2025-Sep-25 06:18:52.622734
#17 [builder 5/9] RUN npm install --platform=linux --arch=x64 --libc=musl sharp
2025-Sep-25 06:18:52.775581
#17 ...
2025-Sep-25 06:18:52.775581
2025-Sep-25 06:18:52.775581
#18 [deps 7/8] RUN npm install --platform=linux --arch=x64 --libc=musl sharp
2025-Sep-25 06:18:54.761700
#18 2.141
2025-Sep-25 06:18:54.761700
#18 2.141 up to date, audited 512 packages in 2s
2025-Sep-25 06:18:54.884122
#18 2.142
2025-Sep-25 06:18:54.894304
#18 2.142 197 packages are looking for funding
2025-Sep-25 06:18:54.894304
#18 2.142 run `npm fund` for details
2025-Sep-25 06:18:54.894304
#18 2.143
2025-Sep-25 06:18:54.894304
#18 2.143 found 0 vulnerabilities
2025-Sep-25 06:18:54.894304
#18 DONE 2.3s
2025-Sep-25 06:18:54.894304
2025-Sep-25 06:18:54.894304
#17 [builder 5/9] RUN npm install --platform=linux --arch=x64 --libc=musl sharp
2025-Sep-25 06:18:55.043455
#17 ...
2025-Sep-25 06:18:55.043455
2025-Sep-25 06:18:55.043455
#19 [deps 8/8] RUN npx prisma generate
2025-Sep-25 06:18:56.796948
#19 1.909 warn The configuration property `package.json#prisma` is deprecated and will be removed in Prisma 7. Please migrate to a Prisma config file (e.g., `prisma.config.ts`).
2025-Sep-25 06:18:56.796948
#19 1.909 For more information, see: https://pris.ly/prisma-config
2025-Sep-25 06:18:56.796948
#19 1.909
2025-Sep-25 06:19:02.729509
#19 7.840 Prisma schema loaded from prisma/schema.prisma
2025-Sep-25 06:19:03.634750
#19 8.747
2025-Sep-25 06:19:03.634750
#19 8.747 ✔ Generated Prisma Client (v6.16.2) to ./node_modules/@prisma/client in 317ms
2025-Sep-25 06:19:03.634750
#19 8.747
2025-Sep-25 06:19:03.634750
#19 8.747 Start by importing your Prisma Client (See: https://pris.ly/d/importing-client)
2025-Sep-25 06:19:03.634750
#19 8.747
2025-Sep-25 06:19:03.634750
#19 8.747 Tip: Want to turn off tips and other hints? https://pris.ly/tip-4-nohints
2025-Sep-25 06:19:03.634750
#19 8.747
2025-Sep-25 06:19:03.742979
#19 DONE 8.9s
2025-Sep-25 06:19:03.749087
#17 [builder 5/9] RUN npm install --platform=linux --arch=x64 --libc=musl sharp
2025-Sep-25 06:19:19.707340
#17 41.30
2025-Sep-25 06:19:19.707340
#17 41.30 added 17 packages, and audited 509 packages in 41s
2025-Sep-25 06:19:19.707340
#17 41.30
2025-Sep-25 06:19:19.707340
#17 41.30 197 packages are looking for funding
2025-Sep-25 06:19:19.861414
#17 41.30 run `npm fund` for details
2025-Sep-25 06:19:19.861414
#17 41.30
2025-Sep-25 06:19:19.861414
#17 41.30 found 0 vulnerabilities
2025-Sep-25 06:19:19.870574
2025-Sep-25 06:19:19.878391
#17 DONE 41.5s
2025-Sep-25 06:19:20.029174
#20 [builder 6/9] RUN npx prisma generate
2025-Sep-25 06:19:21.810272
#20 1.932 warn The configuration property `package.json#prisma` is deprecated and will be removed in Prisma 7. Please migrate to a Prisma config file (e.g., `prisma.config.ts`).
2025-Sep-25 06:19:21.814015
#20 1.932 For more information, see: https://pris.ly/prisma-config
2025-Sep-25 06:19:21.814015
#20 1.932
2025-Sep-25 06:19:22.257594
#20 2.379 Prisma schema loaded from prisma/schema.prisma
2025-Sep-25 06:19:22.849318
#20 2.969
2025-Sep-25 06:19:22.853768
#20 2.969 ✔ Generated Prisma Client (v6.16.2) to ./node_modules/@prisma/client in 241ms
2025-Sep-25 06:19:22.853768
#20 2.969
2025-Sep-25 06:19:22.853768
#20 2.969 Start by importing your Prisma Client (See: https://pris.ly/d/importing-client)
2025-Sep-25 06:19:22.857847
#20 2.969
2025-Sep-25 06:19:22.857847
#20 2.969 Tip: Interested in query caching in just a few lines of code? Try Accelerate today! https://pris.ly/tip-3-accelerate
2025-Sep-25 06:19:22.861770
#20 2.969
2025-Sep-25 06:19:22.950484
#20 DONE 3.0s
2025-Sep-25 06:19:22.950484
2025-Sep-25 06:19:22.950484
#21 [builder 7/9] COPY . .
2025-Sep-25 06:19:22.950484
#21 DONE 0.0s
2025-Sep-25 06:19:23.102782
#22 [builder 8/9] RUN npm run build
2025-Sep-25 06:19:23.179745
#22 0.227
2025-Sep-25 06:19:23.179745
#22 0.227 > yuki-yaki-corner@0.1.0 build
2025-Sep-25 06:19:23.179745
#22 0.227 > next build
2025-Sep-25 06:19:23.179745
#22 0.227
2025-Sep-25 06:19:24.170380
#22 1.218 ⚠ No build cache found. Please configure build caching for faster rebuilds. Read more: https://nextjs.org/docs/messages/no-cache
2025-Sep-25 06:19:24.296687
#22 1.296 ▲ Next.js 15.5.4
2025-Sep-25 06:19:24.296687
#22 1.296 - Experiments (use with caution):
2025-Sep-25 06:19:24.296687
#22 1.296 · serverActions
2025-Sep-25 06:19:24.296687
#22 1.296
2025-Sep-25 06:19:24.296687
#22 1.344 Creating an optimized production build ...
2025-Sep-25 06:19:37.202445
#22 14.25
2025-Sep-25 06:19:37.202445
#22 14.25
2025-Sep-25 06:19:37.202445
#22 14.25 Retrying 1/3...
2025-Sep-25 06:19:37.202445
#22 14.25
2025-Sep-25 06:19:37.202445
#22 14.25
2025-Sep-25 06:19:37.202445
#22 14.25 Retrying 1/3...
2025-Sep-25 06:19:37.202445
#22 14.25
2025-Sep-25 06:19:37.202445
#22 14.25
2025-Sep-25 06:19:37.202445
#22 14.25 Retrying 1/3...
2025-Sep-25 06:19:41.006389
#22 18.05 ✓ Compiled successfully in 13.0s
2025-Sep-25 06:19:41.030971
2025-Sep-25 06:19:41.161368
#22 18.06 Linting and checking validity of types ...
2025-Sep-25 06:19:41.165274
2025-Sep-25 06:19:49.644552
#22 26.69 Collecting page data ...
2025-Sep-25 06:19:52.653448
#22 29.70 Generating static pages (0/7) ...
2025-Sep-25 06:19:53.745961
#22 30.79 Generating static pages (1/7)
2025-Sep-25 06:19:53.902457
#22 30.79 Generating static pages (3/7)
2025-Sep-25 06:19:53.902457
#22 30.79 Generating static pages (5/7)
2025-Sep-25 06:19:53.902457
#22 30.80 ✓ Generating static pages (7/7)
2025-Sep-25 06:19:55.202235
#22 32.25 Finalizing page optimization ...
2025-Sep-25 06:19:55.353294
#22 32.25 Collecting build traces ...
2025-Sep-25 06:20:21.563399
#22 58.61
2025-Sep-25 06:20:21.689566
#22 58.62 Route (app) Size First Load JS
2025-Sep-25 06:20:21.689566
#22 58.62 ┌ ○ / 7.92 kB 110 kB
2025-Sep-25 06:20:21.689566
#22 58.62 ├ ○ /\_not-found 991 B 103 kB
2025-Sep-25 06:20:21.689566
#22 58.62 ├ ○ /admin 3.41 kB 105 kB
2025-Sep-25 06:20:21.689566
#22 58.62 ├ ƒ /api/admin/management 145 B 102 kB
2025-Sep-25 06:20:21.689566
#22 58.62 ├ ƒ /api/analytics 145 B 102 kB
2025-Sep-25 06:20:21.689566
#22 58.62 ├ ƒ /api/auth/login 145 B 102 kB
2025-Sep-25 06:20:21.689566
#22 58.62 ├ ƒ /api/auth/logout 145 B 102 kB
2025-Sep-25 06:20:21.689566
#22 58.62 ├ ƒ /api/auth/me 145 B 102 kB
2025-Sep-25 06:20:21.689566
#22 58.62 ├ ƒ /api/auth/register 145 B 102 kB
2025-Sep-25 06:20:21.689566
#22 58.62 ├ ƒ /api/generate-copy 145 B 102 kB
2025-Sep-25 06:20:21.689566
#22 58.62 ├ ƒ /api/health 145 B 102 kB
2025-Sep-25 06:20:21.689566
#22 58.62 ├ ƒ /api/process 145 B 102 kB
2025-Sep-25 06:20:21.689566
#22 58.62 ├ ○ /auth 1.96 kB 104 kB
2025-Sep-25 06:20:21.689566
#22 58.62 └ ○ /dashboard 2.14 kB 107 kB
2025-Sep-25 06:20:21.689566
#22 58.62 + First Load JS shared by all 102 kB
2025-Sep-25 06:20:21.689566
#22 58.62 ├ chunks/255-4efeec91c7871d79.js 45.7 kB
2025-Sep-25 06:20:21.689566
#22 58.62 ├ chunks/4bd1b696-c023c6e3521b1417.js 54.2 kB
2025-Sep-25 06:20:21.689566
#22 58.62 └ other shared chunks (total) 1.93 kB
2025-Sep-25 06:20:21.689566
#22 58.62
2025-Sep-25 06:20:21.689566
#22 58.62
2025-Sep-25 06:20:21.689566
#22 58.62 ○ (Static) prerendered as static content
2025-Sep-25 06:20:21.689566
#22 58.62 ƒ (Dynamic) server-rendered on demand
2025-Sep-25 06:20:21.689566
#22 58.62
2025-Sep-25 06:20:21.689566
#22 DONE 58.7s
2025-Sep-25 06:20:21.922474
#23 [builder 9/9] RUN ls -la .next/ && test -f .next/standalone/server.js && echo "Build successful: standalone server.js found"
2025-Sep-25 06:20:21.922474
#23 0.073 total 508
2025-Sep-25 06:20:21.922474
#23 0.073 drwxr-xr-x 8 root root 4096 Sep 25 13:20 .
2025-Sep-25 06:20:21.922474
#23 0.073 drwxr-xr-x 1 root root 4096 Sep 25 13:19 ..
2025-Sep-25 06:20:21.922474
#23 0.073 -rw-r--r-- 1 root root 21 Sep 25 13:19 BUILD_ID
2025-Sep-25 06:20:21.922474
#23 0.073 -rw-r--r-- 1 root root 4686 Sep 25 13:19 app-build-manifest.json
2025-Sep-25 06:20:21.922474
#23 0.073 -rw-r--r-- 1 root root 560 Sep 25 13:19 app-path-routes-manifest.json
2025-Sep-25 06:20:21.922474
#23 0.073 -rw-r--r-- 1 root root 995 Sep 25 13:19 build-manifest.json
2025-Sep-25 06:20:21.922474
#23 0.073 drwxr-xr-x 5 root root 4096 Sep 25 13:19 cache
2025-Sep-25 06:20:21.922474
#23 0.073 drwxr-xr-x 2 root root 4096 Sep 25 13:19 diagnostics
2025-Sep-25 06:20:21.922474
#23 0.073 -rw-r--r-- 1 root root 111 Sep 25 13:19 export-marker.json
2025-Sep-25 06:20:21.922474
#23 0.073 -rw-r--r-- 1 root root 1284 Sep 25 13:19 images-manifest.json
2025-Sep-25 06:20:21.922474
#23 0.073 -rw-r--r-- 1 root root 7776 Sep 25 13:20 next-minimal-server.js.nft.json
2025-Sep-25 06:20:21.922474
#23 0.073 -rw-r--r-- 1 root root 120362 Sep 25 13:20 next-server.js.nft.json
2025-Sep-25 06:20:21.922474
#23 0.073 -rw-r--r-- 1 root root 20 Sep 25 13:19 package.json
2025-Sep-25 06:20:21.922474
#23 0.073 -rw-r--r-- 1 root root 3393 Sep 25 13:19 prerender-manifest.json
2025-Sep-25 06:20:21.922474
#23 0.073 -rw-r--r-- 1 root root 2 Sep 25 13:19 react-loadable-manifest.json
2025-Sep-25 06:20:21.922474
#23 0.073 -rw-r--r-- 1 root root 9078 Sep 25 13:19 required-server-files.json
2025-Sep-25 06:20:21.922474
#23 0.073 -rw-r--r-- 1 root root 2380 Sep 25 13:19 routes-manifest.json
2025-Sep-25 06:20:21.922474
#23 0.073 drwxr-xr-x 5 root root 4096 Sep 25 13:19 server
2025-Sep-25 06:20:21.922474
#23 0.073 drwxr-xr-x 4 root root 4096 Sep 25 13:20 standalone
2025-Sep-25 06:20:21.922474
#23 0.073 drwxr-xr-x 6 root root 4096 Sep 25 13:19 static
2025-Sep-25 06:20:21.922474
#23 0.073 -rw-r--r-- 1 root root 297253 Sep 25 13:20 trace
2025-Sep-25 06:20:21.922474
#23 0.073 drwxr-xr-x 3 root root 4096 Sep 25 13:19 types
2025-Sep-25 06:20:21.922474
#23 0.073 Build successful: standalone server.js found
2025-Sep-25 06:20:21.922474
#23 DONE 0.1s
2025-Sep-25 06:20:23.018276
#24 [runner 2/13] RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs
2025-Sep-25 06:20:23.018276
#24 CACHED
2025-Sep-25 06:20:23.018276
2025-Sep-25 06:20:23.018276
#25 [runner 3/13] COPY --from=builder /app/next.config.mjs ./
2025-Sep-25 06:20:23.018276
#25 CACHED
2025-Sep-25 06:20:23.018276
2025-Sep-25 06:20:23.018276
#26 [runner 4/13] COPY --from=builder /app/public ./public
2025-Sep-25 06:20:23.018276
#26 CACHED
2025-Sep-25 06:20:23.018276
2025-Sep-25 06:20:23.018276
#27 [runner 5/13] COPY --from=builder /app/package.json ./package.json
2025-Sep-25 06:20:23.212397
#27 DONE 0.0s
2025-Sep-25 06:20:23.212397
2025-Sep-25 06:20:23.212397
#28 [runner 6/13] COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
2025-Sep-25 06:20:23.618299
#28 DONE 0.6s
2025-Sep-25 06:20:23.758975
#29 [runner 7/13] COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
2025-Sep-25 06:20:23.758975
#29 DONE 0.0s
2025-Sep-25 06:20:23.758975
2025-Sep-25 06:20:23.758975
#30 [runner 8/13] COPY --from=deps --chown=nextjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma
2025-Sep-25 06:20:23.758975
#30 DONE 0.1s
2025-Sep-25 06:20:23.910717
#31 [runner 9/13] COPY --from=deps --chown=nextjs:nodejs /app/node_modules/@prisma ./node_modules/@prisma
2025-Sep-25 06:20:25.361689
#31 DONE 1.6s
2025-Sep-25 06:20:25.515313
2025-Sep-25 06:20:25.519289
#32 [runner 10/13] COPY --from=deps --chown=nextjs:nodejs /app/node_modules/prisma ./node_modules/prisma
2025-Sep-25 06:20:25.698909
#32 DONE 0.3s
2025-Sep-25 06:20:25.836595
2025-Sep-25 06:20:25.840476
#33 [runner 11/13] COPY --from=deps --chown=nextjs:nodejs /app/node_modules/.bin ./node_modules/.bin
2025-Sep-25 06:20:25.840476
#33 DONE 0.0s
2025-Sep-25 06:20:25.840476
2025-Sep-25 06:20:25.840476
#34 [runner 12/13] COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
2025-Sep-25 06:20:25.840476
#34 DONE 0.0s
2025-Sep-25 06:20:25.840476
2025-Sep-25 06:20:25.840476
#35 [runner 13/13] RUN mkdir -p /app/data /app/.data && chown -R nextjs:nodejs /app/data /app/.data
2025-Sep-25 06:20:25.840476
#35 DONE 0.1s
2025-Sep-25 06:20:26.003369
#36 exporting to image
2025-Sep-25 06:20:26.003369
#36 exporting layers
2025-Sep-25 06:20:27.418793
#36 exporting layers 1.6s done
2025-Sep-25 06:20:27.472303
#36 writing image sha256:4a2ec9900a5eb0e163a49026f283181513856319a2aff145f3661a0afdb34132 done
2025-Sep-25 06:20:27.472303
#36 naming to docker.io/library/xg04ckg0goo80oc0gkkcoc0w:7d117056900ce8c8a08cb670da82e74b508db18c done
2025-Sep-25 06:20:27.472303
#36 DONE 1.6s
2025-Sep-25 06:20:27.534516
Building docker image completed.
2025-Sep-25 06:20:27.550508

---

2025-Sep-25 06:20:27.557289
Rolling update started.
2025-Sep-25 06:20:28.170590
[CMD]: docker exec xs8sk84k0g4oo4g048c0os8c bash -c 'SOURCE_COMMIT=7d117056900ce8c8a08cb670da82e74b508db18c COOLIFY_URL=https://design.yukiyaki.id COOLIFY_FQDN=design.yukiyaki.id COOLIFY_BRANCH=main docker compose --project-name xg04ckg0goo80oc0gkkcoc0w --project-directory /artifacts/xs8sk84k0g4oo4g048c0os8c -f /artifacts/xs8sk84k0g4oo4g048c0os8c/docker-compose.yaml up --build -d'
2025-Sep-25 06:20:28.170590
time="2025-09-25T06:20:28Z" level=warning msg="Found orphan containers ([xg04ckg0goo80oc0gkkcoc0w-045243022551]) for this project. If you removed or renamed this service in your compose file, you can run this command with the --remove-orphans flag to clean it up."
2025-Sep-25 06:20:28.170590
Container xg04ckg0goo80oc0gkkcoc0w-061648577280 Creating
2025-Sep-25 06:20:28.209938
xg04ckg0goo80oc0gkkcoc0w-061648577280 Your kernel does not support memory swappiness capabilities or the cgroup is not mounted. Memory swappiness discarded.
2025-Sep-25 06:20:28.217884
Container xg04ckg0goo80oc0gkkcoc0w-061648577280 Created
2025-Sep-25 06:20:28.217884
Container xg04ckg0goo80oc0gkkcoc0w-061648577280 Starting
2025-Sep-25 06:20:28.413019
Container xg04ckg0goo80oc0gkkcoc0w-061648577280 Started
2025-Sep-25 06:20:28.431413
New container started.
2025-Sep-25 06:20:28.444848
Custom healthcheck found, skipping default healthcheck.
2025-Sep-25 06:20:28.456209
Waiting for healthcheck to pass on the new container.
2025-Sep-25 06:20:28.476934
Waiting for the start period (60 seconds) before starting healthcheck.
2025-Sep-25 06:21:28.666071
[CMD]: docker inspect --format='{{json .State.Health.Status}}' xg04ckg0goo80oc0gkkcoc0w-061648577280
2025-Sep-25 06:21:28.666071
"healthy"
2025-Sep-25 06:21:28.778430
[CMD]: docker inspect --format='{{json .State.Health.Log}}' xg04ckg0goo80oc0gkkcoc0w-061648577280
2025-Sep-25 06:21:28.778430
[{"Start":"2025-09-25T06:20:33.412076384Z","End":"2025-09-25T06:20:33.518857266Z","ExitCode":1,"Output":"failed: Connection refused.\nhttp://localhost:3000/api/health:\nRemote file does not exist -- broken link!!!\n"},{"Start":"2025-09-25T06:20:38.519585532Z","End":"2025-09-25T06:20:38.581072294Z","ExitCode":1,"Output":"failed: Connection refused.\nhttp://localhost:3000/api/health:\nRemote file does not exist -- broken link!!!\n"},{"Start":"2025-09-25T06:20:43.582359847Z","End":"2025-09-25T06:20:43.661718523Z","ExitCode":0,"Output":"failed: Connection refused.\n2025-09-25 13:20:43 URL: http://localhost:3000/api/health 200 OK\n"},{"Start":"2025-09-25T06:21:13.663131595Z","End":"2025-09-25T06:21:13.720283139Z","ExitCode":0,"Output":"failed: Connection refused.\n2025-09-25 13:21:13 URL: http://localhost:3000/api/health 200 OK\n"}]
2025-Sep-25 06:21:28.791784
Attempt 1 of 5 | Healthcheck status: "healthy"
2025-Sep-25 06:21:28.799258
Healthcheck logs: failed: Connection refused.
2025-Sep-25 06:21:28.799258
2025-09-25 13:21:13 URL: http://localhost:3000/api/health 200 OK
2025-Sep-25 06:21:28.799258
| Return code: 0
2025-Sep-25 06:21:28.814688
New container is healthy.
2025-Sep-25 06:21:28.822110
Removing old containers.
2025-Sep-25 06:21:29.027920
[CMD]: docker stop --time=30 xg04ckg0goo80oc0gkkcoc0w-045243022551
2025-Sep-25 06:21:29.027920
Flag --time has been deprecated, use --timeout instead
2025-Sep-25 06:21:29.213384
xg04ckg0goo80oc0gkkcoc0w-045243022551
2025-Sep-25 06:21:29.374355
[CMD]: docker rm -f xg04ckg0goo80oc0gkkcoc0w-045243022551
2025-Sep-25 06:21:29.374355
xg04ckg0goo80oc0gkkcoc0w-045243022551
2025-Sep-25 06:21:29.386039
Rolling update completed.
2025-Sep-25 06:21:29.789659
Gracefully shutting down build container: xs8sk84k0g4oo4g048c0os8c
2025-Sep-25 06:21:29.891780
[CMD]: docker stop --time=30 xs8sk84k0g4oo4g048c0os8c
2025-Sep-25 06:21:29.891780
Flag --time has been deprecated, use --timeout instead
2025-Sep-25 06:21:30.056890
xs8sk84k0g4oo4g048c0os8c
2025-Sep-25 06:21:30.183533
[CMD]: docker rm -f xs8sk84k0g4oo4g048c0os8c
2025-Sep-25 06:21:30.183533
Error response from daemon: No such container: xs8sk84k0g4oo4g048c0os8c
