# Sistema de Automatización de Artículos con GEMs de Gemini

## 🎯 Descripción General

Este sistema automatiza la creación de artículos de blog para IA Punto utilizando 4 GEMs especializadas de Google Gemini. El flujo completo incluye planificación, investigación, creación de contenido y publicación automática.

## 🏗️ Arquitectura del Sistema

### Flujo de Trabajo

```
[Trigger: Tema nuevo o ejecución programada]
    ↓
Backend llama GEM 1 → guarda título, keyword, secciones, extensión y metas SEO
    ↓
Loop por secciones: Backend llama GEM 2 por cada sección (investigación profunda)
    ↓
Guarda investigación en DB
    ↓
Cuando todas las secciones están listas → llama GEM 3 para crear artículo largo optimizado
    ↓
GEM 4 — Generador de Frontmatter + MDX:
    - Recibe artículo final de GEM 3
    - Analiza contenido para asignar categoría, subcategoría y tags
    - Genera frontmatter siguiendo reglas oficiales
    - Devuelve artículo en formato MDX listo
    ↓
Guarda el archivo .mdx en /src/content/blog/
    ↓
Publicación automática en el sitio web
```

## 🤖 Las 4 GEMs Especializadas

### GEM 1: Planificador de Contenido

- **Función**: Crear plan detallado del artículo
- **Entrada**: Tema general
- **Salida**: Título, keywords, estructura de secciones, metas SEO
- **Especialización**: SEO y estructura de contenido

### GEM 2: Investigador Profundo

- **Función**: Investigación detallada por sección
- **Entrada**: Sección específica con keywords
- **Salida**: Contenido investigado, fuentes, insights
- **Especialización**: Investigación y verificación de fuentes

### GEM 3: Creador de Contenido

- **Función**: Crear artículo completo optimizado
- **Entrada**: Plan de GEM 1 + investigación de GEM 2
- **Salida**: Artículo HTML completo con SEO
- **Especialización**: Escritura y optimización SEO

### GEM 4: Generador de Frontmatter

- **Función**: Crear frontmatter y formato MDX
- **Entrada**: Artículo de GEM 3 + plan de GEM 1
- **Salida**: Frontmatter válido + contenido MDX
- **Especialización**: Taxonomía y formato MDX

## 📁 Estructura de Archivos

```
src/
├── lib/
│   ├── database/
│   │   └── articleTrackingSchema.ts    # Esquema de tracking
│   └── services/
│       ├── gemArticleService.ts        # Servicio principal de GEMs
│       └── articlePublisherService.ts  # Servicio de publicación
├── pages/api/articles/
│   └── create-automatic.ts             # Endpoint de API
└── content/blog/                       # Artículos generados

scripts/
├── automated-article-creator.ts        # Script de automatización
└── article-monitor.ts                  # Script de monitoreo

gem-config.json                         # Configuración de GEMs
```

## 🚀 Instalación y Configuración

### 1. Dependencias

```bash
# Instalar dependencias de Gemini
pnpm add @google/generative-ai

# Instalar dependencias de desarrollo
pnpm add -D tsx
```

### 2. Variables de Entorno

Crear archivo `.env`:

```env
# API Key de Google Gemini
GEMINI_API_KEY=tu_api_key_aqui

# Configuración del blog
BLOG_BASE_URL=https://iapunto.com
BLOG_CONTENT_PATH=src/content/blog

# Configuración de automatización
MAX_ARTICLES_PER_DAY=2
AUTOMATION_CHECK_INTERVAL=30
```

### 3. Configuración de GEMs

Editar `gem-config.json`:

```json
{
  "apiKey": "${GEMINI_API_KEY}",
  "maxArticlesPerDay": 2,
  "baseUrl": "https://iapunto.com",
  "blogContentPath": "src/content/blog",
  "topics": [
    {
      "topic": "Cómo la IA está transformando el marketing digital para PYMES en 2025",
      "priority": "high",
      "category": "Marketing Digital y SEO",
      "targetKeywords": ["IA marketing", "PYMES", "transformación digital"],
      "schedule": "weekly"
    }
  ]
}
```

## 🔧 Uso del Sistema

### 1. Prueba del Flujo Optimizado

```bash
# Probar el flujo completo de GEMs
pnpm article:test-flow

# Probar configuración del sistema
pnpm article:test
```

### 2. Creación Manual de Artículo

```bash
# Ejecutar script de automatización
pnpm article:create
```

### 3. Creación vía API

```bash
curl -X POST http://localhost:4321/api/articles/create-automatic \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "Tema del artículo",
    "apiKey": "tu_api_key"
  }'
```

### 4. Monitoreo de Artículos

```bash
# Verificar salud de artículos
pnpm article:monitor

# Monitoreo continuo
pnpm article:monitor --continuous
```

