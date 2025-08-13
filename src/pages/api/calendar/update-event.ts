import type { APIRoute } from 'astro';
import { google } from 'googleapis';
import { getStaffForCalendar } from '../../../lib/constants/staff.js';
import * as dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

interface UpdateEventRequest {
  eventId: string;
  attendees?: Array<{
    email: string;
    displayName?: string;
  }>;
  summary?: string;
  description?: string;
  addGoogleMeet?: boolean;
}

interface CalendarEvent {
  id: string;
  summary: string;
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
  attendees?: Array<{
    email: string;
    displayName?: string;
    responseStatus?: string;
  }>;
  meetLink?: string;
}

class GoogleCalendarService {
  private calendar: any;
  private calendarId: string;
  private timezone: string;

  constructor() {
    // Configurar autenticación con Service Account
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: [
        'https://www.googleapis.com/auth/calendar',
        'https://www.googleapis.com/auth/calendar.events',
      ],
    });

    // Configurar impersonación del usuario de Google Workspace (requerido para Google Meet)
    if (process.env.GOOGLE_WORKSPACE_USER) {
      console.log(
        '🔐 Configurada impersonación para:',
        process.env.GOOGLE_WORKSPACE_USER
      );
    } else {
      console.warn(
        '⚠️ GOOGLE_WORKSPACE_USER no configurado. Google Meet puede no funcionar.'
      );
    }

    this.calendar = google.calendar({ version: 'v3', auth });
    this.calendarId = process.env.GOOGLE_CALENDAR_ID || 'primary';
    this.timezone = process.env.TIMEZONE || 'America/Bogota';
  }

  async getEvent(eventId: string): Promise<any> {
    try {
      console.log(`🔍 Obteniendo evento: ${eventId}`);

      const response = await this.calendar.events.get({
        calendarId: this.calendarId,
        eventId: eventId,
      });

      console.log('✅ Evento obtenido exitosamente');
      return response.data;
    } catch (error) {
      console.error('❌ Error obteniendo evento:', error);
      throw error;
    }
  }

  async updateEvent(
    eventId: string,
    updates: UpdateEventRequest
  ): Promise<CalendarEvent> {
    try {
      console.log('🚀 ===== ACTUALIZANDO EVENTO =====');
      console.log(`📝 Actualizando evento: ${eventId}`);

      // Obtener el evento actual
      const currentEvent = await this.getEvent(eventId);

      if (!currentEvent) {
        throw new Error('Evento no encontrado');
      }

      // Preparar los datos de actualización
      const updateData: any = {};

      // Actualizar resumen si se proporciona
      if (updates.summary) {
        updateData.summary = updates.summary;
      }

      // Actualizar descripción si se proporciona
      if (updates.description) {
        updateData.description = updates.description;
      }

      // Nota: Google Meet se agrega manualmente desde Google Calendar
      if (updates.addGoogleMeet) {
        console.log('ℹ️ Google Meet debe agregarse manualmente desde Google Calendar');
      }

      // Agregar invitados si se proporcionan
      if (updates.attendees && updates.attendees.length > 0) {
        // Combinar invitados existentes con nuevos
        const existingAttendees = currentEvent.attendees || [];
        const newAttendees = updates.attendees.map((attendee) => ({
          email: attendee.email,
          displayName: attendee.displayName,
        }));

        // Filtrar duplicados por email
        const allAttendees = [...existingAttendees];
        newAttendees.forEach((newAttendee) => {
          const exists = allAttendees.some(
            (existing) => existing.email === newAttendee.email
          );
          if (!exists) {
            allAttendees.push(newAttendee);
          }
        });

        updateData.attendees = allAttendees;
      }

      console.log('📋 Datos de actualización:', updateData);

      // Actualizar el evento
      const response = await this.calendar.events.update({
        calendarId: this.calendarId,
        eventId: eventId,
        requestBody: updateData,
        sendUpdates: updates.attendees ? 'all' : 'none', // Enviar actualizaciones solo si hay invitados
      });

      const updatedEvent = response.data;

      console.log(`✅ Evento actualizado exitosamente: ${updatedEvent.id}`);
      console.log(`📅 Resumen del evento: ${updatedEvent.summary}`);
      console.log(`👥 Invitados: ${updatedEvent.attendees?.length || 0}`);

      // Nota sobre Google Meet manual
      console.log('ℹ️ Google Meet se agrega manualmente desde Google Calendar');

      console.log('🏁 ===== EVENTO ACTUALIZADO =====');

      return {
        id: updatedEvent.id!,
        summary: updatedEvent.summary!,
        start: {
          dateTime: updatedEvent.start!.dateTime!,
          timeZone: updatedEvent.start!.timeZone!,
        },
        end: {
          dateTime: updatedEvent.end!.dateTime!,
          timeZone: updatedEvent.end!.timeZone!,
        },
        attendees: updatedEvent.attendees?.map((attendee: any) => ({
          email: attendee.email!,
          displayName: attendee.displayName || undefined,
          responseStatus: attendee.responseStatus || undefined,
        })),
        meetLink: undefined, // Google Meet se agrega manualmente
      };
    } catch (error) {
      console.error('❌ Error actualizando evento:', error);
      throw error;
    }
  }

  async addAttendeesToEvent(
    eventId: string,
    attendees: Array<{ email: string; displayName?: string }>
  ): Promise<CalendarEvent> {
    try {
      console.log('🚀 ===== AGREGANDO INVITADOS =====');
      console.log(
        `📝 Agregando ${attendees.length} invitados al evento: ${eventId}`
      );

      // Obtener el evento actual
      const currentEvent = await this.getEvent(eventId);

      if (!currentEvent) {
        throw new Error('Evento no encontrado');
      }

      // Obtener miembros del staff de IA Punto
      const staffMembers = getStaffForCalendar();

      // Combinar invitados existentes con nuevos + staff
      const existingAttendees = currentEvent.attendees || [];
      const allAttendees = [...existingAttendees];

      // Agregar nuevos invitados (evitando duplicados)
      attendees.forEach((newAttendee) => {
        const exists = allAttendees.some(
          (existing) => existing.email === newAttendee.email
        );
        if (!exists) {
          allAttendees.push({
            email: newAttendee.email,
            displayName: newAttendee.displayName,
          });
        }
      });

      // Agregar staff si no están ya incluidos
      staffMembers.forEach((staffMember) => {
        const exists = allAttendees.some(
          (existing) => existing.email === staffMember.email
        );
        if (!exists) {
          allAttendees.push(staffMember);
        }
      });

      console.log(`👥 Total de invitados: ${allAttendees.length}`);

      // Actualizar el evento con los nuevos invitados
      const response = await this.calendar.events.update({
        calendarId: this.calendarId,
        eventId: eventId,
        requestBody: {
          attendees: allAttendees,
        },
        sendUpdates: 'none', // No enviar invitaciones automáticas sin Domain-Wide Delegation
      });

      const updatedEvent = response.data;

      console.log(`✅ Invitados agregados exitosamente`);
      console.log(`📧 Emails agregados: ${allAttendees.map(a => a.email).join(', ')}`);
      console.log('ℹ️ Nota: Las invitaciones deben enviarse manualmente desde Google Calendar');

      return {
        id: updatedEvent.id!,
        summary: updatedEvent.summary!,
        start: {
          dateTime: updatedEvent.start!.dateTime!,
          timeZone: updatedEvent.start!.timeZone!,
        },
        end: {
          dateTime: updatedEvent.end!.dateTime!,
          timeZone: updatedEvent.end!.timeZone!,
        },
        attendees: updatedEvent.attendees?.map((attendee: any) => ({
          email: attendee.email!,
          displayName: attendee.displayName || undefined,
          responseStatus: attendee.responseStatus || undefined,
        })),
        meetLink: undefined, // Google Meet se agrega manualmente
      };
    } catch (error) {
      console.error('❌ Error agregando invitados:', error);
      throw error;
    }
  }
}

