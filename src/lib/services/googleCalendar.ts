import { google } from 'googleapis';
import type { calendar_v3 } from 'googleapis';
import { MockCalendarService } from './mockCalendarService';

export interface AppointmentRequest {
  name: string;
  email: string;
  startTime: Date;
  endTime: Date;
  description?: string;
  meetingType?: string;
}

export interface CalendarEvent {
  id: string;
  summary: string;
  description?: string;
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
}

export interface AvailabilitySlot {
  start: Date;
  end: Date;
  available: boolean;
}

class GoogleCalendarService {
  private calendar: calendar_v3.Calendar;
  private calendarId: string;
  private timezone: string;

  constructor() {
    let auth;

    // Intentar Service Account primero (más simple para aplicaciones servidor)
    if (process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL && process.env.GOOGLE_PRIVATE_KEY) {
      try {
        auth = new google.auth.GoogleAuth({
          credentials: {
            client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
            private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
          },
          scopes: [
            'https://www.googleapis.com/auth/calendar',
            'https://www.googleapis.com/auth/calendar.events'
          ],
        });
      } catch (serviceAccountError) {
        console.warn('Service Account auth failed, falling back to OAuth2:', serviceAccountError);
        auth = null;
      }
    }

    // Fallback a OAuth2 si no hay Service Account
    if (!auth) {
      auth = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URI
      );
    }

