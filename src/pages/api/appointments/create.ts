import type { APIRoute } from 'astro';
import { AppointmentManager, CreateAppointmentRequest } from '../../../lib/appointment/appointmentManager';
import * as dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

export const POST: APIRoute = async ({ request }) => {
  console.log('🚀 ===== ENDPOINT DE CREACIÓN DE CITA INICIADO =====');
  console.log('📥 Solicitud recibida en /api/appointments/create');

  try {
    console.log('📋 Parseando cuerpo de la solicitud...');
    const body = await request.json();
    console.log('✅ Cuerpo de la solicitud parseado exitosamente');
    console.log('📝 Datos de la solicitud:', JSON.stringify(body, null, 2));

    // Validación de datos requeridos
    const { clientName, clientEmail, appointmentDate, appointmentTime, serviceType, clientPhone, description } = body as CreateAppointmentRequest;

    console.log('🔍 Validando campos requeridos...');
    
    if (!clientName || !clientEmail || !appointmentDate || !appointmentTime || !serviceType) {
      console.error('❌ Faltan campos requeridos');
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Faltan campos requeridos: clientName, clientEmail, appointmentDate, appointmentTime, serviceType',
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(clientEmail)) {
      console.error('❌ Formato de email inválido');
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Formato de email inválido',
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
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(appointmentDate)) {
      console.error('❌ Formato de fecha inválido');
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Formato de fecha inválido. Use YYYY-MM-DD',
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // Validar formato de hora
    const timeRegex = /^\d{2}:\d{2}$/;
    if (!timeRegex.test(appointmentTime)) {
      console.error('❌ Formato de hora inválido');
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Formato de hora inválido. Use HH:MM',
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // Validar que la fecha no esté en el pasado
    const requestedDate = new Date(appointmentDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (requestedDate < today) {
      console.error('❌ La fecha está en el pasado');
      return new Response(
        JSON.stringify({
          success: false,
          error: 'No se puede programar citas para fechas pasadas',
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    console.log('✅ Todas las validaciones pasaron');

    // Crear instancia del gestor de citas
    console.log('🔍 Creando gestor de citas...');
    const appointmentManager = new AppointmentManager();

    // Crear la cita
    console.log('🚀 Creando cita...');
    const result = await appointmentManager.createAppointment({
      clientName,
      clientEmail,
      clientPhone,
      appointmentDate,
      appointmentTime,
      serviceType,
      description
    });

    if (!result.success) {
      console.error('❌ Error creando cita:', result.error);
      return new Response(
        JSON.stringify({
          success: false,
          error: result.error || 'Error creando la cita',
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    console.log('✅ Cita creada exitosamente');
    console.log('📅 ID de la cita:', result.appointment?.id);
    console.log('📅 ID de Google Calendar:', result.googleCalendarEventId);
    console.log('📧 Email enviado:', result.emailSent);
    console.log('🔗 Enlace de Meet:', result.meetLink);

    // Cerrar conexiones
    appointmentManager.close();

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Cita creada exitosamente',
        appointment: {
          id: result.appointment?.id,
          clientName: result.appointment?.clientName,
          clientEmail: result.appointment?.clientEmail,
          appointmentDate: result.appointment?.appointmentDate,
          appointmentTime: result.appointment?.appointmentTime,
          serviceType: result.appointment?.serviceType,
          status: result.appointment?.status,
        },
        googleCalendar: {
          eventId: result.googleCalendarEventId,
          meetLink: result.meetLink,
        },
        email: {
          sent: result.emailSent,
        },
        summary: {
          appointmentId: result.appointment?.id,
          googleCalendarSynced: !!result.googleCalendarEventId,
          emailSent: result.emailSent,
          meetLinkAvailable: !!result.meetLink,
        },
      }),
      {
        status: 201,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

  } catch (error) {
    console.error('❌ ===== ERROR EN ENDPOINT DE CREACIÓN DE CITA =====');
    console.error('❌ Detalles del error:', error);
    console.error(
      '❌ Stack del error:',
      error instanceof Error ? error.stack : 'Sin stack trace'
    );
    console.error('🏁 ===== FIN DEL ENDPOINT DE CREACIÓN DE CITA =====');

    return new Response(
      JSON.stringify({
        success: false,
        error: 'Error interno del servidor',
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
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
};
