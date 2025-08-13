import type { APIRoute } from 'astro';
import EmailService from '../../../lib/services/emailService.js';

export const GET: APIRoute = async () => {
  try {
    console.log('🧪 ===== PRUEBA CONFIGURACIÓN EMAIL =====');
    
    // Verificar variables de entorno
    const emailUser = process.env.EMAIL_USER || import.meta.env.EMAIL_USER;
    const emailPassword = process.env.EMAIL_PASSWORD || import.meta.env.EMAIL_PASSWORD;
    const adminEmail = process.env.ADMIN_EMAIL || import.meta.env.ADMIN_EMAIL;
    
    console.log('📧 EMAIL_USER configurado:', !!emailUser);
    console.log('📧 EMAIL_PASSWORD configurado:', !!emailPassword);
    console.log('📧 ADMIN_EMAIL configurado:', !!adminEmail);
    
    if (!emailUser || !emailPassword) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Credenciales de email no configuradas',
        details: {
          emailUser: !!emailUser,
          emailPassword: !!emailPassword,
          adminEmail: !!adminEmail
        },
        instructions: [
          '1. Configure EMAIL_USER en las variables de entorno',
          '2. Configure EMAIL_PASSWORD (App Password de Gmail) en las variables de entorno',
          '3. Configure ADMIN_EMAIL para notificaciones al administrador',
          '4. Para Gmail, use App Passwords en lugar de la contraseña normal',
          '5. Habilite la verificación en 2 pasos en Gmail antes de crear App Password'
        ]
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Crear instancia del servicio de email
    const emailService = new EmailService();
    
    // Datos de prueba
    const testData = {
      name: 'Usuario de Prueba',
      email: emailUser, // Enviar a sí mismo para prueba
      startTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Mañana
      endTime: new Date(Date.now() + 25 * 60 * 60 * 1000).toISOString(),
      meetingType: 'Prueba de Email',
      description: 'Esta es una prueba del sistema de email',
      meetLink: 'https://meet.google.com/test-123-456'
    };
    
    console.log('📧 Enviando email de prueba...');
    
    // Intentar enviar email de confirmación
    const confirmationResult = await emailService.sendAppointmentConfirmation(testData);
    
    // Intentar enviar notificación al admin
    const adminResult = await emailService.sendNotificationToAdmin(testData);
    
    return new Response(JSON.stringify({
      success: true,
      message: 'Prueba de email completada',
      results: {
        confirmationEmail: confirmationResult ? '✅ Enviado' : '❌ Falló',
        adminNotification: adminResult ? '✅ Enviado' : '❌ Falló'
      },
      testData: {
        to: testData.email,
        subject: `Prueba de Email - ${testData.meetingType}`,
        meetLink: testData.meetLink
      },
      configuration: {
        emailUser: emailUser ? '✅ Configurado' : '❌ No configurado',
        emailPassword: emailPassword ? '✅ Configurado' : '❌ No configurado',
        adminEmail: adminEmail ? '✅ Configurado' : '❌ No configurado'
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('❌ Error en prueba de email:', error);
    return new Response(JSON.stringify({
      success: false,
      message: 'Error durante la prueba de email',
      error: error instanceof Error ? error.message : 'Error desconocido'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
