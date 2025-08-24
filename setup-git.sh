#!/bin/bash
# setup-git.sh - Configuración automática de Git para web-iapunto

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