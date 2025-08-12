import type { APIRoute } from 'astro';
import { getAppointmentService } from '../../../lib/services/appointmentService.js';

export const GET: APIRoute = async ({ url }) => {
  try {
    console.log('🔍 ===== GET AVAILABLE SLOTS START =====');
    
    const dateParam = url.searchParams.get('date');
    
    if (!dateParam) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Parámetro "date" es requerido'
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
    
    if (isNaN(date.getTime())) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Formato de fecha inválido'
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    console.log('📅 Getting available slots for:', date.toDateString());

    const appointmentService = getAppointmentService();
    const serviceInfo = appointmentService.getServiceInfo();
    
    console.log(`📅 Using service: ${serviceInfo.name}`);

    const availableSlots = await appointmentService.getAvailableSlots(date);

    console.log(`✅ Found ${availableSlots.length} available slots`);
    console.log('🏁 ===== GET AVAILABLE SLOTS END =====');

    return new Response(
      JSON.stringify({
        success: true,
        date: date.toISOString(),
        slots: availableSlots,
        service: serviceInfo.name,
        serviceType: serviceInfo.type,
        totalSlots: availableSlots.length
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
        error: 'Error al obtener slots disponibles',
        details: error instanceof Error ? error.message : 'Error desconocido'
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
