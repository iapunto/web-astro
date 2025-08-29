# 🚀 Instrucciones de Despliegue en Coolify

## ✅ Configuración Lista

La migración a Coolify está completamente configurada. Aquí están las instrucciones para hacer el despliegue:

### 📋 Archivos de Configuración Creados

- ✅ `astro.config.coolify.working.mjs` - Configuración funcional de Astro
- ✅ `Dockerfile.coolify` - Dockerfile optimizado para Coolify
- ✅ `env.coolify.example` - Variables de entorno para Coolify
- ✅ `.dockerignore` - Archivos a ignorar en Docker
- ✅ `COOLIFY_SETUP.md` - Documentación completa
- ✅ `MIGRATION_SUMMARY.md` - Resumen de la migración
- ✅ `deploy-to-coolify.sh` - Script de despliegue

### 🛠️ Scripts Disponibles

```bash
# Despliegue completo
./deploy-to-coolify.sh

# Build específico para Coolify
pnpm run build:coolify:working

# Start específico para Coolify
pnpm run start:coolify
```

## 🚀 Pasos para el Despliegue

### 1. Ejecutar Script de Despliegue

```bash
# Ejecutar el script de despliegue
./deploy-to-coolify.sh
```

Este script:

- Verifica que estés en la rama main
- Hace commit de todos los cambios
- Hace push a GitHub
- Proporciona instrucciones para Coolify

### 2. Configurar Coolify

1. **Acceder al panel de Coolify**
2. **Crear nueva aplicación**
   - Tipo: Docker
   - Repositorio: Tu repositorio de GitHub
   - Branch: main
3. **Configurar Dockerfile**
   - Dockerfile: `Dockerfile.coolify`
   - Puerto: 4321
4. **Configurar variables de entorno**
   - Copiar desde `env.coolify.example`
   - Configurar valores reales

### 3. Variables de Entorno Requeridas

```bash
# Básicas
NODE_ENV=production
SITE_URL=https://iapunto.com
PORT=4321

# Strapi
STRAPI_API_URL=https://strapi.iapunto.com
STRAPI_API_TOKEN=your-token

# Google Calendar
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-email
GOOGLE_PRIVATE_KEY=your-key
GOOGLE_CALENDAR_ID=primary

# Base de Datos
DATABASE_URL=postgresql://user:pass@host:port/db
DATABASE_PUBLIC_URL=postgresql://user:pass@host:port/db

# APIs
GEMINI_API_KEY=your-key
CLOUDINARY_CLOUD_NAME=your-name
CLOUDINARY_API_KEY=your-key
CLOUDINARY_API_SECRET=your-secret
```

### 4. Configurar Dominio

- **Dominio principal:** iapunto.com
- **Subdominio Strapi:** strapi.iapunto.com
- **Habilitar SSL automático**

### 5. Migrar Base de Datos

```bash
# Exportar desde Railway
pg_dump $RAILWAY_DATABASE_URL > backup.sql

# Importar a Coolify
psql $COOLIFY_DATABASE_URL < backup.sql
```

## 🔧 Configuración Técnica

### Dockerfile.coolify

- Multi-stage build optimizado
- Node 22 Alpine
- pnpm como package manager
- Puerto 4321 expuesto

### Configuración de Astro

- Modo standalone
- Host 0.0.0.0
- Integraciones: React, Tailwind, MDX, Sitemap

## 📊 Monitoreo

### Health Check

- **Endpoint:** `https://iapunto.com/health`
- **Puerto:** 4321
- **Timeout:** 30 segundos

### Logs

- Acceder desde el panel de Coolify
- Configurar alertas para errores críticos

## 🚨 Troubleshooting

### Error de Build

1. Verificar Dockerfile.coolify
2. Revisar logs de build
3. Verificar variables de entorno

### Error de Conexión

1. Verificar puerto 4321
2. Verificar variables de entorno
3. Revisar logs de aplicación

### Error de Base de Datos

1. Verificar DATABASE_URL
2. Verificar conectividad de red
3. Revisar configuración de firewall

## 📞 Soporte

- **Documentación:** `COOLIFY_SETUP.md`
- **Resumen:** `MIGRATION_SUMMARY.md`
- **Coolify Docs:** https://coolify.io/docs

## 🎯 Estado Final

✅ **MIGRACIÓN COMPLETADA** - Todo está listo para el despliegue

La configuración está optimizada para un servidor robusto y estable en Coolify, con todas las integraciones necesarias correctamente configuradas.

---

**🎉 ¡Listo para desplegar!**
