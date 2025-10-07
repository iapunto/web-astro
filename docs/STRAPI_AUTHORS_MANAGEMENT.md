# Gestión de Autores en Strapi

## Descripción

Este documento describe el sistema de gestión y redistribución de autores en Strapi para el proyecto IA Punto. El sistema permite distribuir automáticamente los artículos entre los autores disponibles.

## Autores Disponibles

El sistema está configurado para trabajar con 2 autores:

1. **Sergio Rondón**
   - ID: `sergio-rondon`
   - Email: sergio.rondon@iapunto.com
   - Descripción: CEO y Fundador de IA Punto
   - Bio: Emprendedor tecnológico con más de 25 años de experiencia en transformación digital

2. **Marilyn Cardozo**
   - ID: `marilyn-cardozo`
   - Email: marilyn.cardozo@iapunto.com
   - Descripción: Experta en Desarrollo Digital
   - Bio: Especialista en estrategias digitales y automatización de procesos empresariales

## Componentes del Sistema

### 1. Script de Redistribución (`src/scripts/redistribute-strapi-authors.ts`)

Script principal que maneja la redistribución de autores:

```typescript
// Análisis únicamente (sin cambios)
await redistributeStrapiAuthors(true);

// Redistribución real
await redistributeStrapiAuthors(false);
```

**Funcionalidades:**

- Obtiene todos los artículos de Strapi
- Analiza la distribución actual de autores
- Redistribuye artículos de manera equilibrada
- Actualiza las asignaciones en Strapi
- Maneja errores y proporciona logs detallados

### 2. API Endpoint (`src/pages/api/admin/redistribute-authors.ts`)

Endpoint REST para gestionar la redistribución:

**GET** `/api/admin/redistribute-authors`

- Analiza la distribución actual
- Retorna estadísticas y información de autores

**POST** `/api/admin/redistribute-authors`

```json
{
  "action": "redistribute",
  "dryRun": true // true para simulación, false para ejecutar
}
```

### 3. Interfaz de Administración (`src/pages/admin/authors/index.astro`)

Panel web para gestionar la redistribución:

- **Verificación de conexión**: Estado de conexión con Strapi
- **Análisis actual**: Distribución actual de autores
- **Simulación**: Previsualizar cambios sin ejecutarlos
- **Redistribución real**: Ejecutar cambios permanentes
- **Log de actividades**: Registro de todas las operaciones

### 4. Script de Pruebas (`src/scripts/test-authors-redistribution.ts`)

Suite de pruebas para verificar la funcionalidad:

```typescript
await runAuthorsRedistributionTests();
```

**Pruebas incluidas:**

- Conexión con Strapi
- Definición de autores
- Análisis de distribución
- Simulación de redistribución
- Verificación de endpoint API

## Uso del Sistema

### Método 1: Interfaz Web

1. Accede a `/admin/authors` en el navegador
2. Verifica el estado de conexión
3. Haz clic en "Analizar Distribución" para ver el estado actual
4. Usa "Simular Redistribución" para previsualizar cambios
5. Ejecuta "Redistribución Real" para aplicar cambios

### Método 2: API REST

```bash
# Analizar distribución actual
curl -X GET http://localhost:4321/api/admin/redistribute-authors

# Simular redistribución
curl -X POST http://localhost:4321/api/admin/redistribute-authors \
  -H "Content-Type: application/json" \
  -d '{"action": "redistribute", "dryRun": true}'

# Ejecutar redistribución real
curl -X POST http://localhost:4321/api/admin/redistribute-authors \
  -H "Content-Type: application/json" \
  -d '{"action": "redistribute", "dryRun": false}'
```

### Método 3: Script Directo

```bash
# Ejecutar análisis
npm run test:authors-redistribution

# Ejecutar redistribución (desde Node.js)
node -e "
import('./src/scripts/redistribute-strapi-authors.js')
  .then(module => module.redistributeStrapiAuthors(true))
"
```

## Configuración

### Variables de Entorno

Asegúrate de tener configuradas estas variables:

```env
STRAPI_API_URL=https://strapi.iapunto.com
STRAPI_API_TOKEN=tu_token_de_strapi
```

### Configuración de Strapi

El sistema espera que Strapi tenga:

1. **Content Type "authors"** con campos:
   - `name` (Text)
   - `email` (Email)
   - `bio` (Rich Text)
   - `description` (Text)
   - `image` (Media)

