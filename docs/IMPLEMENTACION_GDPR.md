# Implementación GDPR - IA Punto

## 📋 Resumen

Este documento describe la implementación completa del sistema de consentimiento GDPR en el proyecto web-iapunto, utilizando la integración `@jop-software/astro-cookieconsent` con `vanilla-cookieconsent`.

---

## 🚀 Implementación Completada

### 1. Instalación y Configuración

**Paquete instalado:** `@jop-software/astro-cookieconsent`

```bash
pnpm astro add @jop-software/astro-cookieconsent
```

**Dependencias automáticas:**
- `vanilla-cookieconsent@^3.1.0`

### 2. Configuración en astro.config.mjs

```javascript
jopSoftwarecookieconsent({
  // Configuración GDPR completa
  mode: 'opt-in', // GDPR compliant
  autoShow: true,
  hideFromBots: true,
  disablePageInteraction: false,
  revision: 1,
  
  // Configuración de cookies
  cookie: {
    name: 'iapunto_cookie_consent',
    expiresAfterDays: 365,
    sameSite: 'Lax',
    secure: true,
  },

  // Categorías de cookies
  categories: {
    necessary: {
      enabled: true,
      readOnly: true,
    },
    analytics: {
      autoClear: {
        cookies: [
          { name: /^_ga/ },
          { name: '_gid' },
          { name: '_gat' },
        ],
      },
      services: {
        google_analytics: {
          label: 'Google Analytics',
          onAccept: () => console.log('Google Analytics activado'),
          onReject: () => console.log('Google Analytics desactivado'),
        },
        ahrefs_analytics: {
          label: 'Ahrefs Analytics',
          onAccept: () => console.log('Ahrefs Analytics activado'),
          onReject: () => console.log('Ahrefs Analytics desactivado'),
        },
      },
    },
    marketing: {
      services: {
        google_ads: {
          label: 'Google Ads',
          onAccept: () => console.log('Google Ads activado'),
          onReject: () => console.log('Google Ads desactivado'),
        },
      },
    },
  },
})
```

### 3. Traducciones en Español

**Modal de Consentimiento:**
- Título: "Usamos cookies"
- Descripción: "Utilizamos cookies esenciales para el funcionamiento del sitio web y cookies de seguimiento para entender cómo interactúas con él. Estas últimas solo se establecerán después de tu consentimiento."
- Botones: "Aceptar todas", "Rechazar todas", "Gestionar preferencias"

**Modal de Preferencias:**
- Título: "Gestionar preferencias de cookies"
- Categorías detalladas con descripciones
- Tabla de cookies con información específica
- Enlaces a políticas legales

### 4. Scripts de Tracking Condicionales

**Archivo:** `src/components/common/TrackingScripts.astro`

```astro
<!-- Google Analytics - Solo se carga si el usuario acepta analytics -->
<script 
  type="text/plain" 
  data-category="analytics" 
  data-service="google_analytics"
  async 
  src="https://www.googletagmanager.com/gtag/js?id=AW-11203509179">
</script>

<!-- Ahrefs Analytics - Solo se carga si el usuario acepta analytics -->
<script
  type="text/plain"
  data-category="analytics"
  data-service="ahrefs_analytics"
  src="https://analytics.ahrefs.com/analytics.js"
  data-key="a0hA4hkZX8imqqmH+rlnzg"
  async>
</script>
```

### 5. Gestión Avanzada de Consentimiento

**Archivo:** `src/components/common/GDPRManager.astro`

**Características:**
- ✅ **Gestión automática** de scripts basada en consentimiento
- ✅ **Limpieza de cookies** cuando se rechaza una categoría
- ✅ **Eventos de tracking** para cambios de consentimiento
- ✅ **API pública** para gestionar preferencias
- ✅ **Integración con Google Analytics** para eventos de consentimiento

**Métodos disponibles:**
```javascript
// Obtener estado del consentimiento
window.GDPRManager.getConsentStatus()

// Mostrar modal de preferencias
window.GDPRManager.showPreferences()
```

### 6. Interfaz de Usuario

**Banner de Consentimiento:**
- Posición: Bottom center
- Layout: Cloud
- Botones de igual peso
- Enlaces a políticas legales

**Modal de Preferencias:**
- Posición: Right
- Layout: Box
- Categorías detalladas
- Tabla de cookies específicas
- Información de expiración

**Botón de Gestión:**
- Ubicado en el footer
- Acceso directo a preferencias
- Integrado con el diseño existente

---

## 🎯 Categorías de Cookies

### 1. Cookies Necesarias
- **Estado:** Siempre habilitadas (readOnly: true)
- **Propósito:** Funcionamiento básico del sitio
- **Ejemplos:** Sesión, autenticación, seguridad

### 2. Cookies de Analytics
- **Estado:** Opt-in (requiere consentimiento)
- **Propósito:** Análisis de tráfico y comportamiento
- **Servicios:**
  - Google Analytics (AW-11203509179)
  - Ahrefs Analytics
- **Auto-limpieza:** Cookies `_ga`, `_gid`, `_gat`

### 3. Cookies de Marketing
- **Estado:** Opt-in (requiere consentimiento)
- **Propósito:** Publicidad personalizada
- **Servicios:**
  - Google Ads
- **Auto-limpieza:** Cookies de publicidad

---

## 🔧 Funcionalidades Técnicas

### 1. Gestión Automática de Scripts

```javascript
// Los scripts se habilitan/deshabilitan automáticamente
if (cookie.acceptedCategories.includes('analytics')) {
  // Scripts de analytics se cargan automáticamente
  enableAnalytics();
} else {
  // Scripts de analytics se deshabilitan
  disableAnalytics();
}
```

