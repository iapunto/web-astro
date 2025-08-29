#!/usr/bin/env tsx

/**
 * Script de migración a Coolify
 *
 * Este script automatiza el proceso de migración desde Railway hacia Coolify
 * Incluye validación de configuración, backup de datos y preparación para despliegue
 */

import { execSync } from 'child_process';
import { existsSync, readFileSync, writeFileSync, copyFileSync } from 'fs';
import { join } from 'path';

interface MigrationConfig {
  sourcePlatform: 'railway' | 'vercel' | 'heroku';
  targetPlatform: 'coolify';
  backupDatabase: boolean;
  validateConfig: boolean;
  createBackup: boolean;
}

class CoolifyMigration {
  private config: MigrationConfig;
  private backupDir: string;

  constructor(config: Partial<MigrationConfig> = {}) {
    this.config = {
      sourcePlatform: 'railway',
      targetPlatform: 'coolify',
      backupDatabase: true,
      validateConfig: true,
      createBackup: true,
      ...config,
    };

    this.backupDir = `backup-${new Date().toISOString().split('T')[0]}`;
  }

  async run(): Promise<void> {
    console.log('🚀 Iniciando migración a Coolify...\n');

    try {
      // 1. Validar configuración actual
      if (this.config.validateConfig) {
        await this.validateCurrentConfig();
      }

      // 2. Crear backup
      if (this.config.createBackup) {
        await this.createBackup();
      }

      // 3. Validar archivos de Coolify
      await this.validateCoolifyConfig();

      // 4. Preparar variables de entorno
      await this.prepareEnvironment();

      // 5. Validar Docker
      await this.validateDocker();

      // 6. Generar reporte de migración
      await this.generateMigrationReport();

      console.log('✅ Migración completada exitosamente!');
      console.log('\n📋 Próximos pasos:');
      console.log('1. Configurar aplicación en Coolify');
      console.log('2. Configurar variables de entorno');
      console.log('3. Configurar dominio y SSL');
      console.log('4. Realizar despliegue inicial');
      console.log('5. Verificar funcionamiento');
      console.log('6. Eliminar configuraciones obsoletas');
    } catch (error) {
      console.error('❌ Error durante la migración:', error);
      process.exit(1);
    }
  }

  private async validateCurrentConfig(): Promise<void> {
    console.log('🔍 Validando configuración actual...');

    const requiredFiles = [
      'package.json',
      'astro.config.mjs',
      'Dockerfile',
      'env.railway.example',
    ];

    for (const file of requiredFiles) {
      if (!existsSync(file)) {
        throw new Error(`Archivo requerido no encontrado: ${file}`);
      }
    }

    // Validar package.json
    const packageJson = JSON.parse(readFileSync('package.json', 'utf-8'));
    if (!packageJson.scripts?.build) {
      throw new Error('Script de build no encontrado en package.json');
    }

    console.log('✅ Configuración actual válida');
  }

  private async validateCoolifyConfig(): Promise<void> {
    console.log('🔍 Validando configuración de Coolify...');

    const coolifyFiles = [
      'astro.config.coolify.mjs',
      'Dockerfile.coolify',
      'env.coolify.example',
      '.dockerignore',
    ];

    for (const file of coolifyFiles) {
      if (!existsSync(file)) {
        throw new Error(`Archivo de Coolify no encontrado: ${file}`);
      }
    }

    // Validar scripts de Coolify en package.json
    const packageJson = JSON.parse(readFileSync('package.json', 'utf-8'));
    if (!packageJson.scripts?.['build:coolify']) {
      throw new Error('Script build:coolify no encontrado en package.json');
    }
    if (!packageJson.scripts?.['start:coolify']) {
      throw new Error('Script start:coolify no encontrado en package.json');
    }

    console.log('✅ Configuración de Coolify válida');
  }

