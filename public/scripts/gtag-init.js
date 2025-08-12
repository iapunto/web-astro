// Google Analytics con Consent Mode v2 - Implementación oficial
// Configurar Consent Mode INMEDIATAMENTE al cargar este script

// Inicializar dataLayer
window.dataLayer = window.dataLayer || [];

// Función gtag que se define antes de cargar el script de Google
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

// Función para inicializar Google Analytics cuando se cargue el script
function initializeGoogleAnalytics() {
  gtag('js', new Date());
  gtag('config', 'AW-11203509179', {
    // Configuración básica que funciona sin consentimiento
    anonymize_ip: true,
    allow_google_signals: false,
    allow_ad_personalization_signals: false
  });
}

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
window.initializeGoogleAnalytics = initializeGoogleAnalytics;

// Funciones de tracking de conversiones para Google Analytics
function trackWhatsAppConversion(action = 'Contact') {
  try {
    // Enviar evento a Google Analytics
    gtag('event', 'conversion', {
      send_to: 'AW-11203509179/lead',
      value: 1.00,
      currency: 'COP',
      transaction_id: 'whatsapp_' + Date.now()
    });

    // Evento personalizado para WhatsApp
    gtag('event', 'whatsapp_click', {
      event_category: 'Contact',
      event_label: 'WhatsApp Contact',
      value: 1,
      custom_parameter: {
        source: 'whatsapp',
        action: action
      }
    });

    // Enviar evento a dataLayer para GTM
    dataLayer.push({
      event: 'whatsapp_click',
      event_category: 'Contact',
      event_label: 'WhatsApp Contact',
      value: 1,
      source: 'whatsapp',
      action: action
    });

    console.log('Google Analytics: WhatsApp conversion tracked');
  } catch (error) {
    console.error('Error tracking WhatsApp conversion:', error);
  }
}

function trackAppointmentConversion(appointmentData = {}) {
  try {
    // Enviar evento de conversión
    gtag('event', 'conversion', {
      send_to: 'AW-11203509179/lead',
      value: 5.00,
      currency: 'COP',
      transaction_id: 'appointment_' + Date.now()
    });

    // Evento personalizado para citas
    gtag('event', 'appointment_booked', {
      event_category: 'Appointment',
      event_label: 'Appointment Booking',
      value: 5,
      custom_parameter: {
        meeting_type: appointmentData.meetingType || 'General',
        source: 'calendar_modal'
      }
    });

    // Enviar evento a dataLayer para GTM
    dataLayer.push({
      event: 'appointment_booked',
      event_category: 'Appointment',
      event_label: 'Appointment Booking',
      value: 5,
      meeting_type: appointmentData.meetingType || 'General',
      source: 'calendar_modal'
    });

    console.log('Google Analytics: Appointment conversion tracked');
  } catch (error) {
    console.error('Error tracking appointment conversion:', error);
  }
}

function trackContactFormConversion(formData = {}) {
  try {
    // Enviar evento de conversión
    gtag('event', 'conversion', {
      send_to: 'AW-11203509179/lead',
      value: 2.00,
      currency: 'COP',
      transaction_id: 'contact_form_' + Date.now()
    });

    // Evento personalizado para formularios
    gtag('event', 'contact_form_submitted', {
      event_category: 'Contact',
      event_label: 'Contact Form Submission',
      value: 2,
      custom_parameter: {
        has_company: !!formData.company,
        has_phone: !!formData.phone,
        source: 'website_form'
      }
    });

    // Enviar evento a dataLayer para GTM
    dataLayer.push({
      event: 'contact_form_submitted',
      event_category: 'Contact',
      event_label: 'Contact Form Submission',
      value: 2,
      has_company: !!formData.company,
      has_phone: !!formData.phone,
      source: 'website_form'
    });

    console.log('Google Analytics: Contact form conversion tracked');
  } catch (error) {
    console.error('Error tracking contact form conversion:', error);
  }
}

function trackEngagement(action, value = 1) {
  try {
    gtag('event', 'engagement', {
      event_category: 'Engagement',
      event_label: action,
      value: value
    });

    dataLayer.push({
      event: 'engagement',
      event_category: 'Engagement',
      event_label: action,
      value: value
    });
  } catch (error) {
    console.error('Error tracking engagement:', error);
  }
}

// Exponer funciones de conversión globalmente
window.trackWhatsAppConversion = trackWhatsAppConversion;
window.trackAppointmentConversion = trackAppointmentConversion;
window.trackContactFormConversion = trackContactFormConversion;
window.trackEngagement = trackEngagement;

// Inicializar Google Analytics cuando se cargue el script de Google
document.addEventListener('DOMContentLoaded', function() {
  // Verificar si el script de Google Analytics ya se cargó
  if (typeof window.gtag === 'function') {
    initializeGoogleAnalytics();
  } else {
    // Esperar a que se cargue el script de Google Analytics
    const checkGtag = setInterval(function() {
      if (typeof window.gtag === 'function') {
        initializeGoogleAnalytics();
        clearInterval(checkGtag);
      }
    }, 100);
  }
});
