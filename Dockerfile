FROM node:20-alpine AS base

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# ============================================
# Dependencies
# ============================================
FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# ============================================
# Test runner
# ============================================
FROM deps AS tester
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm test

# ============================================
# Database migration runner
# ============================================
FROM deps AS migrator
WORKDIR /app
COPY . .
ARG DATABASE_TYPE=postgresql
ENV DATABASE_TYPE=$DATABASE_TYPE
CMD ["pnpm", "db:migrate"]

# ============================================
# Build
# ============================================
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build args
ARG DATABASE_TYPE=postgresql
ENV DATABASE_TYPE=$DATABASE_TYPE

RUN pnpm build

# ============================================
# Production
# ============================================
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/scripts/validate-production.mjs ./scripts/validate-production.mjs
COPY --chown=nextjs:nodejs docker-entrypoint.sh ./docker-entrypoint.sh

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 CMD wget -q -O - http://127.0.0.1:3000/api/health || exit 1

CMD ["./docker-entrypoint.sh"]
