// Importar módulos necesarios
import fs from 'fs';
import path from 'path';

// Función para leer recursivamente todos los archivos relevantes
function leerArchivos(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stats = fs.statSync(filePath);

    // Excluir carpetas específicas
    if (stats.isDirectory()) {
      if (['node_modules', '.cspell', '.vscode', '.astro'].includes(file)) {
        return; // Ignorar estas carpetas
      }
      // Si es un directorio válido, leer recursivamente
      leerArchivos(filePath, fileList);
    } else if (stats.isFile() && esArchivoRelevante(file)) {
      // Si es un archivo relevante, agregarlo a la lista
      fileList.push(filePath);
    }
  });

  return fileList;
}

// Función para determinar si un archivo es relevante
function esArchivoRelevante(file) {
  const extensionesValidas = [
    '.astro',
    '.js',
    '.ts',
    '.jsx',
    '.tsx',
    '.json',
    '.md',
  ];
  return extensionesValidas.includes(path.extname(file));
}

// Función para concatenar archivos
function concatenarArchivos(archivos, archivoSalida) {
  let contenidoConcatenado = '';

  archivos.forEach((archivo) => {
    const nombreArchivo = path.relative(process.cwd(), archivo); // Obtener ruta relativa
    const contenidoArchivo = fs.readFileSync(archivo, 'utf-8');

    // Agregar un comentario con el nombre del archivo
    contenidoConcatenado += `\n\n/* ===================== Archivo: ${nombreArchivo} ===================== */\n\n`;
    contenidoConcatenado += contenidoArchivo;
  });

  // Escribir el contenido concatenado en el archivo de salida
  fs.writeFileSync(archivoSalida, contenidoConcatenado, 'utf-8');
  console.log(`Todos los archivos han sido concatenados en: ${archivoSalida}`);
}

// Configuración
const directorioProyecto = './'; // Directorio raíz del proyecto
const archivoSalida = './proyecto_concatenado.txt'; // Nombre del archivo de salida

// Ejecutar el proceso
const archivos = leerArchivos(directorioProyecto);
concatenarArchivos(archivos, archivoSalida);
