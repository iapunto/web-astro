#!/usr/bin/env tsx

import { execSync } from 'child_process';

/**
 * Script para gestionar la base de datos PostgreSQL en Railway
 * Comandos útiles para administración y monitoreo
 */

class RailwayDatabaseManager {
  async getDatabaseURL(): Promise<string> {
    try {
      const result = execSync('railway variables', { encoding: 'utf-8' });
      const databaseUrlMatch = result.match(/DATABASE_URL=([^\s]+)/);
      if (databaseUrlMatch) {
        return databaseUrlMatch[1];
      }
      throw new Error('No se encontró DATABASE_URL');
    } catch (error) {
      console.error('❌ Error obteniendo DATABASE_URL:', error);
      throw error;
    }
  }

  async showTables(): Promise<void> {
    try {
      const databaseUrl = await this.getDatabaseURL();
      console.log('📋 Tablas en la base de datos:');

      const result = execSync(
        `railway run -- psql "${databaseUrl}" -c "\\dt"`,
        { encoding: 'utf-8' }
      );

      console.log(result);
    } catch (error) {
      console.error('❌ Error mostrando tablas:', error);
    }
  }

  async showTableStructure(tableName: string): Promise<void> {
    try {
      const databaseUrl = await this.getDatabaseURL();
      console.log(`📋 Estructura de la tabla ${tableName}:`);

      const result = execSync(
        `railway run -- psql "${databaseUrl}" -c "\\d ${tableName}"`,
        { encoding: 'utf-8' }
      );

      console.log(result);
    } catch (error) {
      console.error(`❌ Error mostrando estructura de ${tableName}:`, error);
    }
  }

  async showStatistics(): Promise<void> {
    try {
      const databaseUrl = await this.getDatabaseURL();
      console.log('📊 Estadísticas de artículos:');

      const result = execSync(
        `railway run -- psql "${databaseUrl}" -c "SELECT * FROM article_statistics LIMIT 10;"`,
        { encoding: 'utf-8' }
      );

      console.log(result);
    } catch (error) {
      console.error('❌ Error mostrando estadísticas:', error);
    }
  }

  async showRecentArticles(limit: number = 5): Promise<void> {
    try {
      const databaseUrl = await this.getDatabaseURL();
      console.log(`📄 Artículos recientes (últimos ${limit}):`);

      const result = execSync(
        `railway run -- psql "${databaseUrl}" -c "SELECT * FROM recent_articles LIMIT ${limit};"`,
        { encoding: 'utf-8' }
      );

      console.log(result);
    } catch (error) {
      console.error('❌ Error mostrando artículos recientes:', error);
    }
  }

  async showPendingTopics(): Promise<void> {
    try {
      const databaseUrl = await this.getDatabaseURL();
      console.log('⏳ Temas pendientes:');

      const result = execSync(
        `railway run -- psql "${databaseUrl}" -c "SELECT * FROM pending_topics;"`,
        { encoding: 'utf-8' }
      );

      console.log(result);
    } catch (error) {
      console.error('❌ Error mostrando temas pendientes:', error);
    }
  }

  async showLogs(limit: number = 10): Promise<void> {
    try {
      const databaseUrl = await this.getDatabaseURL();
      console.log(`📝 Logs del sistema (últimos ${limit}):`);

      const result = execSync(
        `railway run -- psql "${databaseUrl}" -c "SELECT level, message, created_at FROM system_logs ORDER BY created_at DESC LIMIT ${limit};"`,
        { encoding: 'utf-8' }
      );

      console.log(result);
    } catch (error) {
      console.error('❌ Error mostrando logs:', error);
    }
  }

  async backupDatabase(): Promise<void> {
    try {
      const databaseUrl = await this.getDatabaseURL();
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupFile = `backup-${timestamp}.sql`;

      console.log(`💾 Creando backup: ${backupFile}`);

      execSync(`railway run -- pg_dump "${databaseUrl}" > ${backupFile}`, {
        stdio: 'inherit',
      });

      console.log(`✅ Backup creado: ${backupFile}`);
    } catch (error) {
      console.error('❌ Error creando backup:', error);
    }
  }

  async restoreDatabase(backupFile: string): Promise<void> {
    try {
      const databaseUrl = await this.getDatabaseURL();

      console.log(`🔄 Restaurando desde: ${backupFile}`);

      execSync(`railway run -- psql "${databaseUrl}" < ${backupFile}`, {
        stdio: 'inherit',
      });

      console.log('✅ Base de datos restaurada');
    } catch (error) {
      console.error('❌ Error restaurando base de datos:', error);
    }
  }

  async cleanOldLogs(days: number = 30): Promise<void> {
    try {
      const databaseUrl = await this.getDatabaseURL();

      console.log(`🧹 Limpiando logs más antiguos de ${days} días...`);

      const result = execSync(
        `railway run -- psql "${databaseUrl}" -c "DELETE FROM system_logs WHERE created_at < NOW() - INTERVAL '${days} days';"`,
        { encoding: 'utf-8' }
      );

      console.log('✅ Logs antiguos eliminados');
    } catch (error) {
      console.error('❌ Error limpiando logs:', error);
    }
  }

