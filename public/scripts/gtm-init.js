// Google Tag Manager (GTM) - Inicialización
// Script para cargar GTM y configurar dataLayer

// Inicializar dataLayer para GTM
window.dataLayer = window.dataLayer || [];

// Función para inicializar GTM
function initializeGTM() {
  // Crear script de GTM
  const gtmScript = document.createElement('script');
  gtmScript.async = true;
  gtmScript.src = 'https://www.googletagmanager.com/gtm.js?id=GTM-XXXXXXX'; // Reemplazar con tu GTM ID
  
  // Insertar script en el head
  document.head.appendChild(gtmScript);
  
  console.log('GTM script cargado');
}

// Función para enviar eventos a GTM
function sendGTMEvent(eventName, eventData = {}) {
  try {
    // Enviar evento a dataLayer
    dataLayer.push({
      event: eventName,
      ...eventData
    });
    
    console.log('GTM Event sent:', eventName, eventData);
  } catch (error) {
    console.error('Error sending GTM event:', error);
  }
}

// Función para rastrear conversiones de WhatsApp en GTM
function trackWhatsAppConversionGTM(action = 'Contact') {
  sendGTMEvent('whatsapp_click', {
    event_category: 'Contact',
    event_label: 'WhatsApp Contact',
    value: 1,
    source: 'whatsapp',
    action: action,
    conversion_type: 'lead',
    currency: 'COP'
  });
}

// Función para rastrear agendamiento de citas en GTM
function trackAppointmentConversionGTM(appointmentData = {}) {
  sendGTMEvent('appointment_booked', {
    event_category: 'Appointment',
    event_label: 'Appointment Booking',
    value: 5,
    meeting_type: appointmentData.meetingType || 'General',
    source: 'calendar_modal',
    conversion_type: 'lead',
    currency: 'COP',
    appointment_date: appointmentData.appointmentDate || null
  });
}

// Función para rastrear envío de formulario de contacto en GTM
function trackContactFormConversionGTM(formData = {}) {
  sendGTMEvent('contact_form_submitted', {
    event_category: 'Contact',
    event_label: 'Contact Form Submission',
    value: 2,
    has_company: !!formData.company,
    has_phone: !!formData.phone,
    source: 'website_form',
    conversion_type: 'lead',
    currency: 'COP'
  });
}

// Función para rastrear engagement en GTM
function trackEngagementGTM(action, value = 1) {
  sendGTMEvent('engagement', {
    event_category: 'Engagement',
    event_label: action,
    value: value
  });
}

// Exponer funciones globalmente
window.sendGTMEvent = sendGTMEvent;
window.trackWhatsAppConversionGTM = trackWhatsAppConversionGTM;
window.trackAppointmentConversionGTM = trackAppointmentConversionGTM;
window.trackContactFormConversionGTM = trackContactFormConversionGTM;
window.trackEngagementGTM = trackEngagementGTM;

// Inicializar GTM cuando se cargue la página
document.addEventListener('DOMContentLoaded', function() {
  console.log('GTM initialization script loaded');
  // initializeGTM(); // Descomentar cuando tengas el GTM ID
});

console.log('GTM initialization script ready');
