export function linkifyIAPunto(text: any) {
  const iaPuntoRegex = /(IA Punto)/g; // Expresión regular para encontrar "IA Punto" globalmente (case-sensitive)
  const iaPuntoLink = '<a href="/">IA Punto</a>'; // El enlace que reemplazará las ocurrencias
  return text.replace(iaPuntoRegex, iaPuntoLink);
}