2. **Content Type "articles"** con relación:
   - `author` (Relation to authors)

## Algoritmo de Redistribución

El sistema distribuye los artículos de manera equilibrada:

1. Obtiene todos los artículos que tienen autor asignado
2. Los ordena por fecha de publicación (más recientes primero)
3. Alterna entre los autores disponibles
4. Asigna cada artículo al siguiente autor en la secuencia

**Ejemplo:**

- Artículo 1 → Sergio Rondón
- Artículo 2 → Marilyn Cardozo
- Artículo 3 → Sergio Rondón
- Artículo 4 → Marilyn Cardozo
- etc.

## Logs y Monitoreo

### Logs de la Interfaz Web

La interfaz web muestra logs en tiempo real con:

- Timestamp de cada operación
- Estado de éxito/error
- Detalles de la operación
- Contadores de artículos procesados

### Logs del Script

El script genera logs detallados:

```
🚀 Iniciando redistribución de autores en Strapi...
📊 Obtenidos 150 artículos de 2 páginas
📈 Analizando distribución actual de autores...
✅ Autor "Sergio Rondón" existe en Strapi (ID: 1)
✅ Autor "Marilyn Cardozo" existe en Strapi (ID: 2)
🔄 Redistribuyendo artículos...
✅ Artículo 123 asignado a Sergio Rondón
✅ Artículo 124 asignado a Marilyn Cardozo
📊 Resumen de actualizaciones:
  ✅ Exitosas: 148
  ❌ Errores: 2
🎉 ¡Redistribución de autores completada exitosamente!
```

## Manejo de Errores

### Errores Comunes

1. **Conexión a Strapi fallida**
   - Verificar `STRAPI_API_URL`
   - Verificar `STRAPI_API_TOKEN`
   - Verificar conectividad de red

2. **Autor no encontrado en Strapi**
   - El sistema creará automáticamente autores faltantes
   - Verificar que los nombres coincidan exactamente

3. **Error al actualizar artículo**
   - Verificar permisos del token
   - Verificar que el artículo existe
   - Verificar formato de datos

### Recuperación de Errores

El sistema es resiliente a errores:

- Continúa procesando otros artículos si uno falla
- Proporciona contadores de éxitos y errores
- Mantiene logs detallados para debugging

## Seguridad

### Consideraciones de Seguridad

1. **Token de API**: Mantén el token de Strapi seguro
2. **Endpoint de administración**: Protege el acceso a `/admin/authors`
3. **Validación de entrada**: El sistema valida todas las entradas
4. **Modo simulación**: Siempre prueba con `dryRun: true` primero

### Permisos Requeridos

El token de Strapi debe tener permisos para:

- Leer artículos y autores
- Actualizar artículos
- Crear autores (si es necesario)

## Mantenimiento

### Tareas Regulares

1. **Verificar distribución**: Ejecutar análisis mensualmente
2. **Revisar logs**: Monitorear errores de actualización
3. **Actualizar autores**: Modificar información de autores según sea necesario
4. **Backup**: Hacer respaldo antes de redistribuciones masivas

### Actualizaciones

Para actualizar el sistema:

1. Modificar `src/lib/constants/authors.ts` para cambiar autores
2. Actualizar la documentación
3. Ejecutar pruebas para verificar compatibilidad
4. Desplegar cambios

## Troubleshooting

### Problema: "No se recibió código de autorización"

**Solución:**

- Verificar que `STRAPI_API_TOKEN` esté configurado
- Verificar que el token sea válido y no haya expirado
- Verificar permisos del token en Strapi

### Problema: "Autor no encontrado en Strapi"

**Solución:**

- El sistema creará automáticamente autores faltantes
- Verificar que los nombres en `authors.ts` coincidan con Strapi
- Verificar que el content type "authors" existe

### Problema: "Error al actualizar artículo"

**Solución:**

- Verificar que el artículo existe en Strapi
- Verificar permisos de escritura del token
- Verificar formato de la relación author en Strapi

## Changelog

### v1.0.0 (2025-01-27)

- ✅ Implementación inicial del sistema de redistribución
- ✅ Script de redistribución automática
- ✅ API endpoint para gestión REST
- ✅ Interfaz web de administración
- ✅ Suite de pruebas automatizadas
- ✅ Documentación completa

## Contacto

Para soporte técnico o preguntas sobre el sistema:

- Email: sergio.rondon@iapunto.com
- Documentación: Ver este archivo y comentarios en el código
