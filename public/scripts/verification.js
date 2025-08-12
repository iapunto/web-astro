// Script de verificación de tracking
console.log('🔍 Verificación de scripts de tracking iniciada');

// Verificar que dataLayer existe
if (window.dataLayer) {
  console.log('✅ dataLayer está disponible');
  console.log('📊 dataLayer length:', window.dataLayer.length);
} else {
  console.log('❌ dataLayer NO está disponible');
}

// Verificar que gtag existe
if (typeof window.gtag === 'function') {
  console.log('✅ gtag function está disponible');
} else {
  console.log('❌ gtag function NO está disponible');
}

// Verificar scripts en el DOM
const scripts = document.querySelectorAll('script');
console.log('📄 Total de scripts en la página:', scripts.length);

// Buscar scripts específicos
const gtmScripts = Array.from(scripts).filter(script => 
  script.src && script.src.includes('googletagmanager.com')
);
console.log('🔍 Scripts de Google Tag Manager encontrados:', gtmScripts.length);

const gaScripts = Array.from(scripts).filter(script => 
  script.src && script.src.includes('gtag/js')
);
console.log('🔍 Scripts de Google Analytics encontrados:', gaScripts.length);

// Verificar en la pestaña Network
console.log('🌐 Para verificar en Network:');
console.log('   1. Abre DevTools (F12)');
console.log('   2. Ve a pestaña Network');
console.log('   3. Filtra por "googletagmanager"');
console.log('   4. Recarga la página');
console.log('   5. Deberías ver peticiones a googletagmanager.com');

// Función para probar envío de eventos
window.testTracking = function() {
  console.log('🧪 Probando envío de eventos...');
  
  // Probar dataLayer
  if (window.dataLayer) {
    window.dataLayer.push({
      event: 'test_event',
      test_timestamp: new Date().toISOString()
    });
    console.log('✅ Evento enviado a dataLayer');
  }
  
  // Probar gtag
  if (typeof window.gtag === 'function') {
    window.gtag('event', 'test_event', {
      event_category: 'Test',
      event_label: 'Manual Test'
    });
    console.log('✅ Evento enviado con gtag');
  }
};

console.log('🔧 Función de test disponible: window.testTracking()');
