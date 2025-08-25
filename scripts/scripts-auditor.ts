#!/usr/bin/env tsx
/**
 * Script de Auditoría de Scripts - Fase 1: Estabilización
 *
 * Analiza todos los scripts del proyecto para determinar:
 * - Scripts activos y utilizados regularmente
 * - Scripts obsoletos o redundantes
 * - Dependencias entre scripts
 * - Scripts de testing vs producción
 */

import fs from 'fs/promises';
import path from 'path';

interface ScriptInfo {
  name: string;
  path: string;
  size: number;
  lastModified: Date;
  category: 'active' | 'deprecated' | 'testing' | 'migration' | 'unknown';
  description: string;
  dependencies: string[];
  usedBy: string[];
  recommendedAction: 'keep' | 'deprecate' | 'review' | 'consolidate';
}

class ScriptAuditor {
  private scriptsDir: string;
  private packageJsonPath: string;
  private results: ScriptInfo[] = [];

  constructor() {
    this.scriptsDir = path.join(process.cwd(), 'scripts');
    this.packageJsonPath = path.join(process.cwd(), 'package.json');
  }

  async audit(): Promise<void> {
    console.log('🔍 Iniciando auditoría de scripts...');

    // Analizar package.json para ver scripts referenciados
    const packageJson = await this.loadPackageJson();
    const referencedScripts = this.extractReferencedScripts(packageJson);

    // Escanear directorio de scripts
    await this.scanScriptsDirectory('scripts', referencedScripts);

    // Escanear scripts en src/scripts
    await this.scanScriptsDirectory('src/scripts', referencedScripts);

    // Generar reporte
    await this.generateReport();

    console.log('✅ Auditoría completada');
  }

  private async loadPackageJson(): Promise<any> {
    try {
      const content = await fs.readFile(this.packageJsonPath, 'utf-8');
      return JSON.parse(content);
    } catch (error) {
      console.warn('⚠️ No se pudo cargar package.json');
      return { scripts: {} };
    }
  }

  private extractReferencedScripts(packageJson: any): Set<string> {
    const referenced = new Set<string>();

    if (packageJson.scripts) {
      Object.values(packageJson.scripts).forEach((script: any) => {
        const matches = script.match(/tsx\s+scripts\/([^.\s]+)\.ts/g);
        if (matches) {
          matches.forEach((match: string) => {
            const scriptName = match
              .replace(/tsx\s+scripts\//, '')
              .replace(/\.ts$/, '');
            referenced.add(scriptName);
          });
        }
      });
    }

    return referenced;
  }

  private async scanScriptsDirectory(
    dirPath: string,
    referencedScripts: Set<string>
  ): Promise<void> {
    try {
      const fullPath = path.join(process.cwd(), dirPath);
      const items = await fs.readdir(fullPath, { withFileTypes: true });

      for (const item of items) {
        if (
          item.isFile() &&
          (item.name.endsWith('.ts') || item.name.endsWith('.js'))
        ) {
          await this.analyzeScript(
            path.join(fullPath, item.name),
            referencedScripts
          );
        } else if (item.isDirectory()) {
          await this.scanScriptsDirectory(
            path.join(dirPath, item.name),
            referencedScripts
          );
        }
      }
    } catch (error) {
      console.warn(`⚠️ No se pudo escanear ${dirPath}:`, error);
    }
  }

  private async analyzeScript(
    scriptPath: string,
    referencedScripts: Set<string>
  ): Promise<void> {
    const stats = await fs.stat(scriptPath);
    const content = await fs.readFile(scriptPath, 'utf-8');
    const fileName = path.basename(scriptPath, path.extname(scriptPath));
    const relativePath = path.relative(process.cwd(), scriptPath);

    const scriptInfo: ScriptInfo = {
      name: fileName,
      path: relativePath,
      size: stats.size,
      lastModified: stats.mtime,
      category: this.categorizeScript(fileName, relativePath, content),
      description: this.extractDescription(content),
      dependencies: this.extractDependencies(content),
      usedBy: referencedScripts.has(fileName) ? ['package.json'] : [],
      recommendedAction: 'review',
    };

    // Determinar acción recomendada
    scriptInfo.recommendedAction = this.determineAction(
      scriptInfo,
      referencedScripts
    );

    this.results.push(scriptInfo);
  }

  private categorizeScript(
    fileName: string,
    filePath: string,
    content: string
  ): ScriptInfo['category'] {
    // Scripts ya deprecados
    if (filePath.includes('/deprecated/')) {
      return 'deprecated';
    }

    // Scripts de testing
    if (fileName.startsWith('test-') || filePath.includes('/testing/')) {
      return 'testing';
    }

    // Scripts de migración
    if (
      fileName.includes('migrate') ||
      fileName.includes('fix-') ||
      filePath.includes('/migrations/')
    ) {
      return 'migration';
    }

    // Scripts activos principales
    const activePatterns = [
      'automated-article-creator',
      'article-monitor',
      'setup-automation',
      'railway-database-manager',
    ];

    if (activePatterns.some((pattern) => fileName.includes(pattern))) {
      return 'active';
    }

    return 'unknown';
  }

  private extractDescription(content: string): string {
    // Buscar comentarios de descripción al inicio del archivo
    const lines = content.split('\n').slice(0, 10);
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith('//') || trimmed.startsWith('*')) {
        const desc = trimmed.replace(/^[\/\*\s]+/, '').trim();
        if (
          desc.length > 10 &&
          !desc.startsWith('@') &&
          !desc.startsWith('eslint')
        ) {
          return desc;
        }
      }
    }

