// Meta Pixel Debug Script
// Script para diagnosticar problemas con Meta Pixel

console.log('🔍 Meta Pixel Debug Script iniciado');

// Función para verificar el estado del Meta Pixel
function checkMetaPixelStatus() {
  console.log('=== META PIXEL DIAGNOSTIC ===');

  // Verificar si fbq está disponible
  if (typeof fbq === 'function') {
    console.log('✅ fbq function está disponible');

    // Verificar si fbq está inicializado
    if (typeof fbq._fbq !== 'undefined') {
      console.log('✅ fbq está inicializado');
      console.log('📊 fbq version:', fbq.version);
      console.log('📊 fbq loaded:', fbq.loaded);
    } else {
      console.log('❌ fbq no está inicializado correctamente');
    }
  } else {
    console.log('❌ fbq function NO está disponible');
  }

  // Verificar si el script de Facebook se cargó
  const facebookScript = document.querySelector(
    'script[src*="connect.facebook.net"]'
  );
  if (facebookScript) {
    console.log('✅ Script de Facebook detectado en DOM');
  } else {
    console.log('❌ Script de Facebook NO encontrado en DOM');
  }

  // Verificar si hay errores en la consola
  console.log('🔍 Revisa la consola para errores de red o JavaScript');

  // Verificar en la pestaña Network
  console.log('🌐 Para verificar en Network:');
  console.log('   1. Abre DevTools (F12)');
  console.log('   2. Ve a pestaña Network');
  console.log('   3. Filtra por "facebook"');
  console.log('   4. Recarga la página');
  console.log('   5. Deberías ver peticiones a connect.facebook.net');
}

// Ejecutar diagnóstico después de que se cargue la página
document.addEventListener('DOMContentLoaded', function () {
  console.log('📄 DOM cargado, ejecutando diagnóstico...');
  setTimeout(checkMetaPixelStatus, 1000); // Esperar 1 segundo
});

// También ejecutar después de un tiempo adicional
setTimeout(checkMetaPixelStatus, 3000);

// Función para probar el tracking manualmente
window.testMetaPixel = function () {
  console.log('🧪 Probando Meta Pixel manualmente...');

  if (typeof fbq === 'function') {
    try {
      // Enviar evento de prueba
      fbq('track', 'Lead', {
        content_name: 'Test Event',
        content_category: 'Test',
        value: 1.0,
        currency: 'COP',
      });
      console.log('✅ Evento de prueba enviado correctamente');
    } catch (error) {
      console.error('❌ Error enviando evento de prueba:', error);
    }
  } else {
    console.log('❌ fbq no está disponible para testing');
  }
};

// Función para verificar el estado en cualquier momento
window.checkMetaPixel = checkMetaPixelStatus;

console.log('🔧 Funciones de debug disponibles:');
console.log('   - window.testMetaPixel() - Probar tracking manualmente');
console.log('   - window.checkMetaPixel() - Verificar estado del Meta Pixel');
