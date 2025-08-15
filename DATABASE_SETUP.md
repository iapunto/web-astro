# Configuración de Base de Datos - Sistema de Automatización de Artículos

## 📋 Resumen

Este documento describe la configuración completa de la base de datos PostgreSQL necesaria para el sistema de automatización de artículos con GEMs de IA Punto.

## 🗄️ Tablas Requeridas

### 1. **articles_tracking** (Tabla Principal)

- **Propósito**: Tracking del proceso completo de creación de artículos
- **Campos clave**: id, topic, status, created_at, updated_at, published_at, published_url, error
- **Estados**: pending, gem1_completed, gem2_in_progress, gem2_completed, gem3_in_progress, gem3_completed, gem4_in_progress, gem4_completed, published, error

### 2. **gem1_results** (Resultados de Planificación)

- **Propósito**: Almacenar resultados de GEM 1 (planificación del artículo)
- **Campos**: title, keywords, target_length, seo_meta
- **Relación**: 1:1 con articles_tracking

### 3. **article_sections** (Secciones del Artículo)

- **Propósito**: Secciones definidas por GEM 1
- **Campos**: section_id, title, description, keywords, target_length
- **Relación**: 1:N con gem1_results

### 4. **gem2_results** (Resultados de Investigación)

- **Propósito**: Investigación detallada por sección (GEM 2)
- **Campos**: section_id, research, sources, insights
- **Relación**: N:1 con articles_tracking

### 5. **gem3_results** (Resultados de Redacción)

- **Propósito**: Artículo completo redactado (GEM 3)
- **Campos**: full_article, word_count, seo_optimized, readability_score
- **Relación**: 1:1 con articles_tracking

### 6. **gem4_results** (Resultados de Frontmatter)

- **Propósito**: Frontmatter y MDX generado (GEM 4)
- **Campos**: frontmatter, mdx_content, validation_passed, validation_errors
- **Relación**: 1:1 con articles_tracking

### 7. **published_articles** (Artículos Publicados)

- **Propósito**: Artículos publicados exitosamente
- **Campos**: file_path, url, slug, title, category, tags, author_name, word_count, seo_score, health_score
- **Relación**: 1:1 con articles_tracking

### 8. **automation_config** (Configuración del Sistema)

- **Propósito**: Configuración centralizada del sistema
- **Campos**: config_key, config_value, description
- **Datos iniciales**: system_config, gem_models, categories, tags

### 9. **topics_queue** (Cola de Temas)

- **Propósito**: Temas pendientes de procesamiento
- **Campos**: topic, priority, category, target_keywords, schedule, scheduled_for, status
- **Prioridades**: high, medium, low

### 10. **daily_stats** (Estadísticas Diarias)

- **Propósito**: Métricas diarias del sistema
- **Campos**: articles_created, articles_published, articles_failed, avg_creation_time, categories_distribution, tags_distribution

### 11. **system_logs** (Logs del Sistema)

- **Propósito**: Logs para debugging y monitoreo
- **Campos**: level, message, tracking_id, gem_stage, error_details
- **Niveles**: debug, info, warn, error

### 12. **article_backups** (Backups de Artículos)

- **Propósito**: Backups antes de modificaciones
- **Campos**: article_id, backup_type, file_content, metadata
- **Tipos**: manual, auto, before_edit

## 🔧 Configuración Inicial

### 1. Variables de Entorno

Crear archivo `.env` con las siguientes variables:

```env
# Configuración de Base de Datos PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_NAME=iapunto_articles
DB_USER=postgres
DB_PASSWORD=tu_password_aqui
DB_SSL=false

# API Key de Gemini
GEMINI_API_KEY=tu_api_key_aqui

# Configuración del Blog
BLOG_BASE_URL=https://iapunto.com
BLOG_CONTENT_PATH=src/content/blog
```

### 2. Crear Base de Datos

```sql
-- Conectar a PostgreSQL como superusuario
psql -U postgres

-- Crear base de datos
CREATE DATABASE iapunto_articles;

-- Crear usuario específico (opcional)
CREATE USER iapunto_user WITH PASSWORD 'tu_password_aqui';
GRANT ALL PRIVILEGES ON DATABASE iapunto_articles TO iapunto_user;
```

### 3. Ejecutar Script de Configuración

```bash
# Instalar dependencias
pnpm install

# Configurar base de datos
pnpm db:setup

# Verificar configuración
pnpm db:test
```

## 📊 Vistas Útiles

### 1. **article_statistics**

- Estadísticas de artículos por día
- Total, publicados, fallidos, tiempo promedio

### 2. **recent_articles**

- Artículos más recientes
- Incluye información de tracking y publicación

### 3. **pending_topics**

- Temas pendientes ordenados por prioridad
- Útil para programación automática

## 🔍 Índices y Optimización

### Índices Principales

