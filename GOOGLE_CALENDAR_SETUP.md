# Configuración de Google Calendar API - IA Punto

## 🎯 Guía de Configuración Completa

Esta guía te ayudará a configurar la integración de Google Calendar API para el sistema de citas autónomo de IA Punto.

---

## 📋 Prerequisitos

- Cuenta de Google (Gmail)
- Acceso a Google Cloud Console
- Permisos de administrador en el proyecto
- Servidor de email propio (mail.iapunto.com)

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

## 🔐 Paso 2: Configurar Service Account (Recomendado)

### 2.1 Crear Service Account

1. Ve a **APIs & Services > Credentials**
2. Haz clic en **+ CREATE CREDENTIALS > Service Account**
3. Completa la información:
   - **Service account name**: `iapunto-calendar-service`
   - **Service account ID**: `iapunto-calendar-service`
   - **Description**: `Service account para sistema de citas de IA Punto`

### 2.2 Configurar Permisos

1. Haz clic en **CREATE AND CONTINUE**
2. En **Grant this service account access to project**:
   - Selecciona **Editor** como rol
3. Haz clic en **CONTINUE** y luego **DONE**

### 2.3 Crear y Descargar Clave

1. Haz clic en el Service Account creado
2. Ve a la pestaña **KEYS**
3. Haz clic en **ADD KEY > Create new key**
4. Selecciona **JSON** y haz clic en **CREATE**
5. Descarga el archivo JSON

### 2.4 Configurar Permisos del Calendario

1. Ve a [Google Calendar](https://calendar.google.com/)
2. En la barra lateral, busca tu calendario
3. Haz clic en los tres puntos ⋮ junto al nombre del calendario
4. Selecciona **Settings and sharing**
5. En **Share with specific people**, agrega el email del Service Account
6. Dale permisos de **Make changes to events**

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
GOOGLE_SERVICE_ACCOUNT_EMAIL=tu-service-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_CALENDAR_ID=primary

# Application Configuration
APP_URL=http://localhost:4321
APPOINTMENT_DURATION_MINUTES=60
BUSINESS_HOURS_START=09:00
BUSINESS_HOURS_END=17:00
TIMEZONE=America/Mexico_City

# Email Service Configuration (Servidor propio de IA Punto)
SMTP_USER=hola@iapunto.com
SMTP_PASSWORD=tu_password_del_servidor_iapunto
INTERNAL_NOTIFICATION_EMAIL=hola@iapunto.com
```

**Importante**:

- `GOOGLE_CALENDAR_ID=primary` usa tu calendario principal
- Para usar un calendario específico, obtén su ID desde Google Calendar
- El `GOOGLE_PRIVATE_KEY` debe incluir las comillas y los `\n`

---

## 📧 Paso 4: Configurar Servidor de Email

### 4.1 Configuración del Servidor

El sistema usa el servidor propio de IA Punto:

- **Host**: mail.iapunto.com
- **Puerto**: 587 (TLS)
- **Usuario**: hola@iapunto.com
- **Password**: Configurado en SMTP_PASSWORD

### 4.2 Verificar Configuración

Puedes probar la configuración visitando:

```
http://localhost:4321/api/calendar/test
```

---

## 🚀 Paso 5: Testing de la Configuración

### 5.1 Verificar Variables de Entorno

Crea un script de prueba temporal:

```javascript
// test-config.js
console.log(
  'Service Account Email:',
  process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL ? '✅ Configurado' : '❌ Faltante'
);
console.log(
  'Private Key:',
  process.env.GOOGLE_PRIVATE_KEY ? '✅ Configurado' : '❌ Faltante'
);
console.log('Calendar ID:', process.env.GOOGLE_CALENDAR_ID || 'primary');
console.log('SMTP User:', process.env.SMTP_USER || 'hola@iapunto.com');
console.log(
  'SMTP Password:',
  process.env.SMTP_PASSWORD ? '✅ Configurado' : '❌ Faltante'
);
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

3. **Probar sistema completo**:

   ```bash
   curl "http://localhost:4321/api/calendar/test"
   ```

4. **Probar modal**:
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
GOOGLE_SERVICE_ACCOUNT_EMAIL=tu-service-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_CALENDAR_ID=primary
APP_URL=https://tu-dominio.com
TIMEZONE=America/Mexico_City
SMTP_USER=hola@iapunto.com
SMTP_PASSWORD=tu_password_del_servidor_iapunto
INTERNAL_NOTIFICATION_EMAIL=hola@iapunto.com
```

### 7.2 Verificar Permisos del Calendario

Asegúrate de que el Service Account tenga permisos en el calendario de producción.

---

## 🐛 Troubleshooting

### Error: "Service Account auth failed"

**Solución**: Verifica que el `GOOGLE_SERVICE_ACCOUNT_EMAIL` y `GOOGLE_PRIVATE_KEY` sean correctos.

### Error: "calendar_not_found"

**Solución**: Verifica que `GOOGLE_CALENDAR_ID` sea correcto o usa "primary".

### Error: "insufficient_permissions"

**Solución**: Asegúrate de que el Service Account tenga permisos de **Editor** en el calendario.

### Error: "SMTP connection failed"

**Solución**: Verifica las credenciales del servidor de email:

- Host: mail.iapunto.com
- Puerto: 587
- Usuario: hola@iapunto.com
- Password: Verificar en SMTP_PASSWORD

### Error: "No Google Meet link generated"

**Solución**: Verifica que el calendario tenga habilitada la integración con Google Meet.

---

## 📚 Características del Sistema

### ✅ Funcionalidades Implementadas

- **Agendado automático**: Los clientes pueden agendar citas 24/7
- **Generación automática de Google Meet**: Cada cita incluye enlace de reunión virtual
- **Notificaciones automáticas**: Emails de confirmación con enlaces de Meet
- **Recordatorios automáticos**: 24 horas y 30 minutos antes de la cita
- **Notificaciones internas**: El equipo recibe notificaciones de nuevas citas
- **Validaciones en tiempo real**: Verificación de disponibilidad y datos
- **UX mejorada**: Modal moderno con validaciones y confirmaciones claras
- **Servidor de email propio**: Usando mail.iapunto.com

### 🔧 Endpoints Disponibles

- `GET /api/calendar/availability` - Verificar disponibilidad
- `POST /api/calendar/book` - Agendar cita
- `GET /api/calendar/test` - Probar sistema completo

### 📧 Tipos de Email

1. **Confirmación de cita**: Enviado al cliente con enlace de Meet
2. **Notificación interna**: Enviado al equipo de IA Punto
3. **Recordatorio**: Enviado 24 horas antes de la cita

---

## ✅ Checklist de Configuración

- [ ] Proyecto de Google Cloud creado
- [ ] Google Calendar API habilitada
- [ ] Service Account creado y configurado
- [ ] Clave JSON descargada y configurada
- [ ] Permisos del calendario configurados
- [ ] Variables de entorno completadas
- [ ] Servidor de email configurado
- [ ] Testing básico realizado
- [ ] Configuración de producción lista

---

## 🎉 Resultado Final

Con esta configuración tendrás un sistema completamente autónomo que:

- ✅ Permite a los clientes agendar citas 24/7
- ✅ Genera automáticamente enlaces de Google Meet
- ✅ Envía notificaciones automáticas por email
- ✅ Maneja recordatorios automáticos
- ✅ Notifica al equipo interno
- ✅ Valida disponibilidad en tiempo real
- ✅ Proporciona UX moderna y profesional

---

_Guía creada por: IA Punto - Desarrollo Digital_  
_Fecha: Enero 2025_  
_Versión: 2.0 - Sistema Autónomo_
