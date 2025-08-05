# Configuración de Despliegue en Railway

Este proyecto está configurado para desplegar en Railway, una plataforma que permite desplegar tanto la aplicación web como Strapi (CMS) en un solo lugar.

## 🚀 Plataforma Principal

### Railway (Todo en uno)
- **Configuración**: `astro.config.railway.mjs`
- **Adaptador**: `@astrojs/node` (modo standalone)
- **Output**: Server-side rendering
- **Configuración**: `railway.json`
- **CMS**: Strapi desplegado en el mismo proyecto

## 📦 Scripts Disponibles

### Build
```bash
# Build para Railway
pnpm run build:railway

# Build por defecto
pnpm run build
```

### Preview
```bash
# Preview para Railway
pnpm run preview:railway

# Preview por defecto
pnpm run preview
```

### Deploy
```bash
# Deploy a Railway
pnpm run deploy:railway
```

## 🔧 Configuración de Entornos

### Variables de Entorno

#### Railway
```bash
NODE_ENV=production
SITE_URL=https://iapunto.com
STRAPI_API_URL=https://strapi.iapunto.com
STRAPI_API_TOKEN=your-token
PORT=4321
RAILWAY_STATIC_URL=https://iapunto.com
RAILWAY_PUBLIC_DOMAIN=iapunto.com
```

## 🚀 Despliegue Automático

### GitHub Actions

El proyecto incluye workflow automático:

1. **`.github/workflows/deploy-railway.yml`** - Despliegue automático a Railway

### Secrets Requeridos

#### Para Railway:
- `STRAPI_API_URL`
- `STRAPI_API_TOKEN`
- `SITE_URL`

## 🔄 Configuración de Railway

1. Conectar el repositorio a Railway
2. Configurar variables de entorno desde `env.railway.example`
3. El build se ejecuta automáticamente con `pnpm run build:railway`
4. Railway detecta automáticamente los cambios y despliega

## 📝 Notas Importantes

- **Railway**: Todo en una plataforma - aplicación web + Strapi + base de datos
- **Ventajas**: Simplifica la gestión, un solo lugar para todo
- **Escalabilidad**: Railway maneja automáticamente el escalado
- **Monitoreo**: Dashboard integrado para monitorear todos los servicios

## 🛠️ Desarrollo Local

```bash
# Desarrollo con configuración por defecto (Railway)
pnpm run dev

# Desarrollo con configuración específica
pnpm run dev --config astro.config.railway.mjs
```
