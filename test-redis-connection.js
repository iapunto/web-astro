#!/usr/bin/env node

// Script para probar la conexión a Redis
import { createClient } from 'redis';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

const REDIS_URL = process.env.REDIS_URL || 'redis://default:AcG9BjJicYTa943fCjSKkzcTib5ZxfVXH8bbtXpt4FwnE3fKLgAClnkN7rWbWTs3@uc4gwscgo84w4wk4wc8k8kok:6379/0';

async function testRedisConnection() {
  console.log('🔗 Probando conexión a Redis...');
  console.log(`📡 URL: ${REDIS_URL.replace(/:[^:@]+@/, ':***@')}`); // Ocultar password en logs

  const client = createClient({
    url: REDIS_URL,
    socket: {
      reconnectStrategy: (retries) => {
        if (retries > 3) {
          console.error('❌ Máximo de reintentos alcanzado');
          return false;
        }
        return Math.min(retries * 100, 1000);
      }
    }
  });

  client.on('error', (err) => {
    console.error('❌ Redis Client Error:', err.message);
  });

  client.on('connect', () => {
    console.log('🔗 Redis: Conectando...');
  });

  client.on('ready', () => {
    console.log('✅ Redis: Conectado y listo');
  });

  try {
    await client.connect();
    
    // Probar operaciones básicas
    console.log('🧪 Probando operaciones básicas...');
    
    // SET
    await client.set('test:connection', 'Redis funcionando correctamente', { EX: 60 });
    console.log('✅ SET: Clave de prueba creada');
    
    // GET
    const value = await client.get('test:connection');
    console.log(`✅ GET: Valor obtenido: ${value}`);
    
    // EXISTS
    const exists = await client.exists('test:connection');
    console.log(`✅ EXISTS: Clave existe: ${exists === 1}`);
    
    // TTL
    const ttl = await client.ttl('test:connection');
    console.log(`✅ TTL: Tiempo de vida: ${ttl} segundos`);
    
    // DEL
    await client.del('test:connection');
    console.log('✅ DEL: Clave de prueba eliminada');
    
    // INFO
    const info = await client.info('memory');
    console.log('📊 INFO: Información de memoria obtenida');
    
    console.log('\n🎉 ¡Conexión a Redis exitosa!');
    console.log('✅ Todas las operaciones funcionan correctamente');
    
  } catch (error) {
    console.error('❌ Error conectando a Redis:', error.message);
    console.error('💡 Verifica que:');
    console.error('   - Redis esté ejecutándose en el servidor');
    console.error('   - La URL de conexión sea correcta');
    console.error('   - Las credenciales sean válidas');
    console.error('   - El puerto 6379 esté abierto');
  } finally {
    await client.disconnect();
    console.log('🔌 Conexión cerrada');
  }
}

// Ejecutar prueba
testRedisConnection().catch(console.error);
