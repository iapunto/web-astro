import type { APIRoute } from 'astro';
import { getAppointmentService } from '../../../lib/services/appointmentService.js';
import type { AppointmentRequest } from '../../../lib/services/googleCalendar.js';

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
      console.error('❌ Missing required fields');
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Faltan campos requeridos: name, email, startTime, endTime'
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
    if (!emailRegex.test(email)) {
      console.error('❌ Invalid email format');
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

    // Validar fechas
    const startDate = new Date(startTime);
    const endDate = new Date(endTime);
    const now = new Date();

    if (startDate < now) {
      console.error('❌ Start time is in the past');
      return new Response(
        JSON.stringify({
          success: false,
          error: 'La fecha de inicio no puede estar en el pasado'
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    if (endDate <= startDate) {
      console.error('❌ End time must be after start time');
      return new Response(
        JSON.stringify({
          success: false,
          error: 'La fecha de fin debe ser posterior a la fecha de inicio'
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    console.log('✅ All validations passed');

    // Obtener el servicio de agendamiento
    console.log('🔍 Getting appointment service...');
    const appointmentService = getAppointmentService();
    const serviceInfo = appointmentService.getServiceInfo();
    
    console.log(`📅 Using service: ${serviceInfo.name}`);
    console.log('🎯 Service features:', serviceInfo.features);

    // Verificar conexión del servicio
    console.log('🔍 Verifying service connection...');
    const isConnected = await appointmentService.verifyConnection();
    
    if (!isConnected) {
      console.error('❌ Service connection failed');
      return new Response(
        JSON.stringify({
          success: false,
          error: 'No se pudo conectar con el servicio de agendamiento'
        }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    console.log('✅ Service connection verified');

    // Crear la cita
    console.log('🚀 Creating appointment...');
    const appointmentData: AppointmentRequest = {
      name,
      email,
      startTime: startDate,
      endTime: endDate,
      description: description || '',
      meetingType: meetingType || 'Consulta General'
    };

    const createdAppointment = await appointmentService.createAppointment(appointmentData);

    console.log('✅ Appointment created successfully');
    console.log('📅 Appointment details:', {
      id: createdAppointment.id,
      summary: createdAppointment.summary,
      start: createdAppointment.start,
      end: createdAppointment.end,
      meetLink: createdAppointment.meetLink
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Cita creada exitosamente',
        appointment: {
          id: createdAppointment.id,
          summary: createdAppointment.summary,
          start: createdAppointment.start,
          end: createdAppointment.end,
          meetLink: createdAppointment.meetLink
        },
        service: serviceInfo.name,
        serviceType: serviceInfo.type
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

  } catch (error) {
    console.error('❌ ===== BOOK APPOINTMENT ENDPOINT ERROR =====');
    console.error('❌ Error details:', error);
    console.error('❌ Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    console.error('🏁 ===== BOOK APPOINTMENT ENDPOINT END =====');

    return new Response(
      JSON.stringify({
        success: false,
        error: 'Error interno del servidor',
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
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
};
