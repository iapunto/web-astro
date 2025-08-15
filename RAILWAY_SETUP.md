# Configuración de Base de Datos en Railway

## 🚂 Configuración Automática con Railway CLI

Este documento describe cómo configurar la base de datos PostgreSQL en Railway usando el CLI oficial de Railway.

## 📋 Prerequisitos

### 1. Instalar Railway CLI

```bash
# Instalar Railway CLI globalmente
npm install -g @railway/cli

# Verificar instalación
railway --version
```

### 2. Autenticación

```bash
# Loguearse en Railway
railway login

# Verificar que estás logueado
railway whoami
```

## 🚀 Configuración Automática

### 1. Configuración Rápida

```bash
# Configurar base de datos completa en Railway
pnpm railway:setup
```

Este comando automáticamente:

- ✅ Verifica que Railway CLI esté instalado
- ✅ Verifica que estés logueado
- ✅ Crea un proyecto en Railway (si no existe)
- ✅ Crea un servicio PostgreSQL (si no existe)
- ✅ Ejecuta el esquema completo de la base de datos
- ✅ Verifica que todas las tablas se crearon correctamente
- ✅ Configura las variables de entorno necesarias
- ✅ Crea el archivo `railway.json` de configuración

### 2. Variables de Entorno

El script configura automáticamente las siguientes variables:

```env
DATABASE_URL=postgresql://...
DB_HOST=localhost
DB_PORT=5432
DB_NAME=iapunto_articles
DB_USER=postgres
DB_SSL=true
NODE_ENV=production
```

### 3. Configuración Personalizada

Puedes personalizar la configuración usando variables de entorno:

```bash
# Configurar con parámetros personalizados
RAILWAY_PROJECT_NAME="mi-proyecto-articles" \
RAILWAY_SERVICE_NAME="mi-postgresql" \
RAILWAY_DATABASE_NAME="mi_base_datos" \
RAILWAY_REGION="us-west1" \
pnpm railway:setup
```

## 🛠️ Gestión de la Base de Datos

### Comandos Disponibles

```bash
# Ver todas las tablas
pnpm railway:db tables

# Ver estructura de una tabla específica
pnpm railway:db structure articles_tracking

# Ver estadísticas de artículos
pnpm railway:db stats

# Ver artículos recientes (últimos 5)
pnpm railway:db recent

# Ver artículos recientes (últimos 10)
pnpm railway:db recent 10

# Ver temas pendientes
pnpm railway:db pending

# Ver logs del sistema (últimos 10)
pnpm railway:db logs

# Ver logs del sistema (últimos 20)
pnpm railway:db logs 20

# Crear backup completo
pnpm railway:db backup

# Restaurar desde backup
pnpm railway:db restore backup-2025-01-27.sql

# Limpiar logs antiguos (más de 30 días)
pnpm railway:db clean-logs

# Limpiar logs antiguos (más de 7 días)
pnpm railway:db clean-logs 7

# Limpiar backups antiguos (más de 90 días)
pnpm railway:db clean-backups

# Resetear base de datos (¡CUIDADO!)
pnpm railway:db reset --confirm
```

## 📊 Monitoreo y Estadísticas

### Vistas Disponibles

El esquema incluye vistas útiles para monitoreo:

```sql
-- Estadísticas diarias de artículos
SELECT * FROM article_statistics LIMIT 10;

-- Artículos más recientes
SELECT * FROM recent_articles LIMIT 5;

-- Temas pendientes ordenados por prioridad
SELECT * FROM pending_topics;
```

### Comandos de Monitoreo

```bash
# Ver estadísticas generales
pnpm railway:db stats

# Ver artículos recientes
pnpm railway:db recent 10

# Ver temas pendientes
pnpm railway:db pending

# Ver logs del sistema
pnpm railway:db logs 20
```

## 🔧 Configuración Manual (Alternativa)

Si prefieres configurar manualmente:

### 1. Crear Proyecto

```bash
# Crear nuevo proyecto
railway project create --name "iapunto-articles-automation"

# O usar proyecto existente
railway project
```

### 2. Crear Servicio PostgreSQL

```bash
# Crear servicio PostgreSQL
railway service create --name "postgresql" --type postgresql

# Ver servicios
railway service
```

### 3. Ejecutar Esquema

```bash
# Obtener DATABASE_URL
railway variables

# Ejecutar esquema
railway run -- psql "$DATABASE_URL" -f src/lib/database/schema.sql
```

### 4. Configurar Variables

```bash
# Configurar variables de entorno
railway variables set NODE_ENV=production
railway variables set DB_SSL=true
```

## 🚀 Despliegue

### 1. Desplegar Aplicación

```bash
# Desplegar en Railway
railway up

# Ver logs en tiempo real
railway logs

# Ver estado del servicio
railway status
```

### 2. Configurar Dominio

```bash
# Ver dominios disponibles
railway domain

# Configurar dominio personalizado
railway domain add tu-dominio.com
```

## 🔍 Troubleshooting

### Problemas Comunes

1. **Railway CLI no instalado**

   ```bash
   npm install -g @railway/cli
   ```

2. **No estás logueado**

   ```bash
   railway login
   ```

3. **Error de permisos**

   ```bash
   # Verificar permisos del proyecto
   railway project
   ```

4. **Base de datos no accesible**

   ```bash
   # Verificar variables de entorno
   railway variables

   # Probar conexión
   railway run -- psql "$DATABASE_URL" -c "SELECT version();"
   ```

### Comandos de Diagnóstico

```bash
# Ver información del proyecto
railway project

# Ver servicios
railway service

# Ver variables de entorno
railway variables

# Ver logs
railway logs

# Ver estado
railway status
```

## 📈 Escalabilidad

### Configuración de Producción

```bash
# Configurar para producción
railway variables set NODE_ENV=production
railway variables set DB_SSL=true

# Configurar réplicas
railway service update --num-replicas 2
```

### Monitoreo Avanzado

```bash
# Configurar alertas
railway service update --restart-policy-type ON_FAILURE

# Ver métricas
railway service metrics
```

## 🔒 Seguridad

### Mejores Prácticas

1. **Variables de Entorno**: Nunca committear credenciales
2. **SSL**: Siempre habilitar SSL en producción
3. **Backups**: Configurar backups automáticos
4. **Logs**: Monitorear logs regularmente
5. **Permisos**: Usar permisos mínimos necesarios

### Configuración de Seguridad

```bash
# Habilitar SSL
railway variables set DB_SSL=true

# Configurar timeouts
railway variables set DB_CONNECTION_TIMEOUT=30000

# Configurar pool de conexiones
railway variables set DB_POOL_SIZE=10
```

## 📋 Checklist de Configuración

- [ ] Railway CLI instalado
- [ ] Logueado en Railway
- [ ] Proyecto creado
- [ ] Servicio PostgreSQL creado
- [ ] Esquema ejecutado
- [ ] Variables de entorno configuradas
- [ ] Tablas verificadas
- [ ] Datos iniciales insertados
- [ ] Aplicación desplegada
- [ ] Dominio configurado (opcional)
- [ ] Monitoreo configurado

## 🔮 Próximos Pasos

1. **Configurar Webhooks**: Para automatización de artículos
2. **Configurar CI/CD**: Para despliegues automáticos
3. **Configurar Monitoreo**: Para alertas y métricas
4. **Configurar Backups**: Para respaldos automáticos
5. **Configurar Escalado**: Para manejar más carga

---

**Versión**: 1.0.0  
**Última actualización**: Enero 2025  
**Mantenido por**: Equipo de Desarrollo IA Punto
