# FASE 1: ESTABILIZACIÓN - Plan de Trabajo

**Rama:** `feature/phase1-stabilization`  
**Duración estimada:** 1-2 semanas  
**Objetivo:** Auditar, documentar y estabilizar el sistema actual antes de refactorizar

## 🎯 Objetivos de la Fase 1

1. **Auditar y documentar** todos los scripts activos vs obsoletos
2. **Identificar y deprecar** scripts obsoletos o duplicados
3. **Crear documentación técnica** básica de componentes críticos
4. **Implementar logging** unificado en servicios principales
5. **Establecer baseline** de métricas de rendimiento

## 📋 Tasks Detalladas

### 1. Auditoría de Scripts (Prioridad Alta)

#### 1.1 Catalogar Scripts Activos

- [ ] Revisar todos los scripts en `/scripts/` (50+ archivos)
- [ ] Identificar scripts que son efectivamente utilizados
- [ ] Documentar dependencias entre scripts
- [ ] Crear matriz de scripts activos vs obsoletos

**Archivos a revisar:**

```
scripts/
├── automated-article-creator.ts     # ✅ ACTIVO
├── article-monitor.ts              # ✅ ACTIVO
├── setup-automation.ts             # ✅ ACTIVO
├── railway-*.ts                    # ⚠️ REVISAR
├── test-*.ts                       # ❓ POSIBLE DEPRECAR
├── fix-*.ts                        # ❓ POSIBLE DEPRECAR
└── migrate-*.ts                    # ❓ POSIBLE DEPRECAR
```

#### 1.2 Deprecar Scripts Obsoletos

- [ ] Mover scripts obsoletos a `/scripts/deprecated/`
- [ ] Crear archivo `DEPRECATED_SCRIPTS.md` con explicaciones
- [ ] Actualizar package.json para remover scripts obsoletos
- [ ] Crear script de limpieza: `cleanup-scripts.sh`

### 2. Documentación Técnica (Prioridad Alta)

#### 2.1 Documentar Sistema GEM

- [ ] Crear `docs/GEM_SYSTEM.md` - Arquitectura completa del sistema GEM
- [ ] Documentar flujo de datos entre GEM 1-5
- [ ] Mapear dependencias externas (Gemini API, Cloudinary)
- [ ] Documentar esquemas de base de datos relacionados

#### 2.2 Documentar Sistema Calendar

- [ ] Crear `docs/CALENDAR_SYSTEM.md` - Sistema de agendamiento
- [ ] Documentar flujos OAuth2 vs Service Account
- [ ] Mapear endpoints y sus funciones
- [ ] Documentar configuración de permisos

#### 2.3 Documentar Arquitectura General

- [ ] Actualizar `README.md` con información técnica actualizada
- [ ] Crear `docs/ARCHITECTURE.md` - Visión de alto nivel
- [ ] Documentar patrones de diseño utilizados
- [ ] Crear diagramas de flujo principales

### 3. Logging Unificado (Prioridad Media)

#### 3.1 Implementar Logger Central

- [ ] Crear `src/lib/utils/logger.ts`
- [ ] Definir niveles de log (debug, info, warn, error, critical)
- [ ] Implementar rotación de logs
- [ ] Configurar formateo estructurado (JSON)

#### 3.2 Migrar Logging Existente

- [ ] Refactorizar GemArticleService para usar logger central
- [ ] Refactorizar ArticleTrackingService
- [ ] Refactorizar Google Calendar services
- [ ] Estandarizar format de logs en scripts

### 4. Métricas y Monitoreo (Prioridad Media)

#### 4.1 Establecer Baseline de Performance

- [ ] Medir tiempos de generación de artículos (GEM 1-5)
- [ ] Medir uso de memoria en procesos largos
- [ ] Documentar tiempos de respuesta de APIs
- [ ] Crear dashboard básico de métricas

#### 4.2 Implementar Health Checks

