# Google Calendar API - Implementación Limpia

## Descripción

Esta implementación utiliza Google Calendar API para Node.js siguiendo la [guía oficial de Google](https://developers.google.com/workspace/calendar/api/quickstart/nodejs) para crear un sistema de agendamiento de citas completamente integrado.

## Características

- ✅ **Autenticación con Service Account** (recomendado para producción)
- ✅ **Creación automática de eventos** en Google Calendar
- ✅ **Integración con Google Meet** para videoconferencias
- ✅ **Verificación de disponibilidad** en tiempo real
- ✅ **Notificaciones automáticas** por email
- ✅ **Gestión de slots disponibles** (9 AM - 6 PM)
- ✅ **Validación completa** de datos de entrada
- ✅ **Manejo de errores** robusto

## Estructura del Proyecto

```
src/pages/api/calendar/
├── book.ts          # Endpoint para crear citas
└── availability.ts  # Endpoint para consultar disponibilidad
```

## Configuración

### 1. Crear Proyecto en Google Cloud Console

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita la **Google Calendar API**

### 2. Crear Service Account

1. En Google Cloud Console, ve a **IAM & Admin** > **Service Accounts**
2. Haz clic en **Create Service Account**
3. Completa la información:
   - **Name**: `iapunto-calendar-service`
   - **Description**: `Service account for IA Punto calendar integration`
4. Haz clic en **Create and Continue**
5. En **Grant this service account access to project**:
   - Selecciona **Editor** role
6. Haz clic en **Done**

### 3. Descargar Credenciales

1. En la lista de Service Accounts, haz clic en el que acabas de crear
2. Ve a la pestaña **Keys**
3. Haz clic en **Add Key** > **Create new key**
4. Selecciona **JSON** y haz clic en **Create**
5. Guarda el archivo JSON descargado

### 4. Configurar Variables de Entorno

Copia `env.google-calendar.example` a `.env` y completa los valores:

```bash
# Email del Service Account
GOOGLE_SERVICE_ACCOUNT_EMAIL=tu-service-account@tu-proyecto.iam.gserviceaccount.com

# Clave privada (del archivo JSON descargado)
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----
TU_CLAVE_PRIVADA_AQUI
-----END PRIVATE KEY-----"

# ID del calendario
GOOGLE_CALENDAR_ID=primary

# Zona horaria
TIMEZONE=America/Bogota
```

### 5. Compartir Calendario

1. Ve a [Google Calendar](https://calendar.google.com/)
2. En el panel izquierdo, haz clic en los 3 puntos junto al calendario
3. Selecciona **Settings and sharing**
4. En **Share with specific people**, haz clic en **+ Add people**
5. Agrega el email del Service Account
6. Dale permisos de **Make changes and manage sharing**
7. Haz clic en **Send**

## Endpoints API

### POST /api/calendar/book

Crea una nueva cita en Google Calendar.

**Request Body:**

```json
{
  "name": "Juan Pérez",
  "email": "juan@ejemplo.com",
  "startTime": "2025-01-15T09:00:00.000Z",
  "endTime": "2025-01-15T10:00:00.000Z",
  "description": "Consulta sobre desarrollo web",
  "meetingType": "Desarrollo Web"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Cita creada exitosamente",
  "appointment": {
    "id": "event_id_123",
    "summary": "Consulta con Juan Pérez",
    "start": {
      "dateTime": "2025-01-15T09:00:00.000Z",
      "timeZone": "America/Bogota"
    },
    "end": {
      "dateTime": "2025-01-15T10:00:00.000Z",
      "timeZone": "America/Bogota"
    },
    "meetLink": "https://meet.google.com/abc-defg-hij"
  },
  "service": "Google Calendar",
  "serviceType": "google-calendar"
}
```

### GET /api/calendar/availability?date=2025-01-15

Consulta la disponibilidad para una fecha específica.

**Response:**

```json
{
  "success": true,
  "date": "2025-01-15",
  "slots": [
    {
      "start_time": "2025-01-15T09:00:00.000Z",
      "end_time": "2025-01-15T10:00:00.000Z",
      "status": "available"
    },
    {
      "start_time": "2025-01-15T10:00:00.000Z",
      "end_time": "2025-01-15T11:00:00.000Z",
      "status": "busy"
    }
  ],
  "totalSlots": 9,
  "availableSlots": 7,
  "busySlots": 2,
  "service": "Google Calendar",
  "serviceType": "google-calendar"
}
```

## Integración Frontend

### JavaScript del Modal

El archivo `public/scripts/meetingmodal.js` maneja la interfaz de usuario:

- **Validación en tiempo real** de formularios
- **Integración con Flatpickr** para selección de fecha/hora
- **Verificación de disponibilidad** antes de enviar
- **Manejo de respuestas** del API
- **Mostrar/ocultar** enlaces de Google Meet

### Ejemplo de Uso

```javascript
// Verificar disponibilidad
const response = await fetch('/api/calendar/availability?date=2025-01-15');
const data = await response.json();

if (data.success) {
  console.log(`Slots disponibles: ${data.availableSlots}`);
}

// Crear cita
const appointmentData = {
  name: 'Juan Pérez',
  email: 'juan@ejemplo.com',
  startTime: '2025-01-15T09:00:00.000Z',
  endTime: '2025-01-15T10:00:00.000Z',
  description: 'Consulta sobre desarrollo web',
  meetingType: 'Desarrollo Web',
};

const bookResponse = await fetch('/api/calendar/book', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(appointmentData),
});

const result = await bookResponse.json();

if (result.success) {
  console.log('Cita creada:', result.appointment.meetLink);
}
```

## Manejo de Errores

### Errores Comunes

1. **"You need to have writer access to this calendar"**
   - Solución: Compartir el calendario con el Service Account

2. **"Invalid credentials"**
   - Solución: Verificar GOOGLE_SERVICE_ACCOUNT_EMAIL y GOOGLE_PRIVATE_KEY

3. **"Calendar not found"**
   - Solución: Verificar GOOGLE_CALENDAR_ID

4. **"The requested time is unavailable"**
   - Solución: El horario ya está ocupado

### Logs de Debug

Todos los endpoints incluyen logs detallados:

```bash
🚀 ===== ENDPOINT DE AGENDAMIENTO INICIADO =====
📥 Solicitud recibida en /api/calendar/book
📋 Parseando cuerpo de la solicitud...
✅ Cuerpo de la solicitud parseado exitosamente
🔍 Validando campos requeridos...
✅ Todas las validaciones pasaron
🔍 Creando servicio de Google Calendar...
🔍 Verificando conexión del servicio...
✅ Conexión del servicio verificada
🚀 Creando cita...
🔍 Verificando disponibilidad...
✅ Verificación de disponibilidad: DISPONIBLE
🎥 Creando conferencia Google Meet con ID: meet-1234567890
✅ Evento creado exitosamente: event_id_123
🔗 Enlace de Google Meet generado: https://meet.google.com/abc-defg-hij
🏁 ===== CITA CREADA =====
```

## Seguridad

- ✅ **Service Account** con permisos mínimos necesarios
- ✅ **Validación de entrada** en todos los endpoints
- ✅ **Sanitización** de datos de usuario
- ✅ **Manejo seguro** de credenciales
- ✅ **CORS configurado** correctamente

## Monitoreo

### Métricas Recomendadas

- **Tasa de éxito** de creación de citas
- **Tiempo de respuesta** de los endpoints
- **Errores de autenticación** de Google Calendar
- **Uso de slots** disponibles vs ocupados

### Alertas

Configurar alertas para:

- Errores 500 en endpoints de calendar
- Fallos de autenticación con Google Calendar
- Tasa de éxito < 95%

## Mantenimiento

### Actualizaciones

- Mantener `googleapis` actualizado
- Revisar cambios en Google Calendar API
- Actualizar documentación según cambios

### Backup

- Exportar configuración de calendario
- Backup de credenciales de Service Account
- Logs de auditoría de citas creadas

## Recursos Adicionales

- [Google Calendar API Documentation](https://developers.google.com/calendar/api)
- [Google Calendar API Quickstart](https://developers.google.com/workspace/calendar/api/quickstart/nodejs)
- [Google Calendar API Events Guide](https://developers.google.com/workspace/calendar/api/guides/create-events)
- [Google Cloud Service Accounts](https://cloud.google.com/iam/docs/service-accounts)
