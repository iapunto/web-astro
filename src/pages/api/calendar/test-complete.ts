import type { APIRoute } from 'astro';
import { google } from 'googleapis';
import * as dotenv from 'dotenv';
import EmailService from '../../../lib/services/emailService';

export const GET: APIRoute = async () => {
  try {
    console.log('🧪 Testing complete appointment system...');
    
    // Cargar variables de entorno usando dotenv
    const result = dotenv.config();
    
    if (result.error) {
      throw new Error(`Error loading .env file: ${result.error.message}`);
    }
    
    const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY;
    const calendarId = process.env.GOOGLE_CALENDAR_ID || 'primary';
    
    console.log('📋 Credentials from dotenv:');
    console.log(`  - Email: ${serviceAccountEmail ? 'SET' : 'NOT SET'}`);
    console.log(`  - Private Key: ${privateKey ? 'SET' : 'NOT SET'}`);
    console.log(`  - Calendar ID: ${calendarId}`);
    
    if (!serviceAccountEmail || !privateKey) {
      throw new Error('Missing Google Calendar credentials in .env file');
    }
    
    console.log('🔑 Using dotenv credentials...');
    
    // Crear autenticación con GoogleAuth
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: serviceAccountEmail,
        private_key: privateKey.replace(/\\n/g, '\n'),
      },
      scopes: [
        'https://www.googleapis.com/auth/calendar',
        'https://www.googleapis.com/auth/calendar.events',
      ],
    });
    
    console.log('🔐 Auth created, getting calendar...');
    
    // Crear cliente de calendar
    const calendar = google.calendar({ version: 'v3', auth: await auth.getClient() });
    
    console.log('📅 Calendar client created, creating test event with Google Meet...');
    
    // Crear un evento de prueba con Google Meet
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(10, 0, 0, 0);
    
    const endTime = new Date(tomorrow.getTime() + 60 * 60 * 1000); // +1 hora
    
    // Generar ID único para la conferencia
    const conferenceId = `meet-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const event = {
      summary: 'Prueba Completa - IA Punto (Google Meet)',
      description: 'Evento de prueba completo con Google Meet y notificaciones por email',
      start: {
        dateTime: tomorrow.toISOString(),
        timeZone: 'America/Bogota',
      },
      end: {
        dateTime: endTime.toISOString(),
        timeZone: 'America/Bogota',
      },
             // Configurar Google Meet automáticamente
       conferenceData: {
         createRequest: {
           requestId: conferenceId,
           conferenceSolutionKey: {
             type: 'addOn',
           },
         },
       },
      // Configurar permisos del evento
      guestsCanModify: false,
      guestsCanInviteOthers: false,
      guestsCanSeeOtherGuests: false,
      // Configurar visibilidad
      transparency: 'opaque', // Muestra como ocupado
      // Configurar ubicación virtual
      location: 'Reunión Virtual - Google Meet',
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 },
          { method: 'popup', minutes: 30 },
        ],
      },
    };
    
    console.log('📝 Creating event with Google Meet data:', JSON.stringify(event, null, 2));
    
    const response = await calendar.events.insert({
      calendarId: calendarId,
      requestBody: event,
      conferenceDataVersion: 1, // Importante para crear Google Meet
      sendUpdates: 'none', // No enviar invitaciones automáticas
    });
    
    console.log('✅ Event created successfully!');
    console.log('📊 Event details:', JSON.stringify(response.data, null, 2));
    
    // Extraer enlace de Google Meet
    const meetLink = response.data.conferenceData?.entryPoints?.find(
      (entry) => entry.entryPointType === 'video'
    )?.uri;
    
    if (meetLink) {
      console.log(`🔗 Google Meet link generated: ${meetLink}`);
    } else {
      console.warn('⚠️ No Google Meet link found in event response');
    }
    
    // Probar envío de emails
    console.log('📧 Testing email notifications...');
    const emailService = new EmailService();
    
    const emailData = {
      clientName: 'Cliente de Prueba Completa',
      clientEmail: 'test@example.com',
      appointmentDate: tomorrow,
      appointmentTime: tomorrow.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      meetLink,
      eventId: response.data.id!,
      meetingType: 'Prueba Completa',
    };
    
    try {
      await emailService.sendAppointmentConfirmation(emailData);
      console.log('✅ Confirmation email sent successfully');
      
      await emailService.sendInternalNotification(emailData);
      console.log('✅ Internal notification email sent successfully');
    } catch (emailError) {
      console.error('❌ Email sending failed:', emailError);
    }
    
    return new Response(
      JSON.stringify(
        {
          success: true,
          message: 'Complete test successful - Event created with Google Meet and emails sent',
          eventId: response.data.id,
          summary: response.data.summary,
          start: response.data.start,
          end: response.data.end,
          htmlLink: response.data.htmlLink,
          meetLink,
          conferenceData: response.data.conferenceData,
          emailsSent: meetLink ? ['confirmation', 'internal'] : [],
        },
        null,
        2
      ),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('❌ Complete test failed:', error);
    
    return new Response(
      JSON.stringify(
        {
          success: false,
          error: 'Complete test failed',
          details: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : 'No stack trace',
        },
        null,
        2
      ),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
};
