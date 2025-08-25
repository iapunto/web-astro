# Sistema de Calendar - Documentación Técnica

**Versión:** 1.0  
**Fecha:** Enero 2025  
**Estado:** Activo (Optimización pendiente en Fase 3)

## 🎯 Descripción General

El **Sistema de Calendar** gestiona el agendamiento de citas mediante integración completa con Google Calendar API. Soporta múltiples métodos de autenticación y permite la creación, actualización y gestión de eventos con Google Meet automático.

### Objetivos Principales

1. **Agendamiento automatizado** de citas con clientes
2. **Integración nativa** con Google Calendar
3. **Google Meet automático** para reuniones virtuales
4. **Gestión de invitados** y notificaciones por email
5. **Disponibilidad en tiempo real** para evitar conflictos

## 🏗️ Arquitectura del Sistema

### Componentes Principales

#### 1. PostgresAppointmentManager

**Ubicación:** `src/lib/appointment/postgresAppointmentManager.ts`  
**Responsabilidad:** Gestión principal de citas y disponibilidad

#### 2. OAuth2Service

**Ubicación:** `src/lib/services/oauth2Service.ts`  
**Responsabilidad:** Autenticación OAuth2 con Google Calendar

#### 3. Endpoints API

**Ubicación:** `src/pages/api/calendar/`  
**Cantidad:** 15+ endpoints especializados

#### 4. PostgresAppointmentService

**Ubicación:** `src/lib/database/postgresAppointmentService.ts`  
**Responsabilidad:** Persistencia de citas en PostgreSQL

## 🔐 Métodos de Autenticación

### 1. Service Account (Método Principal)

**Configuración:**

```bash
GOOGLE_SERVICE_ACCOUNT_EMAIL=services-web@ia-punto.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"
GOOGLE_CALENDAR_ID=primary
```

**Ventajas:**

- ✅ No requiere intervención del usuario
- ✅ Ideal para automatización
- ✅ Tokens no expiran

**Limitaciones:**

- ❌ Limitaciones en agregar invitados (requiere Domain-Wide Delegation)
- ❌ Google Meet requiere Google Workspace

### 2. OAuth2 (Método Interactivo)

**Configuración:**

```bash
GOOGLE_CLIENT_ID=tu-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=tu-client-secret
GOOGLE_REDIRECT_URI=https://iapunto.com/api/calendar/auth/callback
```

**Ventajas:**

- ✅ Funcionalidades completas de Calendar
- ✅ Google Meet automático (con Google Workspace)
- ✅ Envío de invitaciones por email

**Limitaciones:**

- ❌ Requiere flujo de autorización inicial
- ❌ Tokens pueden expirar

## 📋 Endpoints API Principales

### Agendamiento Core

```typescript
POST / api / calendar / book; // Service Account
POST / api / calendar / book - oauth2; // OAuth2
POST / api / calendar / update - event; // Actualizar evento
GET / api / calendar / get - event; // Obtener evento específico
```

### Disponibilidad

```typescript
GET / api / calendar / availability; // Horarios disponibles día
GET / api / calendar / monthly - availability; // Vista mensual
POST / api / calendar / sync - events; // Sincronizar eventos
```

### Autenticación OAuth2

```typescript
GET / api / calendar / auth; // Iniciar flujo OAuth2
GET / api / calendar / auth / callback; // Callback autorización
```

### Testing y Debug (15+ endpoints)

```typescript
GET / api / calendar / test - simple; // Test básico
GET / api / calendar / test - complete; // Test completo
GET / api / calendar / test - oauth2; // Test OAuth2
GET / api / calendar / test - staff; // Test equipo
GET / api / calendar / verify - setup; // Verificar configuración
```

## 🔄 Flujo de Agendamiento

### Flujo Service Account

```
Cliente → Form Agendamiento → POST /api/calendar/book → Google Calendar API
                                      ↓
                              PostgreSQL (logging) ← Email Notification
```

### Flujo OAuth2

```
Usuario → OAuth Flow → Tokens → POST /api/calendar/book-oauth2 → Google Calendar
   ↓           ↓                          ↓
Autorización  Callback              Google Meet + Invitaciones
```

## 💾 Estructura de Datos

### Evento de Cita

