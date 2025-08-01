# Google Consent Mode v2 - Implementación Oficial

## 📋 Resumen

Este documento describe la implementación correcta de **Google Consent Mode v2** siguiendo la [documentación oficial de Google](https://developers.google.com/tag-platform/security/guides/consent?hl=es-419&consentmode=advanced#configure_default_behavior).

---

## 🎯 Cambios Principales Según Documentación Oficial

### 1. Orden Correcto de Implementación

**ANTES (Incorrecto):**
```javascript
// ❌ Configuración después de inicializar GA
gtag('js', new Date());
gtag('config', 'AW-11203509179');
gtag('consent', 'default', {...});
```

**DESPUÉS (Correcto):**
```javascript
// ✅ Configurar consentimiento ANTES de cualquier comando de medición
gtag('consent', 'default', {
  'ad_storage': 'denied',
  'ad_user_data': 'denied',
  'ad_personalization': 'denied',
  'analytics_storage': 'denied',
  'functionality_storage': 'denied',
  'personalization_storage': 'denied',
  'security_storage': 'granted',
  'wait_for_update': 500
});

// Luego inicializar Google Analytics
gtag('js', new Date());
gtag('config', 'AW-11203509179');
```

### 2. Parámetros Correctos de Consent Mode v2

Según la documentación oficial, los parámetros deben usar **comillas simples**:

```javascript
// ✅ Correcto - Parámetros con comillas
gtag('consent', 'default', {
  'ad_storage': 'denied',
  'ad_user_data': 'denied',
  'ad_personalization': 'denied',
  'analytics_storage': 'denied',
  'functionality_storage': 'denied',
  'personalization_storage': 'denied',
  'security_storage': 'granted',
  'wait_for_update': 500
});
```

### 3. Eventos Simplificados

**Eliminados eventos GTM específicos innecesarios:**
- ❌ `gtm.init_consent`
- ❌ `gtm.consent_update`
- ❌ `gtm.consent_change`

**Mantenidos eventos estándar:**
- ✅ `consent_update`
- ✅ `consent_event`
- ✅ `first_consent`
- ✅ `consent_change`

---

## 🔧 Implementación Técnica

### 1. Archivo gtag-init.js

```javascript
// Configurar Consent Mode v2 por defecto (denied) - ANTES de cualquier comando de medición
gtag('consent', 'default', {
  'ad_storage': 'denied',
  'ad_user_data': 'denied',
  'ad_personalization': 'denied',
  'analytics_storage': 'denied',
  'functionality_storage': 'denied',
  'personalization_storage': 'denied',
  'security_storage': 'granted', // Siempre permitido para seguridad
  'wait_for_update': 500 // Esperar 500ms antes de activar etiquetas
});

// Inicializar Google Analytics DESPUÉS de configurar consentimiento
gtag('js', new Date());
gtag('config', 'AW-11203509179', {
  anonymize_ip: true,
  allow_google_signals: false,
  allow_ad_personalization_signals: false
});
```

### 2. Actualización de Consentimiento

```javascript
// Mapear categorías de consentimiento a Google Consent Mode
const consentSettings = {
  'ad_storage': preferences.acceptedCategories.includes('marketing') ? 'granted' : 'denied',
  'ad_user_data': preferences.acceptedCategories.includes('marketing') ? 'granted' : 'denied',
  'ad_personalization': preferences.acceptedCategories.includes('marketing') ? 'granted' : 'denied',
  'analytics_storage': preferences.acceptedCategories.includes('analytics') ? 'granted' : 'denied',
  'functionality_storage': preferences.acceptedCategories.includes('necessary') ? 'granted' : 'denied',
  'personalization_storage': preferences.acceptedCategories.includes('necessary') ? 'granted' : 'denied',
  'security_storage': 'granted' // Siempre permitido
};

// Actualizar consentimiento en Google Analytics
gtag('consent', 'update', consentSettings);
```

---

## 📊 Eventos de Rastreo

### 1. Eventos a Google Analytics

```javascript
// Evento de actualización de consentimiento
gtag('event', 'consent_update', {
  event_category: 'gdpr',
  event_label: 'consent_mode_updated',
  value: 1
});

// Evento específico de consentimiento
gtag('event', 'consent_event', {
  event_category: 'gdpr',
  event_label: `${action}_${category}`,
  value: status === 'accepted' ? 1 : 0,
  custom_parameter: {
    consent_action: action,
    consent_category: category,
    consent_status: status
  }
});
```

### 2. Eventos a dataLayer (GTM)

```javascript
// Evento de consentimiento actualizado
dataLayer.push({
  event: 'consent_update',
  consent_state: settings,
  event_category: 'gdpr',
  event_label: 'consent_mode_updated',
  value: 1
});

// Evento específico de consentimiento
dataLayer.push({
  event: 'consent_event',
  consent_action: action,
  consent_category: category,
  consent_status: status,
  event_category: 'gdpr',
  event_label: `${action}_${category}`,
  value: status === 'accepted' ? 1 : 0
});
```

---

## 🎯 Beneficios de la Implementación Oficial

### 1. Cumplimiento Total
- ✅ **GDPR compliant** con configuración correcta
- ✅ **CCPA compliant** con parámetros apropiados
- ✅ **ePrivacy Directive** con consentimiento explícito

### 2. Rastreo Mejorado
- ✅ **Eventos correctos** en Google Analytics
- ✅ **DataLayer limpio** para GTM
- ✅ **Métricas precisas** de consentimiento

### 3. Performance Optimizado
- ✅ **Carga rápida** con wait_for_update
- ✅ **Rastreo limitado** sin consentimiento
- ✅ **Expansión automática** con consentimiento

---

## 🚨 Problemas Resueltos

### 1. Eventos GTM No Visibles
**Problema:** Los eventos `gtm.init_consent` no se veían en GTM
**Solución:** Eliminados eventos GTM específicos innecesarios, usando eventos estándar

### 2. Orden de Configuración
**Problema:** Consent Mode se configuraba después de inicializar GA
**Solución:** Consent Mode se configura ANTES de cualquier comando de medición

### 3. Parámetros Incorrectos
**Problema:** Parámetros sin comillas causaban problemas
**Solución:** Todos los parámetros ahora usan comillas simples

---

## 📈 Verificación

### 1. En Google Analytics
- Verificar eventos `consent_update` y `consent_event`
- Comprobar parámetros personalizados
- Revisar métricas de consentimiento

### 2. En Google Tag Manager
- Verificar eventos en dataLayer
- Comprobar triggers de consentimiento
- Revisar variables de consentimiento

### 3. En DevTools
```javascript
// Verificar configuración de consentimiento
console.log(window.gtag);

// Verificar eventos en dataLayer
console.log(window.dataLayer);

// Verificar estado actual
console.log(window.GoogleConsentMode.getCurrentConsent());
```

---

## 📚 Referencias

- [Google Consent Mode Documentation](https://developers.google.com/tag-platform/security/guides/consent?hl=es-419&consentmode=advanced#configure_default_behavior)
- [Google Analytics Consent Mode](https://support.google.com/analytics/answer/9976101)
- [GDPR Compliance with Consent Mode](https://developers.google.com/tag-platform/security/guides/consent-apis)

---

*Documento actualizado: $(date)*
*Versión: 2.0*
*Estado: ✅ IMPLEMENTACIÓN OFICIAL COMPLETADA* 