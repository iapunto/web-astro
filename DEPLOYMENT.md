# Despliegue en Cloudflare Workers

Este proyecto está configurado para desplegarse en Cloudflare Workers siguiendo las mejores prácticas de la [documentación oficial de Astro](https://docs.astro.build/en/guides/deploy/cloudflare/#cloudflare-workers).

## Configuración del Proyecto

### Archivos de Configuración

- **`astro.config.mjs`**: Configurado con `output: 'server'` y `adapter: cloudflare()`
- **`wrangler.toml`**: Configuración optimizada para Workers con assets y observabilidad
- **`public/.assetsignore`**: Excluye archivos del Worker de los assets estáticos

### Scripts Disponibles

```bash
# Desarrollo local con Workers
pnpm run dev:workers

# Desarrollo local con Pages
pnpm run dev:pages

# Build del proyecto
pnpm build

# Despliegue a producción
pnpm deploy

# Despliegue a preview
pnpm deploy:preview
```

## Variables de Entorno

### Variables Públicas (Vars)

- `SITE_URL`: URL del sitio (ej: https://iapunto.com)
- `RECAPTCHA_SITE_KEY`: Clave pública de reCAPTCHA

### Variables Secretas (Secrets)

- `RESEND_API_KEY`: Clave API de Resend para envío de emails
- `RECAPTCHA_SECRET_KEY`: Clave secreta de reCAPTCHA
- `EMAIL_FROM`: Email desde el cual se envían los correos
- `EMAIL_TO`: Email al cual se envían las notificaciones

## Configuración en Cloudflare Dashboard

### Para Workers Builds (Recomendado)

1. Ve a tu dashboard de Cloudflare Workers
2. Selecciona "Create" y luego "Import a repository"
3. Conecta tu cuenta de Git y selecciona el repositorio
4. Configura el proyecto con:
   - **Build command**: `pnpm build`
   - **Deploy command**: `pnpm deploy`
5. Haz clic en "Save and Deploy"

### Para Despliegue Manual

1. Ve a tu dashboard de Cloudflare Workers
2. Crea un nuevo Worker
3. Configura las variables de entorno en "Settings" > "Variables"
4. Ejecuta `pnpm deploy` desde tu máquina local

## Características del Proyecto

### Renderizado On-Demand (SSR)

- Todas las páginas se renderizan en tiempo real en el Worker
- Las páginas estáticas como políticas legales pueden usar `export const prerender = true`
- API routes funcionan dinámicamente en runtime

### Assets Estáticos

- Los assets se sirven desde el directorio `./dist`
- Configurado con binding `ASSETS` para acceso desde el Worker
- Archivos excluidos: `_worker.js`, `_routes.json`

### Observabilidad

- Logs habilitados para debugging
- Métricas disponibles en el dashboard de Cloudflare
- Stack traces y source maps para desarrollo

## Troubleshooting

### Problemas Comunes

1. **Error de variables de entorno**: Asegúrate de que todas las variables estén configuradas en Cloudflare Workers
2. **Error de build**: Verifica que todas las dependencias estén instaladas
3. **API routes no funcionan**: Verifica que el output esté configurado como 'server'
4. **Error de Workers**: Verifica que el Worker tenga los permisos necesarios

### Hydration Mismatches

Si ves "Hydration completed but contains mismatches" en la consola:
- Desactiva "Auto Minify" en la configuración de Cloudflare
- Esto es causado por la minificación automática de Cloudflare

### Node.js Runtime APIs

Si tienes errores como "Could not resolve XXXX":
- Verifica que los paquetes sean compatibles con Cloudflare Workers
- Usa la sintaxis `node:*` para APIs de Node.js cuando sea posible
- Consulta la [documentación de compatibilidad de Node.js](https://docs.astro.build/en/guides/deploy/cloudflare/#nodejs-runtime-apis)

### Logs

Los logs de Cloudflare Workers se pueden ver en:
- Dashboard de Cloudflare Workers > "Logs"
- Real-time logs durante el desarrollo
- Logs históricos para debugging

## Diferencias con Cloudflare Pages

- **Workers**: Más control sobre el runtime, mejor para aplicaciones complejas
- **Pages**: Más simple para sitios estáticos, menos control sobre el servidor
- **Recomendación**: Cloudflare recomienda Workers para nuevos proyectos

## Referencias

- [Documentación oficial de Astro para Cloudflare](https://docs.astro.build/en/guides/deploy/cloudflare/)
- [Guía de Cloudflare Workers para Astro](https://developers.cloudflare.com/workers/frameworks/framework-guides/astro/)
- [Compatibilidad de Node.js en Cloudflare](https://developers.cloudflare.com/workers/runtime-apis/nodejs/)
