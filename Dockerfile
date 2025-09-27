# Multi-stage Dockerfile optimized for Coolify v4 deployment
# Allow overriding the base image (useful if Docker Hub is rate-limited in CI/CD)
ARG BASE_IMAGE=node:20-alpine
FROM ${BASE_IMAGE} AS base

# Install system dependencies for Prisma, Sharp, and wget (for health checks)
RUN apk add --no-cache \
    libc6-compat \
    openssl \
    wget \
    curl \
    netcat-openbsd \
    && rm -rf /var/cache/apk/*

# Configure npm network retries/timeouts (helps flaky networks during CI/build)
ENV NPM_CONFIG_FETCH_RETRIES=5 \
    NPM_CONFIG_FETCH_RETRY_MINTIMEOUT=20000 \
    NPM_CONFIG_FETCH_RETRY_MAXTIMEOUT=60000 \
    NPM_CONFIG_FETCH_TIMEOUT=120000

# Set timezone
RUN apk add --no-cache tzdata
ENV TZ=Asia/Jakarta

# ----------------------
# Dependencies stage
# ----------------------
FROM base AS deps
WORKDIR /app
ARG SOURCE_COMMIT
RUN echo "Building commit: ${SOURCE_COMMIT}" || true

# Copy package files and prisma schema
COPY package.json package-lock.json* ./
COPY prisma ./prisma/

# Install production dependencies with retry mechanism
RUN set -eux; \
        for i in 1 2 3; do \
            npm ci --omit=dev --ignore-scripts --no-audit --no-fund && break || sleep 5; \
            echo "npm ci attempt $i failed, retrying..."; \
        done; \
        npm cache clean --force || true

# Install additional dependencies required by Prisma at runtime
RUN npm install perfect-debounce c12 --no-save

# Generate Prisma client
RUN npx prisma generate
# ----------------------
# Build stage
# ----------------------
FROM base AS builder
WORKDIR /app

# Disable telemetry and husky during build
ENV NEXT_TELEMETRY_DISABLED=1
ENV HUSKY=0
ENV CI=true

# Install all dependencies (including dev) for build
COPY package.json package-lock.json* ./
COPY prisma ./prisma/

# Install with retry mechanism and proper error handling
RUN set -eux; \
        for i in 1 2 3; do \
            npm ci --no-audit --no-fund --prefer-offline --omit=optional && break || sleep 5; \
            echo "builder npm ci attempt $i failed, retrying..."; \
        done || (npm cache clean --force && npm ci --no-audit --no-fund)

# Install Sharp for Alpine Linux musl compatibility
RUN npm install --platform=linux --arch=x64 --libc=musl sharp

# Generate Prisma client for build
RUN npx prisma generate

# Copy source code (excluding node_modules and .next)
COPY . .

# Build the application with production environment
ENV NODE_ENV=production
RUN npm run build

# Verify build output
RUN ls -la .next/ && \
    test -f .next/standalone/server.js && \
    echo "Build successful: standalone server.js found"

# ----------------------
# Production runtime
# ----------------------
FROM base AS runner
WORKDIR /app

# Environment variables for production
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Create system user and group
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy application files with proper ownership
COPY --from=builder /app/next.config.mjs ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

# Copy built Next.js application
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copy all production dependencies from deps stage
COPY --from=deps --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma

# Copy startup script
COPY --chown=nextjs:nodejs scripts/start.sh ./start.sh
RUN chmod +x ./start.sh

# Create data directory for persistent storage
RUN mkdir -p /app/data /app/.data && \
    chown -R nextjs:nodejs /app/data /app/.data

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3000

# Health check endpoint with extended startup period for Coolify v4
HEALTHCHECK --interval=30s --timeout=15s --start-period=60s --retries=5 \
    CMD wget --no-verbose --tries=2 --timeout=10 --spider http://localhost:3000/api/health || exit 1

# Use startup script to avoid command complexity
CMD ["./start.sh"]