- [ ] Crear endpoint `/api/health`
- [ ] Verificar conectividad a servicios externos
- [ ] Monitorear estado de base de datos
- [ ] Alertas básicas por email

### 5. Organización del Código (Prioridad Baja)

#### 5.1 Reorganizar Estructura

- [ ] Mover scripts de `/src/scripts/` que no pertenecen ahí
- [ ] Consolidar archivos de configuración dispersos
- [ ] Crear `/docs/` directorio con toda la documentación
- [ ] Estandarizar nombres de archivos

#### 5.2 Linting y Formateo

- [ ] Configurar ESLint para detectar código problemático
- [ ] Ejecutar Prettier en todo el codebase
- [ ] Corregir warnings de TypeScript
- [ ] Estandarizar imports y exports

## 📊 Entregables de la Fase 1

### Documentación

- [ ] `docs/GEM_SYSTEM.md` - Sistema de generación de artículos
- [ ] `docs/CALENDAR_SYSTEM.md` - Sistema de agendamiento
- [ ] `docs/ARCHITECTURE.md` - Arquitectura general
- [ ] `DEPRECATED_SCRIPTS.md` - Scripts obsoletos
- [ ] `ACTIVE_SCRIPTS.md` - Scripts activos y su función

### Código

- [ ] `src/lib/utils/logger.ts` - Sistema de logging unificado
- [ ] `src/pages/api/health.ts` - Health check endpoint
- [ ] `cleanup-scripts.sh` - Script de limpieza
- [ ] `scripts/deprecated/` - Scripts obsoletos movidos

### Métricas

- [ ] Baseline de performance documentado
- [ ] Lista de scripts activos vs obsoletos
- [ ] Mapeo de dependencias críticas
- [ ] Plan de optimización para Fase 2

## 🔄 Flujo de Trabajo

### Commits por Tarea

```bash
# Auditoría
chore(scripts): auditar y catalogar scripts activos vs obsoletos
chore(scripts): mover scripts obsoletos a deprecated/
docs(scripts): crear documentación de scripts activos

# Documentación
docs(gem): documentar arquitectura del sistema GEM
docs(calendar): documentar sistema de agendamiento
docs(arch): crear documentación de arquitectura general

# Logging
feat(logger): implementar sistema de logging unificado
refactor(gem): migrar GemArticleService a logger central
refactor(calendar): migrar servicios de calendar a logger central

# Monitoreo
feat(health): implementar endpoint de health check
feat(metrics): establecer baseline de métricas de performance
```

### Testing de la Fase 1

```bash
# Verificar que todo funciona después de los cambios
pnpm run build
pnpm run dev

# Probar endpoints críticos
curl http://localhost:4321/api/health
curl http://localhost:4321/api/articles/create-automatic

# Verificar logs
tail -f logs/app.log
```

## ⚠️ Riesgos y Consideraciones

### Riesgos Identificados

1. **Romper funcionalidad existente** al mover/deprecar scripts
2. **Conflictos de merge** con otras ramas activas
3. **Impacto en performance** por logging adicional
4. **Dependencias ocultas** entre scripts

### Mitigaciones

1. **Testing exhaustivo** después de cada cambio mayor
2. **Commits granulares** para fácil rollback
3. **Documentar cambios** antes de implementar
4. **Backup de scripts** antes de mover/eliminar

## 🎯 Criterios de Éxito

- [ ] ✅ 90%+ de scripts catalogados como activos/obsoletos
- [ ] ✅ Sistema de logging funcionando en servicios principales
- [ ] ✅ Documentación técnica básica creada
- [ ] ✅ Health check endpoint implementado
- [ ] ✅ Baseline de métricas establecido
- [ ] ✅ Codebase más organizado y limpio
- [ ] ✅ Sin regresiones en funcionalidad existente

---

**Siguiente Fase:** Fase 2 - Simplificación (feature/phase2-simplification)