  async cleanOldBackups(days: number = 90): Promise<void> {
    try {
      const databaseUrl = await this.getDatabaseURL();

      console.log(`🧹 Limpiando backups más antiguos de ${days} días...`);

      const result = execSync(
        `railway run -- psql "${databaseUrl}" -c "DELETE FROM article_backups WHERE created_at < NOW() - INTERVAL '${days} days';"`,
        { encoding: 'utf-8' }
      );

      console.log('✅ Backups antiguos eliminados');
    } catch (error) {
      console.error('❌ Error limpiando backups:', error);
    }
  }

  async resetDatabase(): Promise<void> {
    try {
      const databaseUrl = await this.getDatabaseURL();

      console.log('⚠️  ADVERTENCIA: Esto eliminará todos los datos');
      console.log('¿Estás seguro? (escribe "SI" para confirmar)');

      // En un entorno real, aquí pedirías confirmación
      const confirm = process.argv.includes('--confirm');
      if (!confirm) {
        console.log('❌ Operación cancelada. Usa --confirm para proceder');
        return;
      }

      console.log('🗑️  Eliminando todas las tablas...');

      const tables = [
        'article_backups',
        'system_logs',
        'daily_stats',
        'topics_queue',
        'automation_config',
        'published_articles',
        'gem4_results',
        'gem3_results',
        'gem2_results',
        'article_sections',
        'gem1_results',
        'articles_tracking',
      ];

      for (const table of tables) {
        try {
          execSync(
            `railway run -- psql "${databaseUrl}" -c "DROP TABLE IF EXISTS ${table} CASCADE;"`,
            { stdio: 'pipe' }
          );
        } catch (error) {
          // Ignorar errores si la tabla no existe
        }
      }

      console.log('✅ Base de datos reseteada');
    } catch (error) {
      console.error('❌ Error reseteando base de datos:', error);
    }
  }

  async showHelp(): Promise<void> {
    console.log(`
🚂 Railway Database Manager - Comandos disponibles:

📋 INFORMACIÓN:
  tables                    - Mostrar todas las tablas
  structure <tabla>         - Mostrar estructura de una tabla
  stats                     - Mostrar estadísticas de artículos
  recent [limite]           - Mostrar artículos recientes (default: 5)
  pending                   - Mostrar temas pendientes
  logs [limite]             - Mostrar logs del sistema (default: 10)

💾 BACKUP Y RESTAURACIÓN:
  backup                    - Crear backup completo de la base de datos
  restore <archivo>         - Restaurar desde un archivo de backup

🧹 MANTENIMIENTO:
  clean-logs [días]         - Limpiar logs antiguos (default: 30 días)
  clean-backups [días]      - Limpiar backups antiguos (default: 90 días)
  reset --confirm           - Resetear completamente la base de datos

📖 EJEMPLOS:
  pnpm railway:db tables
  pnpm railway:db structure articles_tracking
  pnpm railway:db stats
  pnpm railway:db recent 10
  pnpm railway:db backup
  pnpm railway:db clean-logs 7
    `);
  }
}

// Función principal
async function main() {
  const command = process.argv[2];
  const manager = new RailwayDatabaseManager();

  try {
    switch (command) {
      case 'tables':
        await manager.showTables();
        break;
      case 'structure':
        const tableName = process.argv[3];
        if (!tableName) {
          console.error('❌ Debes especificar el nombre de la tabla');
          process.exit(1);
        }
        await manager.showTableStructure(tableName);
        break;
      case 'stats':
        await manager.showStatistics();
        break;
      case 'recent':
        const limit = parseInt(process.argv[3]) || 5;
        await manager.showRecentArticles(limit);
        break;
      case 'pending':
        await manager.showPendingTopics();
        break;
      case 'logs':
        const logLimit = parseInt(process.argv[3]) || 10;
        await manager.showLogs(logLimit);
        break;
      case 'backup':
        await manager.backupDatabase();
        break;
      case 'restore':
        const backupFile = process.argv[3];
        if (!backupFile) {
          console.error('❌ Debes especificar el archivo de backup');
          process.exit(1);
        }
        await manager.restoreDatabase(backupFile);
        break;
      case 'clean-logs':
        const logDays = parseInt(process.argv[3]) || 30;
        await manager.cleanOldLogs(logDays);
        break;
      case 'clean-backups':
        const backupDays = parseInt(process.argv[3]) || 90;
        await manager.cleanOldBackups(backupDays);
        break;
      case 'reset':
        await manager.resetDatabase();
        break;
      case 'help':
      case '--help':
      case '-h':
        await manager.showHelp();
        break;
      default:
        console.error('❌ Comando no reconocido');
        await manager.showHelp();
        process.exit(1);
    }
  } catch (error) {
    console.error('❌ Error ejecutando comando:', error);
    process.exit(1);
  }
}

// Ejecutar si es el archivo principal
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { RailwayDatabaseManager };
