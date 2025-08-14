import { google } from 'googleapis';
import { AppointmentService } from '../database/appointmentService';
import { EmailService } from '../email/emailService';
import { Appointment } from '../database/schema';

export interface CreateAppointmentRequest {
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  appointmentDate: string; // YYYY-MM-DD
  appointmentTime: string; // HH:MM
  serviceType: string;
  description?: string;
}

export interface AppointmentResult {
  success: boolean;
  appointment?: Appointment;
  googleCalendarEventId?: string;
  meetLink?: string;
  emailSent: boolean;
  error?: string;
}

export class AppointmentManager {
  private appointmentService: AppointmentService;
  private emailService: EmailService;
  private calendar: any;
  private calendarId: string;
  private timezone: string;

  constructor() {
    this.appointmentService = new AppointmentService();
    this.emailService = new EmailService();
    this.initializeGoogleCalendar();
  }

  private initializeGoogleCalendar() {
    this.calendarId = process.env.GOOGLE_CALENDAR_ID || 'primary';
    this.timezone = process.env.TIMEZONE || 'America/Bogota';

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

    this.calendar = google.calendar({ version: 'v3', auth });
  }

  // ===== MÉTODO PRINCIPAL DE CREACIÓN DE CITAS =====

  async createAppointment(request: CreateAppointmentRequest): Promise<AppointmentResult> {
    try {
      console.log('🚀 Iniciando creación de cita:', request);

      // 1. Validar disponibilidad
      const isAvailable = await this.checkAvailability(request.appointmentDate, request.appointmentTime);
      if (!isAvailable) {
        return {
          success: false,
          error: 'El horario seleccionado no está disponible'
        };
      }

      // 2. Verificar límite diario
      const dailyCount = await this.appointmentService.getDailyAppointmentsCount(request.appointmentDate);
      const maxAppointments = parseInt(await this.appointmentService.getSystemSetting('max_appointments_per_day') || '3');
      
      if (dailyCount >= maxAppointments) {
        return {
          success: false,
          error: `Se ha alcanzado el límite de ${maxAppointments} citas para este día`
        };
      }

      // 3. Crear cita en base de datos
      const appointmentDateTime = new Date(`${request.appointmentDate}T${request.appointmentTime}:00`);
      const duration = parseInt(await this.appointmentService.getSystemSetting('appointment_duration') || '60');

      const appointment = await this.appointmentService.createAppointment({
        clientName: request.clientName,
        clientEmail: request.clientEmail,
        clientPhone: request.clientPhone,
        appointmentDate: request.appointmentDate,
        appointmentTime: request.appointmentTime,
        appointmentDateTime: appointmentDateTime.toISOString(),
        duration: duration,
        serviceType: request.serviceType,
        description: request.description,
        status: 'confirmed' // Confirmar automáticamente
      });

      console.log('✅ Cita creada en base de datos:', appointment.id);

      // 4. Crear evento en Google Calendar
      let googleCalendarEventId: string | undefined;
      let meetLink: string | undefined;

      try {
        const calendarEvent = await this.createGoogleCalendarEvent(appointment);
        googleCalendarEventId = calendarEvent.id;
        meetLink = calendarEvent.hangoutLink;

        // Actualizar cita con ID de Google Calendar
        await this.appointmentService.updateAppointment(appointment.id, {
          googleCalendarEventId: googleCalendarEventId,
          googleCalendarSynced: true
        });

        console.log('✅ Evento creado en Google Calendar:', googleCalendarEventId);
      } catch (error) {
        console.error('⚠️ Error creando evento en Google Calendar:', error);
        // Continuar sin Google Calendar si falla
      }

      // 5. Enviar email de confirmación
      let emailSent = false;
      try {
        emailSent = await this.emailService.sendAppointmentConfirmation(appointment);
        console.log('✅ Email de confirmación enviado');
      } catch (error) {
        console.error('⚠️ Error enviando email de confirmación:', error);
        // Continuar sin email si falla
      }

      // 6. Enviar notificación al administrador
      try {
        await this.emailService.sendAdminNotification(appointment, 'new');
        console.log('✅ Notificación de administrador enviada');
      } catch (error) {
        console.error('⚠️ Error enviando notificación de administrador:', error);
      }

      return {
        success: true,
        appointment: appointment,
        googleCalendarEventId: googleCalendarEventId,
        meetLink: meetLink,
        emailSent: emailSent
      };

    } catch (error) {
      console.error('❌ Error en createAppointment:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  }

  // ===== MÉTODOS DE GOOGLE CALENDAR =====

  private async createGoogleCalendarEvent(appointment: Appointment): Promise<any> {
    const startTime = new Date(`${appointment.appointmentDate}T${appointment.appointmentTime}:00`);
    const endTime = new Date(startTime.getTime() + appointment.duration * 60 * 1000);

    const event = {
      summary: `Consulta con ${appointment.clientName}`,
      description: `
Tipo de consulta: ${appointment.serviceType}

Cliente: ${appointment.clientName} (${appointment.clientEmail})
${appointment.clientPhone ? `Teléfono: ${appointment.clientPhone}` : ''}
${appointment.description ? `Descripción: ${appointment.description}` : ''}

ID de cita: ${appointment.id}
      `.trim(),
      start: {
        dateTime: startTime.toISOString(),
        timeZone: this.timezone,
      },
      end: {
        dateTime: endTime.toISOString(),
        timeZone: this.timezone,
      },
      attendees: [
        { email: appointment.clientEmail },
        { email: process.env.GOOGLE_CALENDAR_ID || 'tuytecnologia@gmail.com' }
      ],
      conferenceData: {
        createRequest: {
          requestId: appointment.id,
          conferenceSolutionKey: {
            type: 'hangoutsMeet'
          }
        }
      },
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 }, // 1 día antes
          { method: 'popup', minutes: 15 } // 15 minutos antes
        ]
      }
    };

    const response = await this.calendar.events.insert({
      calendarId: this.calendarId,
      resource: event,
      conferenceDataVersion: 1,
      sendUpdates: 'all'
    });

    return response.data;
  }

