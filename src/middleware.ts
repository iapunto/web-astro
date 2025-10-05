import type { MiddlewareHandler } from 'astro';
import { Server as HTTPServer } from 'http';
import { socketService } from './lib/socket/socketServer.js';

// Variable global para mantener la referencia del servidor HTTP
declare global {
  var __httpServer: HTTPServer | undefined;
}

export const onRequest: MiddlewareHandler = async (context, next) => {
  // Solo inicializar Socket.io una vez
  if (!global.__httpServer && context.locals.runtime?.env?.runtime === 'node') {
    try {
      // Obtener el servidor HTTP del contexto de Astro
      const server = context.locals.runtime?.env?.runtime?.server;
      
      if (server && typeof server === 'object' && 'httpServer' in server) {
        const httpServer = server.httpServer as HTTPServer;
        
        if (httpServer && !global.__httpServer) {
          global.__httpServer = httpServer;
          socketService.initialize(httpServer);
          console.log('✅ Socket.io inicializado en middleware');
        }
      }
    } catch (error) {
      console.warn('⚠️ No se pudo inicializar Socket.io en middleware:', error);
    }
  }

  return next();
};