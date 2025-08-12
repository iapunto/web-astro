import nodemailer from 'nodemailer';

interface EmailNotificationData {
  clientName: string;
  clientEmail: string;
  appointmentDate: Date;
  appointmentTime: string;
  meetLink?: string;
  eventId: string;
  meetingType?: string;
}

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    // Cargar variables de entorno usando dotenv
    import('dotenv').then((dotenv) => dotenv.config());

    this.transporter = nodemailer.createTransport({
      host: 'mail.iapunto.com',
      port: 587, // Puerto SMTP estándar para TLS
      secure: false, // true para 465, false para otros puertos
      auth: {
        user: process.env.SMTP_USER || 'hola@iapunto.com',
        pass: process.env.SMTP_PASSWORD, // Password del servidor propio
      },
      tls: {
        rejectUnauthorized: false, // Para evitar problemas de certificados
      },
      // Configuraciones para evitar timeouts
      connectionTimeout: 10000, // 10 segundos
      greetingTimeout: 10000, // 10 segundos
      socketTimeout: 15000, // 15 segundos
    } as any);
  }

  /**
   * Verificar la conexión del servidor de email
   */
  async verifyConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      console.log('✅ Email server connection verified');
      return true;
    } catch (error) {
      console.error('❌ Email server connection failed:', error);
      return false;
    }
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
      meetingType = 'Consulta de Marketing Digital e IA',
    } = data;

    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Cita Confirmada - IA Punto</title>
        <style>
            body { 
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
                line-height: 1.6; 
                color: #333; 
                margin: 0; 
                padding: 0; 
                background-color: #f8fafc;
            }
            .container { 
                max-width: 600px; 
                margin: 0 auto; 
                background: white;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .header { 
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white; 
                padding: 30px 20px; 
                text-align: center; 
            }
            .header h1 {
                margin: 0;
                font-size: 28px;
                font-weight: 600;
            }
            .content { 
                padding: 30px 20px; 
                background: white; 
            }
            .appointment-details {
                background: #f8fafc;
                border-left: 4px solid #667eea;
                padding: 20px;
                margin: 20px 0;
                border-radius: 0 8px 8px 0;
            }
            .meet-button {
                display: inline-block;
                background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                color: white;
                padding: 15px 30px;
                text-decoration: none;
                border-radius: 8px;
                font-weight: 600;
                margin: 20px 0;
                box-shadow: 0 4px 6px rgba(16, 185, 129, 0.25);
                transition: transform 0.2s;
            }
            .meet-button:hover {
                transform: translateY(-2px);
            }
            .footer { 
                text-align: center; 
                padding: 20px; 
                background: #f8fafc;
                color: #64748b;
                font-size: 14px;
            }
            .steps {
                background: #f0f9ff;
                border: 1px solid #bae6fd;
                border-radius: 8px;
                padding: 20px;
                margin: 20px 0;
            }
            .steps h3 {
                color: #0369a1;
                margin-top: 0;
            }
            .steps ul {
                margin: 10px 0;
                padding-left: 20px;
            }
            .steps li {
                margin: 8px 0;
                color: #0c4a6e;
            }
            .contact-info {
                background: #fef3c7;
                border: 1px solid #f59e0b;
                border-radius: 8px;
                padding: 15px;
                margin: 20px 0;
                text-align: center;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🎉 ¡Cita Confirmada!</h1>
                <p style="margin: 10px 0 0 0; opacity: 0.9;">IA Punto - Marketing Digital e IA</p>
            </div>
            
            <div class="content">
                <p>Hola <strong>${clientName}</strong>,</p>
                
                <p>¡Excelente! Tu cita ha sido <strong>confirmada exitosamente</strong>. Estamos emocionados de ayudarte con tu proyecto de marketing digital e inteligencia artificial.</p>
                
                <div class="appointment-details">
                    <h3 style="margin-top: 0; color: #1e293b;">📅 Detalles de tu cita:</h3>
                    <p><strong>Fecha:</strong> ${appointmentDate.toLocaleDateString(
                      'es-ES',
                      {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      }
                    )}</p>
                    <p><strong>Hora:</strong> ${appointmentTime} (Hora de México)</p>
                    <p><strong>Tipo de consulta:</strong> ${meetingType}</p>
                    <p><strong>Duración:</strong> 60 minutos</p>
                    <p><strong>ID de evento:</strong> ${eventId}</p>
                </div>
                
                ${
                  meetLink
                    ? `
                <div style="text-align: center; margin: 30px 0;">
                    <h3 style="color: #1e293b; margin-bottom: 15px;">🔗 Enlace de la reunión virtual:</h3>
                    <a href="${meetLink}" class="meet-button">
                        🎥 Unirse a Google Meet
                    </a>
                    <p style="font-size: 14px; color: #64748b; margin-top: 10px;">
                        El enlace estará activo 5 minutos antes de la hora programada
                    </p>
                </div>
                `
                    : `
                <div class="contact-info">
                    <p><strong>⚠️ Importante:</strong> Recibirás el enlace de Google Meet en un email separado.</p>
                </div>
                `
                }
                
                <div class="steps">
                    <h3>📋 ¿Qué sigue?</h3>
                    <ul>
                        <li><strong>Recibirás recordatorios automáticos</strong> 24 horas y 30 minutos antes de la cita</li>
                        <li><strong>Prepara información sobre tu negocio:</strong> objetivos, público objetivo, presupuesto</li>
                        <li><strong>Ten listas tus preguntas</strong> sobre marketing digital e IA</li>
                        <li><strong>Prueba tu conexión</strong> y micrófono antes de la reunión</li>
                    </ul>
                </div>
                
                <p><strong>¿Necesitas cancelar o reprogramar?</strong></p>
                <p>Responde a este email o contáctanos directamente:</p>
                <ul>
                    <li>📧 <a href="mailto:hola@iapunto.com">hola@iapunto.com</a></li>
                    <li>🌐 <a href="https://iapunto.com">iapunto.com</a></li>
                </ul>
                
                <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
                    <strong>¡Nos vemos pronto!</strong><br>
                    El equipo de IA Punto
                </p>
            </div>
            
            <div class="footer">
                <p><strong>IA Punto</strong> - Expertos en Marketing Digital e Inteligencia Artificial</p>
                <p>📧 hola@iapunto.com | 🌐 iapunto.com</p>
                <p style="font-size: 12px; margin-top: 15px;">
                    Este email fue enviado automáticamente. Por favor no respondas a este mensaje.
                </p>
            </div>
        </div>
    </body>
    </html>
    `;

    const textContent = `
¡Cita Confirmada - IA Punto!

Hola ${clientName},

Tu cita ha sido confirmada exitosamente para el ${appointmentDate.toLocaleDateString('es-ES')} a las ${appointmentTime}.

DETALLES DE LA CITA:
- Fecha: ${appointmentDate.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })}
- Hora: ${appointmentTime} (Hora de México)
- Tipo: ${meetingType}
- Duración: 60 minutos
- ID de evento: ${eventId}