```typescript
interface AppointmentEvent {
  id: string;
  summary: string; // Título del evento
  start: {
    dateTime: string; // ISO 8601 timestamp
    timeZone: string; // "America/Bogota"
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
  attendees: Attendee[]; // Lista de invitados
  meetLink?: string; // URL de Google Meet
}

interface Attendee {
  email: string;
  displayName?: string;
  responseStatus?: 'needsAction' | 'accepted' | 'declined';
}
```

### Staff Automático

El sistema agrega automáticamente al staff predefinido:

```typescript
const STAFF_MEMBERS = [
  { email: 'equipo@iapunto.com', role: 'Equipo IA Punto' },
  { email: 'soporte@iapunto.com', role: 'Soporte Técnico' },
  { email: 'ventas@iapunto.com', role: 'Consultor Comercial' },
  { email: 'desarrollo@iapunto.com', role: 'Desarrollo' },
];
```

## 🏢 Configuración de Horarios

### Horarios de Negocio

```typescript
const BUSINESS_HOURS = {
  monday: { start: '09:00', end: '17:00' },
  tuesday: { start: '09:00', end: '17:00' },
  wednesday: { start: '09:00', end: '17:00' },
  thursday: { start: '09:00', end: '17:00' },
  friday: { start: '09:00', end: '17:00' },
  saturday: { closed: true },
  sunday: { closed: true },
};
```

### Timezone

```typescript
const TIMEZONE = 'America/Bogota'; // UTC-5
```

### Duración de Citas

```typescript
const DEFAULT_DURATION = 60; // minutos
const AVAILABLE_DURATIONS = [30, 60, 90, 120]; // minutos
```

## 🔧 Configuración y Setup

### Google Cloud Console Setup

1. **Crear proyecto** en Google Cloud Console
2. **Habilitar** Google Calendar API
3. **Crear Service Account** o **OAuth2 credentials**
4. **Configurar scopes** necesarios:
   ```
   https://www.googleapis.com/auth/calendar
   https://www.googleapis.com/auth/calendar.events
   https://www.googleapis.com/auth/calendar.readonly
   ```

### Variables de Entorno

```bash
# Service Account
GOOGLE_SERVICE_ACCOUNT_EMAIL=services-web@ia-punto.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"

# OAuth2 (opcional)
GOOGLE_CLIENT_ID=tu-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=tu-client-secret
GOOGLE_REDIRECT_URI=https://iapunto.com/api/calendar/auth/callback

# Configuración general
GOOGLE_CALENDAR_ID=primary
TIMEZONE=America/Bogota
APP_URL=https://iapunto.com

# Email notifications
SMTP_USER=tu-email@gmail.com
SMTP_PASSWORD=tu-app-password
INTERNAL_NOTIFICATION_EMAIL=admin@iapunto.com
```

### Base de Datos PostgreSQL

```sql
-- Tabla de citas (opcional para logging)
CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  google_event_id VARCHAR(255) UNIQUE NOT NULL,
  client_email VARCHAR(255) NOT NULL,
  client_name VARCHAR(255) NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  status VARCHAR(50) DEFAULT 'confirmed',
  meet_link TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX idx_appointments_start_time ON appointments(start_time);
CREATE INDEX idx_appointments_client_email ON appointments(client_email);
CREATE INDEX idx_appointments_google_event_id ON appointments(google_event_id);
```

## ⚡ Rendimiento y Optimización

### Métricas de Performance

- **Creación de cita:** 2-5 segundos
- **Verificación disponibilidad:** 1-2 segundos
- **Sincronización mensual:** 5-10 segundos
- **OAuth2 flow:** 30-60 segundos (incluye autorización manual)

### Optimizaciones Implementadas

1. **Cache de disponibilidad** (30 min TTL)
2. **Verificación asíncrona** de conflictos
3. **Batch processing** para múltiples invitados
4. **Fallback automático** Service Account ↔ OAuth2

### Límites de Google Calendar API

- **Cuota diaria:** 1,000,000 requests
- **Requests por segundo:** 100 RPS
- **Events por calendario:** Sin límite práctico

## 🚨 Puntos de Dolor Identificados

### 1. Complejidad de Autenticación

- **Dos métodos diferentes** con configuraciones distintas
- **Confusión operacional** sobre cuándo usar cada método
- **Setup complejo** de Google Cloud Console

### 2. Proliferación de Endpoints