  // ===== MÉTODOS DE DISPONIBILIDAD =====

  async checkAvailability(date: string, time: string): Promise<boolean> {
    // 1. Verificar en base de datos local
    const isAvailableInDB = await this.appointmentService.checkAvailability(date, time);
    if (!isAvailableInDB) {
      return false;
    }

    // 2. Verificar en Google Calendar
    try {
      const isAvailableInGoogle = await this.checkGoogleCalendarAvailability(date, time);
      return isAvailableInGoogle;
    } catch (error) {
      console.error('Error verificando disponibilidad en Google Calendar:', error);
      // Si no se puede verificar en Google Calendar, confiar en la base de datos
      return isAvailableInDB;
    }
  }

  private async checkGoogleCalendarAvailability(date: string, time: string): Promise<boolean> {
    const startTime = new Date(`${date}T${time}:00`);
    const endTime = new Date(startTime.getTime() + 60 * 60 * 1000); // +1 hora

    const response = await this.calendar.freebusy.query({
      requestBody: {
        timeMin: startTime.toISOString(),
        timeMax: endTime.toISOString(),
        items: [{ id: this.calendarId }],
        timeZone: this.timezone,
      },
    });

    const busySlots = response.data.calendars?.[this.calendarId]?.busy || [];
    return busySlots.length === 0;
  }

  async getAvailabilityForDate(date: string): Promise<any[]> {
    // Obtener configuración del sistema
    const businessHoursStart = await this.appointmentService.getSystemSetting('business_hours_start') || '09:00';
    const businessHoursEnd = await this.appointmentService.getSystemSetting('business_hours_end') || '17:00';
    const maxAppointments = parseInt(await this.appointmentService.getSystemSetting('max_appointments_per_day') || '3');

    // Verificar si es fin de semana
    const dateObj = new Date(date);
    const dayOfWeek = dateObj.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    if (isWeekend) {
      return [];
    }

    // Verificar límite diario
    const dailyCount = await this.appointmentService.getDailyAppointmentsCount(date);
    if (dailyCount >= maxAppointments) {
      return [];
    }

    // Generar horarios disponibles
    const startHour = parseInt(businessHoursStart.split(':')[0]);
    const endHour = parseInt(businessHoursEnd.split(':')[0]);
    const timeSlots = [];

    for (let hour = startHour; hour < endHour; hour++) {
      // Excluir hora de almuerzo
      if (hour === 12) continue;

      const time = `${hour.toString().padStart(2, '0')}:00`;
      const isAvailable = await this.checkAvailability(date, time);

      if (isAvailable) {
        const formattedHour = hour < 12 ? `${hour.toString().padStart(2, '0')}:00 a. m.` : 
                             hour === 12 ? '12:00 p. m.' :
                             `${(hour - 12).toString().padStart(2, '0')}:00 p. m.`;

        timeSlots.push({
          time: time,
          formatted: formattedHour,
          available: true
        });
      }
    }

    return timeSlots;
  }

