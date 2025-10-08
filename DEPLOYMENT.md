# Guía de Deployment - Variables de Entorno

Este proyecto utiliza **Astro 5** con el sistema de variables de entorno `astro:env`. Las variables deben configurarse en el entorno de producción de tu plataforma de deployment.

## 📋 Variables Requeridas

### Strapi CMS (OBLIGATORIAS)
```bash
STRAPI_API_URL=https://strapi.iapunto.com
STRAPI_API_TOKEN=tu_token_secreto_de_strapi
```

### Google Calendar API (Opcionales)
```bash
GOOGLE_CALENDAR_ID=primary
GOOGLE_SERVICE_ACCOUNT_EMAIL=services-web@ia-punto.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"
```

### Email Service (Opcionales)
```bash
SMTP_USER=tu_email@dominio.com
SMTP_PASSWORD=tu_contraseña_smtp
INTERNAL_NOTIFICATION_EMAIL=notificaciones@dominio.com
```

### Configuración de Aplicación (Opcionales)
```bash
TIMEZONE=America/Bogota
APP_URL=https://iapunto.com
```

## 🚀 Configuración por Plataforma

### Vercel

1. Ve a tu proyecto en Vercel Dashboard
2. Selecciona **Settings** → **Environment Variables**
3. Agrega cada variable con su valor
4. Selecciona el entorno: Production, Preview, Development
5. Guarda los cambios
6. Redeploy el sitio para aplicar cambios

```bash
# CLI de Vercel
vercel env add STRAPI_API_URL production
vercel env add STRAPI_API_TOKEN production
```

**Importante para Vercel:**
- Las variables se cargan automáticamente en el build
- No necesitas prefijo `PUBLIC_` para variables del servidor
- El sistema `astro:env/server` funciona perfectamente

### Netlify

1. Ve a **Site Settings** → **Environment Variables**
2. Click en **Add a variable**
3. Agrega cada variable:
   - Key: `STRAPI_API_URL`
   - Value: `https://strapi.iapunto.com`
   - Scopes: Selecciona los entornos necesarios
4. Guarda y redeploy

```bash
# CLI de Netlify
netlify env:set STRAPI_API_URL "https://strapi.iapunto.com"
netlify env:set STRAPI_API_TOKEN "tu_token_aqui"
```

### Cloudflare Pages

1. Ve a tu proyecto en Cloudflare Dashboard
2. Selecciona **Settings** → **Environment Variables**
3. Agrega variables para Production y/o Preview
4. Redeploy el sitio

**Nota:** Cloudflare Pages tiene soporte completo para `astro:env/server`

### Deployment con Node.js / Docker

Para deployments con Node.js o Docker, puedes:

**Opción 1: Archivo .env en producción**
```bash
# En tu servidor
cd /ruta/al/proyecto
nano .env  # o vim .env

# Agrega las variables:
STRAPI_API_URL=https://strapi.iapunto.com
STRAPI_API_TOKEN=tu_token_aqui
```

**Opción 2: Variables de entorno del sistema**
```bash
# Linux/Mac
export STRAPI_API_URL="https://strapi.iapunto.com"
export STRAPI_API_TOKEN="tu_token_aqui"

# Windows
set STRAPI_API_URL=https://strapi.iapunto.com
set STRAPI_API_TOKEN=tu_token_aqui
```

**Opción 3: Docker Compose**
```yaml
version: '3.8'
services:
  web:
    build: .
    environment:
      - STRAPI_API_URL=https://strapi.iapunto.com
      - STRAPI_API_TOKEN=${STRAPI_API_TOKEN}
    env_file:
      - .env
```

## 🔍 Verificación

### En desarrollo local:
```bash
# Crea un archivo .env con tus variables
npm run dev
```

### En producción:
1. Verifica que las variables estén configuradas en tu plataforma
2. Redeploy el sitio
3. Verifica los logs del build:
   - ✅ `Token configured: YES`
   - ✅ `Obtenidos X artículos`
4. Visita https://iapunto.com/blog
5. Deberías ver todos los artículos de Strapi

## ⚠️ Troubleshooting

### El blog muestra solo 1 artículo (mock)
**Causa:** Variables de entorno no configuradas o incorrectas

**Solución:**
1. Verifica que `STRAPI_API_URL` y `STRAPI_API_TOKEN` estén configuradas
2. Verifica que los valores sean correctos (sin comillas extra)
3. Redeploy el sitio después de configurar las variables
4. Revisa los logs del build/runtime

### Error 403 Forbidden
**Causa:** `STRAPI_API_TOKEN` falta o es inválido

**Solución:**
1. Verifica el token en Strapi CMS → Settings → API Tokens
2. Genera un nuevo token si es necesario
3. Actualiza la variable en tu plataforma
4. Redeploy

### Error 400 Bad Request
**Causa:** URL de Strapi incorrecta o populate query inválido

**Solución:**
1. Verifica que `STRAPI_API_URL` sea correcto
2. El código usa `populate=*` que funciona en Strapi v5
3. Revisa la consola del servidor para más detalles

## 📚 Referencias

- [Astro Environment Variables](https://docs.astro.build/en/guides/environment-variables/)
- [Astro + Strapi Guide](https://docs.astro.build/en/guides/cms/strapi/)
- [Astro Deployment](https://docs.astro.build/en/guides/deploy/)

## 🔐 Seguridad

**NUNCA** commitees el archivo `.env` al repositorio. Está incluido en `.gitignore` por seguridad.

**Buenas prácticas:**
- Usa tokens con permisos mínimos necesarios
- Rota los tokens periódicamente
- Usa diferentes tokens para desarrollo y producción
- Monitorea el uso de tokens en Strapi

---

**Última actualización:** Octubre 2025  
**Versión de Astro:** 5.14.1  
**Versión de Strapi:** 5.x