- `idx_articles_tracking_status` - Búsqueda por estado
- `idx_articles_tracking_created_at` - Ordenamiento temporal
- `idx_published_articles_slug` - Búsqueda por slug
- `idx_published_articles_category` - Filtrado por categoría
- `idx_system_logs_created_at` - Logs temporales

### Constraints de Validación

- Estados válidos para articles_tracking
- Longitud mínima de artículos (1800-2500 palabras)
- Máximo 7 tags por artículo
- Puntuaciones SEO entre 0-100

## 🚀 Comandos de Uso

### Configuración

```bash
# Configurar base de datos completa
pnpm db:setup

# Solo probar conexión
pnpm db:test

# Verificar tablas creadas
psql -d iapunto_articles -c "\dt"
```

### Monitoreo

```bash
# Ver estadísticas
psql -d iapunto_articles -c "SELECT * FROM article_statistics LIMIT 10;"

# Ver artículos recientes
psql -d iapunto_articles -c "SELECT * FROM recent_articles LIMIT 5;"

# Ver temas pendientes
psql -d iapunto_articles -c "SELECT * FROM pending_topics;"
```

### Mantenimiento

```bash
# Limpiar logs antiguos (más de 30 días)
psql -d iapunto_articles -c "
DELETE FROM system_logs
WHERE created_at < NOW() - INTERVAL '30 days';
"

# Limpiar backups antiguos (más de 90 días)
psql -d iapunto_articles -c "
DELETE FROM article_backups
WHERE created_at < NOW() - INTERVAL '90 days';
"
```

## 🔒 Seguridad

### Recomendaciones

1. **Usar usuario específico**: No usar postgres para la aplicación
2. **Contraseñas fuertes**: Mínimo 12 caracteres, mezcla de tipos
3. **SSL en producción**: Habilitar SSL para conexiones remotas
4. **Backup regular**: Configurar backups automáticos
5. **Monitoreo**: Configurar alertas para errores de conexión

### Configuración SSL

```env
# Para conexiones SSL
DB_SSL=true
DB_SSL_CA=/path/to/ca-certificate.crt
DB_SSL_KEY=/path/to/client-key.pem
DB_SSL_CERT=/path/to/client-cert.pem
```

## 📈 Escalabilidad

### Particionamiento

Para grandes volúmenes de datos, considerar:

```sql
-- Particionar por fecha (ejemplo)
CREATE TABLE articles_tracking_2025_01 PARTITION OF articles_tracking
FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');

CREATE TABLE articles_tracking_2025_02 PARTITION OF articles_tracking
FOR VALUES FROM ('2025-02-01') TO ('2025-03-01');
```

### Replicación

- Configurar réplica de lectura para consultas de estadísticas
- Usar connection pooling para múltiples conexiones

## 🛠️ Troubleshooting

### Errores Comunes

1. **Error de conexión**

   ```
   Error: connect ECONNREFUSED 127.0.0.1:5432
   Solución: Verificar que PostgreSQL esté ejecutándose
   ```

2. **Error de autenticación**

   ```
   Error: password authentication failed
   Solución: Verificar DB_USER y DB_PASSWORD
   ```

3. **Error de base de datos no existe**

   ```
   Error: database "iapunto_articles" does not exist
   Solución: Crear la base de datos primero
   ```

4. **Error de permisos**
   ```
   Error: permission denied for table articles_tracking
   Solución: Verificar permisos del usuario
   ```

### Comandos de Diagnóstico

```bash
# Verificar conexión
psql -h localhost -U postgres -d iapunto_articles -c "SELECT version();"

# Verificar tablas
psql -d iapunto_articles -c "\dt+"

# Verificar índices
psql -d iapunto_articles -c "\di+"

# Verificar permisos
psql -d iapunto_articles -c "\du+"
```

## 📋 Checklist de Configuración

- [ ] PostgreSQL instalado y ejecutándose
- [ ] Base de datos `iapunto_articles` creada
- [ ] Usuario con permisos configurado
- [ ] Variables de entorno configuradas en `.env`
- [ ] Script `pnpm db:setup` ejecutado exitosamente
- [ ] Todas las tablas creadas (12 tablas)
- [ ] Vistas creadas (3 vistas)
- [ ] Datos iniciales insertados
- [ ] Triggers funcionando
- [ ] Conexión de prueba exitosa
- [ ] Logs de sistema funcionando

## 🔮 Próximas Mejoras

1. **Migraciones**: Sistema de migraciones para cambios de esquema
2. **Backup automático**: Scripts de backup programados
3. **Monitoreo**: Dashboard web para métricas
4. **Optimización**: Análisis de consultas lentas
5. **Seguridad**: Encriptación de datos sensibles

---

**Versión**: 1.0.0  
**Última actualización**: Enero 2025  
**Mantenido por**: Equipo de Desarrollo IA Punto
