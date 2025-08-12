import type { APIRoute } from 'astro';
import EmailService from '../../../lib/services/emailService';

export const GET: APIRoute = async () => {
  try {
    console.log('🧪 Testing email service...');
    
    const emailService = new EmailService();
    
    // Verificar conexión
    const connectionOk = await emailService.verifyConnection();
    
    if (!connectionOk) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Email service connection failed',
          message: 'No se pudo conectar al servidor de email',
        }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }
    
    // Enviar email de prueba
    const testData = {
      clientName: 'Cliente de Prueba',
      clientEmail: 'test@example.com',
      appointmentDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Mañana
      appointmentTime: '10:00',
      meetLink: 'https://meet.google.com/test-link',
      eventId: 'test-event-id',
      meetingType: 'Consulta de Prueba',
    };
    
    console.log('📧 Sending test email...');
    await emailService.sendAppointmentConfirmation(testData);
    
    console.log('📧 Sending internal notification...');
    await emailService.sendInternalNotification(testData);
    
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Test emails sent successfully',
        connection: 'OK',
        emailsSent: ['confirmation', 'internal'],
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('❌ Email test failed:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Email test failed',
        details: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : 'No stack trace',
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
