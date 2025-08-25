#!/usr/bin/env tsx

import { Client } from 'pg';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

async function testDatabaseConnection() {
  console.log('🔍 Probando conexión a la base de datos...');
  console.log(
    '📋 DATABASE_PUBLIC_URL:',
    process.env.DATABASE_PUBLIC_URL ? 'Configurada' : 'No configurada'
  );

  if (!process.env.DATABASE_PUBLIC_URL) {
    console.error('❌ DATABASE_PUBLIC_URL no está configurada');
    return;
  }

  const client = new Client({
    connectionString: process.env.DATABASE_PUBLIC_URL,
  });

  try {
    console.log('📡 Conectando a la base de datos...');
    await client.connect();
    console.log('✅ Conexión exitosa');

    // Probar una consulta simple
    console.log('📋 Probando consulta...');
    const result = await client.query('SELECT COUNT(*) FROM articles_tracking');
    console.log('✅ Consulta exitosa');
    console.log('   Total de artículos en tracking:', result.rows[0].count);

    // Probar inserción
    console.log('📝 Probando inserción...');
    const insertResult = await client.query(
      'INSERT INTO articles_tracking (topic, status) VALUES ($1, $2) RETURNING id',
      ['Test topic', 'pending']
    );
    console.log('✅ Inserción exitosa');
    console.log('   ID creado:', insertResult.rows[0].id);

    // Limpiar
    await client.query('DELETE FROM articles_tracking WHERE topic = $1', [
      'Test topic',
    ]);
    console.log('🧹 Datos de prueba eliminados');
  } catch (error) {
    console.error('❌ Error en la conexión:', error);
    console.error(
      '❌ Error stack:',
      error instanceof Error ? error.stack : 'No stack available'
    );
  } finally {
    await client.end();
    console.log('🔌 Conexión cerrada');
  }
}

// Ejecutar si es el archivo principal
if (import.meta.url === `file://${process.argv[1]}`) {
  testDatabaseConnection().catch(console.error);
}

export { testDatabaseConnection };
