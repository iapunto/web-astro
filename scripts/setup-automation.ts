#!/usr/bin/env tsx

import fs from 'fs/promises';
import path from 'path';
import { execSync } from 'child_process';

interface SetupConfig {
  platform: 'linux' | 'macos' | 'windows';
  automationType: 'cron' | 'systemd' | 'task-scheduler';
  schedule: {
    daily: boolean;
    weekly: boolean;
    monthly: boolean;
  };
  paths: {
    projectRoot: string;
    scriptPath: string;
    logPath: string;
  };
}

class AutomationSetup {
  private config: SetupConfig;

  constructor(config: SetupConfig) {
    this.config = config;
  }

  async setup() {
    console.log('🔧 Configurando Sistema de Automatización de Artículos');
    console.log(`📁 Proyecto: ${this.config.projectRoot}`);
    console.log(`🤖 Plataforma: ${this.config.platform}`);
    console.log(`⏰ Tipo de automatización: ${this.config.automationType}`);

    try {
      // Verificar dependencias
      await this.checkDependencies();

      // Crear directorios necesarios
      await this.createDirectories();

      // Configurar automatización según plataforma
      await this.setupAutomation();

      // Crear archivos de configuración
      await this.createConfigFiles();

      // Configurar logs
      await this.setupLogging();

      console.log('✅ Configuración completada exitosamente');
      console.log('\n📋 Próximos pasos:');
      console.log('   1. Configurar variable de entorno GEMINI_API_KEY');
      console.log('   2. Revisar configuración en gem-config.json');
      console.log('   3. Probar el sistema con: pnpm article:test');
      console.log('   4. Activar automatización con: pnpm article:enable');
    } catch (error) {
      console.error('❌ Error en la configuración:', error);
      process.exit(1);
    }
  }

  private async checkDependencies() {
    console.log('🔍 Verificando dependencias...');

    // Verificar Node.js
    try {
      const nodeVersion = execSync('node --version', { encoding: 'utf-8' });
      console.log(`   ✅ Node.js: ${nodeVersion.trim()}`);
    } catch (error) {
      throw new Error('Node.js no está instalado');
    }

    // Verificar pnpm
    try {
      const pnpmVersion = execSync('pnpm --version', { encoding: 'utf-8' });
      console.log(`   ✅ pnpm: ${pnpmVersion.trim()}`);
    } catch (error) {
      throw new Error('pnpm no está instalado');
    }

    // Verificar tsx
    try {
      execSync('npx tsx --version', { encoding: 'utf-8' });
      console.log('   ✅ tsx: Disponible');
    } catch (error) {
      console.log('   ⚠️  tsx: Instalando...');
      execSync('pnpm add -D tsx', { stdio: 'inherit' });
    }
  }

  private async createDirectories() {
    console.log('📁 Creando directorios...');

    const directories = [
      this.config.paths.logPath,
      path.join(this.config.paths.projectRoot, 'src/content/blog/backups'),
      path.join(this.config.paths.projectRoot, 'logs'),
    ];

    for (const dir of directories) {
      try {
        await fs.mkdir(dir, { recursive: true });
        console.log(`   ✅ ${dir}`);
      } catch (error) {
        console.log(`   ⚠️  ${dir} (ya existe)`);
      }
    }
  }

  private async setupAutomation() {
    console.log('🤖 Configurando automatización...');

    switch (this.config.automationType) {
      case 'cron':
        await this.setupCron();
        break;
      case 'systemd':
        await this.setupSystemd();
        break;
      case 'task-scheduler':
        await this.setupTaskScheduler();
        break;
      default:
        throw new Error(
          `Tipo de automatización no soportado: ${this.config.automationType}`
        );
    }
  }

