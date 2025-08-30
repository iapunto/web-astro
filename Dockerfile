# 1. Build Stage
# Usamos una imagen base de Node.js con Alpine Linux por ser ligera.
FROM node:22-alpine AS builder
WORKDIR /app

# Instalamos las herramientas necesarias para compilar addons nativos (como better-sqlite3).
# Esto soluciona el error de 'node-gyp' y 'python'.
RUN apk add --no-cache python3 make g++

# Instalamos pnpm globalmente.
RUN npm install -g pnpm

# Copiamos los archivos de dependencias e instalamos TODO (incluyendo devDependencies).
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Copiamos el resto del código fuente de la aplicación.
COPY . .

# Construimos la aplicación usando el script específico para Coolify.
RUN pnpm run build:coolify

# 2. Production Stage
# Empezamos desde una imagen limpia para mantener la imagen final pequeña y segura.
FROM node:22-alpine AS runner
WORKDIR /app

# Establecemos el entorno a producción.
ENV NODE_ENV=production

# Instalamos pnpm globalmente.
RUN npm install -g pnpm

# Copiamos solo los artefactos de construcción necesarios desde la etapa anterior.
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json /app/pnpm-lock.yaml ./

# Instalamos ÚNICAMENTE las dependencias de producción.
RUN pnpm install --prod --frozen-lockfile

# Exponemos el puerto en el que correrá la aplicación.
ENV PORT=4321
EXPOSE 4321

# El comando para iniciar la aplicación en producción.
CMD ["pnpm", "run", "start:coolify"]