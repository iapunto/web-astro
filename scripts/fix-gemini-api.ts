#!/usr/bin/env tsx

import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

console.log('🔧 Configuración de API Key de Gemini');
console.log('='.repeat(50));

console.log('📋 Estado actual:');
console.log(
  `   API Key configurada: ${process.env.GEMINI_API_KEY ? '✅ Sí' : '❌ No'}`
);

if (process.env.GEMINI_API_KEY) {
  console.log(
    `   Longitud de la key: ${process.env.GEMINI_API_KEY.length} caracteres`
  );
  console.log(`   Prefijo: ${process.env.GEMINI_API_KEY.substring(0, 10)}...`);
}

console.log('\n❌ PROBLEMA DETECTADO:');
console.log(
  '   La API key tiene restricciones de referrer que están bloqueando las peticiones.'
);
console.log('   Error: "Requests from referer <empty> are blocked"');

console.log('\n🔧 SOLUCIÓN:');
console.log('   1. Ve a https://makersuite.google.com/app/apikey');
console.log('   2. Encuentra tu API key actual');
console.log('   3. Haz clic en "Edit" (lápiz)');
console.log('   4. En "Application restrictions", selecciona "None"');
console.log('   5. En "API restrictions", selecciona "Don\'t restrict key"');
console.log('   6. Guarda los cambios');

console.log('\n📝 Alternativa (más segura):');
console.log('   1. Crea una nueva API key');
console.log('   2. En "Application restrictions", selecciona "None"');
console.log('   3. En "API restrictions", selecciona "Restrict key"');
console.log('   4. Selecciona solo "Generative Language API"');
console.log('   5. Guarda y copia la nueva key');

console.log('\n🔄 Después de hacer los cambios:');
console.log('   1. Actualiza la variable GEMINI_API_KEY en tu archivo .env');
console.log('   2. Reinicia el servidor: pnpm dev');
console.log('   3. Prueba nuevamente la creación de artículos');

console.log('\n⚠️  NOTA IMPORTANTE:');
console.log(
  '   - Las restricciones de referrer están bloqueando las peticiones desde el servidor'
);
console.log(
  '   - Esto es común cuando la API key se creó con restricciones por defecto'
);
console.log(
  '   - Para desarrollo local, es seguro usar "None" en las restricciones'
);
console.log(
  '   - Para producción, considera usar restricciones más específicas'
);

console.log('\n🎯 Próximos pasos:');
console.log('   1. Configura la API key como se indica arriba');
console.log('   2. Ejecuta: pnpm dashboard:test');
console.log('   3. Prueba crear un artículo desde el dashboard');