${meetLink ? `ENLACE DE GOOGLE MEET: ${meetLink}` : 'Recibirás el enlace de Google Meet en un email separado.'}

¿QUÉ SIGUE?
- Recibirás recordatorios automáticos 24 horas y 30 minutos antes
- Prepara información sobre tu negocio y objetivos
- Ten listas tus preguntas sobre marketing digital e IA
- Prueba tu conexión antes de la reunión

¿Necesitas cancelar o reprogramar?
Responde a este email o contáctanos:
- Email: hola@iapunto.com
- Web: iapunto.com

¡Nos vemos pronto!
El equipo de IA Punto
    `.trim();

    const mailOptions = {
      from: `"IA Punto" <hola@iapunto.com>`,
      to: clientEmail,
      subject: `✅ Cita Confirmada - ${appointmentDate.toLocaleDateString('es-ES')} a las ${appointmentTime}`,
      html: htmlContent,
      text: textContent,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`✅ Email confirmation sent to ${clientEmail}`);
    } catch (error) {
      console.error('❌ Error sending email:', error);
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
      meetingType = 'Consulta General',
    } = data;

    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #1f2937; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9fafb; }
            .appointment-card { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6; }
            .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🔔 Nueva Cita Agendada</h1>
                <p>Sistema Automático - IA Punto</p>
            </div>
            
            <div class="content">
                <div class="appointment-card">
                    <h3>📋 Detalles del Cliente</h3>
                    <p><strong>Nombre:</strong> ${clientName}</p>
                    <p><strong>Email:</strong> <a href="mailto:${clientEmail}">${clientEmail}</a></p>
                    <p><strong>Tipo de consulta:</strong> ${meetingType}</p>
                    
                    <h3>📅 Detalles de la Cita</h3>
                    <p><strong>Fecha:</strong> ${appointmentDate.toLocaleDateString(
                      'es-ES',
                      {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      }
                    )}</p>
                    <p><strong>Hora:</strong> ${appointmentTime}</p>
                    <p><strong>ID de evento:</strong> ${eventId}</p>
                    <p><strong>Duración:</strong> 60 minutos</p>
                </div>
                
                <p><strong>Acciones recomendadas:</strong></p>
                <ul>
                    <li>Revisar el perfil del cliente en Google Calendar</li>
                    <li>Preparar información relevante sobre IA Punto</li>
                    <li>Verificar que el enlace de Google Meet esté funcionando</li>
                    <li>Enviar email de seguimiento después de la cita</li>
                </ul>
            </div>
            
            <div class="footer">
                <p>Notificación automática del sistema de citas de IA Punto</p>
                <p>📧 hola@iapunto.com | 🌐 iapunto.com</p>
            </div>
        </div>
    </body>
    </html>
    `;

    const mailOptions = {
      from: `"Sistema IA Punto" <hola@iapunto.com>`,
      to: process.env.INTERNAL_NOTIFICATION_EMAIL || 'hola@iapunto.com',
      subject: `🔔 Nueva Cita - ${clientName} - ${appointmentDate.toLocaleDateString('es-ES')} ${appointmentTime}`,
      html: htmlContent,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log('✅ Internal notification sent');
    } catch (error) {
      console.error('❌ Error sending internal notification:', error);
    }
  }

  /**
   * Enviar recordatorio de cita (24 horas antes)
   */
  async sendAppointmentReminder(data: EmailNotificationData): Promise<void> {
    const {
      clientName,
      clientEmail,
      appointmentDate,
      appointmentTime,
      meetLink,
      meetingType = 'Consulta de Marketing Digital e IA',
    } = data;

    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; background: white; }
            .header { background: #f59e0b; color: white; padding: 20px; text-align: center; }
            .content { padding: 30px 20px; }
            .reminder-box { background: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 20px; margin: 20px 0; }
            .meet-button { display: inline-block; background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>⏰ Recordatorio de Cita</h1>
                <p>Tu cita es mañana</p>
            </div>
            
            <div class="content">
                <p>Hola <strong>${clientName}</strong>,</p>
                
                <div class="reminder-box">
                    <h3>📅 Tu cita es mañana:</h3>
                    <p><strong>Fecha:</strong> ${appointmentDate.toLocaleDateString(
                      'es-ES',
                      {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      }
                    )}</p>
                    <p><strong>Hora:</strong> ${appointmentTime}</p>
                    <p><strong>Tipo:</strong> ${meetingType}</p>
                </div>
                
                ${
                  meetLink
                    ? `
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${meetLink}" class="meet-button">🔗 Unirse a Google Meet</a>
                </div>
                `
                    : ''
                }
                
                <p><strong>Preparación recomendada:</strong></p>
                <ul>
                    <li>Prueba tu conexión a internet</li>
                    <li>Verifica que tu micrófono y cámara funcionen</li>
                    <li>Ten lista información sobre tu negocio</li>
                    <li>Prepara tus preguntas sobre marketing digital e IA</li>
                </ul>
                
                <p>¡Nos vemos mañana!</p>
                <p>El equipo de IA Punto</p>
            </div>
        </div>
    </body>
    </html>
    `;

    const mailOptions = {
      from: `"IA Punto" <hola@iapunto.com>`,
      to: clientEmail,
      subject: `⏰ Recordatorio: Tu cita es mañana a las ${appointmentTime}`,
      html: htmlContent,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`✅ Reminder sent to ${clientEmail}`);
    } catch (error) {
      console.error('❌ Error sending reminder:', error);
    }
  }
}

export default EmailService;
