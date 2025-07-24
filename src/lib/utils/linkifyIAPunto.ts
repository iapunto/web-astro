export function linkifyIAPunto(text: string): string {
  // No reemplazar dentro de correos electrónicos (ej: legales@iapunto.com)
  // 1. Reemplazar solo si no está precedido por '@' o dentro de una dirección de correo
  // 2. Usar una función de reemplazo para evitar mailto y @iapunto.com
  return text.replace(/(\bIA\s*Punto\b)/gi, (match, p1, offset, str) => {
    // Revisar si está precedido por '@' (correo)
    const before = str[offset - 1];
    // Revisar si está dentro de un mailto
    const mailto = str
      .slice(Math.max(0, offset - 20), offset + 20)
      .includes('mailto:');
    if (before === '@' || mailto) return match;
    return '<a href="/" class="text-primary-600 font-bold">IA Punto</a>';
  });
}
