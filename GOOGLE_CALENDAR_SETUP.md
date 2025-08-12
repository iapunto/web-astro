# 🗓️ Configuración de Google Calendar API

Esta guía te ayudará a configurar Google Calendar API para el sistema de agendamiento de citas de IA Punto, siguiendo las [mejores prácticas oficiales](https://developers.google.com/workspace/calendar/api/quickstart/nodejs?hl=es-419).

## 📋 Requisitos Previos

1. **Cuenta de Google Cloud**: Necesitas una cuenta en [Google Cloud Console](https://console.cloud.google.com/)
2. **Proyecto de Google Cloud**: Un proyecto activo para habilitar las APIs
3. **Cuenta de Google Workspace**: Para acceder a Google Calendar
4. **Node.js y npm**: Para ejecutar el código

## 🔧 Configuración Paso a Paso

### 1. Crear Proyecto en Google Cloud

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Anota el **Project ID** para usarlo más adelante

### 2. Habilitar Google Calendar API

1. En la consola de Google Cloud, ve a **APIs & Services** > **Library**
2. Busca "Google Calendar API"
3. Haz clic en **Google Calendar API** y luego en **Enable**

### 3. Configurar Pantalla de Consentimiento OAuth

1. Ve a **APIs & Services** > **OAuth consent screen**
2. Selecciona **Internal** (si tienes Google Workspace) o **External**
3. Completa la información requerida:
   - **App name**: "IA Punto Calendar"
   - **User support email**: `hola@iapunto.com`
   - **Developer contact information**: `hola@iapunto.com`

### 4. Crear Service Account (Recomendado)

**Esta es la opción más simple y segura para aplicaciones servidor:**

1. Ve a **APIs & Services** > **Credentials**
2. Haz clic en **Create Credentials** > **Service Account**
3. Completa la información:
   - **Service account name**: `iapunto-calendar-service`
   - **Service account ID**: Se genera automáticamente
   - **Description**: "Service account for IA Punto calendar integration"
4. Haz clic en **Create and Continue**
5. En **Grant this service account access to project**, selecciona **Editor**
6. Haz clic en **Done**

### 5. Generar Clave Privada

1. En la lista de Service Accounts, haz clic en el que acabas de crear
2. Ve a la pestaña **Keys**
3. Haz clic en **Add Key** > **Create new key**
4. Selecciona **JSON** y haz clic en **Create**
5. Se descargará un archivo JSON con las credenciales

### 6. Configurar Permisos del Calendario

1. Ve a [Google Calendar](https://calendar.google.com/)
2. En el panel izquierdo, encuentra tu calendario principal
3. Haz clic en los tres puntos junto al nombre del calendario
4. Selecciona **Settings and sharing**
5. En **Share with specific people**, haz clic en **+ Add people**
6. Agrega el email del Service Account (está en el archivo JSON descargado)
7. Dale permisos de **Make changes to events**
8. Haz clic en **Send**

### 7. Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
# Google Calendar API
GOOGLE_SERVICE_ACCOUNT_EMAIL=tu-service-account@tu-proyecto.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nTU_CLAVE_PRIVADA_AQUI\n-----END PRIVATE KEY-----"
GOOGLE_CALENDAR_ID=tu-email@gmail.com

# Email Service (Resend)
RESEND_API_KEY=tu_api_key_de_resend

# Configuración General
TIMEZONE=America/Mexico_City
```

**Importante**: 
- El `GOOGLE_PRIVATE_KEY` debe incluir los saltos de línea (`\n`)
- El `GOOGLE_CALENDAR_ID` puede ser tu email o "primary" para el calendario principal

### 8. Configurar en Railway (Producción)

1. Ve a tu dashboard de Railway
2. Selecciona tu proyecto
3. Ve a la pestaña "Variables"
4. Agrega las variables de entorno:
   - `GOOGLE_SERVICE_ACCOUNT_EMAIL`
   - `GOOGLE_PRIVATE_KEY`
   - `GOOGLE_CALENDAR_ID`
   - `RESEND_API_KEY`

## 🧪 Probar la Configuración

### 1. Probar Localmente

```bash
# Iniciar el servidor de desarrollo
npm run dev

# Probar la configuración de Google Calendar
curl http://localhost:4321/api/calendar/test-google-setup
```

### 2. Probar en Producción

```bash
# Probar la configuración en producción
curl https://iapunto.com/api/calendar/test-google-setup
```

## 📊 Endpoints de Prueba Disponibles

- `GET /api/calendar/test-google-setup` - **Probar configuración completa de Google Calendar**
- `GET /api/calendar/test-calendly-setup` - Probar configuración de Calendly (fallback)
- `GET /api/calendar/debug-env` - Verificar variables de entorno
- `GET /api/calendar/availability` - Obtener slots disponibles
- `POST /api/calendar/book` - Crear una cita

## 🔍 Verificar Configuración

### Respuesta Exitosa

```json
{
  "success": true,
  "message": "Google Calendar setup is working correctly",
  "config": {
    "hasServiceAccountEmail": true,
    "hasPrivateKey": true,
    "hasCalendarId": true,
    "calendarId": "tu-email@gmail.com"
  },
  "connection": {
    "isConnected": true,
    "calendarInfo": {
      "id": "tu-email@gmail.com",
      "summary": "Tu Nombre",
      "timeZone": "America/Mexico_City"
    }
  },
  "upcomingEvents": {
    "count": 2,
    "events": [...]
  },
  "availableSlots": {
    "date": "2025-01-14T00:00:00.000Z",
    "count": 8,
    "slots": [...]
  }
}
```

## 🚨 Solución de Problemas

### Error: "Google Calendar configuration incomplete"

**Solución**: Verifica que las variables de entorno estén configuradas:
- `GOOGLE_SERVICE_ACCOUNT_EMAIL`
- `GOOGLE_PRIVATE_KEY`
- `GOOGLE_CALENDAR_ID`

### Error: "Failed to connect to Google Calendar API"

**Solución**: Verifica que:
1. La API de Google Calendar esté habilitada
2. Las credenciales del Service Account sean correctas
3. El Service Account tenga permisos en el calendario
4. El calendario ID sea correcto

### Error: "insufficient_permissions"

**Solución**: Asegúrate de que:
1. El Service Account tenga permisos de **Editor** en el calendario
2. El calendario esté compartido con el email del Service Account
3. La API de Google Calendar esté habilitada en el proyecto

### Error: "calendar_not_found"

**Solución**: Verifica que:
1. El `GOOGLE_CALENDAR_ID` sea correcto
2. El calendario esté compartido con el Service Account
3. El calendario exista y sea accesible

### Error: "No Google Meet link generated"

**Solución**: Verifica que:
1. El calendario tenga habilitada la integración con Google Meet
2. El Service Account tenga permisos para crear conferencias
3. La configuración de conferencias esté habilitada

## 📧 Configuración de Email

### Resend Setup

1. **Crear cuenta en Resend**:
   - Ve a [resend.com](https://resend.com)
   - Crea una cuenta con `hola@iapunto.com`

2. **Verificar dominio**:
   - Agrega tu dominio `iapunto.com`
   - Configura los registros DNS necesarios

3. **Obtener API Key**:
   - Ve a "API Keys" en tu dashboard
   - Crea una nueva API key
   - Copia la key generada

4. **Configurar variable de entorno**:
   ```env
   RESEND_API_KEY=tu_api_key_de_resend
   ```

## 🎯 Características del Sistema

### ✅ Funcionalidades Implementadas

- **Integración directa con Google Calendar API**: Usando la API oficial más reciente
- **Service Account authentication**: Autenticación segura y confiable
- **Creación automática de eventos**: Eventos nativos en Google Calendar
- **Integración con Google Meet**: Enlaces de reunión automáticos
- **Verificación de disponibilidad**: Consulta de horarios disponibles
- **Notificaciones por email**: Usando Resend para emails confiables
- **Fallback a Calendly**: Si Google Calendar no está disponible
- **Gestión de conflictos**: Verificación automática de disponibilidad

### 🔄 Flujo de Agendamiento

1. **Cliente llena formulario** en el sitio web
2. **Sistema verifica disponibilidad** usando Google Calendar API
3. **Se crea un evento nativo** en Google Calendar
4. **Se genera enlace de Google Meet** automáticamente
5. **Se envían emails de confirmación** usando Resend
6. **Cliente recibe confirmación** con enlace de Meet

### 📱 Experiencia del Usuario

- **Formulario integrado**: Sin redirección externa
- **Validación en tiempo real**: Verificación de disponibilidad
- **Confirmación inmediata**: Email con enlace de Google Meet
- **Sincronización automática**: Eventos aparecen en Google Calendar
- **Gestión de conflictos**: Verificación automática de horarios

## 🔗 Enlaces Útiles

- [Google Calendar API Documentation](https://developers.google.com/calendar/api)
- [Google Cloud Console](https://console.cloud.google.com/)
- [Google Workspace Admin](https://admin.google.com/)
- [Resend Documentation](https://resend.com/docs)
- [IA Punto Website](https://iapunto.com)

## 📞 Soporte

Si tienes problemas con la configuración:

1. **Revisa los logs** del servidor
2. **Prueba los endpoints** de verificación
3. **Verifica las variables** de entorno
4. **Contacta al equipo** de desarrollo

---

**Última actualización**: Enero 2025
**Versión**: 2.0.0
**Basado en**: [Google Calendar API Quickstart](https://developers.google.com/workspace/calendar/api/quickstart/nodejs?hl=es-419)
