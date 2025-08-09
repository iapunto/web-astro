# Configuración de Google Calendar API - IA Punto

## 🎯 Guía de Configuración Completa

Esta guía te ayudará a configurar la integración de Google Calendar API para el sistema de citas de IA Punto.

---

## 📋 Prerequisitos

- Cuenta de Google (Gmail)
- Acceso a Google Cloud Console
- Permisos de administrador en el proyecto

---

## 🔧 Paso 1: Configurar Google Cloud Project

### 1.1 Crear o Seleccionar Proyecto

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Anota el **Project ID** para referencia futura

### 1.2 Habilitar APIs Necesarias

1. En Google Cloud Console, ve a **APIs & Services > Library**
2. Busca y habilita las siguientes APIs:
   - **Google Calendar API**
   - **Google+ API** (para información del usuario)

---

## 🔐 Paso 2: Configurar Credenciales OAuth 2.0

### 2.1 Crear Credenciales OAuth 2.0

1. Ve a **APIs & Services > Credentials**
2. Haz clic en **+ CREATE CREDENTIALS > OAuth 2.0 Client IDs**
3. Si es la primera vez, configura la **OAuth consent screen**:
   - **Application type**: External
   - **App name**: IA Punto Calendar Integration
   - **User support email**: tu email
   - **Developer contact information**: tu email

### 2.2 Configurar OAuth Client ID

1. **Application type**: Web application
2. **Name**: IA Punto Web Client
3. **Authorized JavaScript origins**:
   ```
   http://localhost:4321
   https://tu-dominio.com
   ```
4. **Authorized redirect URIs**:
   ```
   http://localhost:4321/api/auth/google/callback
   https://tu-dominio.com/api/auth/google/callback
   ```

### 2.3 Descargar Credenciales

1. Haz clic en **CREATE**
2. Descarga el archivo JSON con las credenciales
3. Guarda los siguientes valores:
   - **Client ID**
   - **Client Secret**

---

## 🌐 Paso 3: Configurar Variables de Entorno

### 3.1 Crear Archivo .env

Copia el archivo `env.google-calendar.example` a `.env` y completa los valores:

```bash
# Copiar archivo de ejemplo
cp env.google-calendar.example .env
```

### 3.2 Completar Variables de Entorno

```env
# Google Calendar API Configuration
GOOGLE_CLIENT_ID=tu_client_id_aqui
GOOGLE_CLIENT_SECRET=tu_client_secret_aqui
GOOGLE_CALENDAR_ID=primary
GOOGLE_REDIRECT_URI=http://localhost:4321/api/auth/google/callback

# Application Configuration
APP_URL=http://localhost:4321
APPOINTMENT_DURATION_MINUTES=60
BUSINESS_HOURS_START=09:00
BUSINESS_HOURS_END=17:00
TIMEZONE=America/Mexico_City
```

**Importante**:

- `GOOGLE_CALENDAR_ID=primary` usa tu calendario principal
- Para usar un calendario específico, obtén su ID desde Google Calendar

---

## 📅 Paso 4: Obtener Calendar ID (Opcional)

Si quieres usar un calendario específico en lugar del principal:

### 4.1 Desde Google Calendar Web

