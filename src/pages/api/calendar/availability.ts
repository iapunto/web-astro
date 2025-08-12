import type { APIRoute } from 'astro';
import { getAppointmentService } from '../../../lib/services/appointmentService.js';

export const GET: APIRoute = async ({ url }) => {
  try {
    console.log('📅 ===== GET AVAILABLE SLOTS =====');

    // Obtener parámetros de la URL
    const searchParams = url.searchParams;
    const dateParam = searchParams.get('date');

    if (!dateParam) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Fecha requerida',
          message: 'Proporciona un parámetro "date" en formato YYYY-MM-DD',
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // Validar formato de fecha
    const date = new Date(dateParam);
    if (isNaN(date.getTime())) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Formato de fecha inválido',
          message: 'La fecha debe estar en formato YYYY-MM-DD',
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    console.log(`📅 Getting available slots for: ${date.toISOString()}`);

    // Obtener slots disponibles
    const appointmentService = getAppointmentService();
    const availableSlots = await appointmentService.getAvailableSlots(date);

    console.log(`✅ Found ${availableSlots.length} available slots`);

    return new Response(
      JSON.stringify({
        success: true,
        date: dateParam,
        availableSlots,
        count: availableSlots.length,
        timestamp: new Date().toISOString(),
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('❌ Error getting available slots:', error);

    return new Response(
      JSON.stringify({
        success: false,
        error: 'Error interno del servidor',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
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
