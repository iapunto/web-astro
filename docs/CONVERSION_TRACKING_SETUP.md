# Configuración de Tracking de Conversiones

Este documento describe la implementación completa del tracking de conversiones para **Meta Pixel** y **Google Tag Manager** en el sitio web de IA Punto.

## 🎯 Tipos de Conversiones Implementadas

### 1. **Contacto por WhatsApp**
- **Trigger**: Click en botón de WhatsApp
- **Valor**: 1.00 COP
- **Eventos**: `Lead`, `WhatsAppClick`

### 2. **Agendamiento de Cita**
- **Trigger**: Confirmación exitosa de cita
- **Valor**: 5.00 COP
- **Eventos**: `Lead`, `AppointmentBooked`

### 3. **Formulario de Contacto**
- **Trigger**: Envío exitoso del formulario
- **Valor**: 2.00 COP
- **Eventos**: `Lead`, `ContactFormSubmitted`

## 📊 Configuración de Meta Pixel

### 1. Obtener Meta Pixel ID
1. Ve a [Facebook Business Manager](https://business.facebook.com/)
2. Navega a **Events Manager**
3. Crea un nuevo Pixel o usa uno existente
4. Copia el **Pixel ID** (formato: `123456789012345`)

### 2. Configurar el Pixel ID
Edita el archivo `public/scripts/meta-pixel.js`:

```javascript
// Línea 18: Reemplazar con tu Meta Pixel ID real
const META_PIXEL_ID = 'TU_META_PIXEL_ID_AQUI';
```

### 3. Eventos Configurados

#### WhatsApp Click
```javascript
fbq('track', 'Lead', {
  content_name: 'WhatsApp Contact',
  content_category: 'Contact',
  value: 1.00,
  currency: 'COP',
  content_type: 'contact_form',
  source: 'whatsapp'
});
```

#### Appointment Booking
```javascript
fbq('track', 'Lead', {
  content_name: 'Appointment Booking',
  content_category: 'Appointment',
  value: 5.00,
  currency: 'COP',
  content_type: 'appointment',
  source: 'calendar_modal',
  meeting_type: 'General'
});
```

#### Contact Form Submission
```javascript
fbq('track', 'Lead', {
  content_name: 'Contact Form Submission',
  content_category: 'Contact',
  value: 2.00,
  currency: 'COP',
  content_type: 'contact_form',
  source: 'website_form'
});
```

## 🔧 Configuración de Google Tag Manager

### 1. Eventos de DataLayer

Los eventos se envían automáticamente al `dataLayer` para GTM:

#### WhatsApp Click
```javascript
dataLayer.push({
  event: 'whatsapp_click',
  event_category: 'Contact',
  event_label: 'WhatsApp Contact',
  value: 1,
  source: 'whatsapp',
  action: 'Contact'
});
```

#### Appointment Booked
```javascript
dataLayer.push({
  event: 'appointment_booked',
  event_category: 'Appointment',
  event_label: 'Appointment Booking',
  value: 5,
  meeting_type: 'General',
  source: 'calendar_modal'
});
```

#### Contact Form Submitted
```javascript
dataLayer.push({
  event: 'contact_form_submitted',
  event_category: 'Contact',
  event_label: 'Contact Form Submission',
  value: 2,
  has_company: true,
  has_phone: false,
  source: 'website_form'
});
```

### 2. Configuración en GTM

#### Crear Triggers
1. **WhatsApp Click Trigger**
   - Tipo: Custom Event
   - Event name: `whatsapp_click`

2. **Appointment Booked Trigger**
   - Tipo: Custom Event
   - Event name: `appointment_booked`

3. **Contact Form Submitted Trigger**
   - Tipo: Custom Event
   - Event name: `contact_form_submitted`

#### Crear Tags de Conversión
1. **Meta Pixel - Lead**
   - Trigger: WhatsApp Click + Appointment Booked + Contact Form Submitted
   - Tag Type: Facebook Pixel
   - Event: Lead
   - Value: {{Event Value}}
   - Currency: COP

2. **Google Ads - Conversion**
   - Trigger: WhatsApp Click + Appointment Booked + Contact Form Submitted
   - Tag Type: Google Ads Conversion Tracking
   - Conversion ID: Tu Conversion ID
   - Conversion Label: Tu Conversion Label

## 🛠️ Archivos Modificados

### 1. Scripts de Tracking
- `public/scripts/meta-pixel.js` - Configuración de Meta Pixel
- `public/scripts/gtag-init.js` - Funciones de tracking para GA4

### 2. Componentes
- `src/components/layout/WhatsAppButton.astro` - Tracking de clicks de WhatsApp
- `src/components/common/MeetingModal.astro` - Tracking de agendamiento
- `src/components/common/ContactForm.astro` - Tracking de formulario
- `src/components/common/TrackingScripts.astro` - Carga de scripts

### 3. JavaScript
- `public/scripts/meetingmodal.js` - Integración de tracking en modal

## 🔍 Verificación de Implementación

### 1. Verificar Meta Pixel
1. Abre las herramientas de desarrollador (F12)
2. Ve a la pestaña **Network**
3. Filtra por `facebook`
4. Haz click en el botón de WhatsApp
5. Deberías ver una petición a `https://connect.facebook.net/...`

### 2. Verificar Google Analytics
1. Abre las herramientas de desarrollador (F12)
2. Ve a la pestaña **Console**
3. Busca mensajes como:
   - `"Google Analytics: WhatsApp conversion tracked"`
   - `"Google Analytics: Appointment conversion tracked"`
   - `"Google Analytics: Contact form conversion tracked"`

### 3. Verificar DataLayer
1. Abre las herramientas de desarrollador (F12)
2. En la consola, escribe: `dataLayer`
3. Deberías ver los eventos de conversión

## 📈 Configuración de Campañas

### 1. Facebook Ads
- **Objetivo**: Leads
- **Evento de conversión**: Lead
- **Valor**: Dinámico basado en el tipo de conversión

### 2. Google Ads
- **Objetivo**: Leads
- **Evento de conversión**: Personalizado
- **Valor**: Dinámico basado en el tipo de conversión

## 🔒 Consideraciones de Privacidad

### 1. Consent Mode
- Todos los scripts respetan el Consent Mode v2
- Meta Pixel solo se carga si el usuario acepta marketing
- Google Analytics se carga con configuración de privacidad

### 2. GDPR Compliance
- Los eventos se envían solo con consentimiento explícito
- Datos anonimizados cuando sea posible
- Información clara sobre el uso de datos

## 🚀 Próximos Pasos

1. **Configurar Meta Pixel ID** en `meta-pixel.js`
2. **Crear campañas** en Facebook Ads y Google Ads
3. **Configurar conversiones** en las plataformas de publicidad
4. **Monitorear** las conversiones en tiempo real
5. **Optimizar** las campañas basándose en los datos

## 📞 Soporte

Para problemas técnicos o preguntas sobre la implementación:
- Revisar la consola del navegador para errores
- Verificar que los IDs de tracking sean correctos
- Confirmar que el Consent Mode esté funcionando correctamente

---

**Nota**: Asegúrate de reemplazar `YOUR_META_PIXEL_ID` con tu Meta Pixel ID real antes de hacer deploy a producción.
