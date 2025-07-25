import type { MiddlewareHandler } from 'astro';

export const onRequest: MiddlewareHandler = async (context, next) => {
  const url = new URL(context.request.url);
  const pathname = url.pathname;

  // Redirecciones para evitar contenido duplicado
  // Redirigir URLs sin barra final a URLs con barra final para páginas principales
  if (
    pathname === '/blog' ||
    pathname === '/servicios' ||
    pathname === '/acerca-de' ||
    pathname === '/contacto'
  ) {
    return new Response(null, {
      status: 301,
      headers: {
        Location: `${pathname}/`,
        'Cache-Control': 'public, max-age=31536000',
      },
    });
  }

  const response = await next();

  // Content Security Policy (CSP)
  response.headers.set(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "script-src 'self' https://www.googletagmanager.com https://www.google-analytics.com https://connect.facebook.net https://analytics.ahrefs.com https://www.google.com https://www.gstatic.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "img-src 'self' data: https: https://res.cloudinary.com https://blog.n8n.io https://*.techcrunch.com https://*.hubspot.com https://inedif.com.co https://iapunto.com https://www.semrush.com https://semrush.com",
      "font-src 'self' https://fonts.gstatic.com",
      "connect-src 'self' https://www.google-analytics.com https://www.googletagmanager.com https://api.resend.com",
      'frame-src https://www.youtube.com https://www.facebook.com',
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'self'",
    ].join('; ')
  );

  // HSTS: fuerza HTTPS en navegadores compatibles
  response.headers.set(
    'Strict-Transport-Security',
    'max-age=63072000; includeSubDomains; preload'
  );

  // COOP: aislamiento de contexto
  response.headers.set('Cross-Origin-Opener-Policy', 'same-origin');

  // CORP: aislamiento de recursos
  response.headers.set('Cross-Origin-Resource-Policy', 'same-origin');

  // X-Frame-Options: evita clickjacking
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');

  // X-Content-Type-Options: evita sniffing de tipos MIME
  response.headers.set('X-Content-Type-Options', 'nosniff');

  // Referrer-Policy: controla el envío del referer
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Permissions-Policy: restringe APIs avanzadas del navegador
  response.headers.set(
    'Permissions-Policy',
    [
      'geolocation=()',
      'microphone=()',
      'camera=()',
      'fullscreen=(self)',
      'payment=()',
    ].join(', ')
  );

  // Eliminar encabezado X-Powered-By si existe
  response.headers.delete('X-Powered-By');

  // Reglas de caché eficientes para recursos estáticos y HTML
  if (
    pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|webp|woff2|woff|ttf|eot)$/)
  ) {
    response.headers.set(
      'Cache-Control',
      'public, max-age=31536000, immutable'
    );
  } else if (
    pathname.endsWith('.html') ||
    pathname === '/' ||
    pathname.endsWith('/')
  ) {
    response.headers.set('Cache-Control', 'public, max-age=0, must-revalidate');
  }

  return response;
};
