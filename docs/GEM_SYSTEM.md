# Sistema GEM - Documentación Técnica

**Versión:** 1.0  
**Fecha:** Enero 2025  
**Estado:** Activo (Candidato a Refactorización en Fase 2)

## 🎯 Descripción General

El **Sistema GEM** (Generative Engine Modules) es el núcleo de automatización de artículos de IA Punto. Utiliza Google Gemini API para generar contenido de blog de manera completamente automatizada a través de un flujo de 5 etapas secuenciales.

### Objetivo Principal

Generar artículos de blog optimizados para SEO de manera automática, desde la planificación hasta la publicación, sin intervención manual.

## 🏗️ Arquitectura del Sistema

### Flujo de Datos Completo

```
Tema/Topic → GEM 1 → GEM 2 → GEM 3 → GEM 4 → GEM 5 → Artículo Publicado
     ↓         ↓        ↓        ↓        ↓        ↓
  Entrada  Planif.  Invest.  Redacc.  Imagen  Frontend/
           + SEO    Secciones Completa  Cover   MDX Final
```

### Componentes Principales

#### 1. GemArticleService

**Ubicación:** `src/lib/services/gemArticleService.ts`  
**Responsabilidad:** Orquestador principal del flujo GEM  
**Líneas de código:** ~767 líneas

#### 2. ArticleTrackingService

**Ubicación:** `src/lib/database/articleTrackingSchema.ts`  
**Responsabilidad:** Persistencia y tracking de estado  
**Líneas de código:** ~606 líneas

#### 3. ArticlePublisherService

**Ubicación:** `src/lib/services/articlePublisherService.ts`  
**Responsabilidad:** Publicación final a sistema de archivos  
**Líneas de código:** ~353 líneas

## 🔄 Etapas del Flujo GEM

### GEM 1: Planificación y SEO

**Función:** `executeGem1(topic: string)`  
**Propósito:** Crear estructura y optimización SEO del artículo

**Entrada:**

- Topic/tema del artículo

**Salida:**

```typescript
interface Gem1Result {
  title: string; // Título optimizado SEO (max 60 chars)
  keywords: string[]; // Palabras clave principales
  sections: ArticleSection[]; // 4-7 secciones planificadas
  targetLength: number; // 1800-2500 palabras objetivo
  seoMeta: SEOMeta; // Meta descripción, focus keyword
}
```

**Proceso:**

1. Analiza el tema proporcionado
2. Genera título optimizado para SEO
3. Define estructura de secciones (mín. 4, máx. 7)
4. Calcula extensión objetivo por sección (mín. 250 palabras)
5. Crea meta descripción (máx. 160 caracteres)

### GEM 2: Investigación por Secciones

**Función:** `executeGem2(gem1Result: Gem1Result)`  
**Propósito:** Investigar cada sección planificada individualmente

**Entrada:**

- Resultado de GEM 1

**Salida:**

```typescript
interface Gem2Result {
  sectionId: string; // ID de la sección
  research: string; // Investigación detallada
  sources: string[]; // Fuentes (actualmente vacío)
  insights: string[]; // Datos clave y estadísticas
}
```

**Proceso:**

1. **Bucle por cada sección** de GEM 1
2. Investiga contenido específico para la sección
3. Recopila datos, estadísticas y ejemplos
4. Genera subtemas y estructura interna
5. **Almacena resultado por sección** en BD

### GEM 3: Redacción Completa

**Función:** `executeGem3(gem1Result, gem2Results)`  
**Propósito:** Crear el artículo final en Markdown

**Entrada:**

- Resultado de GEM 1 (estructura)
- Array de resultados GEM 2 (investigación)

**Salida:**

```typescript
interface Gem3Result {
  fullArticle: string; // Artículo completo en Markdown
  wordCount: number; // Conteo de palabras
  seoOptimized: boolean; // Flag de optimización SEO
  readabilityScore: number; // Score de legibilidad
}
```

**Proceso:**

1. Consolida toda la investigación de GEM 2
2. Redacta artículo completo en Markdown
3. Aplica estructura H1, H2, H3
4. Integra palabras clave según densidad objetivo
5. **Requisito crítico:** Mínimo 1800 palabras

### GEM 4: Generación de Imagen

**Función:** `executeGem4(articleContent, gem1Result)`  
**Propósito:** Crear imagen de portada automática

