#!/usr/bin/env tsx

import { execSync } from 'child_process';
import fs from 'fs/promises';
import path from 'path';

/**
 * Script para configurar la base de datos en Railway usando Railway CLI
 * Este script automatiza la creación de la base de datos PostgreSQL en Railway
 */

interface RailwayConfig {
  projectName: string;
  serviceName: string;
  databaseName: string;
  region?: string;
}

class RailwayDatabaseSetup {
  private config: RailwayConfig;

  constructor(config: RailwayConfig) {
    this.config = config;
  }

  async checkRailwayCLI(): Promise<boolean> {
    try {
      execSync('railway --version', { stdio: 'pipe' });
      console.log('✅ Railway CLI está instalado');
      return true;
    } catch (error) {
      console.error('❌ Railway CLI no está instalado');
      console.log('Instálalo con: npm install -g @railway/cli');
      return false;
    }
  }

  async checkLogin(): Promise<boolean> {
    try {
      execSync('railway whoami', { stdio: 'pipe' });
      console.log('✅ Estás logueado en Railway');
      return true;
    } catch (error) {
      console.error('❌ No estás logueado en Railway');
      console.log('Ejecuta: railway login');
      return false;
    }
  }

  async createProject(): Promise<string> {
    try {
      console.log(`🚀 Creando proyecto: ${this.config.projectName}`);
      
      const result = execSync(
        `railway project create --name "${this.config.projectName}"`,
        { encoding: 'utf-8' }
      );
      
      // Extraer el ID del proyecto del output
      const projectIdMatch = result.match(/Project ID: ([a-zA-Z0-9-]+)/);
      if (projectIdMatch) {
        const projectId = projectIdMatch[1];
        console.log(`✅ Proyecto creado con ID: ${projectId}`);
        return projectId;
      }
      
      throw new Error('No se pudo extraer el ID del proyecto');
    } catch (error) {
      console.error('❌ Error creando proyecto:', error);
      throw error;
    }
  }

  async createPostgreSQLService(): Promise<string> {
    try {
      console.log(`🗄️  Creando servicio PostgreSQL: ${this.config.serviceName}`);
      
      const regionFlag = this.config.region ? `--region ${this.config.region}` : '';
      
      const result = execSync(
        `railway service create --name "${this.config.serviceName}" --type postgresql ${regionFlag}`,
        { encoding: 'utf-8' }
      );
      
      // Extraer el ID del servicio del output
      const serviceIdMatch = result.match(/Service ID: ([a-zA-Z0-9-]+)/);
      if (serviceIdMatch) {
        const serviceId = serviceIdMatch[1];
        console.log(`✅ Servicio PostgreSQL creado con ID: ${serviceId}`);
        return serviceId;
      }
      
      throw new Error('No se pudo extraer el ID del servicio');
    } catch (error) {
      console.error('❌ Error creando servicio PostgreSQL:', error);
      throw error;
    }
  }

  async getDatabaseURL(): Promise<string> {
    try {
      console.log('🔗 Obteniendo URL de la base de datos...');
      
      const result = execSync('railway variables', { encoding: 'utf-8' });
      
      // Buscar la variable DATABASE_URL
      const databaseUrlMatch = result.match(/DATABASE_URL=([^\s]+)/);
      if (databaseUrlMatch) {
        const databaseUrl = databaseUrlMatch[1];
        console.log('✅ URL de base de datos obtenida');
        return databaseUrl;
      }
      
      throw new Error('No se encontró DATABASE_URL en las variables');
    } catch (error) {
      console.error('❌ Error obteniendo URL de base de datos:', error);
      throw error;
    }
  }

