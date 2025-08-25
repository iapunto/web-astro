const fs = require('fs');
const path = require('path');

console.log('🔍 Auditando scripts...');

// Función para escanear directorio
function scanDirectory(dirPath) {
  const results = [];
  try {
    const items = fs.readdirSync(dirPath, { withFileTypes: true });
    
    for (const item of items) {
      if (item.isFile() && (item.name.endsWith('.ts') || item.name.endsWith('.js'))) {
        const fullPath = path.join(dirPath, item.name);
        const stats = fs.statSync(fullPath);
        const relativePath = path.relative(process.cwd(), fullPath);
        
        results.push({
          name: path.basename(item.name, path.extname(item.name)),
          path: relativePath.replace(/\\/g, '/'),
          size: stats.size,
          lastModified: stats.mtime,
          directory: path.basename(dirPath)
        });
      } else if (item.isDirectory()) {
        const subResults = scanDirectory(path.join(dirPath, item.name));
        results.push(...subResults);
      }
    }
  } catch (error) {
    console.warn(`⚠️ Error escaneando ${dirPath}:`, error.message);
  }
  
  return results;
}

// Escanear directorios
const scriptsResults = scanDirectory('scripts');
const srcScriptsResults = fs.existsSync('src/scripts') ? scanDirectory('src/scripts') : [];

const allScripts = [...scriptsResults, ...srcScriptsResults];

console.log(`📊 Total scripts encontrados: ${allScripts.length}`);

// Categorizar scripts
const categories = {
  active: [],
  testing: [],
  deprecated: [],
  migration: [],
  setup: [],
  other: []
};

allScripts.forEach(script => {
  if (script.path.includes('/deprecated/')) {
    categories.deprecated.push(script);
  } else if (script.name.startsWith('test-') || script.path.includes('/testing/')) {
    categories.testing.push(script);
  } else if (script.name.includes('migrate') || script.name.includes('fix-') || script.path.includes('/migrations/')) {
    categories.migration.push(script);
  } else if (script.name.includes('setup') || script.name.includes('railway')) {
    categories.setup.push(script);
  } else if (['automated-article-creator', 'article-monitor'].some(active => script.name.includes(active))) {
    categories.active.push(script);
  } else {
    categories.other.push(script);
  }
});

// Mostrar resultados
console.log('\n📋 CATEGORIZACIÓN:');
Object.entries(categories).forEach(([category, scripts]) => {
  console.log(`\n${category.toUpperCase()}: ${scripts.length} scripts`);
  scripts.forEach(script => {
    console.log(`  - ${script.name} (${(script.size/1024).toFixed(1)}KB) - ${script.path}`);
  });
});

// Generar reporte markdown
const markdown = `# Auditoría Rápida de Scripts

**Fecha:** ${new Date().toLocaleString()}

## Resumen

- **Total de scripts:** ${allScripts.length}
- **Activos:** ${categories.active.length}
- **Testing:** ${categories.testing.length}
- **Deprecados:** ${categories.deprecated.length}
- **Migración:** ${categories.migration.length}
- **Setup:** ${categories.setup.length}
- **Otros:** ${categories.other.length}

## Scripts por Categoría

### ✅ Activos (${categories.active.length})
${categories.active.map(s => `- **${s.name}** - \`${s.path}\` (${(s.size/1024).toFixed(1)}KB)`).join('\n')}

### 🧪 Testing (${categories.testing.length})
${categories.testing.map(s => `- **${s.name}** - \`${s.path}\` (${(s.size/1024).toFixed(1)}KB)`).join('\n')}

### 🗂️ Deprecados (${categories.deprecated.length})
${categories.deprecated.map(s => `- **${s.name}** - \`${s.path}\` (${(s.size/1024).toFixed(1)}KB)`).join('\n')}

### 🔄 Migración (${categories.migration.length})
${categories.migration.map(s => `- **${s.name}** - \`${s.path}\` (${(s.size/1024).toFixed(1)}KB)`).join('\n')}

### ⚙️ Setup (${categories.setup.length})
${categories.setup.map(s => `- **${s.name}** - \`${s.path}\` (${(s.size/1024).toFixed(1)}KB)`).join('\n')}

### ❓ Otros (${categories.other.length})
${categories.other.map(s => `- **${s.name}** - \`${s.path}\` (${(s.size/1024).toFixed(1)}KB)`).join('\n')}

## Recomendaciones

### 🗑️ Scripts a Deprecar
${categories.testing.concat(categories.migration).filter(s => {
  const ageInDays = (Date.now() - s.lastModified.getTime()) / (1000 * 60 * 60 * 24);
  return ageInDays > 30;
}).map(s => `- **${s.name}** - No modificado en ${Math.floor((Date.now() - s.lastModified.getTime()) / (1000 * 60 * 60 * 24))} días`).join('\n')}

### ✅ Scripts a Mantener
${categories.active.concat(categories.setup).map(s => `- **${s.name}** - Script crítico del sistema`).join('\n')}

---
*Auditoría generada automáticamente*`;

fs.writeFileSync('QUICK_SCRIPTS_AUDIT.md', markdown);

console.log('\n✅ Auditoría completada');
console.log('📄 Reporte generado: QUICK_SCRIPTS_AUDIT.md');