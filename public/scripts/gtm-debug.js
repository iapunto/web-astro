// Google Tag Manager Debug Script
// Script para diagnosticar problemas con GTM

console.log('🔍 GTM Debug Script iniciado');

// Función para verificar el estado de GTM
function checkGTMStatus() {
  console.log('=== GTM DIAGNOSTIC ===');
  
  // Verificar si dataLayer está disponible
  if (window.dataLayer && Array.isArray(window.dataLayer)) {
    console.log('✅ dataLayer está disponible');
    console.log('📊 dataLayer length:', window.dataLayer.length);
    console.log('📊 dataLayer content:', window.dataLayer);
  } else {
    console.log('❌ dataLayer NO está disponible o no es un array');
  }
  
  // Verificar si gtag está disponible
  if (typeof gtag === 'function') {
    console.log('✅ gtag function está disponible');
  } else {
    console.log('❌ gtag function NO está disponible');
  }
  
  // Verificar si hay scripts de Google cargados
  const googleScripts = document.querySelectorAll('script[src*="googletagmanager.com"]');
  if (googleScripts.length > 0) {
    console.log('✅ Scripts de Google Tag Manager detectados:', googleScripts.length);
    googleScripts.forEach((script, index) => {
      console.log(`   Script ${index + 1}:`, script.src);
    });
  } else {
    console.log('❌ Scripts de Google Tag Manager NO encontrados');
  }
  
  // Verificar si hay scripts de Google Analytics cargados
  const gaScripts = document.querySelectorAll('script[src*="google-analytics.com"]');
  if (gaScripts.length > 0) {
    console.log('✅ Scripts de Google Analytics detectados:', gaScripts.length);
    gaScripts.forEach((script, index) => {
      console.log(`   Script ${index + 1}:`, script.src);
    });
  } else {
    console.log('❌ Scripts de Google Analytics NO encontrados');
  }
  
  // Verificar funciones de tracking
  const trackingFunctions = [
    'trackWhatsAppConversion',
    'trackAppointmentConversion', 
    'trackContactFormConversion',
    'trackEngagement'
  ];
  
  console.log('🔧 Verificando funciones de tracking:');
  trackingFunctions.forEach(funcName => {
    if (typeof window[funcName] === 'function') {
      console.log(`   ✅ ${funcName} está disponible`);
    } else {
      console.log(`   ❌ ${funcName} NO está disponible`);
    }
  });
}

// Función para probar el tracking manualmente
window.testGTM = function() {
  console.log('🧪 Probando GTM manualmente...');
  
  // Probar envío de evento a dataLayer
  try {
    dataLayer.push({
      event: 'test_event',
      event_category: 'Test',
      event_label: 'Manual Test',
      value: 1,
      test_timestamp: new Date().toISOString()
    });
    console.log('✅ Evento de prueba enviado a dataLayer');
  } catch (error) {
    console.error('❌ Error enviando evento de prueba:', error);
  }
  
  // Probar función de tracking
  if (typeof window.trackWhatsAppConversion === 'function') {
    try {
      window.trackWhatsAppConversion('Test');
      console.log('✅ Función de tracking WhatsApp ejecutada');
    } catch (error) {
      console.error('❌ Error ejecutando tracking WhatsApp:', error);
    }
  }
};

// Función para verificar eventos en tiempo real
window.monitorDataLayer = function() {
  console.log('👀 Monitoreando dataLayer en tiempo real...');
  
  // Interceptar push del dataLayer
  const originalPush = dataLayer.push;
  dataLayer.push = function(...args) {
    console.log('📊 dataLayer.push llamado con:', args);
    return originalPush.apply(this, args);
  };
  
  console.log('✅ Monitoreo activado. Todos los eventos se mostrarán en consola.');
};

// Función para limpiar dataLayer
window.clearDataLayer = function() {
  console.log('🧹 Limpiando dataLayer...');
  dataLayer.length = 0;
  console.log('✅ dataLayer limpiado');
};

// Ejecutar diagnóstico después de que se cargue la página
document.addEventListener('DOMContentLoaded', function() {
  console.log('📄 DOM cargado, ejecutando diagnóstico GTM...');
  setTimeout(checkGTMStatus, 1000); // Esperar 1 segundo
});

// También ejecutar después de un tiempo adicional
setTimeout(checkGTMStatus, 3000);

// Verificar cuando GTM esté listo
window.addEventListener('load', function() {
  console.log('🌐 Página completamente cargada, verificando GTM...');
  setTimeout(checkGTMStatus, 2000);
});

// Función para verificar el estado en cualquier momento
window.checkGTM = checkGTMStatus;

console.log('🔧 Funciones de debug GTM disponibles:');
console.log('   - window.checkGTM() - Verificar estado de GTM');
console.log('   - window.testGTM() - Probar tracking manualmente');
console.log('   - window.monitorDataLayer() - Monitorear eventos en tiempo real');
console.log('   - window.clearDataLayer() - Limpiar dataLayer');