## 📊 Monitoreo y Estadísticas

### Endpoint de Estadísticas

```bash
GET /api/articles/create-automatic
```

Respuesta:

```json
{
  "success": true,
  "data": {
    "stats": {
      "totalArticles": 150,
      "categories": {
        "Marketing Digital y SEO": 45,
        "Inteligencia Artificial": 32
      },
      "tags": {
        "PYMES": 67,
        "SEO": 45
      }
    }
  }
}
```

### Métricas de Salud

- **Porcentaje de salud**: Artículos sin errores estructurales
- **Puntuación SEO**: Evaluación automática de optimización
- **Distribución de categorías**: Balance del contenido
- **Artículos problemáticos**: Identificación de errores

## 🎛️ Configuración Avanzada

### Programación Automática

Configurar cron job para ejecución automática:

```bash
# Ejecutar diariamente a las 9:00 AM
0 9 * * * cd /path/to/project && pnpm tsx scripts/automated-article-creator.ts
```

### Notificaciones

El sistema puede configurarse para enviar notificaciones:

- **Email**: Reportes de creación y errores
- **Slack**: Alertas de problemas
- **Discord**: Notificaciones de publicación
- **Webhook**: Integración personalizada

### Límites y Control

- **Límite diario**: Máximo artículos por día
- **Rotación de temas**: Priorización automática
- **Validación**: Verificación de calidad antes de publicación
- **Backup**: Sistema de respaldo automático

## 🔍 Validación y Calidad

### Reglas de Validación

1. **Frontmatter obligatorio**: title, slug, pubDate, description, cover, coverAlt, author, category, tags, quote
2. **Categorías oficiales**: Solo las definidas en `categorias_tags_reglas.md`
3. **Tags válidos**: Máximo 7 tags de la lista oficial
4. **Quote único**: Frase memorable de 8-20 palabras
5. **Longitud mínima**: 800 palabras por artículo

### Puntuación SEO

- **Campos SEO**: 40 puntos
- **Estructura HTML**: 25 puntos
- **Longitud del contenido**: 25 puntos
- **Optimización**: 10 puntos

## 🛠️ Mantenimiento

### Backup Automático

```bash
# Crear backup de artículo
pnpm tsx scripts/article-monitor.ts --backup slug-del-articulo

# Restaurar desde backup
pnpm tsx scripts/article-monitor.ts --restore backup-file.mdx
```

### Limpieza de Archivos

```bash
# Limpiar archivos temporales
pnpm tsx scripts/article-monitor.ts --cleanup

# Validar todos los artículos
pnpm tsx scripts/article-monitor.ts --validate-all
```

## 🚨 Solución de Problemas

### Errores Comunes

1. **API Key inválida**

   ```
   Error: GEMINI_API_KEY no está configurada
   Solución: Verificar variable de entorno
   ```

2. **Límite diario alcanzado**

   ```
   Error: Límite diario alcanzado: 2/2
   Solución: Esperar al siguiente día o aumentar límite
   ```

3. **Validación fallida**
   ```
   Error: Validación fallida: Categoría no válida
   Solución: Verificar categorías en categorias_tags_reglas.md
   ```

### Logs y Debugging

```bash
# Modo verbose
DEBUG=* pnpm tsx scripts/automated-article-creator.ts

# Solo errores
pnpm tsx scripts/automated-article-creator.ts --quiet
```

## 📈 Métricas y Analytics

### KPIs del Sistema

- **Artículos creados por día/semana/mes**
- **Tiempo promedio de creación**
- **Tasa de éxito de publicación**
- **Distribución de categorías**
- **Puntuación SEO promedio**

### Reportes Automáticos

- **Reporte diario**: Resumen de actividad
- **Reporte semanal**: Análisis de tendencias
- **Reporte mensual**: Métricas de rendimiento

## 🔮 Roadmap

### Próximas Funcionalidades

- [ ] Integración con Google Analytics
- [ ] Optimización automática de imágenes
- [ ] Generación de contenido multimedia
- [ ] A/B testing de títulos
- [ ] Integración con redes sociales
- [ ] Dashboard web de gestión

### Mejoras Técnicas

- [ ] Base de datos PostgreSQL para tracking
- [ ] Cache de respuestas de GEMs
- [ ] Rate limiting inteligente
- [ ] Fallback a modelos alternativos
- [ ] Sistema de versionado de artículos

## 📞 Soporte

Para soporte técnico o preguntas sobre el sistema:

- **Documentación**: Este README
- **Issues**: Crear issue en el repositorio
- **Email**: soporte@iapunto.com

## 📄 Licencia

Este sistema es propiedad de IA Punto y está diseñado específicamente para su uso interno.

---

**Versión**: 1.0.0  
**Última actualización**: Enero 2025  
**Mantenido por**: Equipo de Desarrollo IA Punto
