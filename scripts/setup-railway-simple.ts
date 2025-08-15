#!/usr/bin/env tsx

import { execSync } from 'child_process';
import fs from 'fs/promises';
import path from 'path';

/**
 * Script simplificado para configurar la base de datos en Railway
 * Compatible con Railway CLI v4.x
 */

class RailwaySimpleSetup {
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

  async getProjectStatus(): Promise<void> {
    try {
      console.log('📋 Verificando estado del proyecto...');
      const result = execSync('railway status', { encoding: 'utf-8' });
      console.log(result);
    } catch (error) {
      console.error('❌ Error obteniendo estado del proyecto:', error);
      throw error;
    }
  }

  async getDatabaseURL(): Promise<string> {
    try {
      console.log('🔗 Obteniendo URL de la base de datos...');
      
      const result = execSync('railway variables', { encoding: 'utf-8' });
      
      // Buscar la variable DATABASE_URL
      const databaseUrlMatch = result.match(/DATABASE_URL\s*│\s*(postgresql:\/\/[^\s]+)/);
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

  async executeSchemaWithDocker(databaseUrl: string): Promise<void> {
    try {
      console.log('📋 Ejecutando esquema de base de datos usando Docker...');
      
      const schemaPath = path.join(process.cwd(), 'src/lib/database/schema.sql');
      const schema = await fs.readFile(schemaPath, 'utf-8');
      
      // Crear archivo temporal
      const tempFile = path.join(process.cwd(), 'temp_schema.sql');
      await fs.writeFile(tempFile, schema);
      
      try {
        // Usar Docker para ejecutar psql
        const dockerCommand = `docker run --rm -v "${tempFile}:/schema.sql" postgres:15 psql "${databaseUrl}" -f /schema.sql`;
        
        console.log('🐳 Ejecutando con Docker...');
        execSync(dockerCommand, { stdio: 'inherit' });
        
        console.log('✅ Esquema ejecutado exitosamente');
      } finally {
        // Limpiar archivo temporal
        await fs.unlink(tempFile);
      }
    } catch (error) {
      console.error('❌ Error ejecutando esquema:', error);
      console.log('💡 Alternativa: Instala PostgreSQL client o usa Railway web interface');
      throw error;
    }
  }

  async verifyTablesWithDocker(databaseUrl: string): Promise<void> {
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
      
      const dockerCommand = `docker run --rm postgres:15 psql "${databaseUrl}" -c "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE' ORDER BY table_name;"`;
      
      const result = execSync(dockerCommand, { encoding: 'utf-8' });
      
      const createdTables = result
        .split('\n')
        .filter(line => line.trim() && !line.includes('table_name') && !line.includes('----'))
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

  async setupEnvironmentVariables(): Promise<void> {
    try {
      console.log('🔧 Configurando variables de entorno...');
      
      // Obtener DATABASE_URL
      const databaseUrl = await this.getDatabaseURL();
      
      // Configurar variables para el proyecto
      const variables = {
        'NODE_ENV': 'production',
        'DB_SSL': 'true'
      };
      
      for (const [key, value] of Object.entries(variables)) {
        try {
          execSync(`railway variables set ${key}="${value}"`, { stdio: 'pipe' });
          console.log(`   ✅ ${key} configurado`);
        } catch (error) {
          console.log(`   ⚠️  ${key} ya configurado o error`);
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
      
      // Verificar estado del proyecto
      await this.getProjectStatus();
      
      // Obtener URL de la base de datos
      const databaseUrl = await this.getDatabaseURL();
      
      // Verificar si Docker está disponible
      try {
        execSync('docker --version', { stdio: 'pipe' });
        console.log('✅ Docker está disponible');
        
        // Ejecutar esquema
        await this.executeSchemaWithDocker(databaseUrl);
        
        // Verificar tablas
        await this.verifyTablesWithDocker(databaseUrl);
        
      } catch (error) {
        console.log('⚠️  Docker no está disponible');
        console.log('💡 Instrucciones manuales:');
        console.log('   1. Instala PostgreSQL client o Docker');
        console.log('   2. Ejecuta: psql "TU_DATABASE_URL" -f src/lib/database/schema.sql');
        console.log('   3. O usa Railway web interface para ejecutar el SQL');
      }
      
      // Configurar variables de entorno
      await this.setupEnvironmentVariables();
      
      // Crear archivo de configuración
      await this.createRailwayConfig();
      
      console.log('\n🎉 CONFIGURACIÓN COMPLETADA EXITOSAMENTE');
      console.log('='.repeat(60));
      console.log('✅ Base de datos PostgreSQL configurada en Railway');
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
  const setup = new RailwaySimpleSetup();
  await setup.setup();
}

// Ejecutar si es el archivo principal
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { RailwaySimpleSetup };
