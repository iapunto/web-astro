# Despliegue en Cloudflare Workers

Este proyecto está configurado para desplegarse en Cloudflare Workers.

## Configuración

### Variables de Entorno

Necesitas configurar las siguientes variables de entorno en Cloudflare Workers:

#### Variables Públicas (Vars)

- `SITE_URL`: URL del sitio (ej: https://iapunto.com)
- `RECAPTCHA_SITE_KEY`: Clave pública de reCAPTCHA

#### Variables Secretas (Secrets)

- `RESEND_API_KEY`: Clave API de Resend para envío de emails
- `RECAPTCHA_SECRET_KEY`: Clave secreta de reCAPTCHA
- `EMAIL_FROM`: Email desde el cual se envían los correos
- `EMAIL_TO`: Email al cual se envían las notificaciones

### Configuración en Cloudflare Workers

1. Ve a tu dashboard de Cloudflare Workers
2. Crea un nuevo Worker
3. Configura las variables de entorno en la sección "Settings" > "Variables"
4. Configura el comando de build: `pnpm build`
5. El directorio de salida será `dist`

## Comandos de Despliegue

### Despliegue Manual

```bash
# Build del proyecto
pnpm build

# Despliegue a producción
pnpm deploy

# Despliegue a preview
pnpm deploy:preview
```

### Despliegue Automático

El despliegue automático se realiza a través de GitHub cuando se hace push a la rama `main`.

## Estructura del Proyecto

- `output: 'server'`: Permite API routes dinámicas
- `adapter: cloudflare()`: Configuración para Cloudflare Workers
- API routes en `/src/pages/api/`: Funcionan en runtime
- Páginas estáticas: Se generan en build time

## Diferencias con Cloudflare Pages

- **Workers**: Más control sobre el runtime, mejor para aplicaciones complejas
- **Pages**: Más simple para sitios estáticos, menos control sobre el servidor

## Troubleshooting

### Problemas Comunes

1. **Error de variables de entorno**: Asegúrate de que todas las variables estén configuradas en Cloudflare Workers
2. **Error de build**: Verifica que todas las dependencias estén instaladas
3. **API routes no funcionan**: Verifica que el output esté configurado como 'server'
4. **Error de Workers**: Verifica que el Worker tenga los permisos necesarios

### Logs

Los logs de Cloudflare Workers se pueden ver en el dashboard de Cloudflare Workers en la sección "Logs".