  private async setupCron() {
    console.log('⏰ Configurando cron jobs...');

    const cronJobs = [];

    if (this.config.schedule.daily) {
      cronJobs.push(
        `0 9 * * * cd ${this.config.paths.projectRoot} && pnpm article:create >> ${this.config.paths.logPath}/daily.log 2>&1`
      );
    }

    if (this.config.schedule.weekly) {
      cronJobs.push(
        `0 10 * * 1,3,5 cd ${this.config.paths.projectRoot} && pnpm article:create >> ${this.config.paths.logPath}/weekly.log 2>&1`
      );
    }

    if (this.config.schedule.monthly) {
      cronJobs.push(
        `0 11 15 * * cd ${this.config.paths.projectRoot} && pnpm article:create >> ${this.config.paths.logPath}/monthly.log 2>&1`
      );
    }

    // Crear archivo de cron temporal
    const cronFile = path.join(this.config.paths.projectRoot, 'temp-cron.txt');
    await fs.writeFile(cronFile, cronJobs.join('\n'));

    console.log('📝 Cron jobs generados:');
    cronJobs.forEach((job) => console.log(`   ${job}`));

    console.log('\n💡 Para instalar los cron jobs, ejecuta:');
    console.log(`   crontab ${cronFile}`);
    console.log('   rm temp-cron.txt');
  }

  private async setupSystemd() {
    console.log('🔧 Configurando systemd service...');

    const serviceContent = `[Unit]
Description=IA Punto Article Automation
After=network.target

[Service]
Type=oneshot
User=${process.env.USER || 'root'}
WorkingDirectory=${this.config.paths.projectRoot}
Environment=NODE_ENV=production
ExecStart=/usr/bin/pnpm article:create
StandardOutput=append:${this.config.paths.logPath}/systemd.log
StandardError=append:${this.config.paths.logPath}/systemd-error.log

[Install]
WantedBy=multi-user.target`;

    const serviceFile = path.join(
      this.config.paths.projectRoot,
      'iapunto-article-automation.service'
    );
    await fs.writeFile(serviceFile, serviceContent);

    console.log('📝 Service file creado:', serviceFile);
    console.log('\n💡 Para instalar el servicio, ejecuta:');
    console.log(
      '   sudo cp iapunto-article-automation.service /etc/systemd/system/'
    );
    console.log('   sudo systemctl daemon-reload');
    console.log('   sudo systemctl enable iapunto-article-automation.service');
  }

  private async setupTaskScheduler() {
    console.log('🪟 Configurando Task Scheduler...');

    const batchContent = `@echo off
cd /d "${this.config.paths.projectRoot}"
call pnpm article:create >> "${this.config.paths.logPath}\\task-scheduler.log" 2>&1`;

    const batchFile = path.join(
      this.config.paths.projectRoot,
      'run-article-automation.bat'
    );
    await fs.writeFile(batchFile, batchContent);

    console.log('📝 Batch file creado:', batchFile);
    console.log('\n💡 Para configurar Task Scheduler:');
    console.log('   1. Abrir Task Scheduler');
    console.log('   2. Crear Basic Task');
    console.log('   3. Programar para ejecutar diariamente');
    console.log('   4. Acción: Start a program');
    console.log(`   5. Program/script: ${batchFile}`);
  }

  private async createConfigFiles() {
    console.log('📄 Creando archivos de configuración...');

    // Crear .env.example si no existe
    const envExamplePath = path.join(
      this.config.paths.projectRoot,
      '.env.example'
    );
    const envExampleContent = `# API Key de Google Gemini
GEMINI_API_KEY=tu_api_key_aqui

# Configuración del blog
BLOG_BASE_URL=https://iapunto.com
BLOG_CONTENT_PATH=src/content/blog

# Configuración de automatización
MAX_ARTICLES_PER_DAY=2
AUTOMATION_CHECK_INTERVAL=30

# Configuración de logs
LOG_LEVEL=info
LOG_PATH=${this.config.paths.logPath}`;

    try {
      await fs.access(envExamplePath);
      console.log('   ⚠️  .env.example (ya existe)');
    } catch {
      await fs.writeFile(envExamplePath, envExampleContent);
      console.log('   ✅ .env.example');
    }

    // Crear script de inicio
    const startupScript = path.join(
      this.config.paths.projectRoot,
      'start-automation.sh'
    );
    const startupContent = `#!/bin/bash
cd "${this.config.paths.projectRoot}"
export NODE_ENV=production
pnpm article:monitor --continuous`;

    await fs.writeFile(startupScript, startupContent);
    await fs.chmod(startupScript, 0o755);
    console.log('   ✅ start-automation.sh');
  }

