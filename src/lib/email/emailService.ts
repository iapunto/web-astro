import nodemailer from 'nodemailer';
import { AppointmentService } from '../database/appointmentService';
import { Appointment, EmailTemplate } from '../database/schema';

export class EmailService {
  private transporter: nodemailer.Transporter;
  private appointmentService: AppointmentService;

  constructor() {
    this.appointmentService = new AppointmentService();
    this.initializeTransporter();
  }

  private initializeTransporter() {
    // Configuración del transporter
    this.transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false, // true para 465, false para otros puertos
      auth: {
        user: process.env.SMTP_USER || 'hola@iapunto.com',
        pass: process.env.SMTP_PASSWORD || '',
      },
    });
  }

  // ===== MÉTODOS DE ENVÍO DE EMAILS =====

  async sendAppointmentConfirmation(appointment: Appointment): Promise<boolean> {
    try {
      const template = await this.appointmentService.getEmailTemplate('appointment_confirmation');
      if (!template) {
        throw new Error('Plantilla de confirmación no encontrada');
      }

      const emailContent = this.processTemplate(template.htmlContent, appointment);
      const textContent = this.processTemplate(template.textContent, appointment);

      const mailOptions = {
        from: `"${process.env.EMAIL_FROM_NAME || 'IA Punto'}" <${process.env.EMAIL_FROM_ADDRESS || 'hola@iapunto.com'}>`,
        to: appointment.clientEmail,
        subject: template.subject,
        html: emailContent,
        text: textContent,
      };

      const result = await this.transporter.sendMail(mailOptions);

      // Registrar el envío en la base de datos
      await this.appointmentService.createEmailLog({
        appointmentId: appointment.id,
        emailType: 'confirmation',
        recipientEmail: appointment.clientEmail,
        subject: template.subject,
        content: emailContent,
        status: 'sent',
      });

      // Marcar la cita como email enviado
      await this.appointmentService.updateAppointment(appointment.id, {
        emailSent: true
      });

      console.log(`✅ Email de confirmación enviado a ${appointment.clientEmail}`);
      return true;

    } catch (error) {
      console.error('❌ Error enviando email de confirmación:', error);

      // Registrar el error en la base de datos
      await this.appointmentService.createEmailLog({
        appointmentId: appointment.id,
        emailType: 'confirmation',
        recipientEmail: appointment.clientEmail,
        subject: 'Confirmación de Cita',
        content: '',
        status: 'failed',
        errorMessage: error instanceof Error ? error.message : 'Error desconocido'
      });

      return false;
    }
  }

  async sendAppointmentReminder(appointment: Appointment, meetLink?: string): Promise<boolean> {
    try {
      const template = await this.appointmentService.getEmailTemplate('appointment_reminder');
      if (!template) {
        throw new Error('Plantilla de recordatorio no encontrada');
      }

      // Agregar el enlace de Meet si está disponible
      const appointmentWithMeet = {
        ...appointment,
        meetLink: meetLink || 'Se enviará antes de la reunión'
      };

      const emailContent = this.processTemplate(template.htmlContent, appointmentWithMeet);
      const textContent = this.processTemplate(template.textContent, appointmentWithMeet);

      const mailOptions = {
        from: `"${process.env.EMAIL_FROM_NAME || 'IA Punto'}" <${process.env.EMAIL_FROM_ADDRESS || 'hola@iapunto.com'}>`,
        to: appointment.clientEmail,
        subject: template.subject,
        html: emailContent,
        text: textContent,
      };

      const result = await this.transporter.sendMail(mailOptions);

      // Registrar el envío en la base de datos
      await this.appointmentService.createEmailLog({
        appointmentId: appointment.id,
        emailType: 'reminder',
        recipientEmail: appointment.clientEmail,
        subject: template.subject,
        content: emailContent,
        status: 'sent',
      });

      console.log(`✅ Email de recordatorio enviado a ${appointment.clientEmail}`);
      return true;

    } catch (error) {
      console.error('❌ Error enviando email de recordatorio:', error);

      // Registrar el error en la base de datos
      await this.appointmentService.createEmailLog({
        appointmentId: appointment.id,
        emailType: 'reminder',
        recipientEmail: appointment.clientEmail,
        subject: 'Recordatorio de Cita',
        content: '',
        status: 'failed',
        errorMessage: error instanceof Error ? error.message : 'Error desconocido'
      });

      return false;
    }
  }

  async sendAppointmentCancellation(appointment: Appointment, reason?: string): Promise<boolean> {
    try {
      const template = await this.appointmentService.getEmailTemplate('appointment_cancellation');
      if (!template) {
        // Si no hay plantilla de cancelación, usar una genérica
        const emailContent = this.generateCancellationEmail(appointment, reason);
        
        const mailOptions = {
          from: `"${process.env.EMAIL_FROM_NAME || 'IA Punto'}" <${process.env.EMAIL_FROM_ADDRESS || 'hola@iapunto.com'}>`,
          to: appointment.clientEmail,
          subject: 'Tu cita con IA Punto ha sido cancelada',
          html: emailContent,
          text: this.stripHtml(emailContent),
        };

        const result = await this.transporter.sendMail(mailOptions);

        // Registrar el envío en la base de datos
        await this.appointmentService.createEmailLog({
          appointmentId: appointment.id,
          emailType: 'cancellation',
          recipientEmail: appointment.clientEmail,
          subject: 'Tu cita con IA Punto ha sido cancelada',
          content: emailContent,
          status: 'sent',
        });

        console.log(`✅ Email de cancelación enviado a ${appointment.clientEmail}`);
        return true;
      }

      const emailContent = this.processTemplate(template.htmlContent, appointment);
      const textContent = this.processTemplate(template.textContent, appointment);

      const mailOptions = {
        from: `"${process.env.EMAIL_FROM_NAME || 'IA Punto'}" <${process.env.EMAIL_FROM_ADDRESS || 'hola@iapunto.com'}>`,
        to: appointment.clientEmail,
        subject: template.subject,
        html: emailContent,
        text: textContent,
      };

      const result = await this.transporter.sendMail(mailOptions);

      // Registrar el envío en la base de datos
      await this.appointmentService.createEmailLog({
        appointmentId: appointment.id,
        emailType: 'cancellation',
        recipientEmail: appointment.clientEmail,
        subject: template.subject,
        content: emailContent,
        status: 'sent',
      });

      console.log(`✅ Email de cancelación enviado a ${appointment.clientEmail}`);
      return true;

    } catch (error) {
      console.error('❌ Error enviando email de cancelación:', error);

      // Registrar el error en la base de datos
      await this.appointmentService.createEmailLog({
        appointmentId: appointment.id,
        emailType: 'cancellation',
        recipientEmail: appointment.clientEmail,
        subject: 'Cancelación de Cita',
        content: '',
        status: 'failed',
        errorMessage: error instanceof Error ? error.message : 'Error desconocido'
      });

      return false;
    }
  }

  async sendAdminNotification(appointment: Appointment, notificationType: 'new' | 'cancelled' | 'updated'): Promise<boolean> {
    try {
      const adminEmail = process.env.ADMIN_EMAIL || 'hola@iapunto.com';
      
      let subject = '';
      let content = '';

      switch (notificationType) {
        case 'new':
          subject = 'Nueva cita programada - IA Punto';
          content = this.generateNewAppointmentNotification(appointment);
          break;
        case 'cancelled':
          subject = 'Cita cancelada - IA Punto';
          content = this.generateCancelledAppointmentNotification(appointment);
          break;
        case 'updated':
          subject = 'Cita actualizada - IA Punto';
          content = this.generateUpdatedAppointmentNotification(appointment);
          break;
      }

      const mailOptions = {
        from: `"${process.env.EMAIL_FROM_NAME || 'IA Punto'}" <${process.env.EMAIL_FROM_ADDRESS || 'hola@iapunto.com'}>`,
        to: adminEmail,
        subject: subject,
        html: content,
        text: this.stripHtml(content),
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log(`✅ Notificación de administrador enviada a ${adminEmail}`);
      return true;

    } catch (error) {
      console.error('❌ Error enviando notificación de administrador:', error);
      return false;
    }
  }

  // ===== MÉTODOS DE UTILIDAD =====

  private processTemplate(template: string, appointment: Appointment & { meetLink?: string }): string {
    return template
      .replace(/\{\{clientName\}\}/g, appointment.clientName)
      .replace(/\{\{clientEmail\}\}/g, appointment.clientEmail)
      .replace(/\{\{appointmentDate\}\}/g, appointment.appointmentDate)
      .replace(/\{\{appointmentTime\}\}/g, appointment.appointmentTime)
      .replace(/\{\{serviceType\}\}/g, appointment.serviceType)
      .replace(/\{\{duration\}\}/g, appointment.duration.toString())
      .replace(/\{\{description\}\}/g, appointment.description || '')
      .replace(/\{\{meetLink\}\}/g, appointment.meetLink || 'Se enviará antes de la reunión');
  }

  private generateCancellationEmail(appointment: Appointment, reason?: string): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #dc2626;">Tu cita ha sido cancelada</h2>
        <p>Hola ${appointment.clientName},</p>
        <p>Lamentamos informarte que tu cita con IA Punto ha sido cancelada.</p>
        
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Detalles de la cita cancelada:</h3>
          <p><strong>Fecha:</strong> ${appointment.appointmentDate}</p>
          <p><strong>Hora:</strong> ${appointment.appointmentTime}</p>
          <p><strong>Servicio:</strong> ${appointment.serviceType}</p>
          ${reason ? `<p><strong>Motivo:</strong> ${reason}</p>` : ''}
        </div>
        
        <p>Puedes programar una nueva cita visitando nuestro sitio web.</p>
        
        <p>Saludos,<br>El equipo de IA Punto</p>
      </div>
    `;
  }

  private generateNewAppointmentNotification(appointment: Appointment): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #059669;">Nueva cita programada</h2>
        <p>Se ha programado una nueva cita en el sistema.</p>
        
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Detalles de la cita:</h3>
          <p><strong>Cliente:</strong> ${appointment.clientName}</p>
          <p><strong>Email:</strong> ${appointment.clientEmail}</p>
          <p><strong>Teléfono:</strong> ${appointment.clientPhone || 'No proporcionado'}</p>
          <p><strong>Fecha:</strong> ${appointment.appointmentDate}</p>
          <p><strong>Hora:</strong> ${appointment.appointmentTime}</p>
          <p><strong>Servicio:</strong> ${appointment.serviceType}</p>
          <p><strong>Duración:</strong> ${appointment.duration} minutos</p>
          ${appointment.description ? `<p><strong>Descripción:</strong> ${appointment.description}</p>` : ''}
        </div>
        
        <p>ID de la cita: ${appointment.id}</p>
      </div>
    `;
  }

  private generateCancelledAppointmentNotification(appointment: Appointment): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #dc2626;">Cita cancelada</h2>
        <p>Se ha cancelado una cita en el sistema.</p>
        
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Detalles de la cita cancelada:</h3>
          <p><strong>Cliente:</strong> ${appointment.clientName}</p>
          <p><strong>Email:</strong> ${appointment.clientEmail}</p>
          <p><strong>Fecha:</strong> ${appointment.appointmentDate}</p>
          <p><strong>Hora:</strong> ${appointment.appointmentTime}</p>
          <p><strong>Servicio:</strong> ${appointment.serviceType}</p>
        </div>
        
        <p>ID de la cita: ${appointment.id}</p>
      </div>
    `;
  }

  private generateUpdatedAppointmentNotification(appointment: Appointment): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Cita actualizada</h2>
        <p>Se ha actualizado una cita en el sistema.</p>
        
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Detalles actualizados:</h3>
          <p><strong>Cliente:</strong> ${appointment.clientName}</p>
          <p><strong>Email:</strong> ${appointment.clientEmail}</p>
          <p><strong>Fecha:</strong> ${appointment.appointmentDate}</p>
          <p><strong>Hora:</strong> ${appointment.appointmentTime}</p>
          <p><strong>Servicio:</strong> ${appointment.serviceType}</p>
          <p><strong>Estado:</strong> ${appointment.status}</p>
        </div>
        
        <p>ID de la cita: ${appointment.id}</p>
      </div>
    `;
  }

  private stripHtml(html: string): string {
    return html.replace(/<[^>]*>/g, '');
  }

  // Verificar conexión del transporter
  async verifyConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      console.log('✅ Conexión de email verificada correctamente');
      return true;
    } catch (error) {
      console.error('❌ Error verificando conexión de email:', error);
      return false;
    }
  }
}
