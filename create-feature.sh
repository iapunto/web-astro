#!/bin/bash
# create-feature.sh - Crea una nueva rama feature

if [ -z "$1" ]; then
    echo "❌ Error: Debes proporcionar un nombre para la feature"
    echo "📋 Uso: ./create-feature.sh <nombre-feature>"
    echo "📋 Ejemplo: ./create-feature.sh gem-system-refactor"
    exit 1
fi

FEATURE_NAME="feature/$1"

echo "🌟 Creando feature branch: $FEATURE_NAME"

# Ir a develop y actualizar
git checkout develop
git pull origin develop

# Crear y cambiar a la nueva feature
git checkout -b "$FEATURE_NAME"
git push -u origin "$FEATURE_NAME"

echo "✅ Feature branch creada: $FEATURE_NAME"
echo "🔧 Puedes empezar a trabajar!"
echo "📋 Recuerda usar commits convencionales:"
echo "   feat(gem): nueva funcionalidad"
echo "   fix(calendar): corrección de bug"
echo "   refactor(db): mejora de código"