  // ===== MÉTODOS DE GESTIÓN DE CITAS =====

  async cancelAppointment(appointmentId: string, reason?: string): Promise<boolean> {
    try {
      const appointment = await this.appointmentService.getAppointmentById(appointmentId);
      if (!appointment) {
        throw new Error('Cita no encontrada');
      }

      // 1. Cancelar en Google Calendar
      if (appointment.googleCalendarEventId) {
        try {
          await this.calendar.events.delete({
            calendarId: this.calendarId,
            eventId: appointment.googleCalendarEventId,
            sendUpdates: 'all'
          });
          console.log('✅ Evento cancelado en Google Calendar');
        } catch (error) {
          console.error('⚠️ Error cancelando evento en Google Calendar:', error);
        }
      }

      // 2. Actualizar en base de datos
      await this.appointmentService.updateAppointment(appointmentId, {
        status: 'cancelled'
      });

      // 3. Enviar email de cancelación
      try {
        await this.emailService.sendAppointmentCancellation(appointment, reason);
        console.log('✅ Email de cancelación enviado');
      } catch (error) {
        console.error('⚠️ Error enviando email de cancelación:', error);
      }

      // 4. Notificar al administrador
      try {
        await this.emailService.sendAdminNotification(appointment, 'cancelled');
        console.log('✅ Notificación de cancelación enviada al administrador');
      } catch (error) {
        console.error('⚠️ Error enviando notificación de cancelación:', error);
      }

      return true;

    } catch (error) {
      console.error('❌ Error cancelando cita:', error);
      return false;
    }
  }

  async rescheduleAppointment(appointmentId: string, newDate: string, newTime: string): Promise<boolean> {
    try {
      const appointment = await this.appointmentService.getAppointmentById(appointmentId);
      if (!appointment) {
        throw new Error('Cita no encontrada');
      }

      // Verificar disponibilidad del nuevo horario
      const isAvailable = await this.checkAvailability(newDate, newTime);
      if (!isAvailable) {
        throw new Error('El nuevo horario no está disponible');
      }

      // 1. Actualizar en Google Calendar
      if (appointment.googleCalendarEventId) {
        try {
          const startTime = new Date(`${newDate}T${newTime}:00`);
          const endTime = new Date(startTime.getTime() + appointment.duration * 60 * 1000);

          await this.calendar.events.patch({
            calendarId: this.calendarId,
            eventId: appointment.googleCalendarEventId,
            resource: {
              start: {
                dateTime: startTime.toISOString(),
                timeZone: this.timezone,
              },
              end: {
                dateTime: endTime.toISOString(),
                timeZone: this.timezone,
              }
            },
            sendUpdates: 'all'
          });
          console.log('✅ Evento actualizado en Google Calendar');
        } catch (error) {
          console.error('⚠️ Error actualizando evento en Google Calendar:', error);
        }
      }

      // 2. Actualizar en base de datos
      const newDateTime = new Date(`${newDate}T${newTime}:00`);
      await this.appointmentService.updateAppointment(appointmentId, {
        appointmentDate: newDate,
        appointmentTime: newTime,
        appointmentDateTime: newDateTime.toISOString()
      });

      // 3. Notificar al administrador
      try {
        const updatedAppointment = await this.appointmentService.getAppointmentById(appointmentId);
        if (updatedAppointment) {
          await this.emailService.sendAdminNotification(updatedAppointment, 'updated');
          console.log('✅ Notificación de reprogramación enviada al administrador');
        }
      } catch (error) {
        console.error('⚠️ Error enviando notificación de reprogramación:', error);
      }

      return true;

    } catch (error) {
      console.error('❌ Error reprogramando cita:', error);
      return false;
    }
  }

  // ===== MÉTODOS DE UTILIDAD =====

  async getAppointmentStats(startDate: string, endDate: string) {
    return await this.appointmentService.getAppointmentStats(startDate, endDate);
  }

  async getUpcomingAppointments(limit: number = 10) {
    return await this.appointmentService.getUpcomingAppointments(limit);
  }

  async getPendingAppointments() {
    return await this.appointmentService.getPendingAppointments();
  }

  // Cerrar conexiones
  close(): void {
    this.appointmentService.close();
  }
}