**Entrada:**

- Contenido del artículo (GEM 3)
- Estructura y keywords (GEM 1)

**Salida:**

```typescript
interface Gem4Result {
  imageUrl: string; // URL de Cloudinary
  imageAlt: string; // Alt text descriptivo
  cloudinaryPublicId: string; // ID para gestión
}
```

**Proceso:**

1. **Genera prompt** para imagen con Gemini
2. **Crea imagen** usando Google Imagen API
3. **Sube a Cloudinary** con transformaciones
4. **Genera alt text** descriptivo
5. **Fallback:** Imagen placeholder si falla

**Dependencias Externas:**

- Google Imagen API
- Cloudinary (transformaciones, almacenamiento)

### GEM 5: Frontmatter y MDX Final

**Función:** `executeGem5(articleContent, gem1Result, gem4Result)`  
**Propósito:** Crear archivo MDX listo para publicar

**Entrada:**

- Artículo completo (GEM 3)
- Estructura y SEO (GEM 1)
- Imagen generada (GEM 4)

**Salida:**

```typescript
interface Gem5Result {
  frontmatter: ArticleFrontmatter; // YAML frontmatter completo
  mdxContent: string; // Artículo sin modificar
  validationPassed: boolean; // Validación de reglas
  validationErrors: string[]; // Errores encontrados
}
```

**Proceso:**

1. Genera **frontmatter YAML** completo
2. Asigna **categoría y subcategoría** oficial
3. Selecciona **tags** (máx. 7) de lista oficial
4. Crea **quote único** (máx. 120 caracteres)
5. **Valida** contra reglas del proyecto
6. Combina frontmatter + contenido

## 💾 Persistencia y Tracking

### Base de Datos PostgreSQL

El sistema utiliza un esquema complejo para tracking:

```sql
-- Tabla principal
articles_tracking (id, topic, status, created_at, updated_at)

-- Resultados por etapa
gem1_results (tracking_id, title, keywords, target_length, seo_meta)
gem2_results (tracking_id, section_id, research, sources, insights)
gem3_results (tracking_id, full_article, word_count, seo_optimized)
gem4_results (tracking_id, image_url, image_alt, cloudinary_public_id)
gem5_results (tracking_id, frontmatter, mdx_content, validation_passed)

-- Artículos publicados
published_articles (tracking_id, file_path, url, slug, title)
```

### Estados del Artículo

```typescript
enum ArticleStatus {
  PENDING = 'pending',
  GEM1_COMPLETED = 'gem1_completed',
  GEM2_IN_PROGRESS = 'gem2_in_progress',
  GEM2_COMPLETED = 'gem2_completed',
  GEM3_IN_PROGRESS = 'gem3_in_progress',
  GEM3_COMPLETED = 'gem3_completed',
  GEM4_IN_PROGRESS = 'gem4_in_progress',
  GEM4_COMPLETED = 'gem4_completed',
  GEM5_IN_PROGRESS = 'gem5_in_progress',
  GEM5_COMPLETED = 'gem5_completed',
  PUBLISHED = 'published',
  ERROR = 'error',
}
```

## 🔧 Configuración y Dependencias

### Variables de Entorno Críticas

```bash
GEMINI_API_KEY=                    # API key de Google Gemini
PUBLIC_CLOUDINARY_CLOUD_NAME=     # Cloudinary para imágenes
PUBLIC_CLOUDINARY_API_KEY=        # API key Cloudinary
CLOUDINARY_API_SECRET=             # Secret Cloudinary
DATABASE_PUBLIC_URL=               # PostgreSQL connection string
```

### Dependencias Externas

1. **Google Gemini API** - Generación de contenido (crítico)
2. **Google Imagen API** - Generación de imágenes (opcional con fallback)
3. **Cloudinary** - Almacenamiento y transformación de imágenes
4. **PostgreSQL** - Persistencia de tracking

### Configuración gem-config.json

```json
{
  "maxArticlesPerDay": 2,
  "models": {
    "gem1": { "name": "gemini-2.5-pro", "temperature": 0.7 },
    "gem2": { "name": "gemini-2.5-pro", "temperature": 0.6 },
    "gem3": { "name": "gemini-2.5-pro", "temperature": 0.8 },
    "gem4": { "name": "gemini-2.5-pro", "temperature": 0.5 }
  }
}
```