  async executeSchema(databaseUrl: string): Promise<void> {
    try {
      console.log('📋 Ejecutando esquema de base de datos...');
      
      const schemaPath = path.join(process.cwd(), 'src/lib/database/schema.sql');
      const schema = await fs.readFile(schemaPath, 'utf-8');
      
      // Usar psql a través de Railway
      const tempFile = path.join(process.cwd(), 'temp_schema.sql');
      await fs.writeFile(tempFile, schema);
      
      try {
        execSync(`railway run -- psql "${databaseUrl}" -f temp_schema.sql`, {
          stdio: 'inherit'
        });
        
        console.log('✅ Esquema ejecutado exitosamente');
      } finally {
        // Limpiar archivo temporal
        await fs.unlink(tempFile);
      }
    } catch (error) {
      console.error('❌ Error ejecutando esquema:', error);
      throw error;
    }
  }

  async verifyTables(databaseUrl: string): Promise<void> {
    try {
      console.log('🔍 Verificando tablas creadas...');
      
      const expectedTables = [
        'articles_tracking',
        'gem1_results',
        'article_sections',
        'gem2_results',
        'gem3_results',
        'gem4_results',
        'published_articles',
        'automation_config',
        'topics_queue',
        'daily_stats',
        'system_logs',
        'article_backups'
      ];
      
      const result = execSync(
        `railway run -- psql "${databaseUrl}" -c "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE' ORDER BY table_name;"`,
        { encoding: 'utf-8' }
      );
      
      const createdTables = result
        .split('\n')
        .filter(line => line.trim() && !line.includes('table_name'))
        .map(line => line.trim());
      
      const missingTables = expectedTables.filter(table => !createdTables.includes(table));
      
      if (missingTables.length === 0) {
        console.log('✅ Todas las tablas fueron creadas correctamente');
        console.log(`📊 Tablas creadas: ${createdTables.length}`);
      } else {
        console.error('❌ Faltan las siguientes tablas:', missingTables);
        throw new Error(`Faltan ${missingTables.length} tablas`);
      }
    } catch (error) {
      console.error('❌ Error verificando tablas:', error);
      throw error;
    }
  }

  async verifyData(databaseUrl: string): Promise<void> {
    try {
      console.log('🔍 Verificando datos iniciales...');
      
      const result = execSync(
        `railway run -- psql "${databaseUrl}" -c "SELECT config_key, description FROM automation_config ORDER BY config_key;"`,
        { encoding: 'utf-8' }
      );
      
      console.log('✅ Datos de configuración inicial:');
      const lines = result.split('\n').filter(line => line.trim() && !line.includes('config_key'));
      lines.forEach(line => {
        const [key, ...descParts] = line.split('|');
        const description = descParts.join('|').trim();
        console.log(`   📋 ${key.trim()}: ${description}`);
      });
      
      console.log(`📊 Total de configuraciones: ${lines.length}`);
    } catch (error) {
      console.error('❌ Error verificando datos:', error);
      throw error;
    }
  }

  async setupEnvironmentVariables(): Promise<void> {
    try {
      console.log('🔧 Configurando variables de entorno...');
      
      // Obtener DATABASE_URL
      const databaseUrl = await this.getDatabaseURL();
      
      // Configurar variables para el proyecto
      const variables = {
        'DATABASE_URL': databaseUrl,
        'DB_HOST': 'localhost', // Railway maneja esto internamente
        'DB_PORT': '5432',
        'DB_NAME': this.config.databaseName,
        'DB_USER': 'postgres',
        'DB_PASSWORD': '', // Railway maneja esto internamente
        'DB_SSL': 'true',
        'NODE_ENV': 'production'
      };
      
      for (const [key, value] of Object.entries(variables)) {
        if (value) {
          execSync(`railway variables set ${key}="${value}"`, { stdio: 'pipe' });
          console.log(`   ✅ ${key} configurado`);
        }
      }
      
      console.log('✅ Variables de entorno configuradas');
    } catch (error) {
      console.error('❌ Error configurando variables de entorno:', error);
      throw error;
    }
  }

