import nodemailer from 'nodemailer';

// Configuración de email usando Gmail SMTP

interface AppointmentEmailData {
  name: string;
  email: string;
  startTime: string;
  endTime: string;
  meetingType: string;
  description?: string;
  meetLink?: string;
}

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    // Configurar el transporter de email usando Gmail SMTP
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER || 'tuytecnologia@gmail.com',
        pass: process.env.EMAIL_PASSWORD || '', // App password de Gmail
      },
    });
  }

  async sendAppointmentConfirmation(
    data: AppointmentEmailData
  ): Promise<boolean> {
    try {
      console.log('📧 Enviando email de confirmación...');
      console.log(`📧 Para: ${data.email}`);
      console.log(`📧 Nombre: ${data.name}`);

      const startDate = new Date(data.startTime);
      const endDate = new Date(data.endTime);

      // Formatear fecha y hora en español
      const options: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'America/Bogota',
      };

      const startFormatted = startDate.toLocaleDateString('es-CO', options);
      const endFormatted = endDate.toLocaleDateString('es-CO', options);

      // Generar enlace de Google Meet manual
      const meetLink =
        data.meetLink ||
        `https://meet.google.com/${Math.random().toString(36).substr(2, 9)}-${Math.random().toString(36).substr(2, 4)}`;
      const meetLinkHtml = `<p><strong>🔗 Enlace de Google Meet:</strong> <a href="${meetLink}" target="_blank">${meetLink}</a></p>`;

      const emailHtml = `
        <!DOCTYPE html>
        <html lang="es">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Confirmación de Cita - IA Punto</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .appointment-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea; }
            .button { display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 10px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 ¡Cita Confirmada!</h1>
              <p>Tu consulta ha sido agendada exitosamente</p>
            </div>
            
            <div class="content">
              <h2>Hola ${data.name},</h2>
              
              <p>Tu cita ha sido confirmada exitosamente. Aquí están los detalles:</p>
              
              <div class="appointment-details">
                <h3>📅 Detalles de la Cita</h3>
                <p><strong>Fecha y Hora:</strong> ${startFormatted}</p>
                <p><strong>Duración:</strong> 1 hora</p>
                <p><strong>Tipo de Consulta:</strong> ${data.meetingType}</p>
                ${data.description ? `<p><strong>Descripción:</strong> ${data.description}</p>` : ''}
                ${meetLinkHtml}
              </div>
              
              <h3>📋 Preparación para la Cita</h3>
              <ul>
                <li>Ten listos tus documentos o preguntas</li>
                <li>Si es virtual, asegúrate de tener una conexión estable a internet</li>
                <li>Llega 5 minutos antes de la hora programada</li>
              </ul>
              
              <h3>🔄 Cambios o Cancelaciones</h3>
              <p>Si necesitas cambiar o cancelar tu cita, por favor contáctanos con al menos 24 horas de anticipación.</p>
              
              <p><strong>Contacto:</strong></p>
              <ul>
                <li>📧 Email: info@iapunto.com</li>
                <li>📱 WhatsApp: +57 300 XXX XXXX</li>
                <li>🌐 Web: https://iapunto.com</li>
              </ul>
              
              <p>¡Nos vemos pronto!</p>
              <p><strong>El equipo de IA Punto</strong></p>
            </div>
            
            <div class="footer">
              <p>Este es un email automático, por favor no respondas a este mensaje.</p>
              <p>© 2024 IA Punto. Todos los derechos reservados.</p>
            </div>
          </div>
        </body>
        </html>
      `;

      const mailOptions = {
        from: `"IA Punto" <${process.env.EMAIL_USER || 'tuytecnologia@gmail.com'}>`,
        to: data.email,
        subject: `✅ Cita Confirmada - ${data.meetingType} - ${startFormatted}`,
        html: emailHtml,
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('✅ Email enviado exitosamente');
      console.log('📧 Message ID:', result.messageId);

      return true;
    } catch (error) {
      console.error('❌ Error enviando email:', error);
      return false;
    }
  }

  async sendNotificationToAdmin(data: AppointmentEmailData): Promise<boolean> {
    try {
      console.log('📧 Enviando notificación al administrador...');

      const startDate = new Date(data.startTime);
      const endDate = new Date(data.endTime);

      const options: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'America/Bogota',
      };

      const startFormatted = startDate.toLocaleDateString('es-CO', options);

      const emailHtml = `
        <!DOCTYPE html>
        <html lang="es">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Nueva Cita Agendada - IA Punto</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #ff6b6b; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .appointment-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ff6b6b; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📅 Nueva Cita Agendada</h1>
              <p>Se ha agendado una nueva consulta</p>
            </div>
            
            <div class="content">
              <h2>Detalles de la Nueva Cita</h2>
              
              <div class="appointment-details">
                <h3>👤 Cliente</h3>
                <p><strong>Nombre:</strong> ${data.name}</p>
                <p><strong>Email:</strong> ${data.email}</p>
                
                <h3>📅 Cita</h3>
                <p><strong>Fecha y Hora:</strong> ${startFormatted}</p>
                <p><strong>Tipo de Consulta:</strong> ${data.meetingType}</p>
                ${data.description ? `<p><strong>Descripción:</strong> ${data.description}</p>` : ''}
                ${data.meetLink ? `<p><strong>Google Meet:</strong> <a href="${data.meetLink}">${data.meetLink}</a></p>` : ''}
              </div>
              
              <p><strong>Acciones recomendadas:</strong></p>
              <ul>
                <li>Revisar la información del cliente</li>
                <li>Preparar materiales para la consulta</li>
                <li>Confirmar disponibilidad en el calendario</li>
              </ul>
            </div>
          </div>
        </body>
        </html>
      `;

      const mailOptions = {
        from: `"IA Punto - Sistema" <${process.env.EMAIL_USER || 'tuytecnologia@gmail.com'}>`,
        to: process.env.ADMIN_EMAIL || 'tuytecnologia@gmail.com',
        subject: `📅 Nueva Cita: ${data.name} - ${data.meetingType} - ${startFormatted}`,
        html: emailHtml,
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('✅ Notificación al admin enviada exitosamente');

      return true;
    } catch (error) {
      console.error('❌ Error enviando notificación al admin:', error);
      return false;
    }
  }
}

export default EmailService;
