# Stage 1: Install dependencies + generate Prisma client
FROM node:22-alpine AS deps
WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma/
COPY prisma.config.ts ./
# Limit Node heap during install to avoid OOM (exit code 137) on small VPS
ENV NODE_OPTIONS=--max-old-space-size=512
# Reduce any parallel build jobs during install
ENV npm_config_jobs=1
RUN npm ci --silent --no-audit --no-fund
# prisma generate braucht KEINE echte DB – nur das Schema.
# Dummy-URL reicht, damit prisma.config.ts nicht crasht.
RUN DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy" npx prisma generate

# Stage 2: Build the Next.js app
FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Allow a bit more heap for the build step (adjust if you get OOM here)
ENV NODE_OPTIONS=--max-old-space-size=1024
# next build liest Prisma-Client-Types, verbindet sich aber nicht zur DB.
ENV DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"
RUN npm run build

# Stage 3: Production runner
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV HOSTNAME="0.0.0.0"
ENV PORT=3000

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
# Prisma-Dateien für Runtime-Migrationen
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts
COPY --from=builder /app/scripts ./scripts

EXPOSE 3000

ENTRYPOINT ["sh", "./scripts/docker-entrypoint.sh"]