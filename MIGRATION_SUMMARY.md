# 🚀 Resumen de Migración a Coolify - IA Punto

## ✅ Estado de la Migración

**Fecha:** $(date)
**Estado:** ✅ **COMPLETADA** - Configuración lista para despliegue
**Plataforma Anterior:** Railway/Vercel/Heroku
**Plataforma Nueva:** Coolify

---

## 📋 Archivos Creados/Modificados

### 🆕 Archivos Nuevos para Coolify

| Archivo                         | Descripción                                    | Estado    |
| ------------------------------- | ---------------------------------------------- | --------- |
| `astro.config.coolify.mjs`      | Configuración específica de Astro para Coolify | ✅ Creado |
| `Dockerfile.coolify`            | Dockerfile optimizado para Coolify             | ✅ Creado |
| `env.coolify.example`           | Variables de entorno para Coolify              | ✅ Creado |
| `.dockerignore`                 | Archivos a ignorar en Docker                   | ✅ Creado |
| `COOLIFY_SETUP.md`              | Documentación completa de configuración        | ✅ Creado |
| `scripts/migrate-to-coolify.ts` | Script automatizado de migración               | ✅ Creado |
| `MIGRATION_SUMMARY.md`          | Este archivo de resumen                        | ✅ Creado |

### 🔄 Archivos Modificados

| Archivo        | Modificación                                          | Estado        |
| -------------- | ----------------------------------------------------- | ------------- |
| `package.json` | Scripts `build:coolify` y `start:coolify` agregados   | ✅ Modificado |
| `package.json` | Scripts `coolify:migrate` y `coolify:setup` agregados | ✅ Modificado |

---

## 🛠️ Scripts Disponibles

### Nuevos Scripts de Coolify

```bash
# Migración completa con backup
pnpm run coolify:migrate

# Configuración rápida sin backup
pnpm run coolify:setup

# Build específico para Coolify
pnpm run build:coolify

# Start específico para Coolify
pnpm run start:coolify
```

---

## 🔧 Configuración Técnica

### Configuración de Astro

- **Puerto:** 4321
- **Host:** 0.0.0.0
- **Modo:** standalone
- **Integraciones:** React, Tailwind, MDX, Sitemap, Cookie Consent

### Configuración de Docker

- **Base:** Node 22 Alpine
- **Package Manager:** pnpm
- **Multi-stage build:** Optimizado para producción
- **Puerto expuesto:** 4321

### Variables de Entorno Requeridas

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

---

## 📊 Comparación de Configuraciones

| Aspecto           | Railway                    | Coolify                    |
| ----------------- | -------------------------- | -------------------------- |
| **Configuración** | `astro.config.railway.mjs` | `astro.config.coolify.mjs` |
| **Dockerfile**    | `Dockerfile`               | `Dockerfile.coolify`       |
| **Variables**     | `env.railway.example`      | `env.coolify.example`      |
| **Build Script**  | `pnpm run build`           | `pnpm run build:coolify`   |
| **Start Script**  | `pnpm run preview`         | `pnpm run start:coolify`   |
| **Plataforma**    | Railway App                | Coolify                    |

---

## 🚀 Próximos Pasos para Despliegue

### 1. Configurar Coolify

```bash
# 1. Acceder al panel de Coolify
# 2. Crear nueva aplicación
# 3. Seleccionar "Docker"
# 4. Conectar repositorio GitHub
# 5. Configurar Dockerfile.coolify
# 6. Establecer puerto 4321
```

### 2. Configurar Variables de Entorno

```bash
# Copiar desde env.coolify.example
# Configurar valores reales en Coolify
# Verificar todas las variables requeridas
```

### 3. Configurar Dominio

```bash
# Dominio principal: iapunto.com
# Subdominio Strapi: strapi.iapunto.com
# Habilitar SSL automático
```

### 4. Migrar Base de Datos

```bash
# Exportar desde Railway
pg_dump $RAILWAY_DATABASE_URL > backup.sql

# Importar a Coolify
psql $COOLIFY_DATABASE_URL < backup.sql
```

### 5. Despliegue Inicial

```bash
# 1. Realizar primer build
# 2. Verificar logs
# 3. Comprobar health check
# 4. Verificar funcionalidad
```

---

## 🔍 Validación y Testing

### Comandos de Validación

```bash
# Validar configuración
pnpm run coolify:setup

# Build local de prueba
pnpm run build:coolify

# Verificar archivos
ls -la astro.config.coolify.mjs Dockerfile.coolify env.coolify.example
```

### Health Checks

- **Endpoint:** `https://iapunto.com/health`
- **Puerto:** 4321
- **Timeout:** 30 segundos
- **Retries:** 3

---

## 📚 Documentación

### Archivos de Referencia

- **Configuración completa:** `COOLIFY_SETUP.md`
- **Variables de entorno:** `env.coolify.example`
- **Script de migración:** `scripts/migrate-to-coolify.ts`
- **Dockerfile:** `Dockerfile.coolify`

### Enlaces Útiles

- **Coolify Docs:** https://coolify.io/docs
- **Comunidad:** https://discord.gg/coolify
- **GitHub:** https://github.com/coollabsio/coolify

---

## ⚠️ Notas Importantes

### Antes del Despliegue

1. ✅ Verificar todas las variables de entorno
2. ✅ Configurar dominio y SSL
3. ✅ Migrar base de datos
4. ✅ Configurar Strapi en Coolify
5. ✅ Verificar conectividad entre servicios

### Después del Despliegue

1. ✅ Verificar funcionamiento completo
2. ✅ Configurar monitoreo
3. ✅ Configurar backups automáticos
4. ✅ Eliminar configuraciones obsoletas de Railway
5. ✅ Actualizar DNS si es necesario

---

## 🎯 Estado Final

### ✅ Completado

- [x] Configuración de Astro para Coolify
- [x] Dockerfile optimizado
- [x] Variables de entorno definidas
- [x] Scripts de build y start
- [x] Script de migración automatizado
- [x] Documentación completa
- [x] Validación de configuración

### 🔄 Pendiente

- [ ] Despliegue en Coolify
- [ ] Configuración de dominio
- [ ] Migración de base de datos
- [ ] Configuración de Strapi
- [ ] Eliminación de configuraciones obsoletas

---

## 📞 Soporte

Para problemas durante la migración:

1. Revisar `COOLIFY_SETUP.md`
2. Ejecutar `pnpm run coolify:migrate` para diagnóstico
3. Verificar logs de Coolify
4. Consultar documentación oficial de Coolify

---

**🎉 ¡La migración está lista para ser ejecutada!**