    // Configurar el cliente de Google Calendar
    this.calendar = google.calendar({ version: 'v3', auth });
    this.calendarId = process.env.GOOGLE_CALENDAR_ID || 'primary';
    this.timezone = process.env.TIMEZONE || 'America/Mexico_City';
  }

  /**
   * Configurar tokens de acceso para el usuario autenticado
   */
  setCredentials(tokens: any) {
    const auth = this.calendar.options?.auth as any;
    if (auth && auth.setCredentials) {
      auth.setCredentials(tokens);
    }
  }

  /**
   * Obtener URL de autorización para OAuth2
   */
  getAuthUrl(): string {
    const auth = this.calendar.options?.auth as any;
    const scopes = [
      'https://www.googleapis.com/auth/calendar',
      'https://www.googleapis.com/auth/calendar.events'
    ];

    return auth.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
    });
  }

  /**
   * Intercambiar código de autorización por tokens
   */
  async getTokensFromCode(code: string) {
    const auth = this.calendar.options?.auth as any;
    const { tokens } = await auth.getToken(code);
    return tokens;
  }

  /**
   * Verificar disponibilidad en un rango de tiempo
   */
  async checkAvailability(startTime: Date, endTime: Date): Promise<boolean> {
    try {
      const response = await this.calendar.freebusy.query({
        requestBody: {
          timeMin: startTime.toISOString(),
          timeMax: endTime.toISOString(),
          items: [{ id: this.calendarId }],
          timeZone: this.timezone,
        },
      });

      const busyTimes = response.data.calendars?.[this.calendarId]?.busy || [];
      return busyTimes.length === 0;
    } catch (error) {
      console.error('Error checking availability:', error);
      throw new Error('No se pudo verificar la disponibilidad');
    }
  }

  /**
   * Obtener slots de disponibilidad para un día específico
   */
  async getAvailableSlots(date: Date, durationMinutes: number = 60): Promise<AvailabilitySlot[]> {
    const startOfDay = new Date(date);
    startOfDay.setHours(parseInt(process.env.BUSINESS_HOURS_START?.split(':')[0] || '9'), 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(parseInt(process.env.BUSINESS_HOURS_END?.split(':')[0] || '17'), 0, 0, 0);

    const slots: AvailabilitySlot[] = [];
    const slotDuration = durationMinutes * 60 * 1000; // Convert to milliseconds

    try {
      // Obtener eventos ocupados del día
      const response = await this.calendar.freebusy.query({
        requestBody: {
          timeMin: startOfDay.toISOString(),
          timeMax: endOfDay.toISOString(),
          items: [{ id: this.calendarId }],
          timeZone: this.timezone,
        },
      });

      const busyTimes = response.data.calendars?.[this.calendarId]?.busy || [];
      
      // Generar slots cada 30 minutos
      const slotInterval = 30 * 60 * 1000; // 30 minutes in milliseconds
      let currentTime = startOfDay.getTime();

      while (currentTime + slotDuration <= endOfDay.getTime()) {
        const slotStart = new Date(currentTime);
        const slotEnd = new Date(currentTime + slotDuration);

        // Verificar si el slot está ocupado
        const isAvailable = !busyTimes.some((busy: any) => {
          const busyStart = new Date(busy.start).getTime();
          const busyEnd = new Date(busy.end).getTime();
          
          return (slotStart.getTime() < busyEnd && slotEnd.getTime() > busyStart);
        });

        slots.push({
          start: slotStart,
          end: slotEnd,
          available: isAvailable,
        });

        currentTime += slotInterval;
      }

      return slots;
    } catch (error) {
      console.error('Error getting available slots:', error);
      throw new Error('No se pudieron obtener los horarios disponibles');
    }
  }

  /**
   * Crear una nueva cita en Google Calendar
   */
  async createAppointment(appointment: AppointmentRequest): Promise<CalendarEvent> {
    try {
      // Verificar disponibilidad antes de crear
      const isAvailable = await this.checkAvailability(appointment.startTime, appointment.endTime);
      
      if (!isAvailable) {
        throw new Error('El horario seleccionado no está disponible');
      }

      const event: calendar_v3.Schema$Event = {
        summary: `Consulta con ${appointment.name}`,
        description: appointment.description || `Reunión agendada con ${appointment.name}\\n\\nTipo: ${appointment.meetingType || 'Consulta general'}`,
        start: {
          dateTime: appointment.startTime.toISOString(),
          timeZone: this.timezone,
        },
        end: {
          dateTime: appointment.endTime.toISOString(),
          timeZone: this.timezone,
        },
        attendees: [
          {
            email: appointment.email,
            displayName: appointment.name,
          },
        ],
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'email', minutes: 24 * 60 }, // 24 hours before
            { method: 'popup', minutes: 30 }, // 30 minutes before
          ],
        },
        conferenceData: {
          createRequest: {
            requestId: `meet-${Date.now()}`,
            conferenceSolutionKey: {
              type: 'hangoutsMeet',
            },
          },
        },
      };

      const response = await this.calendar.events.insert({
        calendarId: this.calendarId,
        requestBody: event,
        conferenceDataVersion: 1,
        sendUpdates: 'all', // Send invitations to all attendees
      });

      const createdEvent = response.data;
      
      return {
        id: createdEvent.id!,
        summary: createdEvent.summary!,
        description: createdEvent.description,
        start: {
          dateTime: createdEvent.start!.dateTime!,
          timeZone: createdEvent.start!.timeZone!,
        },
        end: {
          dateTime: createdEvent.end!.dateTime!,
          timeZone: createdEvent.end!.timeZone!,
        },
        attendees: createdEvent.attendees?.map(attendee => ({
          email: attendee.email!,
          displayName: attendee.displayName,
          responseStatus: attendee.responseStatus,
        })),
      };
    } catch (error) {
      console.error('Error creating appointment:', error);
      throw new Error('No se pudo crear la cita');
    }
  }

  /**
   * Actualizar una cita existente
   */
  async updateAppointment(eventId: string, updates: Partial<AppointmentRequest>): Promise<CalendarEvent> {
    try {
      const event: calendar_v3.Schema$Event = {};

      if (updates.name) {
        event.summary = `Consulta con ${updates.name}`;
      }

      if (updates.startTime && updates.endTime) {
        event.start = {
          dateTime: updates.startTime.toISOString(),
          timeZone: this.timezone,
        };
        event.end = {
          dateTime: updates.endTime.toISOString(),
          timeZone: this.timezone,
        };
      }

      if (updates.description) {
        event.description = updates.description;
      }

      if (updates.email) {
        event.attendees = [
          {
            email: updates.email,
            displayName: updates.name,
          },
        ];
      }

      const response = await this.calendar.events.patch({
        calendarId: this.calendarId,
        eventId: eventId,
        requestBody: event,
        sendUpdates: 'all',
      });

      const updatedEvent = response.data;
      
      return {
        id: updatedEvent.id!,
        summary: updatedEvent.summary!,
        description: updatedEvent.description,
        start: {
          dateTime: updatedEvent.start!.dateTime!,
          timeZone: updatedEvent.start!.timeZone!,
        },
        end: {
          dateTime: updatedEvent.end!.dateTime!,
          timeZone: updatedEvent.end!.timeZone!,
        },
        attendees: updatedEvent.attendees?.map(attendee => ({
          email: attendee.email!,
          displayName: attendee.displayName,
          responseStatus: attendee.responseStatus,
        })),
      };
    } catch (error) {
      console.error('Error updating appointment:', error);
      throw new Error('No se pudo actualizar la cita');
    }
  }

  /**
   * Cancelar una cita
   */
  async cancelAppointment(eventId: string): Promise<void> {
    try {
      await this.calendar.events.delete({
        calendarId: this.calendarId,
        eventId: eventId,
        sendUpdates: 'all',
      });
    } catch (error) {
      console.error('Error canceling appointment:', error);
      throw new Error('No se pudo cancelar la cita');
    }
  }

  /**
   * Obtener detalles de una cita específica
   */
  async getAppointment(eventId: string): Promise<CalendarEvent> {
    try {
      const response = await this.calendar.events.get({
        calendarId: this.calendarId,
        eventId: eventId,
      });

      const event = response.data;
      
      return {
        id: event.id!,
        summary: event.summary!,
        description: event.description,
        start: {
          dateTime: event.start!.dateTime!,
          timeZone: event.start!.timeZone!,
        },
        end: {
          dateTime: event.end!.dateTime!,
          timeZone: event.end!.timeZone!,
        },
        attendees: event.attendees?.map(attendee => ({
          email: attendee.email!,
          displayName: attendee.displayName,
          responseStatus: attendee.responseStatus,
        })),
      };
    } catch (error) {
      console.error('Error getting appointment:', error);
      throw new Error('No se pudo obtener la información de la cita');
    }
  }
}