- **15+ endpoints de testing** para diferentes escenarios
- **Mantenimiento complejo** de tantos archivos
- **Documentación fragmentada** entre endpoints

### 3. Inconsistencias de Funcionalidad

- **Google Meet:** Funciona con OAuth2, limitado con Service Account
- **Invitaciones por email:** Depende del método de auth
- **Permisos:** Diferentes capacidades según configuración

### 4. Manejo de Errores

- **Errores crípticos** de Google Calendar API
- **Debugging complejo** por múltiples puntos de fallo
- **Recovery manual** en fallos de autorización

## 🔍 Debugging y Troubleshooting

### Verificación de Setup

```bash
# Verificar configuración básica
curl http://localhost:4321/api/calendar/verify-setup

# Test Service Account
curl http://localhost:4321/api/calendar/test-simple

# Test OAuth2 (requiere flujo previo)
curl http://localhost:4321/api/calendar/test-oauth2

# Ver disponibilidad
curl "http://localhost:4321/api/calendar/availability?date=2025-01-28"
```

### Logs y Monitoring

```bash
# Ver logs de Calendar
tail -f logs/calendar.log

# Debug endpoint específico
curl -X POST http://localhost:4321/api/debug/calendar-events
```

### Errores Comunes

#### 1. "403 Forbidden" / "Invalid credentials"

**Causa:** Service Account mal configurado  
**Solución:**

```bash
# Verificar variables de entorno
echo $GOOGLE_SERVICE_ACCOUNT_EMAIL
echo $GOOGLE_PRIVATE_KEY | head -c 50

# Re-generar credenciales en Google Cloud Console
```

#### 2. "Writer access required"

**Causa:** Service Account sin permisos de escritura  
**Solución:** Configurar Domain-Wide Delegation o usar OAuth2

#### 3. "Google Meet not created automatically"

**Causa:** Requiere Google Workspace para Service Account  
**Solución:** Usar OAuth2 o agregar Meet manualmente

#### 4. "Event conflicts detected"

**Causa:** Horario ya ocupado  
**Solución:** Verificar disponibilidad antes de agendar

## 🎯 Optimizaciones Propuestas (Fase 3)

### 1. Consolidación de Endpoints

```
PROPUESTA: 15+ endpoints → 5 endpoints core
/api/calendar/appointments    # CRUD completo
/api/calendar/availability    # Disponibilidad
/api/calendar/auth           # Manejo OAuth2
/api/calendar/sync           # Sincronización
/api/calendar/test           # Testing unificado
```

### 2. Unificación de Autenticación

```
PROPUESTA: Método híbrido inteligente
- Detectar automáticamente el mejor método disponible
- Fallback transparente entre Service Account ↔ OAuth2
- Configuración unificada
```

### 3. Mejora de Performance

- **Cache inteligente** de disponibilidad por usuario
- **Pre-loading** de horarios frecuentes
- **Optimización** de queries a BD

## 📋 Scripts y Herramientas

### Scripts Activos

```bash
# No hay scripts específicos activos para Calendar
# El sistema funciona principalmente via endpoints API
```

### Endpoints de Testing (a consolidar)

```bash
test-simple.ts           → scripts/deprecated/
test-oauth2.ts          → Mantener para desarrollo
test-complete.ts        → Consolidar con test-oauth2.ts
test-staff.ts           → Mantener para verificación equipo
verify-setup.ts         → Mantener como health check
```

## 📚 Referencias Técnicas

### Google Calendar API

- **Documentación:** [Google Calendar API v3](https://developers.google.com/calendar/api/v3/reference)
- **OAuth2 Guide:** [Google OAuth2](https://developers.google.com/identity/protocols/oauth2)
- **Service Accounts:** [Google Service Accounts](https://developers.google.com/identity/protocols/oauth2/service-account)

### Código Fuente Principal

- **PostgresAppointmentManager:** `src/lib/appointment/postgresAppointmentManager.ts`
- **OAuth2Service:** `src/lib/services/oauth2Service.ts`
- **Endpoints:** `src/pages/api/calendar/`
- **DB Service:** `src/lib/database/postgresAppointmentService.ts`

### Configuración

- **Horarios:** Hardcoded en `postgresAppointmentManager.ts`
- **Staff:** Constante en endpoints de agendamiento
- **Timezone:** Variable de entorno `TIMEZONE`

---

_Documentación técnica generada durante Fase 1 - Estabilización_
