// Sistema híbrido para obtener variables de entorno
// Intenta múltiples métodos para mayor compatibilidad

let STRAPI_API_URL_VALUE: string;
let STRAPI_INTERNAL_URL_VALUE: string | undefined;
let STRAPI_API_TOKEN_VALUE: string | undefined;

try {
  // Método 1: Intentar con astro:env/server (recomendado en Astro 5)
  console.log('🔧 [ENV] Intentando cargar variables con astro:env/server...');
  const envModule = await import('astro:env/server');
  STRAPI_API_URL_VALUE = envModule.STRAPI_API_URL;
  STRAPI_INTERNAL_URL_VALUE = envModule.STRAPI_INTERNAL_URL;
  STRAPI_API_TOKEN_VALUE = envModule.STRAPI_API_TOKEN;
  console.log('✅ [ENV] Variables cargadas con astro:env/server');
  console.log('✅ [ENV] URL Externa:', STRAPI_API_URL_VALUE);
  console.log(
    '✅ [ENV] URL Interna:',
    STRAPI_INTERNAL_URL_VALUE || 'No configurada'
  );
  console.log('✅ [ENV] Token presente:', !!STRAPI_API_TOKEN_VALUE);
} catch (error) {
  // Método 2: Fallback a import.meta.env
  console.warn('⚠️ [ENV] astro:env/server falló, usando import.meta.env...');
  console.warn('⚠️ [ENV] Error:', error);
  STRAPI_API_URL_VALUE =
    import.meta.env.STRAPI_API_URL || 'https://strapi.iapunto.com';
  STRAPI_INTERNAL_URL_VALUE = import.meta.env.STRAPI_INTERNAL_URL;
  STRAPI_API_TOKEN_VALUE = import.meta.env.STRAPI_API_TOKEN;
  console.log('⚠️ [ENV] URL Externa:', STRAPI_API_URL_VALUE);
  console.log(
    '⚠️ [ENV] URL Interna:',
    STRAPI_INTERNAL_URL_VALUE || 'No configurada'
  );
  console.log('⚠️ [ENV] Token presente:', !!STRAPI_API_TOKEN_VALUE);
}

// Método 3: Si aún no hay token, intentar con process.env como último recurso
if (!STRAPI_API_TOKEN_VALUE && typeof process !== 'undefined' && process.env) {
  console.warn('⚠️ [ENV] Intentando process.env como último recurso...');
  STRAPI_API_TOKEN_VALUE = process.env.STRAPI_API_TOKEN;
  if (
    !STRAPI_API_URL_VALUE ||
    STRAPI_API_URL_VALUE === 'https://strapi.iapunto.com'
  ) {
    STRAPI_API_URL_VALUE =
      process.env.STRAPI_API_URL || 'https://strapi.iapunto.com';
  }
  if (!STRAPI_INTERNAL_URL_VALUE) {
    STRAPI_INTERNAL_URL_VALUE = process.env.STRAPI_INTERNAL_URL;
  }
  console.log('⚠️ [ENV] Token desde process.env:', !!STRAPI_API_TOKEN_VALUE);
}

// Priorizar URL interna si está configurada (para Coolify/Docker)
const FINAL_STRAPI_URL = STRAPI_INTERNAL_URL_VALUE || STRAPI_API_URL_VALUE;

// Logging final
console.log('═'.repeat(80));
console.log('🔧 [ENV] === CONFIGURACIÓN FINAL ===');
console.log('🔧 [ENV] STRAPI_API_URL (externa):', STRAPI_API_URL_VALUE);
console.log(
  '🔧 [ENV] STRAPI_INTERNAL_URL:',
  STRAPI_INTERNAL_URL_VALUE || 'No configurada'
);
console.log('🔧 [ENV] URL EFECTIVA (la que se usará):', FINAL_STRAPI_URL);
console.log('🔧 [ENV] STRAPI_API_TOKEN presente:', !!STRAPI_API_TOKEN_VALUE);
console.log(
  '🔧 [ENV] STRAPI_API_TOKEN length:',
  STRAPI_API_TOKEN_VALUE?.length || 0
);
if (STRAPI_API_TOKEN_VALUE) {
  console.log(
    '🔧 [ENV] STRAPI_API_TOKEN preview:',
    STRAPI_API_TOKEN_VALUE.substring(0, 30) + '...'
  );
}
console.log('═'.repeat(80));

// Exportar URL efectiva (interna si existe, externa si no)
export const STRAPI_API_URL = FINAL_STRAPI_URL;
export const STRAPI_API_TOKEN = STRAPI_API_TOKEN_VALUE;
