# 🤖 Dashboard de Automatización - Guía Completa

## 📋 Descripción General

El Dashboard de Automatización es una interfaz web interactiva que permite crear artículos automáticamente usando el sistema de GEMs de Gemini. Proporciona seguimiento en tiempo real del proceso de creación, desde la planificación hasta la publicación final.

## 🚀 Características Principales

### ✨ **Interfaz Intuitiva**

- Diseño moderno y responsive
- Formulario simple para introducir temas
- Indicadores visuales de progreso
- Logs en tiempo real

### 📊 **Seguimiento en Tiempo Real**

- Barra de progreso dinámica
- Estados de cada GEM (Planificación, Investigación, Redacción, Finalización)
- Logs del sistema con timestamps
- Actualizaciones automáticas cada 2 segundos

### 🎯 **Proceso de 4 GEMs**

1. **GEM 1 - Planificación**: Genera título, secciones, palabra clave y meta descripción
2. **GEM 2 - Investigación**: Investiga cada sección en profundidad
3. **GEM 3 - Redacción**: Crea el artículo completo optimizado
4. **GEM 4 - Finalización**: Genera frontmatter y formato MDX

### 📄 **Resultados Completos**

- Vista previa del artículo generado
- Información completa del frontmatter
- Opciones para ver, descargar o crear nuevo artículo
- Estadísticas del sistema

## 🛠️ Instalación y Configuración

### Prerequisitos

- Base de datos PostgreSQL configurada (Railway)
- Variables de entorno configuradas
- Servidor Astro corriendo

### Pasos de Instalación

1. **Configurar Base de Datos**

```bash
# Configurar Railway
pnpm railway:setup

# Verificar tablas
pnpm railway:db tables
```

2. **Configurar Variables de Entorno**

```bash
# Crear archivo .env
cp env.railway.example .env

# Configurar variables
DB_HOST=tu-host
DB_PORT=5432
DB_NAME=tu-database
DB_USER=tu-usuario
DB_PASSWORD=tu-password
DB_SSL=true
GEMINI_API_KEY=tu-api-key
```

3. **Iniciar Servidor**

```bash
pnpm dev
```

## 🎮 Uso del Dashboard

### Acceso

- URL: `http://localhost:4321/automation-dashboard`
- También disponible en el menú de navegación como "🤖 AUTOMATIZACIÓN"

### Crear un Artículo

1. **Introducir Tema**
   - Escribe un tema descriptivo en el campo de entrada
   - Ejemplo: "Estrategias de marketing digital para 2025"

2. **Iniciar Proceso**
   - Haz clic en "Iniciar Automatización"
   - El sistema comenzará el proceso en background

3. **Seguir Progreso**
   - Observa la barra de progreso
   - Verifica el estado de cada GEM
   - Revisa los logs en tiempo real

4. **Ver Resultados**
   - Una vez completado, se mostrará el panel de resultados
   - Puedes ver la vista previa del artículo
   - Descargar el archivo MDX
   - Ver el artículo completo en el blog

### Estados de las GEMs

| Estado      | Icono | Descripción             |
| ----------- | ----- | ----------------------- |
| Pendiente   | ⏳    | Esperando inicio        |
| En Progreso | 🔄    | Procesando              |
| Completado  | ✅    | Finalizado exitosamente |
| Error       | ❌    | Error en el proceso     |

## 🔧 Configuración Avanzada

### Personalizar Prompts

Los prompts de las GEMs se pueden personalizar en:

- `src/lib/services/gemArticleService.ts`

### Ajustar Intervalos

- SSE: 2 segundos (en `src/pages/api/articles/status/[id].ts`)
- Logs: Tiempo real
- Progreso: Actualización automática

### Configurar API Keys

```javascript
// En el dashboard
apiKey: 'demo-key'; // Cambiar por clave real en producción
```

## 📡 API Endpoints

### Crear Artículo

```http
POST /api/articles/create-automatic
Content-Type: application/json

{
  "topic": "Tema del artículo",
  "apiKey": "demo-key"
}
```

### Seguimiento SSE

```http
GET /api/articles/status/{articleId}
```

### Descargar Artículo

```http
GET /api/articles/download/{articleId}
```

## 🧪 Pruebas

### Script de Prueba Automática

```bash
pnpm dashboard:test
```

### Pruebas Manuales

1. **Probar Creación**
   - Introduce un tema simple
   - Verifica que se cree el tracking
   - Observa el progreso

2. **Probar SSE**
   - Abre las herramientas de desarrollador
   - Verifica los eventos SSE
   - Comprueba la actualización en tiempo real

3. **Probar Descarga**
   - Completa un artículo
   - Descarga el archivo MDX
   - Verifica el formato

## 🐛 Solución de Problemas

### Error de Conexión a Base de Datos

```bash
# Verificar Railway
railway status
railway variables

# Probar conexión
pnpm railway:db tables
```

### Error en SSE

- Verificar que el servidor esté corriendo
- Comprobar logs del navegador
- Verificar CORS en desarrollo

### Error en GEMs

- Verificar API key de Gemini
- Comprobar logs del sistema
- Verificar prompts en el servicio

### Dashboard No Carga

- Verificar que Astro esté corriendo
- Comprobar rutas en `src/pages/`
- Verificar dependencias instaladas

## 📊 Monitoreo y Estadísticas

### Estadísticas del Dashboard

- Total de artículos creados
- Artículos pendientes
- Artículos completados
- Artículos con errores

### Logs del Sistema

- Logs en tiempo real en el dashboard
- Logs persistentes en la base de datos
- Logs de errores con timestamps

### Métricas de Rendimiento

- Tiempo de procesamiento por GEM
- Tasa de éxito
- Errores más comunes

## 🔒 Seguridad

### API Keys

- Usar claves reales en producción
- Rotar claves regularmente
- No exponer claves en el frontend

### Validación de Entrada

- Sanitizar temas de entrada
- Validar formato de datos
- Limitar longitud de temas

### Acceso al Dashboard

- Considerar autenticación en producción
- Limitar acceso por IP si es necesario
- Logs de acceso

## 🚀 Próximas Mejoras

### Funcionalidades Planificadas

- [ ] Autenticación de usuarios
- [ ] Cola de artículos
- [ ] Programación automática
- [ ] Plantillas de temas
- [ ] Exportación de estadísticas
- [ ] Notificaciones por email
- [ ] Integración con CMS
- [ ] Análisis de SEO automático

### Mejoras Técnicas

- [ ] WebSockets en lugar de SSE
- [ ] Cache de resultados
- [ ] Optimización de prompts
- [ ] Backup automático
- [ ] Monitoreo avanzado

## 📞 Soporte

### Recursos Útiles

- [Documentación de Astro](https://docs.astro.build/)
- [Documentación de Railway](https://docs.railway.app/)
- [API de Gemini](https://ai.google.dev/docs)

### Comandos Útiles

```bash
# Verificar estado del sistema
pnpm railway:db stats

# Ver logs recientes
pnpm railway:db logs 10

# Backup de base de datos
pnpm railway:db backup

# Reiniciar sistema
pnpm railway:db reset --confirm
```

---

**¡El Dashboard de Automatización está listo para crear contenido de alta calidad de forma automática!** 🎉
