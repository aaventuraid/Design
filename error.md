https://panel.yukiyaki.id/project/qo08kgso808480s844o88w8o/environment/b408sgwwosss0k448wkkc4cg/application/xg04ckg0goo80oc0gkkcoc0w/logs#:~:text=2025%2D09%2D25T06,Ready%20in%20138ms

Deployment is Finished.

2025-Sep-25 06:45:43.098713
Starting deployment of aaventuraid/Design:main to localhost.
2025-Sep-25 06:45:43.781934
Preparing container with helper image: ghcr.io/coollabsio/coolify-helper:1.0.11.
2025-Sep-25 06:45:44.142159
[CMD]: docker stop --time=30 y4og4oo8gkkwo8440gs0kowo
2025-Sep-25 06:45:44.142159
Flag --time has been deprecated, use --timeout instead
2025-Sep-25 06:45:44.155925
Error response from daemon: No such container: y4og4oo8gkkwo8440gs0kowo
2025-Sep-25 06:45:44.486692
[CMD]: docker rm -f y4og4oo8gkkwo8440gs0kowo
2025-Sep-25 06:45:44.486692
Error response from daemon: No such container: y4og4oo8gkkwo8440gs0kowo
2025-Sep-25 06:45:44.897080
[CMD]: docker run -d --network coolify --name y4og4oo8gkkwo8440gs0kowo --rm -v /var/run/docker.sock:/var/run/docker.sock ghcr.io/coollabsio/coolify-helper:1.0.11
2025-Sep-25 06:45:44.897080
060578960ef03e14d85a735d980748184cc380763be9ce68a76f03ec5b3b36a3
2025-Sep-25 06:45:48.945362
[CMD]: docker exec y4og4oo8gkkwo8440gs0kowo bash -c 'GIT_SSH_COMMAND="ssh -o ConnectTimeout=30 -p 22 -o Port=22 -o LogLevel=ERROR -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null" git ls-remote https://x-access-token:<REDACTED>@github.com/aaventuraid/Design.git refs/heads/main'
2025-Sep-25 06:45:48.945362
57d6a3a00b50e8e56133d61c8f72634ed793753a refs/heads/main
2025-Sep-25 06:45:49.420053

---

2025-Sep-25 06:45:49.444722
Importing aaventuraid/Design:main (commit sha HEAD) to /artifacts/y4og4oo8gkkwo8440gs0kowo.
2025-Sep-25 06:45:49.840524
[CMD]: docker exec y4og4oo8gkkwo8440gs0kowo bash -c 'git clone --depth=1 --recurse-submodules --shallow-submodules -b 'main' 'https://x-access-token:<REDACTED>@github.com/aaventuraid/Design.git' '/artifacts/y4og4oo8gkkwo8440gs0kowo' && cd /artifacts/y4og4oo8gkkwo8440gs0kowo && if [ -f .gitmodules ]; then git submodule sync && GIT_SSH_COMMAND="ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null" git submodule update --init --recursive --depth=1; fi && cd /artifacts/y4og4oo8gkkwo8440gs0kowo && GIT_SSH_COMMAND="ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null" git lfs pull'
2025-Sep-25 06:45:49.840524
Cloning into '/artifacts/y4og4oo8gkkwo8440gs0kowo'...
2025-Sep-25 06:45:52.686668
[CMD]: docker exec y4og4oo8gkkwo8440gs0kowo bash -c 'cd /artifacts/y4og4oo8gkkwo8440gs0kowo && git log -1 57d6a3a00b50e8e56133d61c8f72634ed793753a --pretty=%B'
2025-Sep-25 06:45:52.686668
chore: fix Coolify deploy errors (Prisma config, transitive deps in runtime, dev config)
2025-Sep-25 06:45:53.071370
Image not found (xg04ckg0goo80oc0gkkcoc0w:57d6a3a00b50e8e56133d61c8f72634ed793753a). Building new image.
2025-Sep-25 06:45:55.462125
[CMD]: docker exec y4og4oo8gkkwo8440gs0kowo bash -c 'cat /artifacts/y4og4oo8gkkwo8440gs0kowo/Dockerfile'
2025-Sep-25 06:45:55.462125

# Multi-stage Dockerfile optimized for Coolify v4 deployment

2025-Sep-25 06:45:55.462125

# Allow overriding the base image (useful if Docker Hub is rate-limited in CI/CD)

2025-Sep-25 06:45:55.462125
ARG BASE_IMAGE=node:20-alpine
2025-Sep-25 06:45:55.462125
FROM ${BASE_IMAGE} AS base
2025-Sep-25 06:45:55.462125
2025-Sep-25 06:45:55.462125

# Install system dependencies for Prisma, Sharp, and wget (for health checks)

2025-Sep-25 06:45:55.462125
RUN apk add --no-cache \
2025-Sep-25 06:45:55.462125
libc6-compat \
2025-Sep-25 06:45:55.462125
openssl \
2025-Sep-25 06:45:55.462125
wget \
2025-Sep-25 06:45:55.462125
curl \
2025-Sep-25 06:45:55.462125
&& rm -rf /var/cache/apk/\*
2025-Sep-25 06:45:55.462125
2025-Sep-25 06:45:55.462125

# Set timezone

2025-Sep-25 06:45:55.462125
RUN apk add --no-cache tzdata
2025-Sep-25 06:45:55.462125
ENV TZ=Asia/Jakarta
2025-Sep-25 06:45:55.462125
2025-Sep-25 06:45:55.462125

# ----------------------

2025-Sep-25 06:45:55.462125

# Dependencies stage

2025-Sep-25 06:45:55.462125

# ----------------------

2025-Sep-25 06:45:55.462125
FROM base AS deps
2025-Sep-25 06:45:55.462125
WORKDIR /app
2025-Sep-25 06:45:55.462125
ARG SOURCE_COMMIT
2025-Sep-25 06:45:55.462125
RUN echo "Building commit: ${SOURCE_COMMIT}" || true
2025-Sep-25 06:45:55.462125
2025-Sep-25 06:45:55.462125

# Copy package files and prisma schema

2025-Sep-25 06:45:55.462125
COPY package.json package-lock.json\* ./
2025-Sep-25 06:45:55.462125
COPY prisma ./prisma/
2025-Sep-25 06:45:55.462125
2025-Sep-25 06:45:55.462125

# Install production dependencies with retry mechanism

2025-Sep-25 06:45:55.462125
RUN npm ci --omit=dev --ignore-scripts --no-audit --no-fund && \
2025-Sep-25 06:45:55.462125
npm cache clean --force
2025-Sep-25 06:45:55.462125
2025-Sep-25 06:45:55.462125

# Install additional dependencies required by Prisma 6.x and effect package

2025-Sep-25 06:45:55.462125
RUN npm install --save effect@^3.9.2 fast-check@^4.3.0 empathic@^2.0.0
2025-Sep-25 06:45:55.462125
2025-Sep-25 06:45:55.462125

# Install Sharp for Alpine Linux musl compatibility (production deps)

2025-Sep-25 06:45:55.462125
RUN npm install --platform=linux --arch=x64 --libc=musl sharp
2025-Sep-25 06:45:55.462125
2025-Sep-25 06:45:55.462125

# Generate Prisma client

2025-Sep-25 06:45:55.462125
RUN npx prisma generate
2025-Sep-25 06:45:55.462125

# ----------------------

2025-Sep-25 06:45:55.462125

# Build stage

2025-Sep-25 06:45:55.462125

# ----------------------

2025-Sep-25 06:45:55.462125
FROM base AS builder
2025-Sep-25 06:45:55.462125
WORKDIR /app
2025-Sep-25 06:45:55.462125
2025-Sep-25 06:45:55.462125

# Disable telemetry and husky during build

