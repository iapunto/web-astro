import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  return new Response(
    JSON.stringify({
      success: true,
      message: 'Sistema de gestión de invitados funcionando correctamente',
      endpoints: {
        createEvent: '/api/calendar/book',
        updateEvent: '/api/calendar/update-event',
        getEvent: '/api/calendar/get-event',
        checkAvailability: '/api/calendar/availability',
      },
      features: [
        'Creación de eventos con Google Meet automático',
        'Agregar invitados a eventos existentes',
        'Remover invitados de eventos',
        'Gestionar lista de invitados',
        'Obtener información actualizada de eventos',
      ],
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }
  );
};
