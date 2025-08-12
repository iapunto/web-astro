# Guía de Configuración de Google Tag Manager (GTM)

## 🔧 **Problema Identificado**

El sistema actual está configurado para Google Analytics pero no para Google Tag Manager. Necesitamos configurar GTM correctamente.

## 📋 **Pasos para Configurar GTM**

### **1. Crear Cuenta de Google Tag Manager**

1. Ve a [Google Tag Manager](https://tagmanager.google.com/)
2. Crea una nueva cuenta para "IA Punto"
3. Crea un nuevo contenedor para el sitio web
4. Anota el **GTM ID** (formato: `GTM-XXXXXXX`)

### **2. Obtener IDs de Google Analytics**

1. Ve a [Google Analytics](https://analytics.google.com/)
2. Crea una nueva propiedad GA4 para "IA Punto"
3. Anota el **GA4 ID** (formato: `G-XXXXXXXXXX`)

### **3. Configurar Scripts**

Una vez que tengas los IDs, actualiza estos archivos:

#### **A. Actualizar `public/scripts/gtag-init.js`**
```javascript
// Línea 30: Reemplazar G-XXXXXXXXXX con tu GA4 ID real
gtag('config', 'G-XXXXXXXXXX', {
```

#### **B. Actualizar `public/scripts/gtm-init.js`**
```javascript
// Línea 12: GTM ID configurado
gtmScript.src = 'https://www.googletagmanager.com/gtm.js?id=GTM-PJS922TG';

// Línea 85: GTM inicializado automáticamente
initializeGTM(); // GTM se inicializa automáticamente
```

### **4. Configurar GTM en el Sitio Web**

#### **A. Agregar GTM al TrackingScripts.astro**
```astro
<!-- Google Tag Manager -->
<script src="/scripts/gtm-init.js" is:inline></script>
```

#### **B. Agregar GTM noscript al Layout**
En `src/layouts/BaseLayout.astro`, agregado antes del `</body>`:
```html
<!-- Google Tag Manager (noscript) -->
<noscript>
  <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-PJS922TG"
          height="0" width="0" style="display:none;visibility:hidden"></iframe>
</noscript>
<!-- End Google Tag Manager (noscript) -->
```

## 🔍 **Verificación del Sistema**

### **1. Verificar en Consola**
Abre las herramientas de desarrollador (F12) y ejecuta:
```javascript
// Verificar GTM
window.checkGTM()

// Verificar Meta Pixel
window.checkMetaPixel()

// Probar tracking
window.testGTM()
```

### **2. Verificar en GTM**
1. Ve a tu cuenta de GTM
2. Ve a **Preview Mode**
3. Recarga tu sitio web
4. Deberías ver eventos en tiempo real

### **3. Verificar en Google Analytics**
1. Ve a tu cuenta de GA4
2. Ve a **Reports > Realtime**
3. Deberías ver usuarios activos y eventos

## 📊 **Eventos Configurados**

### **Eventos de Conversión**
- `whatsapp_click` - Click en botón de WhatsApp
- `appointment_booked` - Agendamiento de cita
- `contact_form_submitted` - Envío de formulario de contacto
- `engagement` - Eventos de engagement

### **Variables de Evento**
- `event_category` - Categoría del evento
- `event_label` - Etiqueta descriptiva
- `value` - Valor numérico
- `source` - Fuente del evento
- `meeting_type` - Tipo de consulta (solo citas)
- `has_company` - Si incluye empresa (solo formularios)
- `has_phone` - Si incluye teléfono (solo formularios)

## 🚀 **Configuración de Triggers en GTM**

### **1. Trigger para WhatsApp**
- **Tipo**: Custom Event
- **Event Name**: `whatsapp_click`

### **2. Trigger para Citas**
- **Tipo**: Custom Event
- **Event Name**: `appointment_booked`

### **3. Trigger para Formularios**
- **Tipo**: Custom Event
- **Event Name**: `contact_form_submitted`

### **4. Trigger para Engagement**
- **Tipo**: Custom Event
- **Event Name**: `engagement`

## 📈 **Configuración de Tags en GTM**

### **1. Tag para Google Analytics**
- **Tipo**: Google Analytics: GA4 Event
- **Trigger**: Todos los eventos personalizados
- **Event Name**: `{{Event Name}}`
- **Parameters**: Mapear variables del dataLayer

### **2. Tag para Meta Pixel**
- **Tipo**: Facebook Pixel
- **Trigger**: Eventos específicos
- **Event Name**: `Lead`
- **Parameters**: Mapear variables del dataLayer

## 🔧 **Solución de Problemas**

### **Problema**: GTM no se carga
**Solución**: Verificar que el GTM ID esté correcto en `gtm-init.js`

### **Problema**: Eventos no aparecen en GTM
**Solución**: 
1. Verificar que `dataLayer` esté definido
2. Verificar que los eventos se envíen correctamente
3. Usar `window.monitorDataLayer()` para debug

### **Problema**: Eventos no aparecen en GA4
**Solución**:
1. Verificar que el GA4 ID esté correcto
2. Verificar que los tags en GTM estén configurados
3. Verificar que los triggers funcionen

## 📝 **Próximos Pasos**

1. **Obtener los IDs reales** de GTM y GA4
2. **Actualizar los scripts** con los IDs correctos
3. **Configurar GTM** con los triggers y tags
4. **Probar el sistema** completo
5. **Verificar en tiempo real** que todo funcione

## 🎯 **Estado Actual**

- ✅ Meta Pixel configurado y funcionando
- ✅ GTM configurado con ID: GTM-PJS922TG
- ❌ GA4 necesita configuración de ID
- ✅ Scripts de debug disponibles
- ✅ Funciones de tracking implementadas