2025-Sep-25 06:45:55.462125
ENV NEXT_TELEMETRY_DISABLED=1
2025-Sep-25 06:45:55.462125
ENV HUSKY=0
2025-Sep-25 06:45:55.462125
ENV CI=true
2025-Sep-25 06:45:55.462125
2025-Sep-25 06:45:55.462125

# Install all dependencies (including dev) for build

2025-Sep-25 06:45:55.462125
COPY package.json package-lock.json\* ./
2025-Sep-25 06:45:55.462125
COPY prisma ./prisma/
2025-Sep-25 06:45:55.462125
2025-Sep-25 06:45:55.462125

# Install with retry mechanism and proper error handling

2025-Sep-25 06:45:55.462125
RUN npm ci --no-audit --no-fund --prefer-offline --no-optional || \
2025-Sep-25 06:45:55.462125
(npm cache clean --force && npm ci --no-audit --no-fund)
2025-Sep-25 06:45:55.462125
2025-Sep-25 06:45:55.462125

# Install Sharp for Alpine Linux musl compatibility

2025-Sep-25 06:45:55.462125
RUN npm install --platform=linux --arch=x64 --libc=musl sharp
2025-Sep-25 06:45:55.462125
2025-Sep-25 06:45:55.462125

# Generate Prisma client for build

2025-Sep-25 06:45:55.462125
RUN npx prisma generate
2025-Sep-25 06:45:55.462125
2025-Sep-25 06:45:55.462125

# Copy source code (excluding node_modules and .next)

2025-Sep-25 06:45:55.462125
COPY . .
2025-Sep-25 06:45:55.462125
2025-Sep-25 06:45:55.462125

# Build the application with production environment

2025-Sep-25 06:45:55.462125
ENV NODE_ENV=production
2025-Sep-25 06:45:55.462125
RUN npm run build
2025-Sep-25 06:45:55.462125
2025-Sep-25 06:45:55.462125

# Verify build output

2025-Sep-25 06:45:55.462125
RUN ls -la .next/ && \
2025-Sep-25 06:45:55.462125
test -f .next/standalone/server.js && \
2025-Sep-25 06:45:55.462125
echo "Build successful: standalone server.js found"
2025-Sep-25 06:45:55.462125
2025-Sep-25 06:45:55.462125

# ----------------------

2025-Sep-25 06:45:55.462125

# Production runtime

2025-Sep-25 06:45:55.462125

# ----------------------

2025-Sep-25 06:45:55.462125
FROM base AS runner
2025-Sep-25 06:45:55.462125
WORKDIR /app
2025-Sep-25 06:45:55.462125
2025-Sep-25 06:45:55.462125

# Environment variables for production

2025-Sep-25 06:45:55.462125
ENV NODE_ENV=production
2025-Sep-25 06:45:55.462125
ENV NEXT_TELEMETRY_DISABLED=1
2025-Sep-25 06:45:55.462125
ENV PORT=3000
2025-Sep-25 06:45:55.462125
ENV HOSTNAME="0.0.0.0"
2025-Sep-25 06:45:55.462125
2025-Sep-25 06:45:55.462125

# Create system user and group

2025-Sep-25 06:45:55.462125
RUN addgroup --system --gid 1001 nodejs && \
2025-Sep-25 06:45:55.462125
adduser --system --uid 1001 nextjs
2025-Sep-25 06:45:55.462125
2025-Sep-25 06:45:55.462125

# Copy application files with proper ownership

2025-Sep-25 06:45:55.462125
COPY --from=builder /app/next.config.mjs ./
2025-Sep-25 06:45:55.462125
COPY --from=builder /app/public ./public
2025-Sep-25 06:45:55.462125
COPY --from=builder /app/package.json ./package.json
2025-Sep-25 06:45:55.462125
2025-Sep-25 06:45:55.462125

# Copy built Next.js application

2025-Sep-25 06:45:55.462125
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
2025-Sep-25 06:45:55.462125
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
2025-Sep-25 06:45:55.462125
2025-Sep-25 06:45:55.462125

# Copy Prisma files (client and schema)

2025-Sep-25 06:45:55.462125
COPY --from=deps --chown=nextjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma
2025-Sep-25 06:45:55.462125
COPY --from=deps --chown=nextjs:nodejs /app/node_modules/@prisma ./node_modules/@prisma
2025-Sep-25 06:45:55.462125
COPY --from=deps --chown=nextjs:nodejs /app/node_modules/prisma ./node_modules/prisma
2025-Sep-25 06:45:55.462125
COPY --from=deps --chown=nextjs:nodejs /app/node_modules/.bin ./node_modules/.bin
2025-Sep-25 06:45:55.462125

## Prisma 6.x transitive deps required at runtime

2025-Sep-25 06:45:55.462125
COPY --from=deps --chown=nextjs:nodejs /app/node_modules/empathic ./node_modules/empathic
2025-Sep-25 06:45:55.462125
COPY --from=deps --chown=nextjs:nodejs /app/node_modules/effect ./node_modules/effect
2025-Sep-25 06:45:55.462125
COPY --from=deps --chown=nextjs:nodejs /app/node_modules/fast-check ./node_modules/fast-check
2025-Sep-25 06:45:55.462125
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
2025-Sep-25 06:45:55.462125
2025-Sep-25 06:45:55.462125

# Create data directory for persistent storage

2025-Sep-25 06:45:55.462125
RUN mkdir -p /app/data /app/.data && \
2025-Sep-25 06:45:55.462125
chown -R nextjs:nodejs /app/data /app/.data
2025-Sep-25 06:45:55.462125
2025-Sep-25 06:45:55.462125

# Switch to non-root user

2025-Sep-25 06:45:55.462125
USER nextjs
2025-Sep-25 06:45:55.462125
2025-Sep-25 06:45:55.462125

# Expose port

2025-Sep-25 06:45:55.462125
EXPOSE 3000
2025-Sep-25 06:45:55.462125
2025-Sep-25 06:45:55.462125

# Health check endpoint with extended startup period for Coolify v4

2025-Sep-25 06:45:55.462125
HEALTHCHECK --interval=30s --timeout=15s --start-period=60s --retries=5 \
2025-Sep-25 06:45:55.462125
CMD wget --no-verbose --tries=2 --timeout=10 --spider http://localhost:3000/api/health || exit 1
2025-Sep-25 06:45:55.462125
2025-Sep-25 06:45:55.462125

# Startup script with enhanced logging and error handling for Coolify v4

