/**
 * Calcula el tiempo de lectura estimado para un artículo
 * Basado en el estándar de 200-250 palabras por minuto
 */

export interface ReadingTimeResult {
  minutes: number;
  words: number;
  text: string;
}

export function calculateReadingTime(content: string): ReadingTimeResult {
  // Eliminar HTML tags y espacios extra
  const cleanContent = content
    .replace(/<[^>]*>/g, '') // Eliminar HTML tags
    .replace(/\s+/g, ' ') // Reemplazar múltiples espacios con uno solo
    .trim();

  // Contar palabras (separadas por espacios)
  const words = cleanContent.split(/\s+/).filter(word => word.length > 0).length;
  
  // Calcular tiempo de lectura (promedio de 225 palabras por minuto)
  const wordsPerMinute = 225;
  const minutes = Math.ceil(words / wordsPerMinute);
  
  // Generar texto descriptivo
  let text: string;
  if (minutes < 1) {
    text = 'Menos de 1 minuto';
  } else if (minutes === 1) {
    text = '1 minuto';
  } else {
    text = `${minutes} minutos`;
  }
  
  return {
    minutes,
    words,
    text
  };
}

/**
 * Calcula el tiempo de lectura para contenido MDX/Astro
 * Maneja tanto texto plano como contenido renderizado
 */
export function calculateReadingTimeFromContent(content: any): ReadingTimeResult {
  let textContent = '';
  
  // Si es un string, usarlo directamente
  if (typeof content === 'string') {
    textContent = content;
  }
  // Si es un objeto con body (como en Astro content collections)
  else if (content && typeof content.body === 'string') {
    textContent = content.body;
  }
  // Si es un objeto con content
  else if (content && typeof content.content === 'string') {
    textContent = content.content;
  }
  // Si es un array o objeto complejo, intentar extraer texto
  else if (content) {
    textContent = JSON.stringify(content);
  }
  
  return calculateReadingTime(textContent);
} 