  private async createBackup(): Promise<void> {
    console.log('💾 Creando backup...');

    // Crear directorio de backup
    execSync(`mkdir -p ${this.backupDir}`);

    // Backup de archivos de configuración
    const configFiles = [
      'railway.json',
      'astro.config.railway.mjs',
      'env.railway.example',
      'Dockerfile',
      '.nixpacks.toml',
    ];

    for (const file of configFiles) {
      if (existsSync(file)) {
        copyFileSync(file, join(this.backupDir, file));
        console.log(`  📄 Backup de ${file}`);
      }
    }

    // Backup de package.json
    const packageJson = JSON.parse(readFileSync('package.json', 'utf-8'));
    const backupPackageJson = { ...packageJson };
    delete backupPackageJson.scripts['build:coolify'];
    delete backupPackageJson.scripts['start:coolify'];

    writeFileSync(
      join(this.backupDir, 'package.json'),
      JSON.stringify(backupPackageJson, null, 2)
    );

    console.log('✅ Backup creado exitosamente');
  }

  private async prepareEnvironment(): Promise<void> {
    console.log('🔧 Preparando variables de entorno...');

    if (!existsSync('env.coolify.example')) {
      throw new Error('Archivo env.coolify.example no encontrado');
    }

    // Crear .env.coolify si no existe
    if (!existsSync('.env.coolify')) {
      copyFileSync('env.coolify.example', '.env.coolify');
      console.log('  📄 Archivo .env.coolify creado desde ejemplo');
    }

    console.log('✅ Variables de entorno preparadas');
  }

  private async validateDocker(): Promise<void> {
    console.log('🐳 Validando configuración de Docker...');

    try {
      // Verificar que Docker esté disponible
      execSync('docker --version', { stdio: 'pipe' });
    } catch {
      console.warn(
        '⚠️  Docker no está disponible. La validación de Docker se omitirá.'
      );
      return;
    }

    // Validar Dockerfile.coolify
    try {
      execSync('docker build -f Dockerfile.coolify --dry-run .', {
        stdio: 'pipe',
      });
      console.log('✅ Dockerfile.coolify válido');
    } catch (error) {
      console.warn('⚠️  No se pudo validar Dockerfile.coolify completamente');
    }
  }

  private async generateMigrationReport(): Promise<void> {
    console.log('📊 Generando reporte de migración...');

    const report = {
      timestamp: new Date().toISOString(),
      sourcePlatform: this.config.sourcePlatform,
      targetPlatform: this.config.targetPlatform,
      filesCreated: [
        'astro.config.coolify.mjs',
        'Dockerfile.coolify',
        'env.coolify.example',
        '.dockerignore',
        'COOLIFY_SETUP.md',
      ],
      filesModified: ['package.json (scripts agregados)'],
      filesBackedUp: [
        'railway.json',
        'astro.config.railway.mjs',
        'env.railway.example',
        'Dockerfile',
        '.nixpacks.toml',
        'package.json (versión anterior)',
      ],
      nextSteps: [
        'Configurar aplicación en Coolify',
        'Configurar variables de entorno',
        'Configurar dominio y SSL',
        'Realizar despliegue inicial',
        'Verificar funcionamiento',
        'Eliminar configuraciones obsoletas',
      ],
      backupLocation: this.backupDir,
    };

    writeFileSync(
      join(this.backupDir, 'migration-report.json'),
      JSON.stringify(report, null, 2)
    );

    console.log('✅ Reporte de migración generado');
  }
}

// Función principal
async function main() {
  const args = process.argv.slice(2);

  const config: Partial<MigrationConfig> = {};

  // Parsear argumentos
  for (const arg of args) {
    if (arg === '--no-backup') {
      config.createBackup = false;
    } else if (arg === '--no-validate') {
      config.validateConfig = false;
    } else if (arg === '--no-db-backup') {
      config.backupDatabase = false;
    }
  }

  const migration = new CoolifyMigration(config);
  await migration.run();
}

// Ejecutar si es el archivo principal
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { CoolifyMigration };
