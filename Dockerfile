# Dockerfile optimized for Coolify deployment
FROM node:18-alpine AS base

# ----------------------
# Deps + Build stage
# ----------------------
FROM base AS builder
WORKDIR /app
RUN apk add --no-cache libc6-compat

# Disable husky during CI/build to avoid "husky: not found" and .git checks
ENV HUSKY=0

# Install all dependencies (including dev) for build time (Tailwind/PostCSS, etc.)
COPY package.json package-lock.json* ./
RUN npm ci --no-audit --no-fund

# Copy source and build
COPY . .
RUN npm run build

# ----------------------
# Production runtime
# ----------------------
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Non-root user
RUN addgroup --system --gid 1001 nodejs \
	&& adduser --system --uid 1001 nextjs

# Copy public and built output only
COPY --from=builder /app/public ./public

# Create .next dir for static assets and correct permissions
RUN mkdir -p .next && chown nextjs:nodejs .next

# Copy Next.js standalone server build
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]