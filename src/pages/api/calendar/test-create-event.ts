import type { APIRoute } from 'astro';
import { google } from 'googleapis';

export const GET: APIRoute = async () => {
  try {
    console.log('🧪 Testing direct event creation...');
    
    // Credenciales hardcodeadas para prueba
    const serviceAccountEmail = 'services-web@ia-punto.iam.gserviceaccount.com';
    const privateKey = `-----BEGIN PRIVATE KEY-----
MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCqUxhqh6dNlAcp
+5XwILKxXY09tB+LobtNLY27OPz8Uv6sl23lz4TZ+D4Uulmkpn8oRs9ipKLEgc/o
ft5NNsK++wiwKa4E7MU+ahjFUEH9CyRGCnvEUurLHyKaGUGIM2wMypbegT/XviBs
d+9N/RpETrQZyaZVtEPgu3xsd2xN3IJTFeS1hC4YW6p+2zaT5Df3zXJCQQsfZZgp
3dvYy6qv6WvUpL2meuPSPOBwZvTqMejXcPHe9LBFsbOJEBU3jjOAwOWkKb4N+d9e
NV4hW9VMREm1BHf3AiVGgG8av9dqMX6I9G5S5ppk92KJPaWQ9D9OkbSNExt3tpJT
cs3ucPPDI3J9m+e4fJYvcaeq3oc7cfIleZQGbK8CgYBTKlO0GeJW9aiF6K/f1rJQ
f1LLOHdbZghnn8bO6Zj5xmHst83bVs3uxMXrnSMSlecTbTNTtyW/cwejWJ9x832u
ZW1hhfSTS62fpgYA4bJ0VWtg8UIHWk0wQ7HbWafIZHUDpJt/NANFsesblND3TrZG
MaEvf4f8s0so9ufwgmEhOw==
-----END PRIVATE KEY-----`;
    const calendarId = 'primary';
    
    console.log('🔑 Using hardcoded credentials...');
    
    // Crear autenticación con GoogleAuth
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: serviceAccountEmail,
        private_key: privateKey,
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
      summary: 'Prueba de Integración - IA Punto',
      description: 'Evento de prueba para verificar la integración con Google Calendar',
      start: {
        dateTime: tomorrow.toISOString(),
        timeZone: 'America/Bogota',
      },
      end: {
        dateTime: endTime.toISOString(),
        timeZone: 'America/Bogota',
      },
      attendees: [
        { email: 'test@example.com' },
      ],
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
          message: 'Test event created successfully',
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
    console.error('❌ Direct event creation failed:', error);
    
    return new Response(
      JSON.stringify(
        {
          success: false,
          error: 'Direct event creation failed',
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
