# CHANGELOG

Todos los cambios notables de este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es/1.0.0/),
y este proyecto se adhiere a [Semantic Versioning](https://semver.org/lang/es/).

## [Sin liberar]

### En Progreso
- Fase 2: Simplificación (reducir sistema GEM de 5 a 3 etapas)
- Consolidación de endpoints de Calendar
- Optimización de base de datos

## [1.1.0] - 2025-01-27 - Fase 1: Estabilización

### Agregado
- **Auditoría completa de scripts**: Análisis de 93 scripts del proyecto
- **Documentación técnica completa**:
  - `docs/GEM_SYSTEM.md` - Sistema de generación de artículos con IA
  - `docs/CALENDAR_SYSTEM.md` - Sistema de agendamiento con Google Calendar
  - `docs/ARCHITECTURE.md` - Arquitectura general del proyecto
- **Herramientas de auditoría**:
  - `scripts/scripts-auditor.ts` - Auditoría automatizada de scripts
  - `move-obsolete-scripts.cjs` - Migración automática a deprecated
  - `simple-audit.cjs` - Auditoría rápida del sistema
- **Catalogación de scripts activos**: `ACTIVE_SCRIPTS.md`
- **Plan detallado de refactorización**: `PHASE1_PLAN.md`
- **Reporte de auditoría**: `QUICK_SCRIPTS_AUDIT.md`

### Cambiado
- **Reorganización completa de scripts por categorías**:
  - `scripts/analysis/` - 5 scripts de análisis de datos
  - `scripts/gem-system/` - 3 scripts del sistema GEM
  - `scripts/testing/` - 10 scripts de verificación y testing
  - `scripts/railway-setup/` - 4 scripts de configuración Railway
  - `scripts/fixes-2025/` - 3 scripts de fixes específicos
  - `scripts/migrations-2025/` - 1 script de migración
- **Estructura de proyecto más limpia y organizada**
- **Identificación de 28 scripts obsoletos** movidos a deprecated
- **Documentación mejorada** con README.md en cada categoría

### Deprecado
- **37 scripts obsoletos** movidos a `scripts/deprecated/` con documentación:
  - Scripts de testing individual GEM (test-gem1-only.ts → test-gem5-only.ts)
  - Scripts de fixes específicos ya aplicados (fix-marilyn-*.ts, fix-trump-article.js)
  - Scripts de migración completados (migrate-to-strapi*.ts, fix-yaml*.ts)
  - Scripts de procesamiento de imágenes ejecutados (scrape-*.js, extract-real-urls.js)
  - Scripts de migración 2025 completados (validate-2025-*.ts, move-2025-articles.ts)

### Corregido
- **Estructura de scripts** desorganizada y sin categorización
- **Falta de documentación técnica** de componentes críticos
- **Scripts duplicados y obsoletos** acumulados sin gestión
- **Configuración Git** mejorada con flujo de trabajo GitFlow

### Puntos de Dolor Identificados
- **Sistema GEM**: Complejidad excesiva con 5 etapas secuenciales
- **Sistema Calendar**: Dual auth complexity (Service Account + OAuth2)
- **Dependencias externas críticas**: Sin fallbacks robustos
- **Proliferación de scripts**: 93 scripts con solo 2 activos críticos

### Métricas de la Auditoría
- **Scripts totales**: 93 → 65 (28 deprecados)
- **Scripts activos críticos**: 2 (automated-article-creator, article-monitor)
- **Scripts de testing**: 24 → 10 (consolidados en /testing/)
- **Scripts deprecados**: 9 → 37 (auditoría completa)
- **Documentación técnica**: 0 → 3 documentos completos

## [1.0.0] - 2025-01-27

### Agregado

- Sistema de automatización de artículos con IA (GEM 1-5)
- Integración completa con Google Calendar API
- Sistema de agendamiento con OAuth2 y Service Account
- Blog automatizado con Google Gemini
- Integración con Cloudinary para gestión de imágenes
- Sistema de tracking de artículos en PostgreSQL
- 50+ scripts de automatización y monitoreo
- Middleware de seguridad con CSP, HSTS, XSS Protection
- Sistema de notificaciones por email con Resend
- Configuración de despliegue en Railway
- Soporte para múltiples autores y categorías
- Sistema de validación de contenido
- Backup automático de artículos

### Características Técnicas

- Framework: Astro v5.4.2 con renderizado híbrido SSG/SSR
- Frontend: React v19.0.0 + TypeScript v5.8.2
- Estilos: Tailwind CSS v3.4.17 + Flowbite v2.5.2
- Base de datos: PostgreSQL + SQLite + Better-SQLite3
- APIs: Google Calendar, Google Gemini, Cloudinary, Resend
- Contenedores: Docker multi-etapa
- Despliegue: Railway con GitHub Actions
