#!/usr/bin/env tsx

import fs from 'fs/promises';
import path from 'path';
import { Client } from 'pg';

/**
 * Script para configurar la base de datos del sistema de automatización de artículos
 * Este script crea todas las tablas, índices, triggers y datos iniciales necesarios
 */

interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
  ssl?: boolean;
}

class DatabaseSetup {
  private client: Client;
  private config: DatabaseConfig;

  constructor(config: DatabaseConfig) {
    this.config = config;
    this.client = new Client(config);
  }

  async connect() {
    try {
      await this.client.connect();
      console.log('✅ Conectado a la base de datos PostgreSQL');
    } catch (error) {
      console.error('❌ Error conectando a la base de datos:', error);
      throw error;
    }
  }

  async disconnect() {
    try {
      await this.client.end();
      console.log('✅ Desconectado de la base de datos');
    } catch (error) {
      console.error('❌ Error desconectando de la base de datos:', error);
    }
  }

  async readSchemaFile(): Promise<string> {
    try {
      const schemaPath = path.join(
        process.cwd(),
        'src/lib/database/schema.sql'
      );
      const schema = await fs.readFile(schemaPath, 'utf-8');
      return schema;
    } catch (error) {
      console.error('❌ Error leyendo archivo de esquema:', error);
      throw error;
    }
  }

  async executeSchema() {
    try {
      console.log('📋 Leyendo archivo de esquema...');
      const schema = await this.readSchemaFile();

      console.log('🔧 Ejecutando esquema de base de datos...');

      // Dividir el esquema en comandos individuales
      const commands = schema
        .split(';')
        .map((cmd) => cmd.trim())
        .filter((cmd) => cmd.length > 0 && !cmd.startsWith('--'));

      let executedCommands = 0;
      let totalCommands = commands.length;

      for (const command of commands) {
        if (command.trim()) {
          try {
            await this.client.query(command);
            executedCommands++;

            if (executedCommands % 10 === 0) {
              console.log(
                `   Progreso: ${executedCommands}/${totalCommands} comandos ejecutados`
              );
            }
          } catch (error) {
            console.error(`❌ Error ejecutando comando:`, error);
            console.error(
              `Comando problemático:`,
              command.substring(0, 100) + '...'
            );
            throw error;
          }
        }
      }

      console.log(
        `✅ Esquema ejecutado exitosamente: ${executedCommands} comandos`
      );
    } catch (error) {
      console.error('❌ Error ejecutando esquema:', error);
      throw error;
    }
  }

  async verifyTables() {
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
        'article_backups',
      ];

      const { rows } = await this.client.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_type = 'BASE TABLE'
        ORDER BY table_name
      `);

      const createdTables = rows.map((row) => row.table_name);
      const missingTables = expectedTables.filter(
        (table) => !createdTables.includes(table)
      );

      if (missingTables.length === 0) {
        console.log('✅ Todas las tablas fueron creadas correctamente');
        console.log(`📊 Tablas creadas: ${createdTables.length}`);
      } else {
        console.error('❌ Faltan las siguientes tablas:', missingTables);
        throw new Error(`Faltan ${missingTables.length} tablas`);
      }

      // Verificar vistas
      const expectedViews = [
        'article_statistics',
        'recent_articles',
        'pending_topics',
      ];

      const { rows: viewRows } = await this.client.query(`
        SELECT viewname 
        FROM pg_views 
        WHERE schemaname = 'public'
        ORDER BY viewname
      `);

      const createdViews = viewRows.map((row) => row.viewname);
      const missingViews = expectedViews.filter(
        (view) => !createdViews.includes(view)
      );

      if (missingViews.length === 0) {
        console.log('✅ Todas las vistas fueron creadas correctamente');
      } else {
        console.error('❌ Faltan las siguientes vistas:', missingViews);
      }
    } catch (error) {
      console.error('❌ Error verificando tablas:', error);
      throw error;
    }
  }

  async verifyData() {
    try {
      console.log('🔍 Verificando datos iniciales...');

      const { rows } = await this.client.query(`
        SELECT config_key, description 
        FROM automation_config 
        ORDER BY config_key
      `);

      console.log('✅ Datos de configuración inicial:');
      rows.forEach((row) => {
        console.log(`   📋 ${row.config_key}: ${row.description}`);
      });

      console.log(`📊 Total de configuraciones: ${rows.length}`);
    } catch (error) {
      console.error('❌ Error verificando datos:', error);
      throw error;
    }
  }

  async testConnection() {
    try {
      console.log('🧪 Probando conexión y permisos...');

      // Probar inserción
      const testResult = await this.client.query(`
        INSERT INTO system_logs (level, message, gem_stage) 
        VALUES ('info', 'Test de conexión exitoso', 'system')
        RETURNING id
      `);

      console.log('✅ Inserción de prueba exitosa');

      // Limpiar dato de prueba
      await this.client.query(
        `
        DELETE FROM system_logs 
        WHERE id = $1
      `,
        [testResult.rows[0].id]
      );

      console.log('✅ Eliminación de prueba exitosa');
    } catch (error) {
      console.error('❌ Error en prueba de conexión:', error);
      throw error;
    }
  }

  async setup() {
    try {
      console.log('🚀 INICIANDO CONFIGURACIÓN DE BASE DE DATOS');
      console.log('='.repeat(50));

      await this.connect();
      await this.testConnection();
      await this.executeSchema();
      await this.verifyTables();
      await this.verifyData();

      console.log('\n🎉 CONFIGURACIÓN COMPLETADA EXITOSAMENTE');
      console.log('='.repeat(50));
      console.log('✅ Base de datos configurada y lista para usar');
      console.log('✅ Todas las tablas, índices y triggers creados');
      console.log('✅ Datos de configuración inicial insertados');
      console.log('✅ Vistas útiles creadas');
    } catch (error) {
      console.error('\n❌ ERROR EN LA CONFIGURACIÓN');
      console.error('='.repeat(50));
      console.error('Error:', error);
      process.exit(1);
    } finally {
      await this.disconnect();
    }
  }
}

// Función principal
async function main() {
  // Obtener configuración de la base de datos desde variables de entorno
  const config: DatabaseConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'iapunto_articles',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    ssl: process.env.DB_SSL === 'true',
  };

  // Validar configuración mínima
  if (!config.password) {
    console.error('❌ Error: DB_PASSWORD no está configurada');
    console.log('Configúrala en tu archivo .env');
    process.exit(1);
  }

  console.log('📋 Configuración de base de datos:');
  console.log(`   Host: ${config.host}:${config.port}`);
  console.log(`   Database: ${config.database}`);
  console.log(`   User: ${config.user}`);
  console.log(`   SSL: ${config.ssl ? 'Sí' : 'No'}`);

  const setup = new DatabaseSetup(config);
  await setup.setup();
}

// Ejecutar si es el archivo principal
if (require.main === module) {
  main().catch(console.error);
}

export { DatabaseSetup, type DatabaseConfig };
