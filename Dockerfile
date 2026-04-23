# Stage 1: Install dependencies
FROM node:22-alpine AS deps
WORKDIR /app
COPY package*.json ./
# Prisma Schema kopieren, damit der Client generiert werden kann
COPY prisma ./prisma/ 
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
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
# Wichtig: Prisma Engine wird zur Laufzeit benötigt
COPY --from=builder /app/prisma ./prisma 

EXPOSE 3000
CMD ["npm", "start"]