1. Ve a [Google Calendar](https://calendar.google.com/)
2. En la barra lateral izquierda, busca tu calendario
3. Haz clic en los tres puntos ⋮ junto al nombre del calendario
4. Selecciona **Settings and sharing**
5. Copia el **Calendar ID** de la sección "Integrate calendar"

### 4.2 Actualizar Variable de Entorno

```env
GOOGLE_CALENDAR_ID=tu_calendar_id_especifico@gmail.com
```

---

## 🚀 Paso 5: Testing de la Configuración

### 5.1 Verificar Variables de Entorno

Crea un script de prueba temporal:

```javascript
// test-config.js
console.log(
  'Google Client ID:',
  process.env.GOOGLE_CLIENT_ID ? '✅ Configurado' : '❌ Faltante'
);
console.log(
  'Google Client Secret:',
  process.env.GOOGLE_CLIENT_SECRET ? '✅ Configurado' : '❌ Faltante'
);
console.log('Calendar ID:', process.env.GOOGLE_CALENDAR_ID || 'primary');
console.log('Redirect URI:', process.env.GOOGLE_REDIRECT_URI);
```

### 5.2 Probar Endpoints

1. **Iniciar servidor de desarrollo**:

   ```bash
   pnpm run dev
   ```

2. **Probar disponibilidad**:

   ```bash
   curl "http://localhost:4321/api/calendar/availability?date=2025-02-01"
   ```

3. **Probar modal**:
   - Visita tu sitio web
   - Abre el modal de citas
   - Intenta seleccionar una fecha

---

## 🔒 Paso 6: Configuración de Seguridad

### 6.1 Restricciones de API Key (Opcional)

Para mayor seguridad, puedes crear una API Key con restricciones:

1. Ve a **APIs & Services > Credentials**
2. Crea una **API Key**
3. Haz clic en **RESTRICT KEY**
4. **Application restrictions**: HTTP referrers
5. Añade tus dominios:
   ```
   localhost:4321/*
   tu-dominio.com/*
   ```
6. **API restrictions**: Google Calendar API

### 6.2 OAuth Consent Screen

Para uso en producción:

1. Ve a **APIs & Services > OAuth consent screen**
2. Cambia de **Testing** a **In production**
3. Completa toda la información requerida
4. Solicita verificación si es necesario

---

## 🎯 Paso 7: Despliegue en Producción

### 7.1 Actualizar Variables de Entorno

En tu plataforma de hosting (Railway, Vercel, etc.):

```env
GOOGLE_CLIENT_ID=tu_client_id
GOOGLE_CLIENT_SECRET=tu_client_secret
GOOGLE_CALENDAR_ID=primary
GOOGLE_REDIRECT_URI=https://tu-dominio.com/api/auth/google/callback
APP_URL=https://tu-dominio.com
TIMEZONE=America/Mexico_City
```

### 7.2 Actualizar Credenciales OAuth

1. Ve a Google Cloud Console
2. **APIs & Services > Credentials**
3. Edita tu OAuth 2.0 Client ID
4. Actualiza **Authorized JavaScript origins** y **Authorized redirect URIs** con tu dominio de producción

---

## 🐛 Troubleshooting

### Error: "redirect_uri_mismatch"

**Solución**: Verifica que el `GOOGLE_REDIRECT_URI` en tu `.env` coincida exactamente con el configurado en Google Cloud Console.

### Error: "invalid_client"

**Solución**: Verifica que `GOOGLE_CLIENT_ID` y `GOOGLE_CLIENT_SECRET` sean correctos.

### Error: "access_denied"

**Solución**: El usuario canceló la autorización. Normal en flujo OAuth.

### Error: "calendar_not_found"

**Solución**: Verifica que `GOOGLE_CALENDAR_ID` sea correcto o usa "primary".

### Error: "insufficient_permissions"

**Solución**: Asegúrate de que los scopes incluyan:

- `https://www.googleapis.com/auth/calendar`
- `https://www.googleapis.com/auth/calendar.events`

---

## 📚 Recursos Adicionales

- [Google Calendar API Documentation](https://developers.google.com/calendar)
- [OAuth 2.0 for Web Applications](https://developers.google.com/identity/protocols/oauth2/web-server)
- [Google Calendar API Scopes](https://developers.google.com/calendar/auth)

---

## ✅ Checklist de Configuración

- [ ] Proyecto de Google Cloud creado
- [ ] Google Calendar API habilitada
- [ ] OAuth 2.0 credenciales configuradas
- [ ] Variables de entorno completadas
- [ ] Redirect URIs configuradas correctamente
- [ ] Testing básico realizado
- [ ] Configuración de producción lista

---

_Guía creada por: IA Punto - Desarrollo Digital_  
_Fecha: Enero 2025_  
_Versión: 1.0_
