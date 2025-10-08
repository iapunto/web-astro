import type { APIRoute } from 'astro';
import { PostgresAppointmentManager, CreateAppointmentRequest } from '../../../lib/appointment/postgresAppointmentManager.js';
import * as dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { clientName, clientEmail, serviceType, appointmentDate, appointmentTime, notes } = body;

    // Validación de campos requeridos
    if (!clientName || !clientEmail || !serviceType || !appointmentDate || !appointmentTime) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Todos los campos son requeridos: clientName, clientEmail, serviceType, appointmentDate, appointmentTime'
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // Validación de formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(clientEmail)) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Formato de email inválido'
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // Validación de formato de fecha
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(appointmentDate)) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Formato de fecha inválido. Use YYYY-MM-DD'
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // Validación de formato de hora
    const timeRegex = /^\d{2}:\d{2}$/;
    if (!timeRegex.test(appointmentTime)) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Formato de hora inválido. Use HH:MM'
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // Validación de fecha futura
    const appointmentDateTime = new Date(`${appointmentDate}T${appointmentTime}:00`);
    const now = new Date();
    if (appointmentDateTime <= now) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'No se pueden programar citas en fechas pasadas'
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    const appointmentRequest: CreateAppointmentRequest = {
      clientName,
      clientEmail,
      serviceType,
      appointmentDate,
      appointmentTime,
      notes
    };

    const appointmentManager = new PostgresAppointmentManager();
    const result = await appointmentManager.createAppointment(appointmentRequest);

    if (result.success) {
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Cita creada exitosamente',
          appointment: result.appointment,
          details: result.details
        }),
        {
          status: 201,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    } else {
      return new Response(
        JSON.stringify({
          success: false,
          error: result.error || 'Error al crear la cita',
          details: result.details
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

  } catch (error) {
    console.error('Error in appointment creation endpoint:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Error interno del servidor',
        message: error instanceof Error ? error.message : 'Error desconocido'
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
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
};
