// Meta Pixel Configuration - Facebook/Instagram Tracking
// Configurar Meta Pixel para tracking de conversiones

// Inicializar Meta Pixel
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');

// Configurar Meta Pixel ID (reemplazar con tu ID real)
const META_PIXEL_ID = '1119835639006965'; // Meta Pixel ID de IA Punto

// Inicializar Meta Pixel
fbq('init', META_PIXEL_ID);

// Enviar evento de vista de página
fbq('track', 'PageView');

// Función para rastrear conversiones de WhatsApp
function trackWhatsAppConversion(action = 'Contact') {
  try {
    fbq('track', 'Lead', {
      content_name: 'WhatsApp Contact',
      content_category: 'Contact',
      value: 1.00,
      currency: 'COP',
      content_type: 'contact_form',
      source: 'whatsapp'
    });

    // También enviar evento personalizado
    fbq('trackCustom', 'WhatsAppClick', {
      content_name: 'WhatsApp Contact',
      content_category: 'Contact',
      value: 1.00,
      currency: 'COP'
    });

    console.log('Meta Pixel: WhatsApp conversion tracked');
  } catch (error) {
    console.error('Error tracking WhatsApp conversion:', error);
  }
}

// Función para rastrear agendamiento de citas
function trackAppointmentConversion(appointmentData = {}) {
  try {
    fbq('track', 'Lead', {
      content_name: 'Appointment Booking',
      content_category: 'Appointment',
      value: 5.00, // Valor más alto para citas
      currency: 'COP',
      content_type: 'appointment',
      source: 'calendar_modal',
      meeting_type: appointmentData.meetingType || 'General',
      appointment_date: appointmentData.appointmentDate || null
    });

    // Evento personalizado para citas
    fbq('trackCustom', 'AppointmentBooked', {
      content_name: 'Appointment Booking',
      content_category: 'Appointment',
      value: 5.00,
      currency: 'COP',
      meeting_type: appointmentData.meetingType || 'General'
    });

    console.log('Meta Pixel: Appointment conversion tracked');
  } catch (error) {
    console.error('Error tracking appointment conversion:', error);
  }
}

// Función para rastrear envío de formulario de contacto
function trackContactFormConversion(formData = {}) {
  try {
    fbq('track', 'Lead', {
      content_name: 'Contact Form Submission',
      content_category: 'Contact',
      value: 2.00,
      currency: 'COP',
      content_type: 'contact_form',
      source: 'website_form',
      company: formData.company || null,
      phone: formData.phone ? 'provided' : 'not_provided'
    });

    // Evento personalizado para formularios
    fbq('trackCustom', 'ContactFormSubmitted', {
      content_name: 'Contact Form Submission',
      content_category: 'Contact',
      value: 2.00,
      currency: 'COP',
      has_company: !!formData.company,
      has_phone: !!formData.phone
    });

    console.log('Meta Pixel: Contact form conversion tracked');
  } catch (error) {
    console.error('Error tracking contact form conversion:', error);
  }
}

// Función para rastrear eventos de scroll y engagement
function trackEngagement(action, value = 1) {
  try {
    fbq('trackCustom', 'Engagement', {
      content_name: action,
      content_category: 'Engagement',
      value: value,
      currency: 'COP'
    });
  } catch (error) {
    console.error('Error tracking engagement:', error);
  }
}

// Exponer funciones globalmente
window.trackWhatsAppConversion = trackWhatsAppConversion;
window.trackAppointmentConversion = trackAppointmentConversion;
window.trackContactFormConversion = trackContactFormConversion;
window.trackEngagement = trackEngagement;

// Verificar si Meta Pixel está disponible
window.isMetaPixelAvailable = function() {
  return typeof fbq === 'function';
};

console.log('Meta Pixel initialized');
