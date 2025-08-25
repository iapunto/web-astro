#!/usr/bin/env tsx

import { execSync } from 'child_process';
import fs from 'fs/promises';
import path from 'path';

console.log('🚀 Configurando esquema de base de datos en Railway...');

try {
  // Obtener DATABASE_URL
  console.log('🔗 Obteniendo URL de la base de datos...');
  const variables = execSync('railway variables', { encoding: 'utf-8' });
  
  // Extraer DATABASE_URL
  const lines = variables.split('\n');
  let databaseUrl = '';
  let inDatabaseUrlSection = false;
  let urlParts: string[] = [];
  
  for (const line of lines) {
    if (line.includes('DATABASE_URL')) {
      inDatabaseUrlSection = true;
      urlParts = [];
      continue;
    }
    
    if (inDatabaseUrlSection) {
      if (line.includes('postgresql://')) {
        // Extraer la parte de la URL de esta línea
        const urlMatch = line.match(/postgresql:\/\/[^\s]+/);
        if (urlMatch) {
          urlParts.push(urlMatch[0]);
        }
      } else if (line.includes('│') && line.includes('postgres:')) {
        // Continuar construyendo la URL
        const urlMatch = line.match(/postgres:[^@]+@[^\s]+/);
        if (urlMatch) {
          urlParts.push(urlMatch[0]);
        }
      } else if (line.includes('│') && line.includes('railway')) {
        // Final de la URL
        urlParts.push('railway');
        break;
      } else if (line.includes('─')) {
        // Fin de la sección
        break;
      }
    }
  }
  
  if (urlParts.length > 0) {
    databaseUrl = urlParts.join('');
  }
  
  if (!databaseUrl) {
    console.error('Variables disponibles:');
    console.log(variables);
    throw new Error('No se encontró DATABASE_URL en las variables');
  }
  console.log('✅ URL de base de datos obtenida');
  
  // Leer el esquema SQL
  console.log('📋 Leyendo archivo de esquema...');
  const schemaPath = path.join(process.cwd(), 'src/lib/database/schema.sql');
  const schema = await fs.readFile(schemaPath, 'utf-8');
  
  // Crear archivo temporal
  const tempFile = path.join(process.cwd(), 'temp_schema.sql');
  await fs.writeFile(tempFile, schema);
  
  try {
    console.log('🐳 Ejecutando esquema con Docker...');
    
    // Ejecutar el esquema usando Docker
    const dockerCommand = `docker run --rm -v "${tempFile}:/schema.sql" postgres:15 psql "${databaseUrl}" -f /schema.sql`;
    execSync(dockerCommand, { stdio: 'inherit' });
    
    console.log('✅ Esquema ejecutado exitosamente');
    
    // Verificar tablas creadas
    console.log('🔍 Verificando tablas creadas...');
    const verifyCommand = `docker run --rm postgres:15 psql "${databaseUrl}" -c "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE' ORDER BY table_name;"`;
    const result = execSync(verifyCommand, { encoding: 'utf-8' });
    
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
    
    // Configurar variables de entorno adicionales
    console.log('🔧 Configurando variables de entorno...');
    try {
      execSync('railway variables set NODE_ENV=production', { stdio: 'pipe' });
      console.log('   ✅ NODE_ENV configurado');
    } catch (error) {
      console.log('   ⚠️  NODE_ENV ya configurado');
    }
    
    try {
      execSync('railway variables set DB_SSL=true', { stdio: 'pipe' });
      console.log('   ✅ DB_SSL configurado');
    } catch (error) {
      console.log('   ⚠️  DB_SSL ya configurado');
    }
    
    // Crear archivo railway.json
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
    
    console.log('\n🎉 CONFIGURACIÓN COMPLETADA EXITOSAMENTE');
    console.log('='.repeat(60));
    console.log('✅ Base de datos PostgreSQL configurada en Railway');
    console.log('✅ Esquema ejecutado exitosamente');
    console.log('✅ Todas las tablas creadas');
    console.log('✅ Variables de entorno configuradas');
    console.log('✅ Archivo railway.json creado');
    console.log('\n📋 Próximos pasos:');
    console.log('   1. Ejecutar: railway up');
    console.log('   2. Configurar dominio personalizado (opcional)');
    console.log('   3. Configurar webhooks para automatización');
    
  } finally {
    // Limpiar archivo temporal
    await fs.unlink(tempFile);
  }
  
} catch (error) {
  console.error('\n❌ ERROR EN LA CONFIGURACIÓN');
  console.error('='.repeat(60));
  console.error('Error:', error);
  process.exit(1);
}
