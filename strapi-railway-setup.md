# Configuración de Strapi en Railway

Esta guía te ayudará a configurar Strapi (CMS) en Railway junto con tu aplicación Astro.

## 🚀 Configuración Inicial

### 1. Crear Proyecto en Railway

1. Ve a [Railway.app](https://railway.app)
2. Crea un nuevo proyecto
3. Conecta tu repositorio de GitHub

### 2. Configurar Servicios

En Railway necesitarás crear los siguientes servicios:

#### Servicio 1: Aplicación Web (Astro)
- **Nombre**: `iapunto-website`
- **Build Command**: `pnpm run build:railway`
- **Start Command**: `pnpm run preview:railway`
- **Variables de entorno**: Ver `env.railway.example`

#### Servicio 2: Strapi CMS
- **Nombre**: `iapunto-strapi`
- **Build Command**: `npm run build`
- **Start Command**: `npm start`
- **Variables de entorno**: Ver configuración de Strapi

#### Servicio 3: Base de Datos (PostgreSQL)
- **Nombre**: `iapunto-db`
- **Tipo**: PostgreSQL
- **Variables de entorno**: Automáticas

## 🔧 Variables de Entorno

### Para la Aplicación Web
```bash
NODE_ENV=production
SITE_URL=https://iapunto.com
STRAPI_API_URL=https://iapunto-strapi-production.up.railway.app
STRAPI_API_TOKEN=your-strapi-token
PORT=4321
RAILWAY_STATIC_URL=https://iapunto.com
RAILWAY_PUBLIC_DOMAIN=iapunto.com
```

### Para Strapi
```bash
NODE_ENV=production
DATABASE_CLIENT=postgres
DATABASE_HOST=iapunto-db-production.up.railway.app
DATABASE_PORT=5432
DATABASE_NAME=railway
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=your-db-password
JWT_SECRET=your-jwt-secret
ADMIN_JWT_SECRET=your-admin-jwt-secret
API_TOKEN_SALT=your-api-token-salt
APP_KEYS=your-app-keys
TRANSFER_TOKEN_SALT=your-transfer-token-salt
```

## 📦 Configuración de Strapi

### 1. Crear Repositorio Separado para Strapi

```bash
# Crear nuevo repositorio para Strapi
mkdir iapunto-strapi
cd iapunto-strapi
npx create-strapi-app@latest . --quickstart --no-run
```

### 2. Configurar Strapi para Railway

Crear `railway.json` en el proyecto Strapi:

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm start",
    "healthcheckPath": "/admin",
    "healthcheckTimeout": 100,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### 3. Configurar Base de Datos

En `config/database.js`:

```javascript
module.exports = ({ env }) => ({
  connection: {
    client: 'postgres',
    connection: {
      host: env('DATABASE_HOST', 'localhost'),
      port: env.int('DATABASE_PORT', 5432),
      database: env('DATABASE_NAME', 'railway'),
      user: env('DATABASE_USERNAME', 'postgres'),
      password: env('DATABASE_PASSWORD', ''),
      ssl: env.bool('DATABASE_SSL', false),
    },
  },
});
```

## 🔗 Conectar Servicios

### 1. Variables de Entorno Compartidas

En Railway, configura las variables de entorno para que los servicios se comuniquen:

- **Aplicación Web** → **Strapi**: `STRAPI_API_URL`
- **Strapi** → **Base de Datos**: Variables de base de datos

### 2. Dominios Personalizados

1. Configura dominios personalizados en Railway
2. Actualiza las variables de entorno con los nuevos dominios
3. Configura DNS para apuntar a Railway

## 🚀 Despliegue

### 1. Despliegue Automático

Railway detectará automáticamente los cambios en tu repositorio y desplegará:

- **Aplicación Web**: Cuando hagas push a `main`
- **Strapi**: Cuando hagas push al repositorio de Strapi

### 2. Despliegue Manual

```bash
# Para la aplicación web
railway up

# Para Strapi (desde su repositorio)
railway up
```

## 📊 Monitoreo

### Dashboard de Railway

Railway proporciona un dashboard integrado donde puedes:

- Ver logs en tiempo real
- Monitorear uso de recursos
- Configurar alertas
- Ver métricas de rendimiento

### Health Checks

- **Aplicación Web**: `https://iapunto.com/`
- **Strapi Admin**: `https://strapi.iapunto.com/admin`

## 🔧 Troubleshooting

### Problemas Comunes

1. **Error de conexión a base de datos**
   - Verificar variables de entorno de Strapi
   - Asegurar que la base de datos esté desplegada

2. **Error de build**
   - Verificar que todas las dependencias estén en `package.json`
   - Revisar logs de build en Railway

3. **Error de variables de entorno**
   - Verificar que todas las variables estén configuradas
   - Asegurar que los nombres coincidan exactamente

## 📝 Notas Importantes

- **Escalabilidad**: Railway maneja automáticamente el escalado
- **Backups**: Railway proporciona backups automáticos de la base de datos
- **SSL**: Railway maneja automáticamente los certificados SSL
- **CDN**: Railway incluye CDN global para mejor rendimiento 