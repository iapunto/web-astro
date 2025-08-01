#!/bin/bash

# Script de configuración automática para Strapi
# Ejecutar en la raíz de tu instalación de Strapi

echo "🔧 Configurando Strapi para IA Punto..."

# 1. Crear vite.config.js
echo "📝 Creando vite.config.js..."
cat > vite.config.js << 'EOF'
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
EOF

# 2. Crear config/middlewares.js
echo "📝 Configurando middlewares..."
mkdir -p config
cat > config/middlewares.js << 'EOF'
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
EOF

# 3. Crear config/server.js
echo "📝 Configurando servidor..."
cat > config/server.js << 'EOF'
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
EOF

# 4. Crear .env.example
echo "📝 Creando .env.example..."
cat > .env.example << 'EOF'
HOST=0.0.0.0
PORT=1337
APP_KEYS=your_app_keys_here
API_TOKEN_SALT=your_api_token_salt_here
ADMIN_JWT_SECRET=your_admin_jwt_secret_here
JWT_SECRET=your_jwt_secret_here
NODE_ENV=production
EOF

echo "✅ Configuración completada!"
echo ""
echo "📋 Pasos siguientes:"
echo "1. Copia las variables de .env.example a tu archivo .env"
echo "2. Genera las claves necesarias con: npm run strapi generate:keys"
echo "3. Reinicia tu aplicación Strapi en Coolify"
echo "4. Accede a https://strapi.iapunto.com/admin"
echo ""
echo "🔗 Para probar la conexión: https://iapunto.com/api/strapi-test" 