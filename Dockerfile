# Etapa 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --production=false
COPY . .
RUN npm run build

# Etapa 2: Producción
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./public
COPY --from=builder /app/astro.config.mjs ./
COPY --from=builder /app/tsconfig.json ./
COPY --from=builder /app/tailwind.config.mjs ./
COPY --from=builder /app/colors.css ./
COPY --from=builder /app/README.md ./

ENV PORT=3000
EXPOSE 3000
CMD ["npx", "astro", "start"] 