# Stage 1: Install dependencies
FROM node:22-alpine AS deps
WORKDIR /app
ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL
COPY package*.json ./
# Prisma Schema kopieren, damit der Client generiert werden kann
COPY prisma ./prisma/ 
COPY prisma.config.ts ./
RUN npm install
RUN npx prisma generate

# Stage 2: Rebuild the source code only when needed
FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL
RUN npm run build

# Stage 3: Production runner
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV production

# Zwingt Next.js, auf Anfragen von Nginx zu reagieren (verhindert 502)
ENV HOSTNAME="0.0.0.0"
ENV PORT=3000

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma 
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts
COPY --from=builder /app/scripts ./scripts

EXPOSE 3000

ENTRYPOINT ["sh", "./scripts/docker-entrypoint.sh"]