// Google Analytics con Consent Mode v2 - Implementación oficial
window.dataLayer = window.dataLayer || [];
function gtag() {
  dataLayer.push(arguments);
}

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
  // Configuración básica que funciona sin consentimiento
  anonymize_ip: true,
  allow_google_signals: false,
  allow_ad_personalization_signals: false
});

// Función para actualizar consentimiento basado en las preferencias del usuario
function updateGoogleConsentMode() {
  try {
    // Verificar si CookieConsent está disponible
    if (window.CookieConsent && window.CookieConsent.getUserPreferences) {
      const preferences = window.CookieConsent.getUserPreferences();
      
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

      // Log para debugging
      console.log('Google Consent Mode actualizado:', consentSettings);
      
      // Enviar evento de consentimiento actualizado
      gtag('event', 'consent_update', {
        event_category: 'gdpr',
        event_label: 'consent_mode_updated',
        value: 1
      });

      // Enviar evento a dataLayer para GTM
      dataLayer.push({
        event: 'consent_update',
        consent_state: consentSettings,
        event_category: 'gdpr',
        event_label: 'consent_mode_updated',
        value: 1
      });
    }
  } catch (error) {
    console.log('Error actualizando Google Consent Mode:', error);
  }
}

// Función para rastrear eventos de consentimiento específicos
function trackConsentEvent(action, category, status) {
  try {
    // Enviar evento a Google Analytics
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

    // Enviar evento a dataLayer para GTM
    dataLayer.push({
      event: 'consent_event',
      consent_action: action,
      consent_category: category,
      consent_status: status,
      event_category: 'gdpr',
      event_label: `${action}_${category}`,
      value: status === 'accepted' ? 1 : 0
    });
  } catch (error) {
    console.log('Error rastreando evento de consentimiento:', error);
  }
}

// Función para enviar evento de primer consentimiento
function trackFirstConsent(preferences) {
  try {
    dataLayer.push({
      event: 'first_consent',
      consent_preferences: preferences,
      event_category: 'gdpr',
      event_label: 'first_consent',
      value: 1
    });
  } catch (error) {
    console.log('Error rastreando primer consentimiento:', error);
  }
}

// Función para enviar evento de cambio de consentimiento
function trackConsentChange(changedCategories, changedServices) {
  try {
    dataLayer.push({
      event: 'consent_change',
      changed_categories: changedCategories,
      changed_services: changedServices,
      event_category: 'gdpr',
      event_label: 'consent_change',
      value: 1
    });
  } catch (error) {
    console.log('Error rastreando cambio de consentimiento:', error);
  }
}

// Exponer funciones globalmente para uso en GDPRManager
window.updateGoogleConsentMode = updateGoogleConsentMode;
window.trackConsentEvent = trackConsentEvent;
window.trackFirstConsent = trackFirstConsent;
window.trackConsentChange = trackConsentChange;
