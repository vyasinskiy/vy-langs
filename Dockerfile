FROM node:20-bookworm-slim AS base

FROM base AS deps
WORKDIR /app
COPY client/package*.json ./
ARG DATABASE_URL="postgresql://postgres:postgres@localhost:5432/vy_langs?schema=public"
ENV DATABASE_URL=${DATABASE_URL}
RUN npm ci

FROM base AS builder
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ARG DATABASE_URL="postgresql://postgres:postgres@localhost:5432/vy_langs?schema=public"
ENV DATABASE_URL=${DATABASE_URL}
COPY --from=deps /app/node_modules ./node_modules
COPY client ./
RUN npm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]