## ⚡ Rendimiento y Métricas

### Tiempos Típicos de Ejecución

- **GEM 1:** 10-15 segundos
- **GEM 2:** 30-60 segundos (bucle por secciones)
- **GEM 3:** 45-90 segundos
- **GEM 4:** 20-40 segundos (incluye subida Cloudinary)
- **GEM 5:** 5-10 segundos
- **Total:** 2-4 minutos por artículo

### Consumo de Tokens Gemini

- **GEM 1:** ~4,000 tokens
- **GEM 2:** ~6,000 tokens por sección (×4-7 secciones)
- **GEM 3:** ~8,000 tokens
- **GEM 4:** ~3,000 tokens (prompt + alt text)
- **GEM 5:** ~3,000 tokens
- **Total:** ~40,000-60,000 tokens por artículo

### Tasas de Éxito

- **GEM 1-3:** ~95% éxito
- **GEM 4:** ~85% éxito (fallback a placeholder)
- **GEM 5:** ~90% éxito (validación estricta)
- **Flujo completo:** ~80% éxito sin intervención manual

## 🚨 Puntos de Dolor Identificados

### 1. Complejidad Excesiva

- **5 etapas secuenciales** pueden fallar independientemente
- **Dependencias en cadena** - si falla GEM 2, falla todo
- **Tracking complejo** con 7 tablas de BD

### 2. Dependencias Externas Críticas

- **Sin fallback robusto** para fallos de Gemini API
- **Costo elevado** en tokens por artículo
- **Latencia alta** por múltiples API calls secuenciales

### 3. Manejo de Errores

- **Fallos silenciosos** en etapas intermedias
- **Debugging complejo** por tracking distribuido
- **Recovery manual** cuando falla una etapa

### 4. Escalabilidad

- **No paralelizable** por diseño secuencial
- **Límites de cuota** Gemini API
- **Estado en BD** complejo de gestionar

## 🎯 Propuestas de Mejora (Fase 2)

### Simplificación Arquitectónica

```
PROPUESTA: 5 etapas → 3 etapas
GEM 1: Planificación + Investigación (fusionar GEM 1 + GEM 2)
GEM 2: Redacción + Imagen (fusionar GEM 3 + GEM 4)
GEM 3: Finalización + Publicación (mejorar GEM 5)
```

### Beneficios Esperados

- **Reducir fallos** de 20% a 10%
- **Reducir latencia** de 4min a 2min
- **Simplificar debugging** y mantenimiento
- **Reducir costos** de tokens en 30%

## 📋 Scripts y Herramientas

### Scripts Activos

- **`automated-article-creator.ts`** - Ejecutor principal del flujo
- **`article-monitor.ts`** - Monitoreo de salud del sistema

### Scripts de Testing

- **`test-gem-flow.ts`** - Test del flujo completo
- **`check-gem4-result.ts`** - Verificación específica de imágenes

### Scripts Deprecados (Movidos en Fase 1)

- `test-gem1-only.ts` → `test-gem5-only.ts` - Tests individuales obsoletos

## 🔍 Debugging y Troubleshooting

### Logs Principales

```bash
# Ver logs del sistema GEM
tail -f logs/automation.log | grep "GEM"

# Verificar estado de artículos en BD
pnpm tsx scripts/testing/check-article-status.ts

# Test del flujo completo
pnpm tsx scripts/gem-system/test-gem-flow.ts
```

### Errores Comunes

1. **"GEMINI_API_KEY no está configurada"** - Verificar variables de entorno
2. **"Validación fallida: Campos obligatorios faltantes"** - Error en GEM 5
3. **"Error en GEM 4: No se recibió imagen válida"** - Usar fallback placeholder
4. **"Límite diario alcanzado"** - Configurar `maxArticlesPerDay`

## 📚 Referencias

- **Código fuente:** `src/lib/services/gemArticleService.ts`
- **Esquemas BD:** `src/lib/database/articleTrackingSchema.ts`
- **Configuración:** `gem-config.json`
- **Scripts relacionados:** `scripts/gem-system/`, `scripts/testing/`
- **Documentación API:** [Google Gemini API](https://ai.google.dev/gemini-api/docs)

---

_Documentación técnica generada durante Fase 1 - Estabilización_
