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
    && rm -rf /var/cache/apk/*

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
RUN npm ci --omit=dev --ignore-scripts --no-audit --no-fund && \
    npm cache clean --force

# Install additional dependencies required by Prisma 6.x and effect package
RUN npm install --save effect@^3.9.2 fast-check@^3.27.0

# Install Sharp for Alpine Linux musl compatibility (production deps)
RUN npm install --platform=linux --arch=x64 --libc=musl sharp

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
RUN npm ci --no-audit --no-fund --prefer-offline --no-optional || \
    (npm cache clean --force && npm ci --no-audit --no-fund)

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

# Copy Prisma files (client and schema)
COPY --from=deps --chown=nextjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=deps --chown=nextjs:nodejs /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=deps --chown=nextjs:nodejs /app/node_modules/prisma ./node_modules/prisma
COPY --from=deps --chown=nextjs:nodejs /app/node_modules/.bin ./node_modules/.bin
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma

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

# Startup script with enhanced logging and error handling for Coolify v4
CMD ["sh", "-c", "\
    echo '[COOLIFY] Starting application container...' && \
    echo '[COOLIFY] Environment: NODE_ENV=${NODE_ENV}, PORT=${PORT}, HOSTNAME=${HOSTNAME}' && \
    echo '[COOLIFY] Database URL: ${DATABASE_URL}' && \
    echo '[COOLIFY] Running database migrations...' && \
    npx prisma migrate deploy --schema=./prisma/schema.prisma && \
    echo '[COOLIFY] Running database seed (if needed)...' && \
    npx prisma db seed || echo '[COOLIFY] Seed not needed or failed, continuing...' && \
    echo '[COOLIFY] Starting Next.js server on ${HOSTNAME}:${PORT}...' && \
    echo '[COOLIFY] Health check will be available at http://${HOSTNAME}:${PORT}/api/health' && \
    echo '[COOLIFY] Default login - Email: admin@localhost, Password: admin123' && \
    node server.js \
    "]