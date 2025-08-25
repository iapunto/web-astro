#!/usr/bin/env tsx

import { execSync } from 'child_process';

console.log('🚀 Iniciando script de Railway...');

try {
  // Verificar Railway CLI
  const version = execSync('railway --version', { encoding: 'utf-8' });
  console.log('✅ Railway CLI:', version.trim());
  
  // Verificar login
  const whoami = execSync('railway whoami', { encoding: 'utf-8' });
  console.log('✅ Usuario:', whoami.trim());
  
  // Verificar estado del proyecto
  const status = execSync('railway status', { encoding: 'utf-8' });
  console.log('📋 Estado del proyecto:');
  console.log(status);
  
  // Obtener variables
  const variables = execSync('railway variables', { encoding: 'utf-8' });
  console.log('🔗 Variables de entorno:');
  console.log(variables);
  
  console.log('🎉 Script completado exitosamente');
  
} catch (error) {
  console.error('❌ Error:', error);
  process.exit(1);
}
