#!/bin/bash

# Script para hacer deploy a Coolify
echo "🚀 Iniciando despliegue a Coolify..."

# Verificar que estamos en la rama main
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ]; then
    echo "❌ Error: Debes estar en la rama main para hacer deploy"
    echo "Actual branch: $CURRENT_BRANCH"
    exit 1
fi

# Verificar que no hay cambios pendientes
if [ -n "$(git status --porcelain)" ]; then
    echo "❌ Error: Hay cambios pendientes. Por favor, haz commit de todos los cambios antes de hacer deploy"
    git status
    exit 1
fi

# Hacer commit de los cambios de configuración de Coolify
echo "📝 Haciendo commit de la configuración de Coolify..."
git add .
git commit -m "feat: Configuración para despliegue en Coolify

- Agregada configuración específica para Coolify
- Creados scripts de migración
- Actualizado Dockerfile para Coolify
- Agregada documentación de migración

Refs #coolify-migration"

# Hacer push a GitHub
echo "📤 Haciendo push a GitHub..."
git push origin main

echo "✅ Push completado exitosamente!"
echo ""
echo "📋 Próximos pasos en Coolify:"
echo "1. Verificar que el repositorio está conectado"
echo "2. Configurar variables de entorno"
echo "3. Configurar dominio y SSL"
echo "4. Realizar primer despliegue"
echo ""
echo "🔗 Documentación: COOLIFY_SETUP.md"
