# Scripts Activos - Web IA Punto

**Actualizado:** Enero 2025 - Fase 1 Estabilización  
**Scripts Totales:** 65 (después de mover 28 obsoletos)  
**Scripts Críticos:** 11

## 🟢 Scripts Críticos de Producción

### Automatización de Artículos

```bash
# Script principal de generación automática de artículos
scripts/automated-article-creator.ts              # 9.2KB
  └── Ejecuta flujo completo GEM 1-5
  └── Utilizado por: pnpm article:create

# Monitoreo de salud del sistema de artículos
scripts/article-monitor.ts                        # 12.4KB
  └── Verifica integridad de artículos publicados
  └── Utilizado por: pnpm article:monitor
```

### Setup y Configuración

```bash
# Configuración del sistema de automatización
scripts/setup-automation.ts                       # 12.7KB
  └── Inicializa el entorno de automatización
  └── Utilizado por: pnpm article:setup

# Configuración de base de datos
scripts/setup-database.ts                         # 8.3KB
  └── Inicializa esquemas PostgreSQL
  └── Utilizado por: pnpm db:setup

# Configuración de variables de entorno
scripts/setup-env.ts                              # 1.8KB
  └── Valida y configura variables críticas
  └── Utilizado por: pnpm env:setup
```

### Railway y Deployment

```bash
# Gestión de base de datos en Railway
scripts/railway-database-manager.ts               # 10.3KB
  └── Operaciones de BD en producción
  └── Utilizado por: pnpm railway:db

# Configuración final de Railway
scripts/railway-setup-final.ts                    # 4.4KB
  └── Setup completo para producción
  └── Utilizado por: pnpm railway:setup

# Configuración de Railway con PostgreSQL
scripts/setup-railway-database.ts                 # 12.2KB
  └── Inicialización de BD en Railway
```

### Utilidades Importantes

```bash
# Actualización de URL de base de datos
scripts/update-db-url.ts                          # 1.3KB
  └── Utilidad para cambiar conexión de BD

# Optimización de imágenes
scripts/optimize-images.js                        # 3.6KB
  └── Utilizado por: pnpm optimize-images

# Auditoría de scripts (Fase 1)
scripts/scripts-auditor.ts                        # 13.1KB
  └── Script de análisis creado en Fase 1
```

## 🟡 Scripts de Testing y Verificación

### Sistema GEM

```bash
# Test completo del flujo GEM 1-5
scripts/gem-system/test-gem-flow.ts               # 6.4KB
  └── Utilizado por: pnpm article:test-flow

# Verificación específica de GEM 4 (imágenes)
scripts/gem-system/check-gem4-result.ts           # 1.8KB
  └── Debug de generación de imágenes
```

### Sistema Calendar

```bash
# Test completo del sistema de agendamiento
scripts/testing/test-complete-system.ts           # 3.1KB
  └── Verifica integración completa Calendar

# Test de flujo completo con todas las APIs
scripts/testing/test-complete-flow.ts             # 3.0KB
  └── Validación end-to-end

# Test de publicación de artículos
scripts/testing/test-publish-article.ts           # 2.7KB
  └── Verifica proceso de publicación

# Test de conexión a base de datos
scripts/testing/test-db-connection.ts             # 2.0KB
  └── Validación de conectividad PostgreSQL
```

### Verificación de Sistema

```bash
# Verificación de estado de artículos
scripts/testing/check-article-status.ts           # 3.1KB
  └── Monitoreo de artículos en BD

# Verificación de artículos disponibles
scripts/testing/check-available-articles.ts       # 1.6KB
  └── Lista artículos listos para publicar

# Verificación de esquemas de BD
scripts/testing/check-schema.ts                   # 3.7KB
  └── Validación de estructura de BD

# Obtener último artículo generado
scripts/testing/get-last-article.ts               # 1.3KB
  └── Debug de generación reciente

# Test de APIs en modo debug
scripts/testing/test-api-debug.ts                 # 1.8KB
  └── Debugging avanzado de endpoints
```

### Dashboard y Monitoreo

```bash
# Test del dashboard de administración
scripts/test-dashboard.ts                         # 4.0KB
  └── Utilizado por: pnpm dashboard:test

# Monitoreo de artículos específicos
scripts/monitor-article.ts                        # 1.8KB
  └── Seguimiento de artículos individuales
```

## 🔵 Scripts de Análisis y Procesamiento

### Análisis de Contenido

```bash
# Análisis de autores (versión simple)
scripts/analysis/analyze-authors-simple.ts        # 1.8KB
  └── Estadísticas de autorías

# Análisis de artículos rechazados
scripts/analysis/analyze-rejected-articles.ts     # 8.2KB
  └── Debug de fallos en generación

# Asignación de autores (versión simple)
scripts/analysis/assign-authors-simple.ts         # 6.6KB
  └── Asignación automática de autorías

# Asignación avanzada de autores
scripts/analysis/assign-authors.ts                # 5.6KB
  └── Lógica compleja de asignación

# Verificación de autores faltantes
scripts/analysis/check-missing-authors.ts         # 6.0KB
  └── Auditoría de autorías
```