// Singleton instances
let googleCalendarService: GoogleCalendarService;
let mockCalendarService: MockCalendarService;

/**
 * Verificar si las credenciales de Google Calendar están configuradas
 */
function hasGoogleCredentials(): boolean {
  // Service Account (preferido)
  const hasServiceAccount = !!(
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL &&
    process.env.GOOGLE_PRIVATE_KEY &&
    process.env.GOOGLE_CALENDAR_ID
  );

  // OAuth2 (fallback)
  const hasOAuth2 = !!(
    process.env.GOOGLE_CLIENT_ID &&
    process.env.GOOGLE_CLIENT_SECRET &&
    process.env.GOOGLE_CALENDAR_ID
  );

  return hasServiceAccount || hasOAuth2;
}

export function getGoogleCalendarService(): GoogleCalendarService | MockCalendarService {
  // Si no hay credenciales configuradas, usar el mock service
  if (!hasGoogleCredentials()) {
    console.warn('Google Calendar credentials not found, using mock service');
    if (!mockCalendarService) {
      mockCalendarService = new MockCalendarService();
    }
    return mockCalendarService;
  }

  // Si hay credenciales, usar el servicio real
  if (!googleCalendarService) {
    googleCalendarService = new GoogleCalendarService();
  }
  return googleCalendarService;
}

export default GoogleCalendarService;
