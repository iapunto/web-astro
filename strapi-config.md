# Configuración de Strapi para IA Punto

## 1. Configuración de Vite (vite.config.js)

Crea o modifica el archivo `vite.config.js` en la raíz de tu instalación de Strapi:

```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      'strapi.iapunto.com',
      'localhost',
      '127.0.0.1',
      '0.0.0.0'
    ],
    host: '0.0.0.0',
    port: 1337,
    strictPort: true,
  },
  preview: {
    allowedHosts: [
      'strapi.iapunto.com',
      'localhost',
      '127.0.0.1',
      '0.0.0.0'
    ],
    host: '0.0.0.0',
    port: 1337,
    strictPort: true,
  },
});
```

## 2. Configuración de CORS (config/middlewares.js)

Modifica el archivo `config/middlewares.js` en tu instalación de Strapi:

```javascript
module.exports = [
  'strapi::errors',
  {
    name: 'strapi::cors',
    config: {
      enabled: true,
      origin: [
        'https://iapunto.com',
        'https://www.iapunto.com',
        'http://localhost:4321',
        'http://localhost:3000',
        'https://strapi.iapunto.com'
      ],
      headers: [
        'Content-Type',
        'Authorization',
        'Origin',
        'Accept',
        'User-Agent',
        'DNT',
        'Cache-Control',
        'X-Mx-ReqToken',
        'Keep-Alive',
        'X-Requested-With',
        'If-Modified-Since',
        'X-CSRF-Token'
      ]
    }
  },
  'strapi::poweredBy',
  'strapi::logger',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
```

## 3. Configuración de Servidor (config/server.js)

Modifica el archivo `config/server.js`:

```javascript
module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  app: {
    keys: env.array('APP_KEYS'),
  },
  webhooks: {
    populateRelations: env.bool('WEBHOOKS_POPULATE_RELATIONS', false),
  },
});
```

## 4. Variables de Entorno (.env)

Asegúrate de tener estas variables en tu archivo `.env` de Strapi:

```env
HOST=0.0.0.0
PORT=1337
APP_KEYS=your_app_keys_here
API_TOKEN_SALT=your_api_token_salt_here
ADMIN_JWT_SECRET=your_admin_jwt_secret_here
JWT_SECRET=your_jwt_secret_here
```

## 5. Configuración de Coolify

En tu panel de Coolify, asegúrate de:

1. **Variables de Entorno:**
   - `HOST=0.0.0.0`
   - `PORT=1337`
   - `NODE_ENV=production`

2. **Puertos:**
   - Puerto interno: `1337`
   - Puerto externo: `1337` (o el que configures)

3. **Health Check:**
   - URL: `/admin`
   - Método: `GET`

## 6. Reiniciar Strapi

Después de hacer estos cambios:

1. Reinicia tu aplicación Strapi en Coolify
2. Espera a que se complete el reinicio
3. Intenta acceder a `https://strapi.iapunto.com/admin`

## 7. Verificar Conexión

Una vez configurado, puedes probar la conexión visitando:
- `https://iapunto.com/api/strapi-test`

## Notas Importantes

- Asegúrate de que el dominio `strapi.iapunto.com` esté correctamente configurado en tu DNS
- Verifica que el certificado SSL esté instalado correctamente
- Si usas un proxy reverso (nginx, traefik), asegúrate de que esté configurado para pasar las cabeceras correctamente 