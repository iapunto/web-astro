import { defineMiddleware } from 'astro:middleware';
import { SessionManager } from './lib/auth/session';
import { AuthDatabase } from './lib/auth/database';

// Inicializar base de datos
AuthDatabase.init().catch(console.error);

export const onRequest = defineMiddleware(async (context, next) => {
  const { url, request } = context;
  const pathname = new URL(url).pathname;

  // Rutas que requieren autenticación
  const protectedRoutes = ['/admin', '/api/cms'];
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  // Rutas de autenticación
  const authRoutes = ['/portal-seguro', '/logout'];
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));

  // Verificar autenticación para rutas protegidas
  if (isProtectedRoute) {
    try {
      const user = SessionManager.requireAuth(context);
      
      // Verificar si el usuario tiene rol de admin
      if (!SessionManager.hasRole(context, 'admin')) {
        return new Response('Acceso denegado', { status: 403 });
      }

      // Agregar información del usuario al contexto
      context.locals.user = user;
      
    } catch (error) {
      // Redirigir a login si no está autenticado
      return context.redirect('/portal-seguro');
    }
  }

  // Redirigir usuarios autenticados fuera de las páginas de auth
  if (isAuthRoute && SessionManager.isAuthenticated(context)) {
    return context.redirect('/admin');
  }

  // Configurar headers de seguridad
  const response = await next();
  
  // Headers de seguridad adicionales
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // CSP para páginas de admin
  if (pathname.startsWith('/admin')) {
    response.headers.set(
      'Content-Security-Policy',
      "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;"
    );
  }

  return response;
});
