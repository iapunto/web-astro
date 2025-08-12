import type { APIRoute } from 'astro';
import { getGoogleCalendarService } from '../../../lib/services/googleCalendar';
import type { AppointmentRequest } from '../../../lib/services/googleCalendar';

export const POST: APIRoute = async ({ request }) => {
  console.log('🚀 ===== BOOK APPOINTMENT ENDPOINT START =====');
  console.log('📥 Request received at /api/calendar/book');

  try {
    console.log('📋 Parsing request body...');
    const body = await request.json();
    console.log('✅ Request body parsed successfully');
    console.log('📝 Request data:', JSON.stringify(body, null, 2));

    // Validación de datos requeridos
    const { name, email, startTime, endTime, description, meetingType } = body;

    console.log('🔍 Validating required fields...');
    if (!name || !email || !startTime || !endTime) {
      console.error('❌ Missing required fields:', {
        name: !!name,
        email: !!email,
        startTime: !!startTime,
        endTime: !!endTime,
      });
      return new Response(
        JSON.stringify({
          error: 'Datos incompletos',
          message: 'Nombre, email, hora de inicio y fin son requeridos',
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }
    console.log('✅ Required fields validation passed');

    // Validación de email
    console.log('🔍 Validating email format...');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.error('❌ Invalid email format:', email);
      return new Response(
        JSON.stringify({
          error: 'Email inválido',
          message: 'Por favor proporcione un email válido',
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }
    console.log('✅ Email validation passed');

    // Validación de fechas
    console.log('🔍 Validating dates...');
    const start = new Date(startTime);
    const end = new Date(endTime);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      console.error('❌ Invalid dates:', {
        startTime,
        endTime,
        start: start.getTime(),
        end: end.getTime(),
      });
      return new Response(
        JSON.stringify({
          error: 'Fechas inválidas',
          message: 'Las fechas proporcionadas no son válidas',
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    if (start >= end) {
      console.error('❌ Invalid time range:', {
        start: start.toISOString(),
        end: end.toISOString(),
      });
      return new Response(
        JSON.stringify({
          error: 'Horario inválido',
          message: 'La hora de inicio debe ser anterior a la hora de fin',
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // Validar que la cita no sea en el pasado
    if (start < new Date()) {
      console.error('❌ Appointment in the past:', {
        start: start.toISOString(),
        now: new Date().toISOString(),
      });
      return new Response(
        JSON.stringify({
          error: 'Fecha en el pasado',
          message: 'No se pueden agendar citas en el pasado',
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }
    console.log('✅ Date validation passed');

    const appointmentRequest: AppointmentRequest = {
      name,
      email,
      startTime: start,
      endTime: end,
      description,
      meetingType,
    };

    console.log(
      '📅 Creating appointment request:',
      JSON.stringify(appointmentRequest, null, 2)
    );
    console.log('🔧 Getting calendar service...');

    const calendarService = getGoogleCalendarService();
    console.log('✅ Calendar service obtained');

    console.log('🚀 Calling createAppointment...');
    const createdEvent =
      await calendarService.createAppointment(appointmentRequest);
    console.log('✅ Appointment created successfully:', createdEvent.id);

    console.log('📤 Sending success response...');
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Cita agendada exitosamente',
        appointment: {
          id: createdEvent.id,
          summary: createdEvent.summary,
          description: createdEvent.description,
          start: createdEvent.start,
          end: createdEvent.end,
          attendees: createdEvent.attendees,
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
    console.error('❌ ===== BOOK APPOINTMENT ENDPOINT ERROR =====');
    console.error('❌ Error booking appointment:', error);
    console.error(
      '❌ Error details:',
      error instanceof Error ? error.message : 'Unknown error'
    );
    console.error(
      '❌ Error stack:',
      error instanceof Error ? error.stack : 'No stack trace'
    );

    // Manejar errores específicos de Google Calendar
    let errorMessage = 'No se pudo agendar la cita. Inténtelo más tarde.';
    let statusCode = 500;
    let alternativeSlots = null;

    if (error instanceof Error) {
      if (error.message.includes('no está disponible')) {
        errorMessage =
          'El horario seleccionado ya no está disponible. Por favor seleccione otro horario.';
        statusCode = 409; // Conflict

        // Proporcionar horarios alternativos
        try {
          const calendarService = getGoogleCalendarService();
          const start = new Date(startTime);
          const alternativeDate = new Date(start);
          alternativeDate.setDate(alternativeDate.getDate() + 1); // Probar el día siguiente

          const slots = await calendarService.getAvailableSlots(
            alternativeDate,
            60
          );
          const availableSlots = slots
            .filter((slot) => slot.available)
            .slice(0, 5); // Primeros 5 slots disponibles

          alternativeSlots = availableSlots.map((slot) => ({
            start: slot.start.toISOString(),
            end: slot.end.toISOString(),
            formatted: `${slot.start.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })} - ${slot.end.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`,
          }));
        } catch (slotError) {
          console.warn('Could not get alternative slots:', slotError);
        }
      } else if (error.message.includes('quota')) {
        errorMessage = 'Límite de API alcanzado. Inténtelo más tarde.';
        statusCode = 429; // Too Many Requests
      } else if (error.message.includes('credentials')) {
        errorMessage =
          'Error de configuración del sistema. Contacte al administrador.';
        statusCode = 500;
      } else if (
        error.message.includes('network') ||
        error.message.includes('timeout')
      ) {
        errorMessage =
          'Error de conexión. Verifique su conexión a internet e inténtelo nuevamente.';
        statusCode = 503; // Service Unavailable
      }
    }

    console.log('📤 Sending error response...');
    return new Response(
      JSON.stringify({
        error: 'Error al agendar',
        message: errorMessage,
        details: error instanceof Error ? error.message : 'Error desconocido',
        alternativeSlots,
        retryAfter: statusCode === 429 ? 60 : undefined, // Retry after 1 minute for rate limits
      }),
      {
        status: statusCode,
        headers: {
          'Content-Type': 'application/json',
          ...(statusCode === 429 && { 'Retry-After': '60' }),
        },
      }
    );
  } finally {
    console.log('🏁 ===== BOOK APPOINTMENT ENDPOINT END =====');
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
