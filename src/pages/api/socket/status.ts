import type { APIRoute } from 'astro';
import { socketService } from '../../../lib/socket/socketServer.js';

export const GET: APIRoute = async () => {
  try {
    const isReady = socketService.isReady();
    const connectedClients = socketService.getConnectedClients();
    const rooms = socketService.getRooms();

    return new Response(
      JSON.stringify({
        success: true,
        timestamp: new Date().toISOString(),
        socket: {
          ready: isReady,
          connectedClients,
          rooms: rooms.length,
          roomList: rooms.slice(0, 10), // Solo mostrar las primeras 10 salas
        },
        message: isReady 
          ? 'Socket.io está funcionando correctamente' 
          : 'Socket.io no está inicializado'
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      }
    );
  } catch (error) {
    console.error('❌ Error en endpoint de estado de Socket.io:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Error interno del servidor al obtener estado de Socket.io',
        details: error instanceof Error ? error.message : 'Error desconocido',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};
