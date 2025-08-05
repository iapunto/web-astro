# Etapa 1: Build
FROM node:22-alpine AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm run build

# Etapa 2: Producción
FROM node:22-alpine AS runner
WORKDIR /app
RUN npm install -g pnpm
ENV NODE_ENV=production
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./public
COPY --from=builder /app/astro.config.railway.mjs ./astro.config.mjs
COPY --from=builder /app/tsconfig.json ./
COPY --from=builder /app/tailwind.config.mjs ./
COPY --from=builder /app/colors.css ./
COPY --from=builder /app/README.md ./

ENV PORT=4321
EXPOSE 4321
# Comando de inicio (usando la variable de entorno PORT si está disponible)
CMD ["pnpm", "run", "preview"]