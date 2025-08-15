const { Client } = require('pg');
require('dotenv').config();

async function testConnection() {
  console.log('🔍 Probando conexión a la base de datos...');
  console.log(
    '📋 DATABASE_URL:',
    process.env.DATABASE_URL ? 'Configurada' : 'No configurada'
  );

  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL no está configurada');
    return;
  }

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
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
  } catch (error) {
    console.error('❌ Error en la conexión:', error.message);
  } finally {
    await client.end();
    console.log('🔌 Conexión cerrada');
  }
}

testConnection();
