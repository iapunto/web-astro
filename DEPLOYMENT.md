# Despliegue en Cloudflare Pages

Este proyecto está configurado para desplegarse en Cloudflare Pages.

## Configuración

### Variables de Entorno

Necesitas configurar las siguientes variables de entorno en Cloudflare Pages:

#### Variables Públicas (Vars)
- `SITE_URL`: URL del sitio (ej: https://iapunto.com)
- `RECAPTCHA_SITE_KEY`: Clave pública de reCAPTCHA

#### Variables Secretas (Secrets)
- `RESEND_API_KEY`: Clave API de Resend para envío de emails
- `RECAPTCHA_SECRET_KEY`: Clave secreta de reCAPTCHA
- `EMAIL_FROM`: Email desde el cual se envían los correos
- `EMAIL_TO`: Email al cual se envían las notificaciones

### Configuración en Cloudflare Pages

1. Ve a tu dashboard de Cloudflare Pages
2. Conecta tu repositorio de GitHub
3. Configura las variables de entorno en la sección "Settings" > "Environment variables"
4. Configura el comando de build: `pnpm build`
5. Configura el directorio de salida: `dist`

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
- `adapter: cloudflare()`: Configuración para Cloudflare Pages
- API routes en `/src/pages/api/`: Funcionan en runtime
- Páginas estáticas: Se generan en build time

## Troubleshooting

### Problemas Comunes

1. **Error de variables de entorno**: Asegúrate de que todas las variables estén configuradas en Cloudflare Pages
2. **Error de build**: Verifica que todas las dependencias estén instaladas
3. **API routes no funcionan**: Verifica que el output esté configurado como 'server'

### Logs
Los logs de Cloudflare Pages se pueden ver en el dashboard de Cloudflare Pages en la sección "Deployments". 