    // Buscar función main o exports
    if (content.includes('async function main')) {
      return 'Script con función main';
    }

    if (content.includes('export')) {
      return 'Módulo exportable';
    }

    return 'Sin descripción disponible';
  }

  private extractDependencies(content: string): string[] {
    const deps: string[] = [];

    // Imports externos
    const importMatches = content.match(/import .+ from ['"']([^'"']+)['"']/g);
    if (importMatches) {
      importMatches.forEach((match) => {
        const depMatch = match.match(/from ['"']([^'"']+)['"']/);
        if (depMatch && !depMatch[1].startsWith('.')) {
          deps.push(depMatch[1]);
        }
      });
    }

    // APIs específicas del proyecto
    if (content.includes('GemArticleService')) deps.push('GemArticleService');
    if (content.includes('ArticleTrackingService'))
      deps.push('ArticleTrackingService');
    if (content.includes('GoogleCalendar')) deps.push('GoogleCalendar');
    if (content.includes('Cloudinary')) deps.push('Cloudinary');

    return [...new Set(deps)];
  }

  private determineAction(
    scriptInfo: ScriptInfo,
    referencedScripts: Set<string>
  ): ScriptInfo['recommendedAction'] {
    // Ya está deprecado
    if (scriptInfo.category === 'deprecated') {
      return 'keep'; // Ya está en deprecated, mantener ahí
    }

    // Scripts activos críticos
    if (
      scriptInfo.category === 'active' ||
      referencedScripts.has(scriptInfo.name)
    ) {
      return 'keep';
    }

    // Scripts de testing antiguos
    if (
      scriptInfo.category === 'testing' &&
      scriptInfo.lastModified < new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    ) {
      return 'deprecate';
    }

    // Scripts de migración antiguos
    if (
      scriptInfo.category === 'migration' &&
      scriptInfo.lastModified < new Date(Date.now() - 60 * 24 * 60 * 60 * 1000)
    ) {
      return 'deprecate';
    }

    // Scripts con nombres similares (posible consolidación)
    const similarScripts = this.results.filter(
      (s) =>
        s.name.includes(scriptInfo.name.split('-')[0]) &&
        s.name !== scriptInfo.name
    );
    if (similarScripts.length > 0) {
      return 'consolidate';
    }

    return 'review';
  }

  private async generateReport(): Promise<void> {
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        total: this.results.length,
        active: this.results.filter((s) => s.category === 'active').length,
        deprecated: this.results.filter((s) => s.category === 'deprecated')
          .length,
        testing: this.results.filter((s) => s.category === 'testing').length,
        migration: this.results.filter((s) => s.category === 'migration')
          .length,
        unknown: this.results.filter((s) => s.category === 'unknown').length,
      },
      recommendations: {
        keep: this.results.filter((s) => s.recommendedAction === 'keep').length,
        deprecate: this.results.filter(
          (s) => s.recommendedAction === 'deprecate'
        ).length,
        review: this.results.filter((s) => s.recommendedAction === 'review')
          .length,
        consolidate: this.results.filter(
          (s) => s.recommendedAction === 'consolidate'
        ).length,
      },
      scripts: this.results.sort((a, b) =>
        a.category.localeCompare(b.category)
      ),
    };

    // Guardar reporte JSON
    await fs.writeFile(
      'scripts-audit-report.json',
      JSON.stringify(report, null, 2)
    );

    // Generar reporte markdown
    await this.generateMarkdownReport(report);

    console.log('\n📊 RESUMEN DE AUDITORÍA:');
    console.log(`   📁 Total de scripts: ${report.summary.total}`);
    console.log(`   ✅ Activos: ${report.summary.active}`);
    console.log(`   🗂️ Deprecados: ${report.summary.deprecated}`);
    console.log(`   🧪 Testing: ${report.summary.testing}`);
    console.log(`   🔄 Migración: ${report.summary.migration}`);
    console.log(`   ❓ Desconocidos: ${report.summary.unknown}`);
    console.log('\n💡 RECOMENDACIONES:');
    console.log(`   ✅ Mantener: ${report.recommendations.keep}`);
    console.log(`   🗑️ Deprecar: ${report.recommendations.deprecate}`);
    console.log(`   🔍 Revisar: ${report.recommendations.review}`);
    console.log(`   🔗 Consolidar: ${report.recommendations.consolidate}`);
    console.log('\n📄 Reportes generados:');
    console.log('   - scripts-audit-report.json');
    console.log('   - SCRIPTS_AUDIT_REPORT.md');
  }

  private async generateMarkdownReport(report: any): Promise<void> {
    const markdown = `# Reporte de Auditoría de Scripts

**Fecha:** ${new Date().toLocaleString()}  
**Fase:** 1 - Estabilización  

## 📊 Resumen

| Categoría | Cantidad | Porcentaje |
|-----------|----------|------------|
| **Activos** | ${report.summary.active} | ${((report.summary.active / report.summary.total) * 100).toFixed(1)}% |
| **Deprecados** | ${report.summary.deprecated} | ${((report.summary.deprecated / report.summary.total) * 100).toFixed(1)}% |
| **Testing** | ${report.summary.testing} | ${((report.summary.testing / report.summary.total) * 100).toFixed(1)}% |
| **Migración** | ${report.summary.migration} | ${((report.summary.migration / report.summary.total) * 100).toFixed(1)}% |
| **Desconocidos** | ${report.summary.unknown} | ${((report.summary.unknown / report.summary.total) * 100).toFixed(1)}% |
| **TOTAL** | ${report.summary.total} | 100% |

## 💡 Recomendaciones

| Acción | Cantidad | Scripts |
|--------|----------|---------|
| ✅ **Mantener** | ${report.recommendations.keep} | Scripts activos y críticos |
| 🗑️ **Deprecar** | ${report.recommendations.deprecate} | Scripts obsoletos |
| 🔍 **Revisar** | ${report.recommendations.review} | Requieren análisis manual |
| 🔗 **Consolidar** | ${report.recommendations.consolidate} | Scripts similares |

## 📋 Detalle de Scripts

### ✅ Scripts Activos (Mantener)
${this.results
  .filter((s) => s.category === 'active' || s.recommendedAction === 'keep')
  .map(
    (s) =>
      `- **${s.name}** - ${s.description}\n  - Ruta: \`${s.path}\`\n  - Tamaño: ${(s.size / 1024).toFixed(1)}KB`
  )
  .join('\n\n')}

