import nodemailer from 'nodemailer';

interface EmailNotificationData {
  clientName: string;
  clientEmail: string;
  appointmentDate: Date;
  appointmentTime: string;
  meetLink?: string;
  eventId: string;
}

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransporter({
      service: 'gmail', // O tu servicio SMTP preferido
      auth: {
        user: process.env.SMTP_USER, // tu-email@gmail.com
        pass: process.env.SMTP_APP_PASSWORD, // App password de Gmail
      },
    });
  }

  /**
   * Enviar confirmación de cita al cliente
   */
  async sendAppointmentConfirmation(
    data: EmailNotificationData
  ): Promise<void> {
    const {
      clientName,
      clientEmail,
      appointmentDate,
      appointmentTime,
      meetLink,
      eventId,
    } = data;

    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9fafb; }
            .button { display: inline-block; background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0; }
            .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🎉 Cita Confirmada - IA Punto</h1>
            </div>
            
            <div class="content">
                <p>Hola <strong>${clientName}</strong>,</p>
                
                <p>Tu cita ha sido <strong>confirmada exitosamente</strong>. Aquí están los detalles:</p>
                
                <div style="background: white; padding: 15px; border-radius: 8px; margin: 20px 0;">
                    <p><strong>📅 Fecha:</strong> ${appointmentDate.toLocaleDateString(
                      'es-ES',
                      {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      }
                    )}</p>
                    <p><strong>🕐 Hora:</strong> ${appointmentTime}</p>
                    <p><strong>💼 Tipo:</strong> Consulta de Marketing Digital e IA</p>
                    <p><strong>📧 ID de evento:</strong> ${eventId}</p>
                </div>
                
                ${
                  meetLink
                    ? `
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${meetLink}" class="button">🔗 Unirse a Google Meet</a>
                </div>
                `
                    : ''
                }
                
                <p><strong>¿Qué sigue?</strong></p>
                <ul>
                    <li>Recibirás un recordatorio 24 horas antes</li>
                    <li>Prepara tus preguntas sobre marketing digital e IA</li>
                    <li>Ten lista información sobre tu negocio</li>
                </ul>
                
                <p>Si necesitas cancelar o reprogramar, responde a este email o contáctanos.</p>
            </div>
            
            <div class="footer">
                <p>IA Punto - Expertos en Marketing Digital e Inteligencia Artificial</p>
                <p>📧 info@iapunto.com | 🌐 iapunto.com</p>
            </div>
        </div>
    </body>
    </html>
    `;

    const mailOptions = {
      from: `"IA Punto" <${process.env.SMTP_USER}>`,
      to: clientEmail,
      subject: `✅ Cita Confirmada - ${appointmentDate.toLocaleDateString('es-ES')} a las ${appointmentTime}`,
      html: htmlContent,
      text: `
Hola ${clientName},

Tu cita ha sido confirmada para el ${appointmentDate.toLocaleDateString('es-ES')} a las ${appointmentTime}.

${meetLink ? `Enlace de Google Meet: ${meetLink}` : ''}

ID de evento: ${eventId}

Saludos,
IA Punto
      `.trim(),
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Email confirmation sent to ${clientEmail}`);
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('No se pudo enviar el email de confirmación');
    }
  }

  /**
   * Enviar notificación interna al equipo
   */
  async sendInternalNotification(data: EmailNotificationData): Promise<void> {
    const {
      clientName,
      clientEmail,
      appointmentDate,
      appointmentTime,
      eventId,
    } = data;

    const mailOptions = {
      from: `"Sistema IA Punto" <${process.env.SMTP_USER}>`,
      to: process.env.INTERNAL_NOTIFICATION_EMAIL || process.env.SMTP_USER,
      subject: `🔔 Nueva Cita Agendada - ${clientName}`,
      html: `
        <h2>Nueva Cita Agendada</h2>
        <p><strong>Cliente:</strong> ${clientName}</p>
        <p><strong>Email:</strong> ${clientEmail}</p>
        <p><strong>Fecha:</strong> ${appointmentDate.toLocaleDateString('es-ES')}</p>
        <p><strong>Hora:</strong> ${appointmentTime}</p>
        <p><strong>ID de evento:</strong> ${eventId}</p>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log('Internal notification sent');
    } catch (error) {
      console.error('Error sending internal notification:', error);
    }
  }
}

export default EmailService;