### 2. Limpieza de Cookies

```javascript
// Limpieza automática cuando se rechaza una categoría
clearAnalyticsCookies() {
  const cookiesToClear = ['_ga', '_gid', '_gat', '_ga_*', 'ahrefs_*'];
  cookiesToClear.forEach(cookieName => {
    this.clearCookie(cookieName);
  });
}
```

### 3. Eventos de Tracking

```javascript
// Eventos enviados a Google Analytics (solo si está habilitado)
trackConsentEvent('analytics_enabled', 'accepted');
trackConsentEvent('marketing_disabled', 'rejected');
```

### 4. Integración con CSP

**Archivo:** `src/middleware.ts`

```javascript
// Content Security Policy actualizado para GDPR
"script-src 'self' https://www.googletagmanager.com https://www.google-analytics.com https://connect.facebook.net https://analytics.ahrefs.com https://www.google.com https://www.gstatic.com",
```

---

## 📊 Cumplimiento Legal

### 1. GDPR (Reglamento General de Protección de Datos)
- ✅ **Consentimiento explícito** antes de cargar scripts
- ✅ **Modo opt-in** (no opt-out)
- ✅ **Información clara** sobre el uso de cookies
- ✅ **Derecho de revocación** en cualquier momento
- ✅ **Limpieza automática** de cookies rechazadas

### 2. CCPA (California Consumer Privacy Act)
- ✅ **Información sobre recopilación** de datos
- ✅ **Derecho de exclusión** (opt-out)
- ✅ **Información clara** sobre categorías de datos

### 3. ePrivacy Directive
- ✅ **Consentimiento previo** para cookies no esenciales
- ✅ **Información específica** sobre cada tipo de cookie
- ✅ **Acceso fácil** a preferencias

---

## 🎨 Personalización de la Interfaz

### 1. Colores y Estilos
- Integrado con el diseño existente
- Colores corporativos (#E51F52)
- Responsive design
- Accesibilidad WCAG 2.1

### 2. Posicionamiento
- **Banner:** Bottom center (no intrusivo)
- **Modal:** Right side (fácil acceso)
- **Botón:** Footer (siempre visible)

### 3. Contenido
- Textos en español
- Información específica por servicio
- Enlaces a políticas legales
- Información de expiración

---

## 🔍 Monitoreo y Analytics

### 1. Eventos de Consentimiento
```javascript
// Eventos enviados a Google Analytics
gtag('event', 'consent_update', {
  event_category: 'gdpr',
  event_label: 'analytics_enabled',
  value: 1
});
```

### 2. Métricas de Cumplimiento
- Tasa de aceptación por categoría
- Cambios en preferencias
- Tiempo hasta primer consentimiento
- Revocaciones de consentimiento

### 3. Logs de Auditoría
```javascript
// Logs automáticos en consola
console.log('Primer consentimiento:', cookie);
console.log('Cambio en consentimiento:', changedCategories);
```

---

## 🚨 Troubleshooting

### 1. Problemas Comunes

**Banner no aparece:**
- Verificar `autoShow: true`
- Comprobar que no hay consentimiento previo
- Revisar `hideFromBots: true`

**Scripts no se cargan:**
- Verificar `data-category` y `data-service`
- Comprobar que el consentimiento está dado
- Revisar CSP en middleware

**Cookies no se limpian:**
- Verificar configuración `autoClear`
- Comprobar nombres de cookies
- Revisar dominios y paths

### 2. Debugging

```javascript
// Verificar estado del consentimiento
console.log(window.GDPRManager.getConsentStatus());

// Forzar reset del consentimiento
CookieConsent.reset(true);

// Verificar scripts cargados
document.querySelectorAll('script[data-category]');
```

---

## 📈 Próximos Pasos

### 1. Mejoras Futuras
- **A/B Testing** de diferentes textos del banner
- **Personalización** basada en ubicación geográfica
- **Integración** con más servicios de analytics
- **Analytics** de comportamiento del banner

### 2. Monitoreo Continuo
- **Auditorías regulares** de cumplimiento
- **Actualizaciones** de políticas legales
- **Optimización** de tasas de aceptación
- **Mejoras** de accesibilidad

### 3. Expansión
- **Más servicios** de tracking
- **Categorías adicionales** (funcionalidad, personalización)
- **Integración** con sistemas de gestión de consentimiento
- **API** para gestión programática

---

## 📚 Recursos

- [vanilla-cookieconsent Documentation](https://cookieconsent.orestbida.com/)
- [Astro Cookie Consent Integration](https://github.com/jop-software/astro-cookieconsent)
- [GDPR Compliance Guide](https://gdpr.eu/)
- [Google Consent Mode](https://developers.google.com/tag-platform/security/guides/consent)

---

## ✅ Checklist de Implementación

- [x] **Instalación** de astro-cookieconsent
- [x] **Configuración** en astro.config.mjs
- [x] **Traducciones** en español
- [x] **Scripts condicionales** para tracking
- [x] **GDPRManager** para gestión avanzada
- [x] **Botón de preferencias** en footer
- [x] **Integración** con BaseLayout
- [x] **Limpieza automática** de cookies
- [x] **Eventos de tracking** de consentimiento
- [x] **CSP actualizado** para nuevos scripts
- [x] **Documentación** completa
- [x] **Testing** básico

---

*Documento actualizado: $(date)*
*Versión: 1.0*
*Estado: ✅ COMPLETADO* 