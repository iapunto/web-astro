import type { APIRoute } from 'astro';
import { google } from 'googleapis';
import * as dotenv from 'dotenv';

export const GET: APIRoute = async () => {
  try {
    console.log('🧪 Testing with dotenv library...');
    
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
    
    console.log('📅 Calendar client created, creating test event...');
    
    // Crear un evento de prueba
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(10, 0, 0, 0);
    
    const endTime = new Date(tomorrow.getTime() + 60 * 60 * 1000); // +1 hora
    
    const event = {
      summary: 'Prueba de Integración - IA Punto (dotenv)',
      description: 'Evento de prueba usando dotenv para cargar credenciales',
      start: {
        dateTime: tomorrow.toISOString(),
        timeZone: 'America/Bogota',
      },
      end: {
        dateTime: endTime.toISOString(),
        timeZone: 'America/Bogota',
      },
      // No agregar asistentes automáticamente (Service Account no puede invitar)
      // Los asistentes se manejarán por email manual
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 },
          { method: 'popup', minutes: 30 },
        ],
      },
    };
    
    console.log('📝 Creating event with data:', JSON.stringify(event, null, 2));
    
    const response = await calendar.events.insert({
      calendarId: calendarId,
      requestBody: event,
      sendUpdates: 'none', // No enviar invitaciones automáticas
    });
    
    console.log('✅ Event created successfully!');
    console.log('📊 Event details:', JSON.stringify(response.data, null, 2));
    
    return new Response(
      JSON.stringify(
        {
          success: true,
          message: 'Test event created successfully using dotenv',
          eventId: response.data.id,
          summary: response.data.summary,
          start: response.data.start,
          end: response.data.end,
          htmlLink: response.data.htmlLink,
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
    console.error('❌ Event creation with dotenv failed:', error);
    
    return new Response(
      JSON.stringify(
        {
          success: false,
          error: 'Event creation with dotenv failed',
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