  async createRailwayConfig(): Promise<void> {
    try {
      console.log('📝 Creando archivo railway.json...');
      
      const railwayConfig = {
        $schema: "https://railway.app/railway.schema.json",
        build: {
          builder: "NIXPACKS"
        },
        deploy: {
          numReplicas: 1,
          restartPolicyType: "ON_FAILURE",
          restartPolicyMaxRetries: 10
        }
      };
      
      await fs.writeFile(
        path.join(process.cwd(), 'railway.json'),
        JSON.stringify(railwayConfig, null, 2)
      );
      
      console.log('✅ Archivo railway.json creado');
    } catch (error) {
      console.error('❌ Error creando railway.json:', error);
      throw error;
    }
    }
    
    async setup(): Promise<void> {
      try {
        console.log('🚀 INICIANDO CONFIGURACIÓN DE BASE DE DATOS EN RAILWAY');
        console.log('='.repeat(60));
        
        // Verificar prerequisitos
        const cliInstalled = await this.checkRailwayCLI();
        if (!cliInstalled) {
          process.exit(1);
        }
        
        const isLoggedIn = await this.checkLogin();
        if (!isLoggedIn) {
          process.exit(1);
        }
        
        // Crear proyecto si no existe
        console.log('📋 Verificando proyecto existente...');
        try {
          execSync('railway project', { stdio: 'pipe' });
          console.log('✅ Proyecto ya existe, usando el actual');
        } catch {
          await this.createProject();
        }
        
        // Crear servicio PostgreSQL si no existe
        console.log('📋 Verificando servicio PostgreSQL...');
        try {
          execSync('railway service', { stdio: 'pipe' });
          console.log('✅ Servicio ya existe, usando el actual');
        } catch {
          await this.createPostgreSQLService();
        }
        
        // Obtener URL de la base de datos
        const databaseUrl = await this.getDatabaseURL();
        
        // Ejecutar esquema
        await this.executeSchema(databaseUrl);
        
        // Verificar tablas
        await this.verifyTables(databaseUrl);
        
        // Verificar datos
        await this.verifyData(databaseUrl);
        
        // Configurar variables de entorno
        await this.setupEnvironmentVariables();
        
        // Crear archivo de configuración
        await this.createRailwayConfig();
        
        console.log('\n🎉 CONFIGURACIÓN COMPLETADA EXITOSAMENTE');
        console.log('='.repeat(60));
        console.log('✅ Base de datos PostgreSQL creada en Railway');
        console.log('✅ Todas las tablas, índices y triggers creados');
        console.log('✅ Datos de configuración inicial insertados');
        console.log('✅ Variables de entorno configuradas');
        console.log('✅ Archivo railway.json creado');
        console.log('\n📋 Próximos pasos:');
        console.log('   1. Ejecutar: railway up');
        console.log('   2. Configurar dominio personalizado (opcional)');
        console.log('   3. Configurar webhooks para automatización');
        
      } catch (error) {
        console.error('\n❌ ERROR EN LA CONFIGURACIÓN');
        console.error('='.repeat(60));
        console.error('Error:', error);
        process.exit(1);
      }
    }
}

// Función principal
async function main() {
  const config: RailwayConfig = {
    projectName: process.env.RAILWAY_PROJECT_NAME || 'iapunto-articles-automation',
    serviceName: process.env.RAILWAY_SERVICE_NAME || 'postgresql',
    databaseName: process.env.RAILWAY_DATABASE_NAME || 'iapunto_articles',
    region: process.env.RAILWAY_REGION || 'us-west1' // Región por defecto
  };
  
  console.log('📋 Configuración de Railway:');
  console.log(`   Proyecto: ${config.projectName}`);
  console.log(`   Servicio: ${config.serviceName}`);
  console.log(`   Base de datos: ${config.databaseName}`);
  console.log(`   Región: ${config.region}`);
  
  const setup = new RailwayDatabaseSetup(config);
  await setup.setup();
}

// Ejecutar si es el archivo principal
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { RailwayDatabaseSetup, type RailwayConfig };
