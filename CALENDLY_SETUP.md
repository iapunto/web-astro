# 🗓️ Configuración de Calendly API v2

Esta guía te ayudará a configurar Calendly API v2 para el sistema de agendamiento de citas de IA Punto.

## 📋 Requisitos Previos

1. **Cuenta de Calendly**: Necesitas una cuenta en [Calendly](https://calendly.com)
2. **Plan Premium o superior**: Para acceder a la API v2
3. **Dominio verificado**: Para enviar emails desde tu dominio

## 🔧 Configuración Paso a Paso

### 1. Crear Cuenta en Calendly

1. Ve a [calendly.com](https://calendly.com)
2. Crea una cuenta con tu email `hola@iapunto.com`
3. Verifica tu cuenta de email

### 2. Configurar Tipo de Evento

1. **Crear un nuevo tipo de evento**:
   - Ve a "Event Types" en tu dashboard
   - Haz clic en "Create"
   - Selecciona "One-on-One"

2. **Configurar el evento**:
   - **Nombre**: "Consulta IA Punto"
   - **Duración**: 60 minutos
   - **Descripción**: "Consulta personalizada sobre marketing digital e inteligencia artificial"
   - **Ubicación**: Google Meet (seleccionar automáticamente)

3. **Configurar preguntas personalizadas**:
   - Agregar pregunta: "Tipo de consulta"
   - Agregar pregunta: "Descripción del proyecto"
   - Agregar pregunta: "¿Cómo conociste IA Punto?"

4. **Configurar disponibilidad**:
   - Horario de trabajo: Lunes a Viernes, 9:00 AM - 6:00 PM (Hora de México)
   - Zona horaria: America/Mexico_City
   - Buffer antes/después: 15 minutos

### 3. Obtener API Key

1. **Acceder a la API**:
   - Ve a [developer.calendly.com](https://developer.calendly.com)
   - Inicia sesión con tu cuenta de Calendly
   - Ve a "API Keys"

2. **Crear API Key**:
   - Haz clic en "Create API Key"
   - Dale un nombre descriptivo: "IA Punto Website"
   - Copia la API key generada

### 4. Obtener Event Type URI

1. **Obtener el URI del tipo de evento**:
   - Ve a tu dashboard de Calendly
   - Selecciona el tipo de evento "Consulta IA Punto"
   - En la URL, copia el ID del evento
   - El formato será: `https://api.calendly.com/event_types/[EVENT_TYPE_ID]`

### 5. Configurar Variables de Entorno

Agrega las siguientes variables a tu archivo `.env`:

```env
# Calendly API v2
CALENDLY_API_KEY=tu_api_key_de_calendly
CALENDLY_EVENT_TYPE_URI=https://api.calendly.com/event_types/tu_event_type_id

# Email Service (Resend)
RESEND_API_KEY=tu_api_key_de_resend
```

### 6. Configurar en Railway (Producción)

1. Ve a tu dashboard de Railway
2. Selecciona tu proyecto
3. Ve a la pestaña "Variables"
4. Agrega las variables de entorno:
   - `CALENDLY_API_KEY`
   - `CALENDLY_EVENT_TYPE_URI`
   - `RESEND_API_KEY`

## 🧪 Probar la Configuración

### 1. Probar Localmente

```bash
# Iniciar el servidor de desarrollo
npm run dev

# Probar la configuración de Calendly
curl http://localhost:4321/api/calendar/test-calendly-setup
```

### 2. Probar en Producción

```bash
# Probar la configuración en producción
curl https://iapunto.com/api/calendar/test-calendly-setup
```

## 📊 Endpoints de Prueba Disponibles

- `GET /api/calendar/test-calendly-setup` - Probar configuración completa
- `GET /api/calendar/test-calendly` - Probar integración básica
- `GET /api/calendar/debug-env` - Verificar variables de entorno

## 🔍 Verificar Configuración

### Respuesta Exitosa

```json
{
  "success": true,
  "message": "Calendly setup is working correctly",
  "config": {
    "hasApiKey": true,
    "hasEventTypeUri": true,
    "eventTypeUri": "https://api.calendly.com/event_types/..."
  },
  "connection": {
    "isConnected": true,
    "userInfo": {
      "name": "IA Punto",
      "email": "hola@iapunto.com"
    }
  },
  "eventTypes": {
    "count": 1,
    "types": [
      {
        "name": "Consulta IA Punto",
        "uri": "https://api.calendly.com/event_types/...",
        "duration": 60,
        "active": true
      }
    ]
  },
  "availableSlots": {
    "date": "2025-01-14T00:00:00.000Z",
    "count": 8,
    "slots": [...]
  }
}
```

## 🚨 Solución de Problemas

### Error: "Calendly configuration incomplete"

**Solución**: Verifica que las variables de entorno estén configuradas:
- `CALENDLY_API_KEY`
- `CALENDLY_EVENT_TYPE_URI`

### Error: "Failed to connect to Calendly API"

**Solución**: Verifica que:
1. La API key sea correcta
2. Tengas un plan Premium o superior
3. La API key tenga los permisos correctos

### Error: "No event types found"

**Solución**: Verifica que:
1. El Event Type URI sea correcto
2. El tipo de evento esté activo
3. Tengas permisos para acceder al tipo de evento

### Error: "No available slots"

**Solución**: Verifica que:
1. El tipo de evento tenga disponibilidad configurada
2. La zona horaria esté configurada correctamente
3. No haya eventos que bloqueen los slots

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

- **Integración con Calendly API v2**: Usando la API oficial más reciente
- **Verificación de conexión**: Prueba automática de autenticación
- **Obtención de slots disponibles**: Consulta de horarios disponibles
- **Creación de scheduling links**: Enlaces personalizados para agendamiento
- **Notificaciones por email**: Usando Resend para emails confiables
- **Fallback a Google Calendar**: Si Calendly no está disponible

### 🔄 Flujo de Agendamiento

1. **Cliente llena formulario** en el sitio web
2. **Sistema verifica disponibilidad** usando Calendly API
3. **Se crea un scheduling link** personalizado
4. **Se envían emails de confirmación** usando Resend
5. **Cliente recibe enlace** para completar el agendamiento

### 📱 Experiencia del Usuario

- **Formulario integrado**: Sin redirección a Calendly
- **Validación en tiempo real**: Verificación de disponibilidad
- **Confirmación inmediata**: Email con enlace de Calendly
- **Gestión automática**: Calendly maneja zonas horarias y conflictos

## 🔗 Enlaces Útiles

- [Calendly Developer Documentation](https://developer.calendly.com/)
- [Calendly API v2 Reference](https://developer.calendly.com/api-docs/)
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
**Versión**: 1.0.0
