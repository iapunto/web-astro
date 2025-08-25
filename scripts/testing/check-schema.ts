#!/usr/bin/env tsx

import dotenv from 'dotenv';
import { Client } from 'pg';

// Cargar variables de entorno
dotenv.config();

async function checkSchema() {
  console.log('🔍 Verificando esquema de la base de datos...');
  
  try {
    const client = new Client({
      connectionString: process.env.DATABASE_PUBLIC_URL,
    });
    
    await client.connect();
    
    // Verificar tablas existentes
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    console.log('📋 Tablas existentes:');
    tablesResult.rows.forEach(row => {
      console.log(`   - ${row.table_name}`);
    });
    
    // Verificar estructura de articles_tracking
    console.log('\n🔍 Estructura de articles_tracking:');
    const trackingColumns = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'articles_tracking' 
      ORDER BY ordinal_position
    `);
    
    trackingColumns.rows.forEach(row => {
      console.log(`   - ${row.column_name}: ${row.data_type}`);
    });
    
    // Verificar estructura de gem1_results
    console.log('\n🔍 Estructura de gem1_results:');
    const gem1Columns = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'gem1_results' 
      ORDER BY ordinal_position
    `);
    
    gem1Columns.rows.forEach(row => {
      console.log(`   - ${row.column_name}: ${row.data_type}`);
    });
    
    // Verificar estructura de gem3_results
    console.log('\n🔍 Estructura de gem3_results:');
    const gem3Columns = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'gem3_results' 
      ORDER BY ordinal_position
    `);
    
    gem3Columns.rows.forEach(row => {
      console.log(`   - ${row.column_name}: ${row.data_type}`);
    });
    
    // Verificar restricciones de gem3_results
    console.log('\n🔍 Restricciones de gem3_results:');
    const constraints = await client.query(`
      SELECT tc.constraint_name, tc.constraint_type, cc.check_clause
      FROM information_schema.table_constraints tc
      LEFT JOIN information_schema.check_constraints cc ON tc.constraint_name = cc.constraint_name
      WHERE tc.table_name = 'gem3_results'
    `);
    
    constraints.rows.forEach(row => {
      console.log(`   - ${row.constraint_name}: ${row.check_clause}`);
    });
    
    // Verificar estructura de article_sections
    console.log('\n🔍 Estructura de article_sections:');
    const sectionsColumns = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'article_sections' 
      ORDER BY ordinal_position
    `);
    
    sectionsColumns.rows.forEach(row => {
      console.log(`   - ${row.column_name}: ${row.data_type}`);
    });
    
    // Verificar restricciones de article_sections
    console.log('\n🔍 Restricciones de article_sections:');
    const sectionsConstraints = await client.query(`
      SELECT tc.constraint_name, tc.constraint_type, cc.check_clause
      FROM information_schema.table_constraints tc
      LEFT JOIN information_schema.check_constraints cc ON tc.constraint_name = cc.constraint_name
      WHERE tc.table_name = 'article_sections'
    `);
    
    sectionsConstraints.rows.forEach(row => {
      console.log(`   - ${row.constraint_name}: ${row.check_clause}`);
    });
    
    await client.end();
    
  } catch (error) {
    console.error('❌ Error verificando esquema:', error);
  }
}

checkSchema();