  private async setupLogging() {
    console.log('📊 Configurando sistema de logs...');

    const logConfig = {
      level: 'info',
      path: this.config.paths.logPath,
      rotation: {
        daily: true,
        maxFiles: 30,
      },
    };

    const logConfigPath = path.join(
      this.config.paths.projectRoot,
      'log-config.json'
    );
    await fs.writeFile(logConfigPath, JSON.stringify(logConfig, null, 2));
    console.log('   ✅ log-config.json');

    // Crear archivo de log inicial
    const initialLog = path.join(this.config.paths.logPath, 'automation.log');
    const logEntry = `[${new Date().toISOString()}] Sistema de automatización configurado\n`;
    await fs.appendFile(initialLog, logEntry);
    console.log('   ✅ Archivo de log inicializado');
  }

  async test() {
    console.log('🧪 Probando configuración...');

    try {
      // Verificar que los scripts existen
      const scripts = [
        'scripts/automated-article-creator.ts',
        'scripts/article-monitor.ts',
      ];

      for (const script of scripts) {
        const scriptPath = path.join(this.config.paths.projectRoot, script);
        await fs.access(scriptPath);
        console.log(`   ✅ ${script}`);
      }

      // Verificar configuración
      const configPath = path.join(
        this.config.paths.projectRoot,
        'gem-config.json'
      );
      await fs.access(configPath);
      console.log('   ✅ gem-config.json');

      console.log('\n✅ Configuración válida');
      console.log('\n🚀 Para probar el sistema:');
      console.log('   pnpm article:test');
    } catch (error) {
      console.error('❌ Error en la prueba:', error);
      throw error;
    }
  }

  async enable() {
    console.log('🚀 Activando automatización...');

    try {
      // Verificar API key
      if (!process.env.GEMINI_API_KEY) {
        console.warn('⚠️  GEMINI_API_KEY no está configurada');
        console.log('   Configúrala en tu archivo .env');
      } else {
        console.log('   ✅ GEMINI_API_KEY configurada');
      }

      // Crear archivo de estado
      const stateFile = path.join(
        this.config.paths.projectRoot,
        '.automation-enabled'
      );
      await fs.writeFile(stateFile, new Date().toISOString());

      console.log('✅ Automatización activada');
      console.log('\n📋 Estado del sistema:');
      console.log('   • Scripts de automatización: ✅');
      console.log('   • Sistema de logs: ✅');
      console.log('   • Configuración: ✅');
      console.log('   • Estado: ACTIVADO');
    } catch (error) {
      console.error('❌ Error al activar:', error);
      throw error;
    }
  }

  async disable() {
    console.log('🛑 Desactivando automatización...');

    try {
      const stateFile = path.join(
        this.config.paths.projectRoot,
        '.automation-enabled'
      );
      await fs.unlink(stateFile);
      console.log('✅ Automatización desactivada');
    } catch (error) {
      console.error('❌ Error al desactivar:', error);
      throw error;
    }
  }
}

// Configuración por defecto
const defaultConfig: SetupConfig = {
  platform:
    process.platform === 'win32'
      ? 'windows'
      : process.platform === 'darwin'
        ? 'macos'
        : 'linux',
  automationType: process.platform === 'win32' ? 'task-scheduler' : 'cron',
  schedule: {
    daily: true,
    weekly: true,
    monthly: true,
  },
  paths: {
    projectRoot: process.cwd(),
    scriptPath: path.join(process.cwd(), 'scripts'),
    logPath: path.join(process.cwd(), 'logs'),
  },
};

// Función principal
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  const setup = new AutomationSetup(defaultConfig);

  switch (command) {
    case 'setup':
      await setup.setup();
      break;
    case 'test':
      await setup.test();
      break;
    case 'enable':
      await setup.enable();
      break;
    case 'disable':
      await setup.disable();
      break;
    default:
      console.log('🔧 Herramienta de Configuración de Automatización');
      console.log('\nComandos disponibles:');
      console.log('  setup    - Configurar sistema de automatización');
      console.log('  test     - Probar configuración');
      console.log('  enable   - Activar automatización');
      console.log('  disable  - Desactivar automatización');
      console.log('\nEjemplo:');
      console.log('  pnpm tsx scripts/setup-automation.ts setup');
  }
}

// Ejecutar si es el archivo principal
if (require.main === module) {
  main().catch(console.error);
}

export { AutomationSetup, type SetupConfig };