export const POST: APIRoute = async ({ request }) => {
  console.log('🚀 ===== ENDPOINT DE ACTUALIZACIÓN DE EVENTO INICIADO =====');
  console.log('📥 Solicitud recibida en /api/calendar/update-event');

  try {
    console.log('📋 Parseando cuerpo de la solicitud...');
    const body = await request.json();
    console.log('✅ Cuerpo de la solicitud parseado exitosamente');
    console.log('📝 Datos de la solicitud:', JSON.stringify(body, null, 2));

    // Validación de datos requeridos
    const { eventId, attendees, summary, description, addGoogleMeet } = body;

    console.log('🔍 Validando campos requeridos...');
    if (!eventId) {
      console.error('❌ Falta eventId requerido');
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Falta campo requerido: eventId',
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // Validar que al menos un campo de actualización esté presente
    if (!attendees && !summary && !description && !addGoogleMeet) {
      console.error('❌ No se proporcionaron campos para actualizar');
      return new Response(
        JSON.stringify({
          success: false,
          error:
            'Debe proporcionar al menos un campo para actualizar: attendees, summary, description, o addGoogleMeet',
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // Validar formato de emails si se proporcionan invitados
    if (attendees && Array.isArray(attendees)) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      for (const attendee of attendees) {
        if (!attendee.email || !emailRegex.test(attendee.email)) {
          console.error('❌ Formato de email inválido en invitados');
          return new Response(
            JSON.stringify({
              success: false,
              error: `Formato de email inválido: ${attendee.email}`,
            }),
            {
              status: 400,
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );
        }
      }
    }

    console.log('✅ Todas las validaciones pasaron');

    // Crear instancia del servicio de Google Calendar
    console.log('🔍 Creando servicio de Google Calendar...');
    const calendarService = new GoogleCalendarService();

    // Actualizar el evento
    console.log('🚀 Actualizando evento...');
    const updateData: UpdateEventRequest = {
      eventId,
      attendees,
      summary,
      description,
      addGoogleMeet,
    };

    const updatedEvent = await calendarService.updateEvent(eventId, updateData);

    console.log('✅ Evento actualizado exitosamente');
    console.log('📅 Detalles del evento actualizado:', {
      id: updatedEvent.id,
      summary: updatedEvent.summary,
      attendees: updatedEvent.attendees?.length || 0,
      meetLink: updatedEvent.meetLink,
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Evento actualizado exitosamente',
        event: {
          id: updatedEvent.id,
          summary: updatedEvent.summary,
          start: updatedEvent.start,
          end: updatedEvent.end,
          attendees: updatedEvent.attendees,
          meetLink: updatedEvent.meetLink,
        },
        service: 'Google Calendar',
        serviceType: 'google-calendar',
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('❌ ===== ERROR EN ENDPOINT DE ACTUALIZACIÓN =====');
    console.error('❌ Detalles del error:', error);
    console.error(
      '❌ Stack del error:',
      error instanceof Error ? error.stack : 'Sin stack trace'
    );
    console.error('🏁 ===== FIN DEL ENDPOINT DE ACTUALIZACIÓN =====');

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

// Endpoint específico para agregar solo invitados
export const PUT: APIRoute = async ({ request }) => {
  console.log('🚀 ===== ENDPOINT DE AGREGAR INVITADOS INICIADO =====');
  console.log('📥 Solicitud recibida en /api/calendar/update-event (PUT)');

  try {
    console.log('📋 Parseando cuerpo de la solicitud...');
    const body = await request.json();
    console.log('✅ Cuerpo de la solicitud parseado exitosamente');
    console.log('📝 Datos de la solicitud:', JSON.stringify(body, null, 2));

    // Validación de datos requeridos
    const { eventId, attendees } = body;

    console.log('🔍 Validando campos requeridos...');
    if (!eventId || !attendees) {
      console.error('❌ Faltan campos requeridos');
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Faltan campos requeridos: eventId, attendees',
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // Validar que attendees sea un array
    if (!Array.isArray(attendees) || attendees.length === 0) {
      console.error('❌ attendees debe ser un array no vacío');
      return new Response(
        JSON.stringify({
          success: false,
          error: 'attendees debe ser un array no vacío',
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // Validar formato de emails
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    for (const attendee of attendees) {
      if (!attendee.email || !emailRegex.test(attendee.email)) {
        console.error('❌ Formato de email inválido en invitados');
        return new Response(
          JSON.stringify({
            success: false,
            error: `Formato de email inválido: ${attendee.email}`,
          }),
          {
            status: 400,
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
      }
    }

    console.log('✅ Todas las validaciones pasaron');

    // Crear instancia del servicio de Google Calendar
    console.log('🔍 Creando servicio de Google Calendar...');
    const calendarService = new GoogleCalendarService();

    // Agregar invitados al evento
    console.log('🚀 Agregando invitados al evento...');
    const updatedEvent = await calendarService.addAttendeesToEvent(
      eventId,
      attendees
    );

    console.log('✅ Invitados agregados exitosamente');
    console.log('📅 Detalles del evento actualizado:', {
      id: updatedEvent.id,
      summary: updatedEvent.summary,
      attendees: updatedEvent.attendees?.length || 0,
      meetLink: updatedEvent.meetLink,
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Invitados agregados exitosamente',
        event: {
          id: updatedEvent.id,
          summary: updatedEvent.summary,
          start: updatedEvent.start,
          end: updatedEvent.end,
          attendees: updatedEvent.attendees,
          meetLink: updatedEvent.meetLink,
        },
        service: 'Google Calendar',
        serviceType: 'google-calendar',
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('❌ ===== ERROR EN ENDPOINT DE AGREGAR INVITADOS =====');
    console.error('❌ Detalles del error:', error);
    console.error(
      '❌ Stack del error:',
      error instanceof Error ? error.stack : 'Sin stack trace'
    );
    console.error('🏁 ===== FIN DEL ENDPOINT DE AGREGAR INVITADOS =====');

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
      'Access-Control-Allow-Methods': 'POST, PUT, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
};
