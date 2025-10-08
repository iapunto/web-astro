import type { APIRoute } from 'astro';
import { PostgresAppointmentManager } from '../../../lib/appointment/postgresAppointmentManager.js';
import * as dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

export const GET: APIRoute = async ({ request, url }) => {
  try {
    const date = url.searchParams.get('date');

    if (!date) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Fecha requerida'
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    console.log('🚀 ===== ENDPOINT DE DISPONIBILIDAD INICIADO =====');
    console.log('📝 Fecha solicitada:', date);

    const appointmentManager = new PostgresAppointmentManager();
    const availableSlots = await appointmentManager.getAvailabilityForDate(date);

    console.log('✅ Disponibilidad obtenida:', availableSlots.length, 'horarios disponibles');
    console.log('📋 Horarios disponibles:', availableSlots);

    return new Response(
      JSON.stringify({
        success: true,
        date: date,
        availableSlots: availableSlots,
        totalSlots: availableSlots.length,
        timezone: process.env.TIMEZONE || 'America/Bogota',
        businessHours: {
          start: process.env.BUSINESS_HOURS_START || '09:00',
          end: process.env.BUSINESS_HOURS_END || '17:00'
        }
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('❌ Error en endpoint de disponibilidad:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Error obteniendo disponibilidad',
        message: error instanceof Error ? error.message : 'Error desconocido'
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
    const { date } = body;

    if (!date) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Fecha requerida'
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    console.log('🚀 ===== ENDPOINT DE DISPONIBILIDAD INICIADO =====');
    console.log('📝 Fecha solicitada:', date);

    const appointmentManager = new PostgresAppointmentManager();
    const availableSlots = await appointmentManager.getAvailabilityForDate(date);

    console.log('✅ Disponibilidad obtenida:', availableSlots.length, 'horarios disponibles');
    console.log('📋 Horarios disponibles:', availableSlots);

    return new Response(
      JSON.stringify({
        success: true,
        date: date,
        availableSlots: availableSlots,
        totalSlots: availableSlots.length,
        timezone: process.env.TIMEZONE || 'America/Bogota',
        businessHours: {
          start: process.env.BUSINESS_HOURS_START || '09:00',
          end: process.env.BUSINESS_HOURS_END || '17:00'
        }
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('❌ Error en endpoint de disponibilidad:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Error obteniendo disponibilidad',
        message: error instanceof Error ? error.message : 'Error desconocido'
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
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
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
};
