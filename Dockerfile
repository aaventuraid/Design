# Dockerfile optimized for Coolify deployment with database support
FROM node:20-alpine AS base

# Install system dependencies for Prisma and Sharp
RUN apk add --no-cache libc6-compat openssl

# ----------------------
# Dependencies stage
# ----------------------
FROM base AS deps
WORKDIR /app

# Copy package files and prisma schema
COPY package.json package-lock.json* ./
COPY prisma ./prisma/

# Install production dependencies
RUN npm ci --only=production --ignore-scripts && \
    npm cache clean --force

# Generate Prisma client
RUN npx prisma generate

# ----------------------
# Build stage
# ----------------------
FROM base AS builder
WORKDIR /app

# Disable husky during CI/build
ENV HUSKY=0

# Install all dependencies (including dev) for build
COPY package.json package-lock.json* ./
COPY prisma ./prisma/
RUN npm ci --no-audit --no-fund

# Generate Prisma client for build
RUN npx prisma generate

# Copy source and build
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
RUN npm run build

# ----------------------
# Production runtime
# ----------------------
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Non-root user
RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

# Copy necessary files
COPY --from=builder /app/next.config.mjs ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

# Copy built application
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copy Prisma files from deps stage (contains generated client)
COPY --from=deps --chown=nextjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=deps --chown=nextjs:nodejs /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/prisma ./prisma

# Create data directory with proper permissions
RUN mkdir -p /app/data && chown nextjs:nodejs /app/data

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Start with database migration and then the app
CMD ["sh", "-c", "npx prisma migrate deploy && node server.js"]