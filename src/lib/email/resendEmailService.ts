import { Resend } from 'resend';
import { PostgresAppointmentService } from '../database/postgresAppointmentService.js';
import { Appointment, EmailTemplate } from '../database/postgresSchema.js';

export class ResendEmailService {
  private resend: Resend;
  private appointmentService: PostgresAppointmentService;

  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY);
    this.appointmentService = new PostgresAppointmentService();
  }

  async sendAppointmentConfirmation(appointment: Appointment): Promise<boolean> {
    try {
      const template = await this.appointmentService.getEmailTemplate('confirmation');
      if (!template) {
        console.error('Email template not found for confirmation');
        return false;
      }

      const processedSubject = this.processTemplate(template.subject, appointment);
      const processedBody = this.processTemplate(template.body, appointment);

      const result = await this.resend.emails.send({
        from: process.env.EMAIL_FROM_ADDRESS || 'hola@iapunto.com',
        to: appointment.clientEmail,
        subject: processedSubject,
        html: processedBody,
      });

      if (result.error) {
        console.error('Error sending confirmation email:', result.error);
        await this.appointmentService.createEmailLog({
          appointmentId: appointment.id,
          emailType: 'confirmation',
          recipientEmail: appointment.clientEmail,
          subject: processedSubject,
          body: processedBody,
          status: 'failed',
          errorMessage: result.error.message,
        });
        return false;
      }

      await this.appointmentService.createEmailLog({
        appointmentId: appointment.id,
        emailType: 'confirmation',
        recipientEmail: appointment.clientEmail,
        subject: processedSubject,
        body: processedBody,
        status: 'sent',
        sentAt: new Date().toISOString(),
      });

      return true;
    } catch (error) {
      console.error('Error in sendAppointmentConfirmation:', error);
      await this.appointmentService.createEmailLog({
        appointmentId: appointment.id,
        emailType: 'confirmation',
        recipientEmail: appointment.clientEmail,
        subject: 'Confirmación de cita',
        body: 'Error al procesar el email',
        status: 'failed',
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
      });
      return false;
    }
  }

  async sendAppointmentReminder(appointment: Appointment): Promise<boolean> {
    try {
      const template = await this.appointmentService.getEmailTemplate('reminder');
      if (!template) {
        console.error('Email template not found for reminder');
        return false;
      }

      const processedSubject = this.processTemplate(template.subject, appointment);
      const processedBody = this.processTemplate(template.body, appointment);

      const result = await this.resend.emails.send({
        from: process.env.EMAIL_FROM_ADDRESS || 'hola@iapunto.com',
        to: appointment.clientEmail,
        subject: processedSubject,
        html: processedBody,
      });

      if (result.error) {
        console.error('Error sending reminder email:', result.error);
        await this.appointmentService.createEmailLog({
          appointmentId: appointment.id,
          emailType: 'reminder',
          recipientEmail: appointment.clientEmail,
          subject: processedSubject,
          body: processedBody,
          status: 'failed',
          errorMessage: result.error.message,
        });
        return false;
      }

      await this.appointmentService.createEmailLog({
        appointmentId: appointment.id,
        emailType: 'reminder',
        recipientEmail: appointment.clientEmail,
        subject: processedSubject,
        body: processedBody,
        status: 'sent',
        sentAt: new Date().toISOString(),
      });

      return true;
    } catch (error) {
      console.error('Error in sendAppointmentReminder:', error);
      await this.appointmentService.createEmailLog({
        appointmentId: appointment.id,
        emailType: 'reminder',
        recipientEmail: appointment.clientEmail,
        subject: 'Recordatorio de cita',
        body: 'Error al procesar el email',
        status: 'failed',
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
      });
      return false;
    }
  }

  async sendAppointmentCancellation(appointment: Appointment): Promise<boolean> {
    try {
      const template = await this.appointmentService.getEmailTemplate('cancellation');
      if (!template) {
        console.error('Email template not found for cancellation');
        return false;
      }

      const processedSubject = this.processTemplate(template.subject, appointment);
      const processedBody = this.processTemplate(template.body, appointment);

      const result = await this.resend.emails.send({
        from: process.env.EMAIL_FROM_ADDRESS || 'hola@iapunto.com',
        to: appointment.clientEmail,
        subject: processedSubject,
        html: processedBody,
      });

      if (result.error) {
        console.error('Error sending cancellation email:', result.error);
        await this.appointmentService.createEmailLog({
          appointmentId: appointment.id,
          emailType: 'cancellation',
          recipientEmail: appointment.clientEmail,
          subject: processedSubject,
          body: processedBody,
          status: 'failed',
          errorMessage: result.error.message,
        });
        return false;
      }

      await this.appointmentService.createEmailLog({
        appointmentId: appointment.id,
        emailType: 'cancellation',
        recipientEmail: appointment.clientEmail,
        subject: processedSubject,
        body: processedBody,
        status: 'sent',
        sentAt: new Date().toISOString(),
      });

      return true;
    } catch (error) {
      console.error('Error in sendAppointmentCancellation:', error);
      await this.appointmentService.createEmailLog({
        appointmentId: appointment.id,
        emailType: 'cancellation',
        recipientEmail: appointment.clientEmail,
        subject: 'Cancelación de cita',
        body: 'Error al procesar el email',
        status: 'failed',
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
      });
      return false;
    }
  }

  async sendAdminNotification(appointment: Appointment): Promise<boolean> {
    try {
      const template = await this.appointmentService.getEmailTemplate('admin_notification');
      if (!template) {
        console.error('Email template not found for admin notification');
        return false;
      }

      const processedSubject = this.processTemplate(template.subject, appointment);
      const processedBody = this.processTemplate(template.body, appointment);

      const adminEmail = process.env.ADMIN_EMAIL || 'admin@iapunto.com';

      const result = await this.resend.emails.send({
        from: process.env.EMAIL_FROM_ADDRESS || 'hola@iapunto.com',
        to: adminEmail,
        subject: processedSubject,
        html: processedBody,
      });

      if (result.error) {
        console.error('Error sending admin notification:', result.error);
        await this.appointmentService.createEmailLog({
          appointmentId: appointment.id,
          emailType: 'admin_notification',
          recipientEmail: adminEmail,
          subject: processedSubject,
          body: processedBody,
          status: 'failed',
          errorMessage: result.error.message,
        });
        return false;
      }

      await this.appointmentService.createEmailLog({
        appointmentId: appointment.id,
        emailType: 'admin_notification',
        recipientEmail: adminEmail,
        subject: processedSubject,
        body: processedBody,
        status: 'sent',
        sentAt: new Date().toISOString(),
      });

      return true;
    } catch (error) {
      console.error('Error in sendAdminNotification:', error);
      const adminEmail = process.env.ADMIN_EMAIL || 'admin@iapunto.com';
      await this.appointmentService.createEmailLog({
        appointmentId: appointment.id,
        emailType: 'admin_notification',
        recipientEmail: adminEmail,
        subject: 'Notificación de nueva cita',
        body: 'Error al procesar el email',
        status: 'failed',
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
      });
      return false;
    }
  }

  private processTemplate(template: string, appointment: Appointment): string {
    return template
      .replace(/\{\{clientName\}\}/g, appointment.clientName)
      .replace(/\{\{clientEmail\}\}/g, appointment.clientEmail)
      .replace(/\{\{serviceType\}\}/g, appointment.serviceType)
      .replace(/\{\{appointmentDate\}\}/g, appointment.appointmentDate)
      .replace(/\{\{appointmentTime\}\}/g, appointment.appointmentTime);
  }
}
