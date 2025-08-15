#!/usr/bin/env tsx

import dotenv from 'dotenv';
import { Client } from 'pg';
import fs from 'fs/promises';

// Cargar variables de entorno
dotenv.config();

async function updateSchemaGem5() {
  console.log('🔧 Actualizando schema para GEM 5...');

  try {
    const client = new Client({
      connectionString: process.env.DATABASE_PUBLIC_URL,
    });

    await client.connect();
    console.log('✅ Conectado a la base de datos');

    // Leer el archivo SQL
    const sqlContent = await fs.readFile('scripts/update-schema-gem5.sql', 'utf-8');
    
    // Ejecutar el SQL
    await client.query(sqlContent);
    
    console.log('✅ Schema actualizado exitosamente');

    // Verificar que la tabla se creó
    const result = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_name = 'gem5_results'
    `);

    if (result.rows.length > 0) {
      console.log('✅ Tabla gem5_results creada correctamente');
    } else {
      console.log('❌ Error: La tabla no se creó');
    }

    await client.end();
  } catch (error) {
    console.error('❌ Error actualizando schema:', error);
  }
}

updateSchemaGem5();
