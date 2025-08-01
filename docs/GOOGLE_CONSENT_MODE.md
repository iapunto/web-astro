# Google Consent Mode v2 - IA Punto

## 📋 Resumen

Este documento describe la implementación de **Google Consent Mode v2** en el proyecto web-iapunto para rastrear correctamente el consentimiento de cookies en Google Analytics.

---

## 🎯 ¿Qué es Google Consent Mode v2?

Google Consent Mode v2 es una funcionalidad que permite que Google Analytics funcione de manera limitada incluso sin consentimiento explícito del usuario, y luego se expanda cuando el usuario da su consentimiento.

### Beneficios:

- ✅ **Rastreo limitado** sin consentimiento (anónimo)
- ✅ **Expansión automática** cuando se da consentimiento
- ✅ **Cumplimiento GDPR** completo
- ✅ **Métricas de consentimiento** detalladas
- ✅ **Integración nativa** con Google Analytics

---

## 🚀 Implementación

### 1. Configuración en gtag-init.js

```javascript
// Configurar Consent Mode v2 por defecto (denied)
gtag('consent', 'default', {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'denied',
  functionality_storage: 'denied',
  personalization_storage: 'denied',
  security_storage: 'granted', // Siempre permitido para seguridad
  wait_for_update: 500
});

// Inicializar Google Analytics con configuración básica
gtag('config', 'AW-11203509179', {
  anonymize_ip: true,
  allow_google_signals: false,
  allow_ad_personalization_signals: false
});
```

### 2. Componente GoogleConsentMode.astro

**Archivo:** `src/components/common/GoogleConsentMode.astro`

**Funcionalidades:**
- Configuración automática de Consent Mode
- Escucha de eventos de consentimiento
- Actualización automática de configuración
- Rastreo de eventos de consentimiento

### 3. Mapeo de Categorías

| Categoría Cookie | Google Consent Mode | Descripción |
|------------------|-------------------|-------------|
| `analytics` | `analytics_storage` | Almacenamiento de datos de analytics |
| `marketing` | `ad_storage`, `ad_user_data`, `ad_personalization` | Publicidad y personalización |
| `necessary` | `functionality_storage`, `personalization_storage` | Funcionalidad básica |
| - | `security_storage` | Siempre permitido |

---

## 📊 Eventos de Rastreo

### 1. Eventos Automáticos

```javascript
// Evento de actualización de consentimiento
gtag('event', 'consent_update', {
  event_category: 'gdpr',
  event_label: 'consent_mode_updated',
  value: 1,
  custom_parameter: {
    analytics_storage: 'granted',
    ad_storage: 'denied',
    functionality_storage: 'granted'
  }
});

// Evento específico de consentimiento
gtag('event', 'consent_event', {
  event_category: 'gdpr',
  event_label: 'analytics_enabled',
  value: 1,
  custom_parameter: {
    consent_action: 'enable',
    consent_category: 'analytics',
    consent_status: 'accepted'
  }
});
```

### 2. Métricas Disponibles

**En Google Analytics:**
- Tasa de aceptación por categoría
- Tiempo hasta primer consentimiento
- Cambios en preferencias
- Revocaciones de consentimiento
- Eventos de consentimiento específicos

---

## 🔧 Configuración Técnica

### 1. Estados de Consentimiento

```javascript
// Estado por defecto (sin consentimiento)
{
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'denied',
  functionality_storage: 'denied',
  personalization_storage: 'denied',
  security_storage: 'granted'
}

// Estado con consentimiento completo
{
  ad_storage: 'granted',
  ad_user_data: 'granted',
  ad_personalization: 'granted',
  analytics_storage: 'granted',
  functionality_storage: 'granted',
  personalization_storage: 'granted',
  security_storage: 'granted'
}
```

### 2. Integración con CookieConsent

```javascript
// Mapeo automático de categorías
const consentSettings = {
  ad_storage: preferences.acceptedCategories.includes('marketing') ? 'granted' : 'denied',
  ad_user_data: preferences.acceptedCategories.includes('marketing') ? 'granted' : 'denied',
  ad_personalization: preferences.acceptedCategories.includes('marketing') ? 'granted' : 'denied',
  analytics_storage: preferences.acceptedCategories.includes('analytics') ? 'granted' : 'denied',
  functionality_storage: preferences.acceptedCategories.includes('necessary') ? 'granted' : 'denied',
  personalization_storage: preferences.acceptedCategories.includes('necessary') ? 'granted' : 'denied',
  security_storage: 'granted'
};
```

---

## 📈 Métricas y Reportes

### 1. Reportes en Google Analytics

**Eventos de Consentimiento:**
- `consent_update` - Actualización de consentimiento
- `consent_event` - Eventos específicos de consentimiento

**Dimensiones Personalizadas:**
- `consent_action` - Acción realizada
- `consent_category` - Categoría afectada
- `consent_status` - Estado del consentimiento

### 2. Métricas Clave

- **Tasa de Aceptación:** Porcentaje de usuarios que aceptan cada categoría
- **Tiempo de Decisión:** Tiempo desde la carga hasta el consentimiento
- **Cambios de Preferencias:** Frecuencia de cambios en preferencias
- **Revocaciones:** Número de revocaciones de consentimiento

---

## 🎨 Personalización

### 1. Configuración Avanzada

```javascript
// Configuración personalizada de Consent Mode
gtag('consent', 'default', {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'denied',
  functionality_storage: 'denied',
  personalization_storage: 'denied',
  security_storage: 'granted',
  wait_for_update: 500, // Esperar 500ms antes de actualizar
  region: ['ES', 'EU'] // Regiones específicas
});
```

### 2. Eventos Personalizados

```javascript
// Evento personalizado de consentimiento
window.GoogleConsentMode.trackConsentEvent('custom_action', 'analytics', 'accepted');

// Obtener estado actual
const currentConsent = window.GoogleConsentMode.getCurrentConsent();
```

---

## 🚨 Troubleshooting

### 1. Problemas Comunes

**Consent Mode no se actualiza:**
- Verificar que `window.gtag` esté disponible
- Comprobar que `CookieConsent` esté inicializado
- Revisar la consola para errores

**Eventos no se envían:**
- Verificar que analytics esté habilitado
- Comprobar configuración de Consent Mode
- Revisar red en DevTools

### 2. Debugging

```javascript
// Verificar estado de Consent Mode
console.log(window.GoogleConsentMode.getCurrentConsent());

// Verificar configuración de gtag
console.log(window.gtag);

// Forzar actualización de consentimiento
window.GoogleConsentMode.updateConsentMode();
```

---

## 📚 Recursos

- [Google Consent Mode Documentation](https://developers.google.com/tag-platform/security/guides/consent)
- [Google Analytics Consent Mode](https://support.google.com/analytics/answer/9976101)
- [GDPR Compliance with Consent Mode](https://developers.google.com/tag-platform/security/guides/consent-apis)

---

## ✅ Checklist de Implementación

- [x] **Configuración** de Consent Mode v2 en gtag-init.js
- [x] **Componente GoogleConsentMode** para gestión avanzada
- [x] **Integración** con CookieConsent
- [x] **Eventos de rastreo** de consentimiento
- [x] **Mapeo automático** de categorías
- [x] **Documentación** completa
- [x] **Testing** básico

---

*Documento actualizado: $(date)*
*Versión: 1.0*
*Estado: ✅ COMPLETADO* 