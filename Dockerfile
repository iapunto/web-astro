# 1. Build Stage
# Usamos una imagen base de Node.js con Alpine Linux por ser ligera.
FROM node:20-alpine AS builder
WORKDIR /app

# Copiamos los archivos de dependencias e instalamos TODO (incluyendo devDependencies).
COPY package.json pnpm-lock.yaml ./

# Instalamos pnpm globalmente.
RUN npm install -g pnpm

# Instalamos las herramientas necesarias para compilar addons nativos (como better-sqlite3).
# Esto soluciona el error de 'node-gyp' y 'python' que tenías al principio.
RUN apk add --no-cache python3 make g++
RUN pnpm install --frozen-lockfile

# Copiamos el resto del código fuente de la aplicación.
COPY . .

# Construimos la aplicación usando el script específico para Coolify.
RUN pnpm run build:coolify

# 2. Production Stage
# Empezamos desde una imagen limpia para mantener la imagen final pequeña y segura.
FROM node:20-alpine AS runner
WORKDIR /app

# Instalamos pnpm globalmente.
RUN npm install -g pnpm

# Establecemos el entorno a producción.
ENV NODE_ENV=production

# Copiamos solo los artefactos de construcción necesarios desde la etapa anterior.
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json /app/pnpm-lock.yaml ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./public
COPY --from=builder /app/astro.config.coolify.working.mjs ./astro.config.mjs
COPY --from=builder /app/tsconfig.json ./
COPY --from=builder /app/tailwind.config.mjs ./
COPY --from=builder /app/colors.css ./
COPY --from=builder /app/README.md ./

# Instalamos ÚNICAMENTE las dependencias de producción.
# Esto es más rápido, seguro y evita instalar 'better-sqlite3' en producción.
RUN pnpm install --prod --frozen-lockfile

# Exponemos el puerto en el que correrá la aplicación.
ENV PORT=4321
EXPOSE 4321

# El comando para iniciar la aplicación en producción.
CMD ["pnpm", "run", "start:coolify"]