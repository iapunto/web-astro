# Scripts de Migración a Strapi

Este directorio contiene scripts para migrar todos los artículos de Astro a Strapi sin depender de n8n.

## 🚀 Opciones de Migración

### Opción 1: Migración usando endpoint local (Recomendada)

**Ventajas:**
- Usa los endpoints optimizados que ya creamos
- Manejo de errores y reintentos
- Logging detallado
- Procesamiento en lotes pequeños

**Pasos:**

1. **Configurar variables de entorno:**
```bash
export STRAPI_URL="https://strapi.iapunto.com"
export STRAPI_API_TOKEN="tu_token_aqui"
```

2. **Asegurar que el servidor Astro esté corriendo:**
```bash
pnpm run dev
```

3. **Ejecutar migración:**
```bash
node scripts/migrate-astro.js
```

### Opción 2: Migración directa (Alternativa)

**Ventajas:**
- No requiere servidor corriendo
- Procesamiento directo de archivos
- Más control sobre el proceso

**Pasos:**

1. **Configurar el script:**
```bash
node scripts/setup-migration.js
```

2. **Editar el script con tu token:**
```bash
# Editar scripts/migrate-simple.js
# Cambiar: const STRAPI_TOKEN = 'TU_TOKEN_AQUI';
# Por: const STRAPI_TOKEN = 'tu_token_real';
```

3. **Ejecutar migración:**
```bash
node scripts/migrate-simple.js
```

## 📊 Configuración Recomendada

### Variables de Entorno
```bash
STRAPI_URL=https://strapi.iapunto.com
STRAPI_API_TOKEN=tu_token_de_api
```

### Parámetros de Migración
- **Batch Size**: 5 artículos por lote
- **Delay entre requests**: 1 segundo
- **Max Retries**: 3 intentos
- **Delay entre lotes**: 2 segundos

## 📁 Archivos Generados

Después de la migración se generarán:

- `migration-results.json`: Resultados detallados de la migración
- `migration-log.json`: Log completo del proceso (solo opción 1)
- `migration-config.json`: Configuración guardada (solo opción 2)

## 🔧 Estructura de Datos para Strapi

Los artículos se migran con la siguiente estructura:

```json
{
  "title": "Título del artículo",
  "slug": "slug-del-articulo",
  "content": "Contenido MDX completo",
  "excerpt": "Descripción",
  "publishedAt": "2025-01-01T00:00:00.000Z",
  "seo": {
    "metaTitle": "Título SEO",
    "metaDescription": "Descripción SEO",
    "keywords": "tags, separados, por, comas"
  },
  "featuredImage": {
    "url": "https://...",
    "alt": "Texto alternativo"
  },
  "author": {
    "name": "Nombre del autor",
    "bio": "Biografía",
    "avatar": "URL del avatar"
  },
  "category": "Categoría",
  "subcategory": "Subcategoría",
  "tags": ["tag1", "tag2", "tag3"],
  "migration": {
    "source": "astro-markdown",
    "originalId": "id-original",
    "migratedAt": "2025-01-01T00:00:00.000Z"
  }
}
```

## 🚨 Solución de Problemas

### Error: "STRAPI_API_TOKEN no está configurado"
```bash
export STRAPI_API_TOKEN="tu_token_aqui"
```

### Error: "Connection refused" (Opción 1)
Asegúrate de que el servidor Astro esté corriendo:
```bash
pnpm run dev
```

### Error: "HTTP 401: Unauthorized"
Verifica que tu token de Strapi sea válido y tenga permisos para crear artículos.

### Error: "HTTP 429: Too Many Requests"
Aumenta el delay entre requests en el script:
```javascript
DELAY_BETWEEN_REQUESTS: 2000 // 2 segundos
```

## 📈 Monitoreo del Progreso

Durante la migración verás:
- ✅ Artículos migrados exitosamente
- ❌ Artículos que fallaron con el error específico
- 📦 Progreso por lotes
- 📊 Resumen final

## 🎯 Resultado Esperado

Con 114 artículos y lotes de 5:
- **Total de lotes**: 23
- **Tiempo estimado**: ~5-10 minutos
- **Artículos exitosos**: 114 (si todo va bien)
- **Archivo de resultados**: `migration-results.json`

¡La migración debería completarse sin problemas de timeout!
