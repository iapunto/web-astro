const fs = require('fs');
const path = require('path');

console.log('🧹 Moviendo scripts obsoletos a deprecated...');

// Scripts que claramente pueden moverse a deprecated
const scriptsToDeprecate = [
  // Testing antiguos de GEM individual
  'scripts/gem-system/test-gem1-only.ts',
  'scripts/gem-system/test-gem2-only.ts',
  'scripts/gem-system/test-gem3-only.ts',
  'scripts/gem-system/test-gem4-only.ts',
  'scripts/gem-system/test-gem5-only.ts',

  // Testing simples/antiguos
  'scripts/testing/test-simple.ts',
  'scripts/testing/test-api-simple.ts',
  'scripts/testing/test-scraping.js',

  // Fixes específicos de 2025 (ya aplicados)
  'scripts/fixes-2025/fix-trump-article.js',
  'scripts/fixes-2025/fix-marilyn-avatar.ts',
  'scripts/fixes-2025/fix-marilyn-description.ts',
  'scripts/fixes-2025/fix-marilyn-simple.ts',

  // Scripts de migración ya ejecutados
  'src/scripts/migrate-to-strapi.ts',
  'src/scripts/migrate-to-strapi-v2.ts',
  'src/scripts/migrate-with-correct-blocks.ts',
  'src/scripts/migrate-without-content.ts',

  // YAML fixes ya aplicados
  'src/scripts/fix-yaml-complete.ts',
  'src/scripts/fix-yaml-errors.ts',
  'src/scripts/fix-yaml-final.ts',

  // Image processing específicos ya ejecutados
  'scripts/image-processing/extract-real-urls.js',
  'scripts/image-processing/real-urls-mapping.js',
  'scripts/image-processing/scrape-real-images.js',
  'scripts/image-processing/scrape-techcrunch-images.js',

  // Migration 2025 ya ejecutados
  'scripts/migrations-2025/check-and-move-bad-articles.ts',
  'scripts/migrations-2025/move-2025-articles.ts',
  'scripts/migrations-2025/update-article-dates-and-images.ts',
  'scripts/migrations-2025/validate-2025-articles.ts',
  'scripts/migrations-2025/validate-2025-final.ts',
];

// Función para mover archivo
function moveToDeprecated(scriptPath) {
  try {
    if (!fs.existsSync(scriptPath)) {
      console.log(`⚠️ Script no encontrado: ${scriptPath}`);
      return false;
    }

    const fileName = path.basename(scriptPath);
    const destinationPath = path.join('scripts/deprecated', fileName);

    // Verificar que no exista ya en deprecated
    if (fs.existsSync(destinationPath)) {
      console.log(`⚠️ Ya existe en deprecated: ${fileName}`);
      return false;
    }

    // Mover archivo
    fs.renameSync(scriptPath, destinationPath);
    console.log(`✅ Movido: ${scriptPath} → scripts/deprecated/${fileName}`);
    return true;
  } catch (error) {
    console.log(`❌ Error moviendo ${scriptPath}:`, error.message);
    return false;
  }
}

// Mover scripts
let movedCount = 0;
let errorCount = 0;

console.log(`\n📋 Procesando ${scriptsToDeprecate.length} scripts...\n`);

scriptsToDeprecate.forEach((scriptPath) => {
  if (moveToDeprecated(scriptPath)) {
    movedCount++;
  } else {
    errorCount++;
  }
});

console.log(`\n📊 RESUMEN:`);
console.log(`   ✅ Scripts movidos: ${movedCount}`);
console.log(`   ❌ Errores: ${errorCount}`);

// Actualizar README de deprecated
const deprecatedReadme = `# Scripts Deprecados

Este directorio contiene scripts que ya no se utilizan activamente pero se mantienen por referencia histórica.

## Scripts Movidos en Fase 1 - Estabilización

**Fecha:** ${new Date().toLocaleDateString()}

### Testing Scripts Obsoletos
- test-gem1-only.ts - Test individual GEM 1 (reemplazado por test-gem-flow.ts)
- test-gem2-only.ts - Test individual GEM 2 (reemplazado por test-gem-flow.ts)  
- test-gem3-only.ts - Test individual GEM 3 (reemplazado por test-gem-flow.ts)
- test-gem4-only.ts - Test individual GEM 4 (reemplazado por test-gem-flow.ts)
- test-gem5-only.ts - Test individual GEM 5 (reemplazado por test-gem-flow.ts)
- test-simple.ts - Test básico obsoleto
- test-api-simple.ts - Test de API básico
- test-scraping.js - Test de scraping específico

### Fixes Específicos Aplicados
- fix-trump-article.js - Fix específico ya aplicado
- fix-marilyn-avatar.ts - Fix de avatar ya aplicado
- fix-marilyn-description.ts - Fix de descripción ya aplicado  
- fix-marilyn-simple.ts - Fix simple ya aplicado

### Scripts de Migración Ejecutados
- migrate-to-strapi.ts - Migración a Strapi completada
- migrate-to-strapi-v2.ts - Migración v2 completada
- migrate-with-correct-blocks.ts - Migración con bloques completada
- migrate-without-content.ts - Migración sin contenido completada

### Fixes YAML Aplicados
- fix-yaml-complete.ts - Fix YAML completo aplicado
- fix-yaml-errors.ts - Fix errores YAML aplicado
- fix-yaml-final.ts - Fix final YAML aplicado

### Image Processing Ejecutados
- extract-real-urls.js - Extracción URLs completada
- real-urls-mapping.js - Mapeo URLs completado
- scrape-real-images.js - Scraping imágenes completado
- scrape-techcrunch-images.js - Scraping TechCrunch completado

### Migration 2025 Completadas
- check-and-move-bad-articles.ts - Verificación completada
- move-2025-articles.ts - Movimiento artículos completado
- update-article-dates-and-images.ts - Actualización fechas e imágenes completada
- validate-2025-articles.ts - Validación artículos completada
- validate-2025-final.ts - Validación final completada

## Scripts Previamente Deprecados
- assign-unique-covers.js - Asignación covers únicos
- remove-quote-field.js - Remoción campo quote
- restore-covers.js - Restauración covers
- restore-original-covers.js - Restauración covers originales
- restore-quotes.js - Restauración quotes
- setup-cloudinary.ts - Setup Cloudinary inicial
- update-all-remaining-covers.js - Actualización covers restantes
- update-covers-with-real-images.js - Actualización covers con imágenes reales
- update-schema-gem5.ts - Actualización schema GEM 5

---
*Actualizado automáticamente durante Fase 1 - Estabilización*`;

fs.writeFileSync('scripts/deprecated/README.md', deprecatedReadme);
console.log('📄 README.md actualizado en scripts/deprecated/');

console.log(`\n✅ Proceso completado. Scripts obsoletos movidos a deprecated.`);