2025-Sep-25 06:45:55.462125
CMD ["sh", "-c", "\
2025-Sep-25 06:45:55.462125
echo '[COOLIFY] Starting application container...' && \
2025-Sep-25 06:45:55.462125
echo '[COOLIFY] Environment: NODE_ENV=${NODE_ENV}, PORT=${PORT}, HOSTNAME=${HOSTNAME}' && \
2025-Sep-25 06:45:55.462125
echo '[COOLIFY] Database URL: ${DATABASE_URL}' && \
2025-Sep-25 06:45:55.462125
echo '[COOLIFY] Running database migrations...' && \
2025-Sep-25 06:45:55.462125
npx prisma migrate deploy --schema=./prisma/schema.prisma && \
2025-Sep-25 06:45:55.462125
echo '[COOLIFY] Running database seed (if needed)...' && \
2025-Sep-25 06:45:55.462125
npx prisma db seed || echo '[COOLIFY] Seed not needed or failed, continuing...' && \
2025-Sep-25 06:45:55.462125
echo '[COOLIFY] Starting Next.js server on ${HOSTNAME}:${PORT}...' && \
2025-Sep-25 06:45:55.462125
echo '[COOLIFY] Health check will be available at http://${HOSTNAME}:${PORT}/api/health' && \
2025-Sep-25 06:45:55.462125
echo '[COOLIFY] Default login - Email: admin@localhost, Password: admin123' && \
2025-Sep-25 06:45:55.462125
node server.js \
2025-Sep-25 06:45:55.462125
"]
2025-Sep-25 06:45:55.898765

---

2025-Sep-25 06:45:55.904301
⚠️ Build-time environment variable warning: NODE_ENV=production
2025-Sep-25 06:45:55.909538
Affects: Node.js/npm/yarn/bun/pnpm
2025-Sep-25 06:45:55.914693
Issue: Skips devDependencies installation which are often required for building (webpack, typescript, etc.)
2025-Sep-25 06:45:55.919810
Recommendation: Uncheck "Available at Buildtime" or use "development" during build
2025-Sep-25 06:45:55.925116
2025-Sep-25 06:45:55.930448
💡 Tips to resolve build issues:
2025-Sep-25 06:45:55.935706

1. Set these variables as "Runtime only" in the environment variables settings
   2025-Sep-25 06:45:55.940860
2. Use different values for build-time (e.g., NODE_ENV=development for build)
   2025-Sep-25 06:45:55.946062
3. Consider using multi-stage Docker builds to separate build and runtime environments
   2025-Sep-25 06:45:56.354728
   [CMD]: docker exec y4og4oo8gkkwo8440gs0kowo bash -c 'cat /artifacts/y4og4oo8gkkwo8440gs0kowo/Dockerfile'
   2025-Sep-25 06:45:56.354728

# Multi-stage Dockerfile optimized for Coolify v4 deployment

2025-Sep-25 06:45:56.354728

# Allow overriding the base image (useful if Docker Hub is rate-limited in CI/CD)

2025-Sep-25 06:45:56.354728
ARG BASE_IMAGE=node:20-alpine
2025-Sep-25 06:45:56.354728
FROM ${BASE_IMAGE} AS base
2025-Sep-25 06:45:56.354728
2025-Sep-25 06:45:56.354728

# Install system dependencies for Prisma, Sharp, and wget (for health checks)

2025-Sep-25 06:45:56.354728
RUN apk add --no-cache \
2025-Sep-25 06:45:56.354728
libc6-compat \
2025-Sep-25 06:45:56.354728
openssl \
2025-Sep-25 06:45:56.354728
wget \
2025-Sep-25 06:45:56.354728
curl \
2025-Sep-25 06:45:56.354728
&& rm -rf /var/cache/apk/\*
2025-Sep-25 06:45:56.354728
2025-Sep-25 06:45:56.354728

# Set timezone

2025-Sep-25 06:45:56.354728
RUN apk add --no-cache tzdata
2025-Sep-25 06:45:56.354728
ENV TZ=Asia/Jakarta
2025-Sep-25 06:45:56.354728
2025-Sep-25 06:45:56.354728

# ----------------------

2025-Sep-25 06:45:56.354728

# Dependencies stage

2025-Sep-25 06:45:56.354728

# ----------------------

2025-Sep-25 06:45:56.354728
FROM base AS deps
2025-Sep-25 06:45:56.354728
WORKDIR /app
2025-Sep-25 06:45:56.354728
ARG SOURCE_COMMIT
2025-Sep-25 06:45:56.354728
RUN echo "Building commit: ${SOURCE_COMMIT}" || true
2025-Sep-25 06:45:56.354728
2025-Sep-25 06:45:56.354728

# Copy package files and prisma schema

2025-Sep-25 06:45:56.354728
COPY package.json package-lock.json\* ./
2025-Sep-25 06:45:56.354728
COPY prisma ./prisma/
2025-Sep-25 06:45:56.354728
2025-Sep-25 06:45:56.354728

# Install production dependencies with retry mechanism

2025-Sep-25 06:45:56.354728
RUN npm ci --omit=dev --ignore-scripts --no-audit --no-fund && \
2025-Sep-25 06:45:56.354728
npm cache clean --force
2025-Sep-25 06:45:56.354728
2025-Sep-25 06:45:56.354728

# Install additional dependencies required by Prisma 6.x and effect package

2025-Sep-25 06:45:56.354728
RUN npm install --save effect@^3.9.2 fast-check@^4.3.0 empathic@^2.0.0
2025-Sep-25 06:45:56.354728
2025-Sep-25 06:45:56.354728

# Install Sharp for Alpine Linux musl compatibility (production deps)

2025-Sep-25 06:45:56.354728
RUN npm install --platform=linux --arch=x64 --libc=musl sharp
2025-Sep-25 06:45:56.354728
2025-Sep-25 06:45:56.354728

# Generate Prisma client

2025-Sep-25 06:45:56.354728
RUN npx prisma generate
2025-Sep-25 06:45:56.354728

# ----------------------

2025-Sep-25 06:45:56.354728

# Build stage

2025-Sep-25 06:45:56.354728

# ----------------------

2025-Sep-25 06:45:56.354728
FROM base AS builder
2025-Sep-25 06:45:56.354728
WORKDIR /app
2025-Sep-25 06:45:56.354728
2025-Sep-25 06:45:56.354728

# Disable telemetry and husky during build

2025-Sep-25 06:45:56.354728
ENV NEXT_TELEMETRY_DISABLED=1
2025-Sep-25 06:45:56.354728
ENV HUSKY=0
2025-Sep-25 06:45:56.354728
ENV CI=true
2025-Sep-25 06:45:56.354728
2025-Sep-25 06:45:56.354728

# Install all dependencies (including dev) for build

2025-Sep-25 06:45:56.354728
COPY package.json package-lock.json\* ./
2025-Sep-25 06:45:56.354728
COPY prisma ./prisma/
2025-Sep-25 06:45:56.354728
2025-Sep-25 06:45:56.354728

# Install with retry mechanism and proper error handling

2025-Sep-25 06:45:56.354728
RUN npm ci --no-audit --no-fund --prefer-offline --no-optional || \
2025-Sep-25 06:45:56.354728
(npm cache clean --force && npm ci --no-audit --no-fund)
2025-Sep-25 06:45:56.354728
2025-Sep-25 06:45:56.354728

# Install Sharp for Alpine Linux musl compatibility

2025-Sep-25 06:45:56.354728
RUN npm install --platform=linux --arch=x64 --libc=musl sharp
2025-Sep-25 06:45:56.354728
2025-Sep-25 06:45:56.354728

# Generate Prisma client for build

2025-Sep-25 06:45:56.354728
RUN npx prisma generate
2025-Sep-25 06:45:56.354728
2025-Sep-25 06:45:56.354728

# Copy source code (excluding node_modules and .next)

2025-Sep-25 06:45:56.354728
COPY . .
2025-Sep-25 06:45:56.354728
2025-Sep-25 06:45:56.354728

# Build the application with production environment

2025-Sep-25 06:45:56.354728
ENV NODE_ENV=production
2025-Sep-25 06:45:56.354728
RUN npm run build
2025-Sep-25 06:45:56.354728
2025-Sep-25 06:45:56.354728

# Verify build output

2025-Sep-25 06:45:56.354728
RUN ls -la .next/ && \
2025-Sep-25 06:45:56.354728
test -f .next/standalone/server.js && \
2025-Sep-25 06:45:56.354728
echo "Build successful: standalone server.js found"
2025-Sep-25 06:45:56.354728
2025-Sep-25 06:45:56.354728

# ----------------------

2025-Sep-25 06:45:56.354728

# Production runtime

2025-Sep-25 06:45:56.354728

# ----------------------

2025-Sep-25 06:45:56.354728
FROM base AS runner
2025-Sep-25 06:45:56.354728
WORKDIR /app
2025-Sep-25 06:45:56.354728
2025-Sep-25 06:45:56.354728

# Environment variables for production

2025-Sep-25 06:45:56.354728
ENV NODE_ENV=production
2025-Sep-25 06:45:56.354728
ENV NEXT_TELEMETRY_DISABLED=1
2025-Sep-25 06:45:56.354728
ENV PORT=3000
2025-Sep-25 06:45:56.354728
ENV HOSTNAME="0.0.0.0"
2025-Sep-25 06:45:56.354728
2025-Sep-25 06:45:56.354728

# Create system user and group

2025-Sep-25 06:45:56.354728
RUN addgroup --system --gid 1001 nodejs && \
2025-Sep-25 06:45:56.354728
adduser --system --uid 1001 nextjs
2025-Sep-25 06:45:56.354728
2025-Sep-25 06:45:56.354728

# Copy application files with proper ownership

2025-Sep-25 06:45:56.354728
COPY --from=builder /app/next.config.mjs ./
2025-Sep-25 06:45:56.354728
COPY --from=builder /app/public ./public
2025-Sep-25 06:45:56.354728
COPY --from=builder /app/package.json ./package.json
2025-Sep-25 06:45:56.354728
2025-Sep-25 06:45:56.354728

# Copy built Next.js application

2025-Sep-25 06:45:56.354728
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
2025-Sep-25 06:45:56.354728
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
2025-Sep-25 06:45:56.354728
2025-Sep-25 06:45:56.354728

# Copy Prisma files (client and schema)

2025-Sep-25 06:45:56.354728
COPY --from=deps --chown=nextjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma
2025-Sep-25 06:45:56.354728
COPY --from=deps --chown=nextjs:nodejs /app/node_modules/@prisma ./node_modules/@prisma
2025-Sep-25 06:45:56.354728
COPY --from=deps --chown=nextjs:nodejs /app/node_modules/prisma ./node_modules/prisma
2025-Sep-25 06:45:56.354728
COPY --from=deps --chown=nextjs:nodejs /app/node_modules/.bin ./node_modules/.bin
2025-Sep-25 06:45:56.354728

## Prisma 6.x transitive deps required at runtime

2025-Sep-25 06:45:56.354728
COPY --from=deps --chown=nextjs:nodejs /app/node_modules/empathic ./node_modules/empathic
2025-Sep-25 06:45:56.354728
COPY --from=deps --chown=nextjs:nodejs /app/node_modules/effect ./node_modules/effect
2025-Sep-25 06:45:56.354728
COPY --from=deps --chown=nextjs:nodejs /app/node_modules/fast-check ./node_modules/fast-check
2025-Sep-25 06:45:56.354728
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
2025-Sep-25 06:45:56.354728
2025-Sep-25 06:45:56.354728

# Create data directory for persistent storage

2025-Sep-25 06:45:56.354728
RUN mkdir -p /app/data /app/.data && \
2025-Sep-25 06:45:56.354728
chown -R nextjs:nodejs /app/data /app/.data
2025-Sep-25 06:45:56.354728
2025-Sep-25 06:45:56.354728

# Switch to non-root user

2025-Sep-25 06:45:56.354728
USER nextjs
2025-Sep-25 06:45:56.354728
2025-Sep-25 06:45:56.354728

# Expose port

2025-Sep-25 06:45:56.354728
EXPOSE 3000
2025-Sep-25 06:45:56.354728
2025-Sep-25 06:45:56.354728

# Health check endpoint with extended startup period for Coolify v4

2025-Sep-25 06:45:56.354728
HEALTHCHECK --interval=30s --timeout=15s --start-period=60s --retries=5 \
2025-Sep-25 06:45:56.354728
CMD wget --no-verbose --tries=2 --timeout=10 --spider http://localhost:3000/api/health || exit 1
2025-Sep-25 06:45:56.354728
2025-Sep-25 06:45:56.354728

# Startup script with enhanced logging and error handling for Coolify v4

2025-Sep-25 06:45:56.354728
CMD ["sh", "-c", "\
2025-Sep-25 06:45:56.354728
echo '[COOLIFY] Starting application container...' && \
2025-Sep-25 06:45:56.354728
echo '[COOLIFY] Environment: NODE_ENV=${NODE_ENV}, PORT=${PORT}, HOSTNAME=${HOSTNAME}' && \
2025-Sep-25 06:45:56.354728
echo '[COOLIFY] Database URL: ${DATABASE_URL}' && \
2025-Sep-25 06:45:56.354728
echo '[COOLIFY] Running database migrations...' && \
2025-Sep-25 06:45:56.354728
npx prisma migrate deploy --schema=./prisma/schema.prisma && \
2025-Sep-25 06:45:56.354728
echo '[COOLIFY] Running database seed (if needed)...' && \
2025-Sep-25 06:45:56.354728
npx prisma db seed || echo '[COOLIFY] Seed not needed or failed, continuing...' && \
2025-Sep-25 06:45:56.354728
echo '[COOLIFY] Starting Next.js server on ${HOSTNAME}:${PORT}...' && \
2025-Sep-25 06:45:56.354728
echo '[COOLIFY] Health check will be available at http://${HOSTNAME}:${PORT}/api/health' && \
2025-Sep-25 06:45:56.354728
echo '[COOLIFY] Default login - Email: admin@localhost, Password: admin123' && \
2025-Sep-25 06:45:56.354728
node server.js \
2025-Sep-25 06:45:56.354728
"]
2025-Sep-25 06:45:56.803639

---

2025-Sep-25 06:45:56.811177
Building docker image started.
2025-Sep-25 06:45:56.817325
To check the current progress, click on Show Debug Logs.
2025-Sep-25 06:45:57.648470
[CMD]: docker exec y4og4oo8gkkwo8440gs0kowo bash -c 'cat /artifacts/build.sh'
2025-Sep-25 06:45:57.648470
docker build --add-host coolify:10.0.1.6 --add-host coolify-db:10.0.1.4 --add-host coolify-realtime:10.0.1.3 --add-host coolify-redis:10.0.1.2 --add-host sw8cgooww404sgkswgswg08o:10.0.1.8 --network host -f /artifacts/y4og4oo8gkkwo8440gs0kowo/Dockerfile --build-arg SOURCE_COMMIT='57d6a3a00b50e8e56133d61c8f72634ed793753a' --build-arg DATABASE_URL='postgres://designDB:keoYPvVy5FgC9v7isPycTjbTMHTMOqBSv7FHuCzMzpamHP9QDvutlm2nQDT2PZMN@sw8cgooww404sgkswgswg08o:5432/designDB' --build-arg NEXTAUTH_SECRET='K8mJ9vN2pQ4rS7wX1aB6cE9fH3kL8mP5qR7tU0vY2zA4bC6dF9gH1jK3mN6pQ8sT' --build-arg NODE_ENV='production' --build-arg COOLIFY_BUILD_SECRETS_HASH=7221cd9bc2eda0c01f5ae043217dc413b786469698c6dea466f6692878a1ae02 --build-arg 'COOLIFY_URL=https://design.yukiyaki.id' --build-arg 'COOLIFY_FQDN=design.yukiyaki.id' --build-arg 'COOLIFY_BRANCH=main' --build-arg 'COOLIFY_RESOURCE_UUID=xg04ckg0goo80oc0gkkcoc0w' --build-arg 'COOLIFY_CONTAINER_NAME=xg04ckg0goo80oc0gkkcoc0w-064542539240' --progress plain -t xg04ckg0goo80oc0gkkcoc0w:57d6a3a00b50e8e56133d61c8f72634ed793753a /artifacts/y4og4oo8gkkwo8440gs0kowo
2025-Sep-25 06:45:58.362790
[CMD]: docker exec y4og4oo8gkkwo8440gs0kowo bash -c 'bash /artifacts/build.sh'
2025-Sep-25 06:45:58.362790
#0 building with "default" instance using docker driver
2025-Sep-25 06:45:58.362790
2025-Sep-25 06:45:58.362790
#1 [internal] load build definition from Dockerfile
2025-Sep-25 06:45:58.362790
#1 transferring dockerfile: 5.37kB done
2025-Sep-25 06:45:58.362790
#1 DONE 0.0s
2025-Sep-25 06:45:58.362790
2025-Sep-25 06:45:58.362790
#2 [internal] load metadata for docker.io/library/node:20-alpine
2025-Sep-25 06:46:00.051931
#2 DONE 1.8s
2025-Sep-25 06:46:00.177476
#3 [internal] load .dockerignore
2025-Sep-25 06:46:00.177476
#3 transferring context: 1.15kB done
2025-Sep-25 06:46:00.177476
#3 DONE 0.0s
2025-Sep-25 06:46:00.177476
2025-Sep-25 06:46:00.177476
#4 [base 1/3] FROM docker.io/library/node:20-alpine@sha256:eabac870db94f7342d6c33560d6613f188bbcf4bbe1f4eb47d5e2a08e1a37722
2025-Sep-25 06:46:00.177476
#4 DONE 0.0s
2025-Sep-25 06:46:00.177476
2025-Sep-25 06:46:00.177476
#5 [base 2/3] RUN apk add --no-cache libc6-compat openssl wget curl && rm -rf /var/cache/apk/_
2025-Sep-25 06:46:00.177476
#5 CACHED
2025-Sep-25 06:46:00.177476
2025-Sep-25 06:46:00.177476
#6 [base 3/3] RUN apk add --no-cache tzdata
2025-Sep-25 06:46:00.177476
#6 CACHED
2025-Sep-25 06:46:00.177476
2025-Sep-25 06:46:00.177476
#7 [deps 1/8] WORKDIR /app
2025-Sep-25 06:46:00.177476
#7 CACHED
2025-Sep-25 06:46:00.177476
2025-Sep-25 06:46:00.177476
#8 [internal] load build context
2025-Sep-25 06:46:00.177476
#8 transferring context: 496.70kB 0.0s done
2025-Sep-25 06:46:00.177476
#8 DONE 0.0s
2025-Sep-25 06:46:00.177476
2025-Sep-25 06:46:00.177476
#9 [builder 2/9] COPY package.json package-lock.json_ ./
2025-Sep-25 06:46:00.402423
#9 DONE 0.1s
2025-Sep-25 06:46:00.402423
2025-Sep-25 06:46:00.402423
#10 [deps 2/8] RUN echo "Building commit: 57d6a3a00b50e8e56133d61c8f72634ed793753a" || true
2025-Sep-25 06:46:00.402423
#10 0.089 Building commit: 57d6a3a00b50e8e56133d61c8f72634ed793753a
2025-Sep-25 06:46:00.402423
#10 DONE 0.1s
2025-Sep-25 06:46:00.402423
2025-Sep-25 06:46:00.402423
#11 [deps 3/8] COPY package.json package-lock.json\* ./
2025-Sep-25 06:46:00.402423
#11 DONE 0.0s
2025-Sep-25 06:46:00.402423
2025-Sep-25 06:46:00.402423
#12 [builder 3/9] COPY prisma ./prisma/
2025-Sep-25 06:46:00.402423
#12 DONE 0.0s
2025-Sep-25 06:46:00.402423
2025-Sep-25 06:46:00.402423
#13 [deps 4/8] COPY prisma ./prisma/
2025-Sep-25 06:46:00.402423
#13 DONE 0.0s
2025-Sep-25 06:46:00.402423
2025-Sep-25 06:46:00.402423
#14 [deps 5/8] RUN npm ci --omit=dev --ignore-scripts --no-audit --no-fund && npm cache clean --force
2025-Sep-25 06:46:07.819826
#14 ...
2025-Sep-25 06:46:07.819826
2025-Sep-25 06:46:07.819826
#15 [builder 4/9] RUN npm ci --no-audit --no-fund --prefer-offline --no-optional || (npm cache clean --force && npm ci --no-audit --no-fund)
2025-Sep-25 06:46:07.819826
#15 0.248 npm warn config optional Use `--omit=optional` to exclude optional dependencies, or
2025-Sep-25 06:46:07.819826
#15 0.248 npm warn config `--include=optional` to include them.
2025-Sep-25 06:46:07.819826
#15 0.248 npm warn config
2025-Sep-25 06:46:07.819826
#15 0.248 npm warn config Default value does install optional deps unless otherwise omitted.
2025-Sep-25 06:47:24.781956
#15 ...
2025-Sep-25 06:47:24.781956
2025-Sep-25 06:47:24.781956
#14 [deps 5/8] RUN npm ci --omit=dev --ignore-scripts --no-audit --no-fund && npm cache clean --force
2025-Sep-25 06:47:24.781956
#14 84.49
2025-Sep-25 06:47:24.781956
#14 84.49 added 96 packages in 1m
2025-Sep-25 06:47:24.911595
#14 84.50 npm notice
2025-Sep-25 06:47:24.911595
#14 84.50 npm notice New major version of npm available! 10.8.2 -> 11.6.1
2025-Sep-25 06:47:24.911595
#14 84.50 npm notice Changelog: https://github.com/npm/cli/releases/tag/v11.6.1
2025-Sep-25 06:47:24.911595
#14 84.50 npm notice To update run: npm install -g npm@11.6.1
2025-Sep-25 06:47:24.911595
#14 84.50 npm notice
2025-Sep-25 06:47:24.911595
#14 84.66 npm warn using --force Recommended protections disabled.
2025-Sep-25 06:47:25.357238
#14 DONE 85.1s
2025-Sep-25 06:47:25.357238
2025-Sep-25 06:47:25.357238
#15 [builder 4/9] RUN npm ci --no-audit --no-fund --prefer-offline --no-optional || (npm cache clean --force && npm ci --no-audit --no-fund)
2025-Sep-25 06:47:25.512468
#15 ...
2025-Sep-25 06:47:25.512468
2025-Sep-25 06:47:25.512468
#16 [deps 6/8] RUN npm install --save effect@^3.9.2 fast-check@^4.3.0 empathic@^2.0.0
2025-Sep-25 06:47:37.750265
#16 ...
2025-Sep-25 06:47:37.750265
2025-Sep-25 06:47:37.750265
#15 [builder 4/9] RUN npm ci --no-audit --no-fund --prefer-offline --no-optional || (npm cache clean --force && npm ci --no-audit --no-fund)
2025-Sep-25 06:47:37.750265
#15 97.53
2025-Sep-25 06:47:37.750265
#15 97.53 > yuki-yaki-corner@0.1.0 prepare
2025-Sep-25 06:47:37.750265
#15 97.53 > husky
2025-Sep-25 06:47:37.750265
#15 97.53
2025-Sep-25 06:47:37.867907
#15 97.61 HUSKY=0 skip install
2025-Sep-25 06:47:37.867907
#15 97.65 added 491 packages in 2m
2025-Sep-25 06:47:38.505486
#15 DONE 98.3s
2025-Sep-25 06:47:38.505486
2025-Sep-25 06:47:38.505486
#16 [deps 6/8] RUN npm install --save effect@^3.9.2 fast-check@^4.3.0 empathic@^2.0.0
2025-Sep-25 06:47:38.660023
#16 ...
2025-Sep-25 06:47:38.660023
2025-Sep-25 06:47:38.660023
#17 [builder 5/9] RUN npm install --platform=linux --arch=x64 --libc=musl sharp
2025-Sep-25 06:47:50.151977
#17 ...
2025-Sep-25 06:47:50.151977
2025-Sep-25 06:47:50.151977
#16 [deps 6/8] RUN npm install --save effect@^3.9.2 fast-check@^4.3.0 empathic@^2.0.0
2025-Sep-25 06:47:50.151977
#16 24.79
2025-Sep-25 06:47:50.151977
#16 24.79 added 415 packages, changed 1 package, and audited 512 packages in 25s
2025-Sep-25 06:47:50.305125
#16 24.79
2025-Sep-25 06:47:50.305125
#16 24.79 197 packages are looking for funding
2025-Sep-25 06:47:50.305125
#16 24.79 run `npm fund` for details
2025-Sep-25 06:47:50.305125
#16 24.79
2025-Sep-25 06:47:50.305125
#16 24.79 found 0 vulnerabilities
2025-Sep-25 06:47:50.402263
#16 DONE 25.0s
2025-Sep-25 06:47:50.402263
2025-Sep-25 06:47:50.402263
#17 [builder 5/9] RUN npm install --platform=linux --arch=x64 --libc=musl sharp
2025-Sep-25 06:47:50.557257
#17 ...
2025-Sep-25 06:47:50.557257
2025-Sep-25 06:47:50.557257
#18 [deps 7/8] RUN npm install --platform=linux --arch=x64 --libc=musl sharp
2025-Sep-25 06:47:52.935571
#18 2.531
2025-Sep-25 06:47:52.935571
#18 2.531 up to date, audited 512 packages in 2s
2025-Sep-25 06:47:52.935571
#18 2.531
2025-Sep-25 06:47:52.935571
#18 2.531 197 packages are looking for funding
2025-Sep-25 06:47:53.064286
#18 2.531 run `npm fund` for details
2025-Sep-25 06:47:53.064286
#18 2.533
2025-Sep-25 06:47:53.064286
#18 2.533 found 0 vulnerabilities
2025-Sep-25 06:47:53.064286
#18 DONE 2.7s
2025-Sep-25 06:47:53.064286
2025-Sep-25 06:47:53.064286
#17 [builder 5/9] RUN npm install --platform=linux --arch=x64 --libc=musl sharp
2025-Sep-25 06:47:53.216278
#17 ...
2025-Sep-25 06:47:53.220959
#19 [deps 8/8] RUN npx prisma generate
2025-Sep-25 06:48:01.310865
#19 8.240 Prisma schema loaded from prisma/schema.prisma
2025-Sep-25 06:48:02.504355
#19 9.439
2025-Sep-25 06:48:02.507911
#19 9.439 ✔ Generated Prisma Client (v6.16.2) to ./node_modules/@prisma/client in 339ms
2025-Sep-25 06:48:02.510996
#19 9.439
2025-Sep-25 06:48:02.514659
#19 9.439 Start by importing your Prisma Client (See: https://pris.ly/d/importing-client)
2025-Sep-25 06:48:02.514659
#19 9.439
2025-Sep-25 06:48:02.517397
#19 9.439 Tip: Interested in query caching in just a few lines of code? Try Accelerate today! https://pris.ly/tip-3-accelerate
2025-Sep-25 06:48:02.517397
#19 9.439
2025-Sep-25 06:48:02.520406
2025-Sep-25 06:48:02.638444
#19 DONE 9.6s
2025-Sep-25 06:48:02.638444
2025-Sep-25 06:48:02.638444
#17 [builder 5/9] RUN npm install --platform=linux --arch=x64 --libc=musl sharp
2025-Sep-25 06:48:19.380153
#17 40.87
2025-Sep-25 06:48:19.383798
#17 40.87 added 17 packages, and audited 509 packages in 41s
2025-Sep-25 06:48:19.488868
#17 40.87
2025-Sep-25 06:48:19.488868
#17 40.87 197 packages are looking for funding
2025-Sep-25 06:48:19.488868
#17 40.87 run `npm fund` for details
2025-Sep-25 06:48:19.488868
#17 40.87
2025-Sep-25 06:48:19.488868
#17 40.87 found 0 vulnerabilities
2025-Sep-25 06:48:19.488868
#17 DONE 41.0s
2025-Sep-25 06:48:19.641121
#20 [builder 6/9] RUN npx prisma generate
2025-Sep-25 06:48:21.713230
#20 2.223 Prisma schema loaded from prisma/schema.prisma
2025-Sep-25 06:48:22.509032
#20 3.018
2025-Sep-25 06:48:22.509032
#20 3.018 ✔ Generated Prisma Client (v6.16.2) to ./node_modules/@prisma/client in 412ms
2025-Sep-25 06:48:22.509032
#20 3.018
2025-Sep-25 06:48:22.509032
#20 3.018 Start by importing your Prisma Client (See: https://pris.ly/d/importing-client)
2025-Sep-25 06:48:22.509032
#20 3.018
2025-Sep-25 06:48:22.509032
#20 3.018 Tip: Want to turn off tips and other hints? https://pris.ly/tip-4-nohints
2025-Sep-25 06:48:22.509032
#20 3.018
2025-Sep-25 06:48:22.623807
#20 DONE 3.1s
2025-Sep-25 06:48:22.830765
#21 [builder 7/9] COPY . .
2025-Sep-25 06:48:22.830765
#21 DONE 0.0s
2025-Sep-25 06:48:22.830765
2025-Sep-25 06:48:22.830765
#22 [builder 8/9] RUN npm run build
2025-Sep-25 06:48:22.915004
#22 0.234
2025-Sep-25 06:48:22.915004
#22 0.234 > yuki-yaki-corner@0.1.0 build
2025-Sep-25 06:48:22.915004
#22 0.234 > next build
2025-Sep-25 06:48:22.915004
#22 0.234
2025-Sep-25 06:48:23.885501
#22 1.205 ⚠ No build cache found. Please configure build caching for faster rebuilds. Read more: https://nextjs.org/docs/messages/no-cache
2025-Sep-25 06:48:24.003672
#22 1.280 ▲ Next.js 15.5.4
2025-Sep-25 06:48:24.003672
#22 1.280 - Experiments (use with caution):
2025-Sep-25 06:48:24.003672
#22 1.280 · serverActions
2025-Sep-25 06:48:24.003672
#22 1.280
2025-Sep-25 06:48:24.003672
#22 1.323 Creating an optimized production build ...
2025-Sep-25 06:48:41.764528
#22 19.08 ✓ Compiled successfully in 14.0s
2025-Sep-25 06:48:41.919191
#22 19.09 Linting and checking validity of types ...
2025-Sep-25 06:48:51.123739
#22 28.44 Collecting page data ...
2025-Sep-25 06:48:53.951295
#22 31.27 Generating static pages (0/7) ...
2025-Sep-25 06:48:55.034976
#22 32.35 Generating static pages (1/7)
2025-Sep-25 06:48:55.186604
#22 32.35 Generating static pages (3/7)
2025-Sep-25 06:48:55.186604
#22 32.35 Generating static pages (5/7)
2025-Sep-25 06:48:55.186604
#22 32.35 ✓ Generating static pages (7/7)
2025-Sep-25 06:48:56.429642
#22 33.74 Finalizing page optimization ...
2025-Sep-25 06:48:56.584495
#22 33.75 Collecting build traces ...
2025-Sep-25 06:49:21.545633
#22 58.87
2025-Sep-25 06:49:21.672651
#22 58.87 Route (app) Size First Load JS
2025-Sep-25 06:49:21.672651
#22 58.87 ┌ ○ / 7.92 kB 110 kB
2025-Sep-25 06:49:21.672651
#22 58.87 ├ ○ /\_not-found 991 B 103 kB
2025-Sep-25 06:49:21.672651
#22 58.87 ├ ○ /admin 3.41 kB 105 kB
2025-Sep-25 06:49:21.672651
#22 58.87 ├ ƒ /api/admin/management 145 B 102 kB
2025-Sep-25 06:49:21.672651
#22 58.87 ├ ƒ /api/analytics 145 B 102 kB
2025-Sep-25 06:49:21.672651
#22 58.87 ├ ƒ /api/auth/login 145 B 102 kB
2025-Sep-25 06:49:21.672651
#22 58.87 ├ ƒ /api/auth/logout 145 B 102 kB
2025-Sep-25 06:49:21.672651
#22 58.87 ├ ƒ /api/auth/me 145 B 102 kB
2025-Sep-25 06:49:21.672651
#22 58.87 ├ ƒ /api/auth/register 145 B 102 kB
2025-Sep-25 06:49:21.672651
#22 58.87 ├ ƒ /api/generate-copy 145 B 102 kB
2025-Sep-25 06:49:21.672651
#22 58.87 ├ ƒ /api/health 145 B 102 kB
2025-Sep-25 06:49:21.672651
#22 58.87 ├ ƒ /api/process 145 B 102 kB
2025-Sep-25 06:49:21.672651
#22 58.87 ├ ○ /auth 1.96 kB 104 kB
2025-Sep-25 06:49:21.672651
#22 58.87 └ ○ /dashboard 2.14 kB 107 kB
2025-Sep-25 06:49:21.672651
#22 58.87 + First Load JS shared by all 102 kB
2025-Sep-25 06:49:21.672651
#22 58.87 ├ chunks/255-4efeec91c7871d79.js 45.7 kB
2025-Sep-25 06:49:21.672651
#22 58.87 ├ chunks/4bd1b696-c023c6e3521b1417.js 54.2 kB
2025-Sep-25 06:49:21.672651
#22 58.87 └ other shared chunks (total) 1.93 kB
2025-Sep-25 06:49:21.672651
#22 58.87
2025-Sep-25 06:49:21.672651
#22 58.87
2025-Sep-25 06:49:21.672651
#22 58.87 ○ (Static) prerendered as static content
2025-Sep-25 06:49:21.672651
#22 58.87 ƒ (Dynamic) server-rendered on demand
2025-Sep-25 06:49:21.672651
#22 58.87
2025-Sep-25 06:49:21.672651
#22 DONE 59.0s
2025-Sep-25 06:49:21.917222
#23 [builder 9/9] RUN ls -la .next/ && test -f .next/standalone/server.js && echo "Build successful: standalone server.js found"
2025-Sep-25 06:49:21.917222
#23 0.079 total 508
2025-Sep-25 06:49:21.917222
#23 0.079 drwxr-xr-x 8 root root 4096 Sep 25 13:49 .
2025-Sep-25 06:49:21.917222
#23 0.079 drwxr-xr-x 1 root root 4096 Sep 25 13:48 ..
2025-Sep-25 06:49:21.917222
#23 0.079 -rw-r--r-- 1 root root 21 Sep 25 13:48 BUILD_ID
2025-Sep-25 06:49:21.917222
#23 0.079 -rw-r--r-- 1 root root 4686 Sep 25 13:48 app-build-manifest.json
2025-Sep-25 06:49:21.917222
#23 0.079 -rw-r--r-- 1 root root 560 Sep 25 13:48 app-path-routes-manifest.json
2025-Sep-25 06:49:21.917222
#23 0.079 -rw-r--r-- 1 root root 995 Sep 25 13:48 build-manifest.json
2025-Sep-25 06:49:21.917222
#23 0.079 drwxr-xr-x 5 root root 4096 Sep 25 13:48 cache
2025-Sep-25 06:49:21.917222
#23 0.079 drwxr-xr-x 2 root root 4096 Sep 25 13:48 diagnostics
2025-Sep-25 06:49:21.917222
#23 0.079 -rw-r--r-- 1 root root 111 Sep 25 13:48 export-marker.json
2025-Sep-25 06:49:21.917222
#23 0.079 -rw-r--r-- 1 root root 1284 Sep 25 13:48 images-manifest.json
2025-Sep-25 06:49:21.917222
#23 0.079 -rw-r--r-- 1 root root 7776 Sep 25 13:49 next-minimal-server.js.nft.json
2025-Sep-25 06:49:21.917222
#23 0.079 -rw-r--r-- 1 root root 120362 Sep 25 13:49 next-server.js.nft.json
2025-Sep-25 06:49:21.917222
#23 0.079 -rw-r--r-- 1 root root 20 Sep 25 13:48 package.json
2025-Sep-25 06:49:21.917222
#23 0.079 -rw-r--r-- 1 root root 3393 Sep 25 13:48 prerender-manifest.json
2025-Sep-25 06:49:21.917222
#23 0.079 -rw-r--r-- 1 root root 2 Sep 25 13:48 react-loadable-manifest.json
2025-Sep-25 06:49:21.917222
#23 0.079 -rw-r--r-- 1 root root 9078 Sep 25 13:48 required-server-files.json
2025-Sep-25 06:49:21.917222
#23 0.079 -rw-r--r-- 1 root root 2380 Sep 25 13:48 routes-manifest.json
2025-Sep-25 06:49:21.917222
#23 0.079 drwxr-xr-x 5 root root 4096 Sep 25 13:48 server
2025-Sep-25 06:49:21.917222
#23 0.079 drwxr-xr-x 4 root root 4096 Sep 25 13:49 standalone
2025-Sep-25 06:49:21.917222
#23 0.079 drwxr-xr-x 6 root root 4096 Sep 25 13:48 static
2025-Sep-25 06:49:21.917222
#23 0.079 -rw-r--r-- 1 root root 297282 Sep 25 13:49 trace
2025-Sep-25 06:49:21.917222
#23 0.079 drwxr-xr-x 3 root root 4096 Sep 25 13:48 types
2025-Sep-25 06:49:21.917222
#23 0.079 Build successful: standalone server.js found
2025-Sep-25 06:49:21.917222
#23 DONE 0.1s
2025-Sep-25 06:49:22.874546
2025-Sep-25 06:49:22.880932
#24 [runner 2/16] RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs
2025-Sep-25 06:49:22.880932
#24 CACHED
2025-Sep-25 06:49:22.880932
2025-Sep-25 06:49:22.880932
#25 [runner 3/16] COPY --from=builder /app/next.config.mjs ./
2025-Sep-25 06:49:23.073380
#25 DONE 0.1s
2025-Sep-25 06:49:23.073380
2025-Sep-25 06:49:23.073380
#26 [runner 4/16] COPY --from=builder /app/public ./public
2025-Sep-25 06:49:23.270921
#26 DONE 0.0s
2025-Sep-25 06:49:23.270921
2025-Sep-25 06:49:23.270921
#27 [runner 5/16] COPY --from=builder /app/package.json ./package.json
2025-Sep-25 06:49:23.270921
#27 DONE 0.0s
2025-Sep-25 06:49:23.270921
2025-Sep-25 06:49:23.270921
#28 [runner 6/16] COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
2025-Sep-25 06:49:23.664820
#28 DONE 0.5s
2025-Sep-25 06:49:23.799854
#29 [runner 7/16] COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
2025-Sep-25 06:49:23.799854
#29 DONE 0.0s
2025-Sep-25 06:49:23.799854
2025-Sep-25 06:49:23.799854
#30 [runner 8/16] COPY --from=deps --chown=nextjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma
2025-Sep-25 06:49:23.799854
#30 DONE 0.1s
2025-Sep-25 06:49:23.952348
#31 [runner 9/16] COPY --from=deps --chown=nextjs:nodejs /app/node_modules/@prisma ./node_modules/@prisma
2025-Sep-25 06:49:25.238383
#31 DONE 1.4s
2025-Sep-25 06:49:25.389121
#32 [runner 10/16] COPY --from=deps --chown=nextjs:nodejs /app/node_modules/prisma ./node_modules/prisma
2025-Sep-25 06:49:25.531984
#32 DONE 0.3s
2025-Sep-25 06:49:25.742444
#33 [runner 11/16] COPY --from=deps --chown=nextjs:nodejs /app/node_modules/.bin ./node_modules/.bin
2025-Sep-25 06:49:25.742444
#33 DONE 0.0s
2025-Sep-25 06:49:25.742444
2025-Sep-25 06:49:25.742444
#34 [runner 12/16] COPY --from=deps --chown=nextjs:nodejs /app/node_modules/empathic ./node_modules/empathic
2025-Sep-25 06:49:25.742444
#34 DONE 0.0s
2025-Sep-25 06:49:25.742444
2025-Sep-25 06:49:25.742444
#35 [runner 13/16] COPY --from=deps --chown=nextjs:nodejs /app/node_modules/effect ./node_modules/effect
2025-Sep-25 06:49:26.575788
#35 DONE 1.0s
2025-Sep-25 06:49:26.731465
#36 [runner 14/16] COPY --from=deps --chown=nextjs:nodejs /app/node_modules/fast-check ./node_modules/fast-check
2025-Sep-25 06:49:26.781142
#36 DONE 0.2s
2025-Sep-25 06:49:26.883051
#37 [runner 15/16] COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
2025-Sep-25 06:49:26.883051
#37 DONE 0.0s
2025-Sep-25 06:49:26.883051
2025-Sep-25 06:49:26.883051
#38 [runner 16/16] RUN mkdir -p /app/data /app/.data && chown -R nextjs:nodejs /app/data /app/.data
2025-Sep-25 06:49:26.883051
#38 DONE 0.1s
2025-Sep-25 06:49:27.042092
#39 exporting to image
2025-Sep-25 06:49:27.042092
#39 exporting layers
2025-Sep-25 06:49:29.223286
#39 exporting layers 2.3s done
2025-Sep-25 06:49:29.229712
#39 writing image sha256:09dace7143850e0216deed08184658361ec4837d537c3f793b808d08b1e163a8
2025-Sep-25 06:49:29.288639
#39 writing image sha256:09dace7143850e0216deed08184658361ec4837d537c3f793b808d08b1e163a8 done
2025-Sep-25 06:49:29.288639
#39 naming to docker.io/library/xg04ckg0goo80oc0gkkcoc0w:57d6a3a00b50e8e56133d61c8f72634ed793753a done
2025-Sep-25 06:49:29.288639
#39 DONE 2.4s
2025-Sep-25 06:49:29.383840
Building docker image completed.
2025-Sep-25 06:49:29.400098

---

2025-Sep-25 06:49:29.407354
Rolling update started.
2025-Sep-25 06:49:30.300464
[CMD]: docker exec y4og4oo8gkkwo8440gs0kowo bash -c 'SOURCE_COMMIT=57d6a3a00b50e8e56133d61c8f72634ed793753a COOLIFY_URL=https://design.yukiyaki.id COOLIFY_FQDN=design.yukiyaki.id COOLIFY_BRANCH=main docker compose --project-name xg04ckg0goo80oc0gkkcoc0w --project-directory /artifacts/y4og4oo8gkkwo8440gs0kowo -f /artifacts/y4og4oo8gkkwo8440gs0kowo/docker-compose.yaml up --build -d'
2025-Sep-25 06:49:30.300464
time="2025-09-25T06:49:30Z" level=warning msg="Found orphan containers ([xg04ckg0goo80oc0gkkcoc0w-061648577280]) for this project. If you removed or renamed this service in your compose file, you can run this command with the --remove-orphans flag to clean it up."
2025-Sep-25 06:49:30.300464
Container xg04ckg0goo80oc0gkkcoc0w-064542539240 Creating
2025-Sep-25 06:49:30.630206
xg04ckg0goo80oc0gkkcoc0w-064542539240 Your kernel does not support memory swappiness capabilities or the cgroup is not mounted. Memory swappiness discarded.
2025-Sep-25 06:49:30.635530
Container xg04ckg0goo80oc0gkkcoc0w-064542539240 Created
2025-Sep-25 06:49:30.635530
Container xg04ckg0goo80oc0gkkcoc0w-064542539240 Starting
2025-Sep-25 06:49:30.880022
Container xg04ckg0goo80oc0gkkcoc0w-064542539240 Started
2025-Sep-25 06:49:30.899302
New container started.
2025-Sep-25 06:49:30.911723
Custom healthcheck found, skipping default healthcheck.
2025-Sep-25 06:49:30.927427
Waiting for healthcheck to pass on the new container.
2025-Sep-25 06:49:30.940478
Waiting for the start period (60 seconds) before starting healthcheck.
2025-Sep-25 06:50:31.366042
[CMD]: docker inspect --format='{{json .State.Health.Status}}' xg04ckg0goo80oc0gkkcoc0w-064542539240
2025-Sep-25 06:50:31.366042
"healthy"
2025-Sep-25 06:50:31.715954
[CMD]: docker inspect --format='{{json .State.Health.Log}}' xg04ckg0goo80oc0gkkcoc0w-064542539240
2025-Sep-25 06:50:31.715954
[{"Start":"2025-09-25T06:49:35.879813832Z","End":"2025-09-25T06:49:35.988369595Z","ExitCode":1,"Output":"failed: Connection refused.\nhttp://localhost:3000/api/health:\nRemote file does not exist -- broken link!!!\n"},{"Start":"2025-09-25T06:49:40.988945835Z","End":"2025-09-25T06:49:41.055983945Z","ExitCode":1,"Output":"failed: Connection refused.\nhttp://localhost:3000/api/health:\nRemote file does not exist -- broken link!!!\n"},{"Start":"2025-09-25T06:49:46.056962346Z","End":"2025-09-25T06:49:46.138128846Z","ExitCode":0,"Output":"failed: Connection refused.\n2025-09-25 13:49:46 URL: http://localhost:3000/api/health 200 OK\n"},{"Start":"2025-09-25T06:50:16.139591502Z","End":"2025-09-25T06:50:16.206992028Z","ExitCode":0,"Output":"failed: Connection refused.\n2025-09-25 13:50:16 URL: http://localhost:3000/api/health 200 OK\n"}]
2025-Sep-25 06:50:31.725402
Attempt 1 of 5 | Healthcheck status: "healthy"
2025-Sep-25 06:50:31.733093
Healthcheck logs: failed: Connection refused.
2025-Sep-25 06:50:31.733093
2025-09-25 13:50:16 URL: http://localhost:3000/api/health 200 OK
2025-Sep-25 06:50:31.733093
| Return code: 0
2025-Sep-25 06:50:31.747507
New container is healthy.
2025-Sep-25 06:50:31.756208
Removing old containers.
2025-Sep-25 06:50:32.453957
[CMD]: docker stop --time=30 xg04ckg0goo80oc0gkkcoc0w-061648577280
2025-Sep-25 06:50:32.453957
Flag --time has been deprecated, use --timeout instead
2025-Sep-25 06:50:32.683495
xg04ckg0goo80oc0gkkcoc0w-061648577280
2025-Sep-25 06:50:33.067250
[CMD]: docker rm -f xg04ckg0goo80oc0gkkcoc0w-061648577280
2025-Sep-25 06:50:33.067250
xg04ckg0goo80oc0gkkcoc0w-061648577280
2025-Sep-25 06:50:33.077128
Rolling update completed.
2025-Sep-25 06:50:34.237901
Gracefully shutting down build container: y4og4oo8gkkwo8440gs0kowo
2025-Sep-25 06:50:34.593017
[CMD]: docker stop --time=30 y4og4oo8gkkwo8440gs0kowo
2025-Sep-25 06:50:34.593017
Flag --time has been deprecated, use --timeout instead
2025-Sep-25 06:50:34.797546
y4og4oo8gkkwo8440gs0kowo
2025-Sep-25 06:50:35.161532
[CMD]: docker rm -f y4og4oo8gkkwo8440gs0kowo
2025-Sep-25 06:50:35.161532
Error response from daemon: No such container: y4og4oo8gkkwo8440gs0kowo
