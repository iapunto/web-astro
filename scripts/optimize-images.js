#!/usr/bin/env node

/**
 * Script para optimizar imágenes del proyecto
 * Genera diferentes tamaños y formatos para responsive images
 */

import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración de tamaños para responsive images
const SIZES = {
  thumbnail: { width: 150, height: 150 },
  small: { width: 300, height: 200 },
  medium: { width: 600, height: 400 },
  large: { width: 800, height: 600 },
  xlarge: { width: 1200, height: 800 },
};

// Formatos a generar
const FORMATS = ['webp', 'avif', 'jpeg'];

// Calidad de compresión
const QUALITY = {
  webp: 80,
  avif: 70,
  jpeg: 85,
};

/**
 * Optimiza una imagen y genera diferentes tamaños y formatos
 */
async function optimizeImage(inputPath, outputDir) {
  try {
    const filename = path.basename(inputPath, path.extname(inputPath));

    for (const [sizeName, dimensions] of Object.entries(SIZES)) {
      for (const format of FORMATS) {
        const outputFilename = `${filename}-${sizeName}.${format}`;
        const outputPath = path.join(outputDir, outputFilename);

        let pipeline = sharp(inputPath).resize(
          dimensions.width,
          dimensions.height,
          {
            fit: 'cover',
            position: 'center',
          }
        );

        switch (format) {
          case 'webp':
            pipeline = pipeline.webp({ quality: QUALITY.webp });
            break;
          case 'avif':
            pipeline = pipeline.avif({ quality: QUALITY.avif });
            break;
          case 'jpeg':
            pipeline = pipeline.jpeg({ quality: QUALITY.jpeg });
            break;
        }

        await pipeline.toFile(outputPath);
        console.log(`✅ Generado: ${outputFilename}`);
      }
    }
  } catch (error) {
    console.error(`❌ Error optimizando ${inputPath}:`, error.message);
  }
}

/**
 * Procesa todas las imágenes en un directorio
 */
async function processDirectory(inputDir, outputDir) {
  try {
    // Crear directorio de salida si no existe
    await fs.mkdir(outputDir, { recursive: true });

    const files = await fs.readdir(inputDir);
    const imageFiles = files.filter((file) =>
      /\.(jpg|jpeg|png|gif|bmp|tiff)$/i.test(file)
    );

    console.log(
      `📁 Procesando ${imageFiles.length} imágenes en ${inputDir}...`
    );

    for (const file of imageFiles) {
      const inputPath = path.join(inputDir, file);
      await optimizeImage(inputPath, outputDir);
    }

    console.log('🎉 Optimización completada!');
  } catch (error) {
    console.error('❌ Error procesando directorio:', error.message);
  }
}

/**
 * Función principal
 */
async function main() {
  const args = process.argv.slice(2);

  if (args.length < 2) {
    console.log(
      'Uso: node optimize-images.js <directorio-entrada> <directorio-salida>'
    );
    console.log(
      'Ejemplo: node optimize-images.js ./src/images ./public/optimized'
    );
    process.exit(1);
  }

  const [inputDir, outputDir] = args;

  console.log('🚀 Iniciando optimización de imágenes...');
  console.log(`📂 Entrada: ${inputDir}`);
  console.log(`📂 Salida: ${outputDir}`);

  await processDirectory(inputDir, outputDir);
}

// Ejecutar si es llamado directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { optimizeImage, processDirectory };
