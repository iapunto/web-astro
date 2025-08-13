# Configuración OAuth2 para Google Calendar

Esta guía te ayudará a configurar OAuth2 para Google Calendar, permitiendo la gestión completa de invitados y Google Meet automático.

## 🎯 **Ventajas de OAuth2 vs Service Account**

- ✅ **Gestión completa de invitados** sin Domain-Wide Delegation
- ✅ **Google Meet automático** (si tienes Google Workspace)
- ✅ **Envío automático de invitaciones** por email
- ✅ **Funciona con cualquier cuenta de Google** (no requiere Workspace)
- ✅ **Tokens de usuario directo** con permisos completos

## 📋 **Prerrequisitos**

1. **Cuenta de Google Cloud** con facturación habilitada
2. **Proyecto de Google Cloud** configurado
3. **Google Calendar API** habilitada
4. **Credenciales OAuth2** configuradas

## 🔧 **Paso 1: Configurar OAuth2 en Google Cloud Console**

### 1.1 Acceder a Google Cloud Console
- Ve a [Google Cloud Console](https://console.cloud.google.com/)
- Selecciona tu proyecto

### 1.2 Habilitar Google Calendar API
- Ve a **"APIs y servicios"** → **"Biblioteca"**
- Busca **"Google Calendar API"**
- Haz clic en **"Habilitar"**

### 1.3 Crear credenciales OAuth2
- Ve a **"APIs y servicios"** → **"Credenciales"**
- Haz clic en **"Crear credenciales"** → **"ID de cliente de OAuth 2.0"**
- Selecciona **"Aplicación web"**
- Configura:
  - **Nombre**: `IA Punto Calendar`
  - **URIs de redirección autorizados**:
    ```
    https://iapunto.com/api/calendar/auth/callback
    http://localhost:4321/api/calendar/auth/callback
    ```

### 1.4 Guardar credenciales
- Anota el **Client ID** y **Client Secret**
- Los necesitarás para las variables de entorno

## 🔑 **Paso 2: Configurar variables de entorno**

Agrega estas variables a tu archivo `.env` o en Railway:

```bash
# Google OAuth2 Configuration
GOOGLE_CLIENT_ID=tu-client-id-oauth2.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=tu-client-secret-oauth2
GOOGLE_REDIRECT_URI=https://iapunto.com/api/calendar/auth/callback

# Google OAuth2 Tokens (se obtienen después del flujo de autenticación)
GOOGLE_ACCESS_TOKEN=tu-access-token-aqui
GOOGLE_REFRESH_TOKEN=tu-refresh-token-aqui
GOOGLE_USER_EMAIL=tu-email@gmail.com

# Otras configuraciones
GOOGLE_CALENDAR_ID=primary
TIMEZONE=America/Bogota
```

## 🚀 **Paso 3: Obtener tokens OAuth2**

### 3.1 Iniciar flujo de autenticación
Visita este endpoint para iniciar el flujo OAuth2:
```
https://iapunto.com/api/calendar/auth
```

### 3.2 Completar autorización
1. Inicia sesión con tu cuenta de Google
2. Concede permisos para Google Calendar
3. Serás redirigido de vuelta con tokens

### 3.3 Guardar tokens
Copia los tokens de la respuesta y configúralos en las variables de entorno:
- `GOOGLE_ACCESS_TOKEN`
- `GOOGLE_REFRESH_TOKEN`
- `GOOGLE_USER_EMAIL`

## 🧪 **Paso 4: Probar la configuración**

### 4.1 Verificar configuración básica
```
https://iapunto.com/api/calendar/test-oauth2
```

### 4.2 Verificar funcionamiento completo
```
https://iapunto.com/api/calendar/test-oauth2-working
```

### 4.3 Crear cita de prueba
Usa el endpoint principal:
```
POST https://iapunto.com/api/calendar/book
```

## 📅 **Funcionalidades disponibles con OAuth2**

### ✅ **Creación de eventos con invitados**
- Los clientes se agregan automáticamente como invitados
- Las invitaciones se envían por email automáticamente
- No requiere Domain-Wide Delegation

### ✅ **Google Meet automático**
- Se crea automáticamente si tienes Google Workspace
- El enlace se incluye en las invitaciones
- Funciona con cuentas personales (manual)

### ✅ **Gestión completa de calendario**
- Crear, actualizar y eliminar eventos
- Verificar disponibilidad
- Gestionar múltiples calendarios

## 🔄 **Renovación automática de tokens**

El sistema renueva automáticamente los tokens cuando expiran:
- Los refresh tokens no expiran (a menos que se revoquen)
- Los access tokens se renuevan automáticamente
- No requiere intervención manual

## 🛠️ **Endpoints disponibles**

### **Autenticación**
- `GET /api/calendar/auth` - Iniciar flujo OAuth2
- `GET /api/calendar/auth/callback` - Callback de autorización

### **Gestión de citas**
- `POST /api/calendar/book` - Crear cita (OAuth2 + Service Account)
- `POST /api/calendar/book-oauth2` - Crear cita (solo OAuth2)
- `PUT /api/calendar/update-event` - Actualizar evento
- `GET /api/calendar/get-event` - Obtener información de evento

### **Pruebas y verificación**
- `GET /api/calendar/test-oauth2` - Verificar configuración OAuth2
- `GET /api/calendar/test-oauth2-working` - Probar funcionalidad completa
- `GET /api/calendar/verify-setup` - Verificar configuración general

## ⚠️ **Solución de problemas**

### **Error: redirect_uri_mismatch**
- Verifica que la URI de redirección esté configurada en Google Cloud Console
- Asegúrate de que coincida exactamente con `GOOGLE_REDIRECT_URI`

### **Error: invalid_grant**
- Los tokens han expirado o sido revocados
- Ejecuta nuevamente el flujo OAuth2

### **Google Meet no se crea**
- Verifica que tengas Google Workspace (para Meet automático)
- Con cuentas personales, agrega Meet manualmente desde Google Calendar

### **No se envían invitaciones**
- Verifica que `sendUpdates: 'all'` esté configurado
- Asegúrate de que los emails de los invitados sean válidos

## 📞 **Soporte**

Si tienes problemas con la configuración:
1. Revisa los logs del servidor
2. Verifica las variables de entorno
3. Ejecuta los endpoints de prueba
4. Consulta la documentación de Google Calendar API

---

**¡Con OAuth2 configurado, tu sistema de citas tendrá funcionalidad completa de invitados y Google Meet!** 🎉
