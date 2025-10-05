import type { APIRoute } from 'astro';
import { Server as HTTPServer } from 'http';
import { socketService } from '../../../lib/socket/socketServer.js';

// Variable global para mantener la referencia del servidor HTTP
declare global {
  var __httpServer: HTTPServer | undefined;
  var __socketInitialized: boolean | undefined;
}

export const GET: APIRoute = async ({ request, locals }) => {
  try {
    // Solo inicializar una vez
    if (global.__socketInitialized) {
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Socket.io ya está inicializado',
          initialized: true
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Intentar obtener el servidor HTTP del contexto de Astro
    let httpServer: HTTPServer | null = null;

    // Método 1: Desde locals.runtime (si está disponible)
    if (locals.runtime && typeof locals.runtime === 'object') {
      const runtime = locals.runtime as any;
      if (runtime.server && runtime.server.httpServer) {
        httpServer = runtime.server.httpServer as HTTPServer;
      }
    }

    // Método 2: Desde el contexto global (si ya fue inicializado)
    if (!httpServer && global.__httpServer) {
      httpServer = global.__httpServer;
    }

    // Método 3: Crear un servidor HTTP básico si no hay uno disponible
    if (!httpServer) {
      console.warn('⚠️ No se encontró servidor HTTP, creando uno básico para Socket.io');
      const { createServer } = await import('http');
      httpServer = createServer();
      global.__httpServer = httpServer;
    }

    // Inicializar Socket.io
    if (httpServer) {
      socketService.initialize(httpServer);
      global.__socketInitialized = true;
      
      console.log('✅ Socket.io inicializado exitosamente');
      
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Socket.io inicializado correctamente',
          initialized: true,
          connectedClients: socketService.getConnectedClients(),
          rooms: socketService.getRooms().length
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    } else {
      throw new Error('No se pudo obtener o crear un servidor HTTP');
    }

  } catch (error) {
    console.error('❌ Error inicializando Socket.io:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Error inicializando Socket.io',
        details: error instanceof Error ? error.message : 'Error desconocido',
        initialized: false
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { action, data } = body;

    if (!socketService.isReady()) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Socket.io no está inicializado'
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    switch (action) {
      case 'emit-to-room':
        const { room, event, eventData } = data;
        socketService.emitToRoom(room, event, eventData);
        break;
        
      case 'emit-to-all':
        const { event: allEvent, eventData: allEventData } = data;
        socketService.emitToAll(allEvent, allEventData);
        break;
        
      case 'send-notification':
        const { type, message, targetRoom } = data;
        socketService.sendNotification(type, message, targetRoom);
        break;
        
      default:
        return new Response(
          JSON.stringify({
            success: false,
            error: 'Acción no válida'
          }),
          {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          }
        );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Acción '${action}' ejecutada correctamente`
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('❌ Error en POST /api/socket/init:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Error procesando solicitud',
        details: error instanceof Error ? error.message : 'Error desconocido'
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};
