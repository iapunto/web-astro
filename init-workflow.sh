#!/bin/bash
# init-workflow.sh - Inicializa el flujo de trabajo Git

echo "🚀 Inicializando flujo de trabajo Git..."

# Verificar que estamos en main
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ]; then
    echo "❌ Error: Debes estar en la rama main"
    exit 1
fi

# Crear rama develop si no existe
if ! git show-ref --verify --quiet refs/heads/develop; then
    echo "📱 Creando rama develop..."
    git checkout -b develop
    git push -u origin develop
    echo "✅ Rama develop creada"
else
    echo "ℹ️  Rama develop ya existe"
    git checkout develop
    git pull origin develop
fi

# Volver a main
git checkout main

echo "✅ Flujo de trabajo inicializado"
echo "📋 Ramas disponibles:"
git branch -a