#!/usr/bin/env tsx

import dotenv from 'dotenv';
import fs from 'fs/promises';

console.log('🔧 Configurando variables de Cloudinary...');
console.log('');
console.log('Para configurar Cloudinary, necesitas:');
console.log('1. Crear una cuenta en https://cloudinary.com/');
console.log('2. Obtener tu Cloud Name, API Key y API Secret del Dashboard');
console.log('3. Agregar las variables al archivo .env');
console.log('');
console.log('Variables necesarias:');
console.log('- CLOUDINARY_CLOUD_NAME=tu_cloud_name');
console.log('- CLOUDINARY_API_KEY=tu_api_key');
console.log('- CLOUDINARY_API_SECRET=tu_api_secret');
console.log('');
console.log('Ejemplo:');
console.log('CLOUDINARY_CLOUD_NAME=dkb9jfet8');
console.log('CLOUDINARY_API_KEY=123456789012345');
console.log('CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz123456');
console.log('');
console.log(
  'Una vez configuradas las variables, podrás usar GEM 5 para generar imágenes automáticamente.'
);
