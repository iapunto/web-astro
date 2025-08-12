import type { AppointmentRequest } from './googleCalendar.js';
import GoogleCalendarService from './googleCalendar.js';
import EmailService from './emailService.js';

class AppointmentService {
  private googleCalendarService: GoogleCalendarService;
  private emailService: EmailService;

  constructor() {
    this.googleCalendarService = new GoogleCalendarService();
    this.emailService = new EmailService();
    console.log('🎯 Using Google Calendar as appointment service');
  }

  async createAppointment(appointmentData: AppointmentRequest): Promise<any> {
    console.log('🚀 Creating appointment using Google Calendar...');
    
    try {
      const result = await this.googleCalendarService.createAppointment(appointmentData);
      
      // Enviar emails de confirmación
      await this.sendConfirmationEmails(appointmentData, result);
      return result;
    } catch (error) {
      console.error('❌ Error creating appointment with Google Calendar:', error);
      throw error;
    }
  }

  async verifyConnection(): Promise<boolean> {
    console.log('🔍 Verifying Google Calendar connection...');
    
    try {
      return await this.googleCalendarService.verifyConnection();
    } catch (error) {
      console.error('❌ Connection verification failed:', error);
      return false;
    }
  }

  async getAvailableSlots(date: Date): Promise<any[]> {
    console.log('📅 Getting available slots from Google Calendar...');
    
    try {
      return await this.googleCalendarService.getAvailableSlots(date);
    } catch (error) {
      console.error('❌ Error getting available slots:', error);
      return [];
    }
  }

  async cancelAppointment(eventId: string, reason?: string): Promise<boolean> {
    console.log('❌ Canceling appointment using Google Calendar...');
    
    try {
      return await this.googleCalendarService.cancelAppointment(eventId, reason);
    } catch (error) {
      console.error('❌ Error canceling appointment:', error);
      return false;
    }
  }

  async getEventDetails(eventId: string): Promise<any> {
    console.log('📋 Getting event details from Google Calendar...');
    
    try {
      return await this.googleCalendarService.getAppointment(eventId);
    } catch (error) {
      console.error('❌ Error getting event details:', error);
      return null;
    }
  }

  private async sendConfirmationEmails(appointmentData: AppointmentRequest, result: any): Promise<void> {
    try {
      console.log('📧 Sending confirmation emails...');
      
      // Email de confirmación al cliente
      await this.emailService.sendAppointmentConfirmation({
        clientName: appointmentData.name,
        clientEmail: appointmentData.email,
        appointmentDate: appointmentData.startTime,
        appointmentTime: appointmentData.startTime.toLocaleTimeString('es-ES', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        meetLink: result.meetLink,
        eventId: result.id,
        meetingType: appointmentData.meetingType || 'Consulta General',
      });

      // Notificación interna
      await this.emailService.sendInternalNotification({
        clientName: appointmentData.name,
        clientEmail: appointmentData.email,
        appointmentDate: appointmentData.startTime,
        appointmentTime: appointmentData.startTime.toLocaleTimeString('es-ES', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        eventId: result.id,
        meetingType: appointmentData.meetingType || 'Consulta General',
      });

      console.log('✅ Confirmation emails sent successfully');
    } catch (error) {
      console.error('❌ Error sending confirmation emails:', error);
      // No fallar la creación del evento por problemas de email
    }
  }

  getServiceInfo(): any {
    return {
      name: 'Google Calendar',
      type: 'google-calendar',
      features: [
        'Creación directa de eventos',
        'Integración con Google Meet',
        'Notificaciones automáticas',
        'Gestión de disponibilidad',
        'Sincronización con Google Calendar'
      ],
      config: {
        hasGoogleConfig: this.hasGoogleConfig()
      }
    };
  }

  private hasGoogleConfig(): boolean {
    return !!(process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL && process.env.GOOGLE_PRIVATE_KEY);
  }
}

let appointmentServiceInstance: AppointmentService | null = null;

export function getAppointmentService(): AppointmentService {
  if (!appointmentServiceInstance) {
    appointmentServiceInstance = new AppointmentService();
  }
  return appointmentServiceInstance;
}

export default AppointmentService;
