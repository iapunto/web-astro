# Configuración Git para Web IA Punto

Este archivo contiene scripts y configuraciones para optimizar el flujo de trabajo Git en el proyecto.

## Configuración Automática

Ejecuta este script para configurar Git automáticamente:

```bash
#!/bin/bash
# setup-git.sh

echo "🔧 Configurando Git para web-iapunto..."

# Configuración básica de Git
git config --local core.autocrlf input
git config --local core.safecrlf true
git config --local push.default simple
git config --local pull.rebase false

# Configuración de merge
git config --local merge.ff false
git config --local merge.commit true

# Configuración de branch
git config --local branch.autosetuprebase always

# Configuración de aliases útiles
git config --local alias.co checkout
git config --local alias.br branch
git config --local alias.ci commit
git config --local alias.st status
git config --local alias.last 'log -1 HEAD'
git config --local alias.visual '!gitk'
git config --local alias.graph 'log --oneline --graph --decorate --all'
git config --local alias.unstage 'reset HEAD --'

# Aliases específicos para el proyecto
git config --local alias.feature 'checkout -b feature/'
git config --local alias.bugfix 'checkout -b bugfix/'
git config --local alias.hotfix 'checkout -b hotfix/'
git config --local alias.release 'checkout -b release/'

# Configuración de commit template
git config --local commit.template .gitmessage

echo "✅ Git configurado correctamente"
echo "📋 Aliases disponibles:"
echo "   git co      # checkout"
echo "   git br      # branch"
echo "   git ci      # commit"
echo "   git st      # status"
echo "   git graph   # historial gráfico"
echo "   git feature # crear rama feature"
echo "   git bugfix  # crear rama bugfix"
echo "   git hotfix  # crear rama hotfix"
```

## Template de Commits

Crea el archivo `.gitmessage` en la raíz del proyecto:

```
# <tipo>[alcance]: <descripción>
#
# <cuerpo>
#
# <footer>
#
# Tipos: feat, fix, docs, style, refactor, perf, test, chore, gem, calendar, db, api, script, deploy
# Alcances: gem1-5, calendar, auth, db, api, ui, config, deps, scripts, docs, test
#
# Ejemplo:
# feat(gem3): agregar validación de contenido en redacción automática
#
# Implementa validación de longitud mínima y máxima para artículos
# generados automáticamente. Incluye verificación de palabras clave
# y estructura de secciones.
#
# Closes #123
```

## Scripts de Automatización

### Script para inicializar flujo de trabajo

```bash
#!/bin/bash
# init-workflow.sh

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
fi

# Volver a main
git checkout main

echo "✅ Flujo de trabajo inicializado"
echo "📋 Ramas disponibles:"
git branch -a
```

### Script para crear feature branch

```bash
#!/bin/bash
# create-feature.sh

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
```

### Script para finalizar feature

```bash
#!/bin/bash
# finish-feature.sh

CURRENT_BRANCH=$(git branch --show-current)

if [[ $CURRENT_BRANCH != feature/* ]]; then
    echo "❌ Error: Debes estar en una rama feature"
    exit 1
fi

echo "🏁 Finalizando feature: $CURRENT_BRANCH"

# Verificar que no hay cambios sin commit
if ! git diff-index --quiet HEAD --; then
    echo "❌ Error: Hay cambios sin commit"
    git status
    exit 1
fi

# Ir a develop y actualizar
git checkout develop
git pull origin develop

# Merge de la feature
git merge --no-ff "$CURRENT_BRANCH"

if [ $? -eq 0 ]; then
    echo "✅ Feature mergeada exitosamente"

    # Push develop
    git push origin develop

    # Eliminar rama feature
    git branch -d "$CURRENT_BRANCH"
    git push origin --delete "$CURRENT_BRANCH"

    echo "🧹 Rama feature eliminada"
else
    echo "❌ Error en el merge. Resuelve los conflictos manualmente"
    exit 1
fi
```

## Hooks de Git

### Pre-commit Hook

```bash
#!/bin/sh
# .git/hooks/pre-commit

echo "🔍 Ejecutando pre-commit checks..."

# Verificar que no hay archivos .env
if git diff --cached --name-only | grep -q "\.env$"; then
    echo "❌ Error: No se pueden commitear archivos .env"
    echo "💡 Sugerencia: Agrega .env a .gitignore"
    exit 1
fi

# Verificar formato de commit message (si hay mensaje)
if [ -f .git/COMMIT_EDITMSG ]; then
    # Verificar formato de conventional commits
    commit_regex='^(feat|fix|docs|style|refactor|perf|test|chore|gem|calendar|db|api|script|deploy)(\(.+\))?: .{1,50}'

    if ! grep -qE "$commit_regex" .git/COMMIT_EDITMSG; then
        echo "❌ Error: El mensaje de commit no sigue las convenciones"
        echo "📋 Formato esperado: tipo(alcance): descripción"
        echo "📖 Ver COMMIT_CONVENTIONS.md para más detalles"
        exit 1
    fi
fi

echo "✅ Pre-commit checks pasaron"
exit 0
```

### Commit-msg Hook

```bash
#!/bin/sh
# .git/hooks/commit-msg

commit_regex='^(feat|fix|docs|style|refactor|perf|test|chore|gem|calendar|db|api|script|deploy)(\(.+\))?: .{1,50}'

if ! grep -qE "$commit_regex" "$1"; then
    echo "❌ Error: Mensaje de commit inválido"
    echo "📋 Formato: tipo(alcance): descripción"
    echo "📋 Ejemplo: feat(gem): agregar nueva funcionalidad"
    echo "📖 Ver COMMIT_CONVENTIONS.md para más detalles"
    exit 1
fi

# Verificar longitud de líneas
while IFS= read -r line; do
    if [ ${#line} -gt 72 ]; then
        echo "❌ Error: Línea demasiado larga (>72 caracteres)"
        echo "📏 Línea: $line"
        exit 1
    fi
done < "$1"

echo "✅ Mensaje de commit válido"
exit 0
```

## Instalación

Para instalar toda la configuración:

```bash
# Hacer ejecutables los scripts
chmod +x setup-git.sh
chmod +x init-workflow.sh
chmod +x create-feature.sh
chmod +x finish-feature.sh

# Ejecutar configuración
./setup-git.sh
./init-workflow.sh

# Instalar hooks (opcional)
cp pre-commit .git/hooks/
cp commit-msg .git/hooks/
chmod +x .git/hooks/pre-commit
chmod +x .git/hooks/commit-msg
```

## Uso Diario

```bash
# Crear nueva feature
./create-feature.sh gem-system-refactor

# Trabajar en la feature...
git add .
git commit -m "feat(gem): implementar nueva arquitectura"

# Finalizar feature
./finish-feature.sh

# Ver estado del proyecto
git graph
git st
```
