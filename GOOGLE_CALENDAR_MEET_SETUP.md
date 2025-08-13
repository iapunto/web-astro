# Configuración de Google Calendar API con Google Meet

## 📋 Requisitos Previos

### 1. Cuenta de Google Cloud con Facturación

- **Requerido**: Una cuenta de Google Cloud con facturación habilitada
- **Nota**: Google Calendar API es gratuito para uso básico, pero requiere cuenta de facturación para cuotas más altas
- **Google Meet**: Se agrega manualmente desde Google Calendar (no requiere Google Workspace)

### 2. Configuración del Proyecto de Google Cloud

#### 2.1 Crear Proyecto en Google Cloud Console

1. Ir a [Google Cloud Console](https://console.cloud.google.com/)
2. Crear un nuevo proyecto o seleccionar uno existente
3. Habilitar la API de Google Calendar

#### 2.2 Crear Service Account

1. En Google Cloud Console, ir a "IAM & Admin" > "Service Accounts"
2. Crear una nueva Service Account
3. Descargar el archivo JSON de credenciales
4. **Importante**: Guardar el email de la Service Account

#### 2.3 Configurar Domain-Wide Delegation

1. En la Service Account, ir a "Keys" > "Add Key" > "Create new key"
2. Seleccionar JSON y descargar
3. En Google Workspace Admin Console:
   - Ir a "Security" > "API Controls" > "Domain-wide Delegation"
   - Agregar el Client ID de la Service Account
   - Configurar el scope: `https://www.googleapis.com/auth/calendar`

### 3. Configuración del Calendario

#### 3.1 Compartir Calendario

1. En Google Calendar, ir a configuración del calendario
2. En "Share with specific people", agregar el email de la Service Account
3. Dar permisos: "Make changes to events"

#### 3.2 Verificar Tipos de Conferencia Permitidos

```bash
GET https://www.googleapis.com/calendar/v3/calendars/{calendarId}
```

La respuesta debe incluir:

```json
{
  "conferenceProperties": {
    "allowedConferenceSolutionTypes": ["hangoutsMeet"]
  }
}
```

## 🔧 Configuración en el Código

### Variables de Entorno Requeridas

```env
# Service Account Credentials
GOOGLE_SERVICE_ACCOUNT_EMAIL=tu-service-account@proyecto.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Calendar Configuration
GOOGLE_CALENDAR_ID=primary
TIMEZONE=America/Bogota

# Google Workspace User (para impersonación)
GOOGLE_WORKSPACE_USER=usuario@tudominio.com
```

### Configuración de Autenticación

```typescript
const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
  scopes: [
    'https://www.googleapis.com/auth/calendar',
    'https://www.googleapis.com/auth/calendar.events',
  ],
});

// Configurar impersonación del usuario de Google Workspace
auth.setSubject(process.env.GOOGLE_WORKSPACE_USER);
```

## 🚀 Creación de Eventos con Google Meet

### Estructura del Evento

```typescript
const event = {
  summary: 'Título del evento',
  start: {
    dateTime: startDate.toISOString(),
    timeZone: 'America/Bogota',
  },
  end: {
    dateTime: endDate.toISOString(),
    timeZone: 'America/Bogota',
  },
  conferenceData: {
    createRequest: {
      requestId: `meet-${Date.now()}`,
      conferenceSolutionKey: {
        type: 'hangoutsMeet',
      },
    },
  },
};
```

### Crear Evento

```typescript
const response = await calendar.events.insert({
  calendarId: 'primary',
  requestBody: event,
  conferenceDataVersion: 1, // REQUERIDO para Google Meet
  sendUpdates: 'none',
});
```

### Extraer Enlace de Google Meet

```typescript
const meetLink = response.data.conferenceData?.entryPoints?.find(
  (entry) => entry.entryPointType === 'video'
)?.uri;
```

## ⚠️ Problemas Comunes y Soluciones

### Error: "Invalid conference type value"

**Causa**: No se está usando impersonación del usuario de Google Workspace
**Solución**:

1. Configurar domain-wide delegation
2. Usar `auth.setSubject()` con el email del usuario de Google Workspace

### Error: "Client is unauthorized"

**Causa**: Service Account no tiene permisos en el calendario
**Solución**:

1. Agregar Service Account al calendario con permisos de "Make changes"
2. Verificar que el calendario permita Google Meet

### Error: "Not Found 404"

**Causa**: Calendario no encontrado o Service Account sin acceso
**Solución**:

1. Verificar `GOOGLE_CALENDAR_ID`
2. Asegurar que Service Account tenga acceso al calendario

### Google Meet no se crea

**Causa**: Falta el parámetro `conferenceDataVersion`
**Solución**:

1. Agregar `conferenceDataVersion: 1` en `optParams`
2. Verificar que el calendario permita Google Meet

## 📚 Referencias

- [Google Calendar API Documentation](https://developers.google.com/workspace/calendar/api/guides/create-events?hl=es-419)
- [Stack Overflow - Google Meet Creation](https://stackoverflow.com/questions/75916295/google-calendar-api-create-event-google-meet-link)
- [Google Workspace Admin Help](https://support.google.com/a/answer/162106?hl=es)

## 🔍 Verificación de Configuración

### Endpoint de Prueba

```bash
GET /api/calendar/test-attendees
```

### Verificar Conexión

```bash
GET /api/calendar/availability?startTime=2024-01-01T10:00:00Z&endTime=2024-01-01T11:00:00Z
```

### Crear Evento de Prueba

```bash
POST /api/calendar/book
{
  "name": "Test User",
  "email": "test@example.com",
  "startTime": "2024-01-01T10:00:00Z",
  "endTime": "2024-01-01T11:00:00Z",
  "description": "Test appointment"
}
```
