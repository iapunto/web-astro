# Flujo de Trabajo Git - Web IA Punto

Este documento describe el flujo de trabajo Git implementado para el proyecto web-iapunto, basado en **GitFlow** con adaptaciones específicas para nuestro contexto.

## 🌳 Estructura de Ramas

### Ramas Principales

#### `main`

- **Propósito**: Código en producción
- **Estabilidad**: Siempre estable y desplegable
- **Protección**: Protegida contra push directo
- **Despliegue**: Automático a Railway

#### `develop`

- **Propósito**: Rama de desarrollo principal
- **Integración**: Todas las features se integran aquí
- **Testing**: Pruebas de integración
- **Origen**: Creada desde `main`

### Ramas de Soporte

#### `feature/*`

- **Propósito**: Desarrollo de nuevas funcionalidades
- **Nomenclatura**: `feature/gem-simplification`, `feature/calendar-oauth2-fix`
- **Origen**: Creada desde `develop`
- **Destino**: Merge a `develop`
- **Duración**: Temporal (se elimina después del merge)

#### `bugfix/*`

- **Propósito**: Corrección de bugs en desarrollo
- **Nomenclatura**: `bugfix/gem4-image-generation`, `bugfix/calendar-permissions`
- **Origen**: Creada desde `develop`
- **Destino**: Merge a `develop`

#### `hotfix/*`

- **Propósito**: Correcciones urgentes en producción
- **Nomenclatura**: `hotfix/v1.0.1-critical-gem-fix`
- **Origen**: Creada desde `main`
- **Destino**: Merge a `main` y `develop`

#### `release/*`

- **Propósito**: Preparación de releases
- **Nomenclatura**: `release/v1.1.0`
- **Origen**: Creada desde `develop`
- **Destino**: Merge a `main` y `develop`

## 🔄 Flujo de Trabajo

### 1. Configuración Inicial

```bash
# Clonar repositorio
git clone https://github.com/iapunto/web-iapunto.git
cd web-iapunto

# Configurar Git Flow (si está instalado)
git flow init

# O configuración manual
git checkout -b develop
git push -u origin develop
```

### 2. Desarrollo de Features

```bash
# Crear feature branch
git checkout develop
git pull origin develop
git checkout -b feature/gem-system-refactor

# Desarrollo...
git add .
git commit -m "feat(gem): implementar nueva arquitectura de 3 etapas"

# Finalizar feature
git checkout develop
git pull origin develop
git merge --no-ff feature/gem-system-refactor
git push origin develop
git branch -d feature/gem-system-refactor
```

### 3. Corrección de Bugs

```bash
# Crear bugfix branch
git checkout develop
git pull origin develop
git checkout -b bugfix/calendar-oauth2-tokens

# Corrección...
git add .
git commit -m "fix(calendar): corregir renovación de tokens OAuth2"

# Finalizar bugfix
git checkout develop
git merge --no-ff bugfix/calendar-oauth2-tokens
git push origin develop
git branch -d bugfix/calendar-oauth2-tokens
```

### 4. Hotfixes (Correcciones Urgentes)

```bash
# Crear hotfix desde main
git checkout main
git pull origin main
git checkout -b hotfix/v1.0.1-gemini-api-fix

# Corrección urgente...
git add .
git commit -m "fix(gem)!: corregir fallo crítico en API de Gemini"

# Merge a main
git checkout main
git merge --no-ff hotfix/v1.0.1-gemini-api-fix
git tag -a v1.0.1 -m "Hotfix v1.0.1: Corrección crítica API Gemini"
git push origin main --tags

# Merge a develop
git checkout develop
git merge --no-ff hotfix/v1.0.1-gemini-api-fix
git push origin develop

# Limpiar
git branch -d hotfix/v1.0.1-gemini-api-fix
```

### 5. Releases

```bash
# Crear release branch
git checkout develop
git pull origin develop
git checkout -b release/v1.1.0

# Preparar release (actualizar versiones, changelog, etc.)
git add .
git commit -m "chore(release): preparar v1.1.0"

# Finalizar release
git checkout main
git merge --no-ff release/v1.1.0
git tag -a v1.1.0 -m "Release v1.1.0: Sistema GEM refactorizado"
git push origin main --tags

# Merge de vuelta a develop
git checkout develop
git merge --no-ff release/v1.1.0
git push origin develop

# Limpiar
git branch -d release/v1.1.0
```

## 🏷️ Estrategia de Versionado

### Semantic Versioning (SemVer)

**Formato**: `MAJOR.MINOR.PATCH`

- **MAJOR**: Cambios incompatibles (breaking changes)
- **MINOR**: Nueva funcionalidad compatible
- **PATCH**: Correcciones de bugs compatibles

### Ejemplos para nuestro proyecto:

```
v1.0.0 → v1.0.1  # Hotfix: Corrección bug crítico
v1.0.1 → v1.1.0  # Feature: Nueva funcionalidad GEM
v1.1.0 → v2.0.0  # Breaking: Cambio arquitectura GEM
```

## 🛡️ Protección de Ramas

### Configuración Recomendada

#### Rama `main`:

- ✅ Requerir pull request reviews
- ✅ Requerir que las branches estén actualizadas
- ✅ Requerir status checks (CI/CD)
- ✅ Incluir administradores
- ❌ Permitir force push

#### Rama `develop`:

- ✅ Requerir pull request reviews
- ✅ Requerir que las branches estén actualizadas
- ❌ Incluir administradores (más flexibilidad)

## 🔄 Comandos Útiles

```bash
# Ver todas las ramas
git branch -a

# Ver estado de tracking
git status

# Sincronizar con remoto
git fetch --all
git pull --all

# Limpiar ramas obsoletas
git branch -d <branch-name>
git push origin --delete <branch-name>

# Ver historial gráfico
git log --oneline --graph --decorate --all

# Ver cambios entre ramas
git diff develop..feature/nueva-feature
```

## 📋 Checklist para Pull Requests

### Antes de crear PR:

- [ ] Código sigue convenciones del proyecto
- [ ] Tests pasan (cuando existan)
- [ ] Documentación actualizada
- [ ] CHANGELOG.md actualizado
- [ ] Commit messages siguen convenciones
- [ ] Rama actualizada con develop/main

### Revisión de PR:

- [ ] Funcionalidad cumple requisitos
- [ ] Código es mantenible
- [ ] No introduce vulnerabilidades
- [ ] Performance es aceptable
- [ ] Documentación suficiente

## 🚀 Automatización

### GitHub Actions / CI/CD

```yaml
# .github/workflows/ci.yml
name: CI/CD Pipeline
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: pnpm install
      - name: Run tests
        run: pnpm test
      - name: Build project
        run: pnpm build
```

## 🎯 Aplicación al Plan de Refactorización

Para nuestro plan de refactorización en 4 fases:

1. **Fase 1**: `feature/phase1-stabilization`
2. **Fase 2**: `feature/phase2-simplification`
3. **Fase 3**: `feature/phase3-robustness`
4. **Fase 4**: `feature/phase4-quality`

Cada fase tendrá su propia rama feature que se mergeará a `develop` al completarse.