### 🗑️ Scripts a Deprecar
${this.results
  .filter((s) => s.recommendedAction === 'deprecate')
  .map(
    (s) =>
      `- **${s.name}** - ${s.description}\n  - Ruta: \`${s.path}\`\n  - Última modificación: ${s.lastModified.toLocaleDateString()}`
  )
  .join('\n\n')}

### 🔍 Scripts a Revisar
${this.results
  .filter((s) => s.recommendedAction === 'review')
  .map(
    (s) =>
      `- **${s.name}** - ${s.description}\n  - Ruta: \`${s.path}\`\n  - Categoría: ${s.category}`
  )
  .join('\n\n')}

### 🔗 Scripts a Consolidar
${this.results
  .filter((s) => s.recommendedAction === 'consolidate')
  .map(
    (s) =>
      `- **${s.name}** - ${s.description}\n  - Ruta: \`${s.path}\`\n  - Posible consolidación con scripts similares`
  )
  .join('\n\n')}

## 🎯 Próximos Pasos

1. **Revisar manualmente** los scripts marcados para revisión
2. **Mover a deprecated/** los scripts obsoletos identificados
3. **Consolidar** scripts similares en módulos unificados
4. **Actualizar package.json** para remover referencias a scripts obsoletos
5. **Crear script de limpieza** automatizado

---
*Reporte generado automáticamente por scripts-auditor.ts*`;

    await fs.writeFile('SCRIPTS_AUDIT_REPORT.md', markdown);
  }
}

// Ejecutar auditoría
async function main() {
  const auditor = new ScriptAuditor();
  await auditor.audit();
}

// Ejecutar si es el módulo principal
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { ScriptAuditor };
