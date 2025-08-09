import type { APIRoute } from 'astro';
import { getGoogleCalendarService } from '../../../lib/services/googleCalendar';

export const GET: APIRoute = async ({ request, url }) => {
  try {
    const searchParams = url.searchParams;
    const dateParam = searchParams.get('date');
    const durationParam = searchParams.get('duration');

    if (!dateParam) {
      return new Response(
        JSON.stringify({ 
          error: 'Fecha requerida', 
          message: 'Debe proporcionar una fecha para consultar disponibilidad' 
        }),
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    const date = new Date(dateParam);
    const duration = durationParam ? parseInt(durationParam) : 60;

    // Validar que la fecha sea válida
    if (isNaN(date.getTime())) {
      return new Response(
        JSON.stringify({ 
          error: 'Fecha inválida', 
          message: 'El formato de fecha proporcionado no es válido' 
        }),
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // Validar que la fecha no sea en el pasado
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date < today) {
      return new Response(
        JSON.stringify({ 
          error: 'Fecha en el pasado', 
          message: 'No se pueden agendar citas en fechas pasadas' 
        }),
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    const calendarService = getGoogleCalendarService();
    const availableSlots = await calendarService.getAvailableSlots(date, duration);

    // Filtrar solo los slots disponibles para la respuesta
    const availableOnly = availableSlots.filter(slot => slot.available);

    return new Response(
      JSON.stringify({
        success: true,
        date: dateParam,
        duration: duration,
        availableSlots: availableOnly.map(slot => ({
          start: slot.start.toISOString(),
          end: slot.end.toISOString(),
          available: slot.available,
        })),
        totalSlots: availableOnly.length,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

  } catch (error) {
    console.error('Error fetching availability:', error);
    
    return new Response(
      JSON.stringify({
        error: 'Error del servidor',
        message: 'No se pudo consultar la disponibilidad. Inténtelo más tarde.',
        details: error instanceof Error ? error.message : 'Error desconocido',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
};

// Manejar preflight requests para CORS
export const OPTIONS: APIRoute = async () => {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
};
