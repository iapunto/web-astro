#!/bin/bash

echo "🚀 Despliegue simple a Coolify"

# Verificar que estamos en main
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ]; then
    echo "❌ Error: Debes estar en la rama main"
    exit 1
fi

# Hacer commit de los cambios
git add .
git commit -m "feat: Configuración simple para despliegue"

# Hacer push
git push origin main

echo "✅ Push completado!"
echo ""
echo "📋 Configuración en Coolify:"
echo "1. Dockerfile: Dockerfile.simple"
echo "2. Puerto: 4321"
echo "3. Build Command: pnpm run build:simple"
echo "4. Start Command: pnpm run start:coolify"