## 🟡 Scripts de Setup Railway

### Configuración de Railway

```bash
# Configuración de esquemas en Railway
scripts/railway-setup/railway-setup-schema.ts     # 5.8KB
  └── Inicialización de BD en Railway

# Test de setup de Railway
scripts/railway-setup/railway-setup-test.ts       # 0.9KB
  └── Verificación de configuración

# Setup simple de Railway
scripts/railway-setup/setup-railway-simple.ts     # 8.9KB
  └── Configuración básica Railway
```

## 🟠 Scripts src/scripts (Internos)

### Gestión de Contenido

```bash
# Análisis de migraciones
src/scripts/analyze-migration.ts                  # 5.3KB
  └── Debug de procesos de migración

# Verificación de configuración de componentes
src/scripts/check-component-config.ts             # 2.1KB
  └── Validación de config de UI

# Verificación de componentes
src/scripts/check-components.ts                   # 1.9KB
  └── Auditoría de componentes

# Verificación de datos Strapi
src/scripts/check-strapi-data.ts                  # 3.3KB
  └── Validación de contenido CMS

# Verificación de esquemas Strapi
src/scripts/check-strapi-schema.ts                # 2.6KB
  └── Validación de estructura CMS
```

### Creación y Debug

```bash
# Creación de artículos con contenido
src/scripts/create-articles-with-content.ts       # 6.5KB
  └── Generación de contenido completo

# Debug de migraciones
src/scripts/debug-migration.ts                    # 4.2KB
  └── Depuración de procesos de migración

# Debug de artículos individuales
src/scripts/debug-single-article.ts               # 3.9KB
  └── Análisis detallado de artículos

# Debug de Strapi
src/scripts/debug-strapi.ts                       # 6.5KB
  └── Depuración de CMS
```

### Mantenimiento

```bash
# Migración final
src/scripts/final-migration.ts                    # 6.6KB
  └── Proceso final de migración

# Reconstrucción de frontmatter
src/scripts/rebuild-frontmatter.ts                # 3.4KB
  └── Reparación de metadatos

# Actualización de bloques de contenido
src/scripts/update-content-blocks.ts              # 4.1KB
  └── Modificación de estructura de contenido

# Actualización solo de contenido
src/scripts/update-content-only.ts                # 4.0KB
  └── Modificación de contenido sin metadatos

# Testing de formato de contenido
src/scripts/test-content-format.ts                # 4.0KB
  └── Validación de formatos

# Testing de migración
src/scripts/test-migration.ts                     # 6.6KB
  └── Verificación de migraciones

# Testing de contenido simple
src/scripts/test-simple-content.ts                # 2.1KB
  └── Validación básica de contenido

# Testing de artículos individuales
src/scripts/test-single-article.ts                # 3.2KB
  └── Verificación de artículos específicos

# Corrección de artículos
src/scripts/fix-articles.ts                       # 5.3KB
  └── Reparación de artículos problemáticos
```

## ❌ Scripts Deprecados (Movidos en Fase 1)

**Total movidos:** 28 scripts obsoletos  
**Ubicación:** `scripts/deprecated/`  
**Razón:** Scripts de testing individual, fixes específicos ya aplicados, migraciones completadas

Ver detalles en: `scripts/deprecated/README.md`

## 📋 Scripts Referenciados en package.json

```json
{
  "article:create": "tsx scripts/automated-article-creator.ts",
  "article:monitor": "tsx scripts/article-monitor.ts",
  "article:setup": "tsx scripts/setup-automation.ts setup",
  "article:test": "tsx scripts/setup-automation.ts test",
  "article:test-flow": "tsx scripts/test-gem-flow.ts",
  "dashboard:test": "tsx scripts/test-dashboard.ts",
  "env:setup": "tsx scripts/setup-env.ts",
  "db:test": "tsx scripts/setup-database.ts --test-only",
  "db:setup": "tsx scripts/setup-database.ts",
  "railway:setup": "tsx scripts/railway-setup-final.ts",
  "railway:db": "tsx scripts/railway-database-manager.ts"
}
```

## 🎯 Recomendaciones Post-Auditoría

### Scripts a Mantener (Críticos)

- ✅ **automated-article-creator.ts** - Núcleo del sistema
- ✅ **article-monitor.ts** - Monitoreo esencial
- ✅ **setup-automation.ts** - Configuración crítica
- ✅ **railway-database-manager.ts** - Operaciones de producción

### Scripts a Revisar en Fase 2

- 🔍 **Scripts de testing múltiples** - Consolidar en test suites
- 🔍 **Scripts de setup Railway** - Unificar configuraciones
- 🔍 **Scripts src/scripts** - Evaluar si pertenecen en `/scripts/`

### Scripts que Podrían Consolidarse

- 🔗 **analysis/\*** - Agrupar en un análisis unificado
- 🔗 **testing/test-\*** - Crear test suite integral
- 🔗 **railway-setup/\*** - Un solo script de setup Railway

---

_Documentación de scripts activos actualizada durante Fase 1 - Estabilización_
