# Migración a Coolify - IA Punto

## Resumen

Este documento describe la migración completa del proyecto IA Punto desde Railway/Vercel/Heroku hacia Coolify como plataforma única de despliegue.

## Archivos de Configuración Creados

### 1. `astro.config.coolify.mjs`

Configuración específica de Astro optimizada para Coolify:

- Configuración de servidor para `0.0.0.0:4321`
- Integraciones optimizadas para producción
- Configuración GDPR completa
- Variables de entorno específicas para Coolify

### 2. `env.coolify.example`

Archivo de ejemplo con todas las variables de entorno necesarias:

- Variables básicas de la aplicación
- Configuración de Google Calendar API
- Configuración de email (Gmail SMTP)
- Configuración de OAuth2
- Variables de base de datos
- Configuración de Gemini API y Cloudinary

### 3. `Dockerfile.coolify`

Dockerfile optimizado para Coolify:

- Multi-stage build para optimizar el tamaño
- Uso de Node 22 Alpine para mejor rendimiento
- Configuración específica para pnpm
- Comandos optimizados para Coolify

### 4. Scripts Actualizados en `package.json`

```json
{
  "build:coolify": "astro build --config astro.config.coolify.mjs",
  "start:coolify": "node ./dist/server/entry.mjs"
}
```

## Configuración en Coolify

### 1. Crear Nueva Aplicación

1. Acceder al panel de Coolify
2. Crear nueva aplicación
3. Seleccionar "Docker" como tipo de aplicación
4. Conectar repositorio de GitHub

### 2. Configuración del Repositorio

**Branch:** `main` (o la rama principal del proyecto)
**Dockerfile:** `Dockerfile.coolify`
**Puerto:** `4321`

### 3. Variables de Entorno

Copiar todas las variables desde `env.coolify.example` y configurar los valores reales:

#### Variables Obligatorias

```bash
NODE_ENV=production
SITE_URL=https://iapunto.com
STRAPI_API_URL=https://strapi.iapunto.com
STRAPI_API_TOKEN=your-strapi-token-here
PORT=4321
```

#### Variables de Google Calendar

```bash
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_CALENDAR_ID=primary
TIMEZONE=America/Bogota
```

#### Variables de Base de Datos

```bash
DATABASE_URL=postgresql://user:password@host:port/database
DATABASE_PUBLIC_URL=postgresql://user:password@host:port/database
```

#### Variables de API

```bash
GEMINI_API_KEY=your_gemini_api_key_here
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 4. Configuración de Dominio

1. Configurar dominio personalizado: `iapunto.com`
2. Habilitar SSL automático
3. Configurar redirecciones si es necesario

### 5. Configuración de Recursos

**CPU:** 1 vCPU mínimo
**RAM:** 2GB mínimo
**Almacenamiento:** 10GB mínimo

## Proceso de Despliegue

### 1. Build

```bash
pnpm run build:coolify
```

### 2. Start

```bash
pnpm run start:coolify
```

### 3. Health Check

La aplicación debe responder en: `https://iapunto.com/health`

## Migración de Base de Datos

### 1. Exportar desde Railway

```bash
# Exportar datos actuales
pg_dump $RAILWAY_DATABASE_URL > backup_railway.sql
```

### 2. Importar a Coolify

```bash
# Importar a la nueva base de datos
psql $COOLIFY_DATABASE_URL < backup_railway.sql
```

## Configuración de Strapi

### 1. Variables de Entorno de Strapi

```bash
DATABASE_CLIENT=postgres
DATABASE_HOST=your-coolify-db-host
DATABASE_PORT=5432
DATABASE_NAME=strapi
DATABASE_USERNAME=strapi_user
DATABASE_PASSWORD=secure_password
JWT_SECRET=your-jwt-secret
ADMIN_JWT_SECRET=your-admin-jwt-secret
API_TOKEN_SALT=your-api-token-salt
APP_KEYS=your-app-keys
```

### 2. Configuración de Dominio

- Configurar Strapi en subdominio: `strapi.iapunto.com`
- Habilitar SSL
- Configurar CORS para permitir `https://iapunto.com`

## Monitoreo y Logs

### 1. Logs de Aplicación

- Acceder a logs desde el panel de Coolify
- Configurar alertas para errores críticos
- Monitorear uso de recursos

### 2. Métricas de Rendimiento

- Tiempo de respuesta
- Uso de CPU y RAM
- Errores de aplicación
- Estado de la base de datos

## Rollback y Recuperación

### 1. Rollback Automático

- Configurar rollback automático en caso de fallo
- Mantener versiones anteriores disponibles
- Configurar health checks robustos

### 2. Backup de Datos

- Backup automático de base de datos
- Backup de archivos estáticos
- Backup de configuración

## Optimizaciones Específicas para Coolify

### 1. Docker Optimizado

- Multi-stage build para reducir tamaño
- Uso de Alpine Linux
- Optimización de capas Docker

### 2. Configuración de Red

- Configuración de proxy reverso
- Optimización de SSL/TLS
- Configuración de cache

### 3. Seguridad

- Variables de entorno seguras
- Configuración de firewall
- Monitoreo de seguridad

## Troubleshooting

### Problemas Comunes

1. **Error de Build**
   - Verificar Dockerfile.coolify
   - Revisar logs de build
   - Verificar dependencias

2. **Error de Conexión a Base de Datos**
   - Verificar variables de entorno
   - Verificar conectividad de red
   - Revisar configuración de firewall

3. **Error de Variables de Entorno**
   - Verificar todas las variables requeridas
   - Revisar formato de variables
   - Verificar permisos

### Comandos de Diagnóstico

```bash
# Verificar logs
docker logs container_name

# Verificar variables de entorno
echo $DATABASE_URL

# Verificar conectividad
curl -I https://iapunto.com

# Verificar base de datos
psql $DATABASE_URL -c "SELECT version();"
```

## Contacto y Soporte

Para problemas específicos de Coolify:

- Documentación oficial: https://coolify.io/docs
- Comunidad: https://discord.gg/coolify
- GitHub: https://github.com/coollabsio/coolify

## Notas de Migración

- ✅ Configuración de Astro para Coolify creada
- ✅ Variables de entorno definidas
- ✅ Dockerfile optimizado creado
- ✅ Scripts de build y start agregados
- ✅ Documentación completa creada

**Próximos pasos:**

1. Configurar aplicación en Coolify
2. Migrar base de datos
3. Configurar dominio y SSL
4. Realizar pruebas de despliegue
5. Configurar monitoreo
6. Eliminar configuraciones obsoletas de Railway
