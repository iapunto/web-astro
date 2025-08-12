import type { APIRoute } from 'astro';
import { google } from 'googleapis';

export const GET: APIRoute = async () => {
  try {
    console.log('🧪 Testing direct Google Calendar connection...');

    // Credenciales hardcodeadas para prueba
    const serviceAccountEmail = 'services-web@ia-punto.iam.gserviceaccount.com';
    const privateKey =
      '-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCqUxhqh6dNlAcp\n+5XwILKxXY09tB+LobtNLY27OPz8Uv6sl23lz4TZ+D4Uulmkpn8oRs9ipKLEgc/o\nft5NNsK++wiwKa4E7MU+ahjFUEH9CyRGCnvEUurLHyKaGUGIM2wMypbegT/XviBs\nd+9N/RpETrQZyaZVtEPgu3xsd2xN3IJTFeS1hC4YW6p+2zaT5Df3zXJCQQsfZZgp\n3dvYy6qv6WvUpL2meuPSPOBwZvTqMejXcPHe9LBFsbOJEBU3jjOAwOWkKb4N+d9e\nNV4hW9VMREm1BHf3AiVGgG8av9dqMX6I9G5S5ppk92KJPaWQ9D9OkbSNExt3tpJT\ncs3ucPPDI3J9m+e4fJYvcaeq3oc7cfIleZQGbK8CgYBTKlO0GeJW9aiF6K/f1rJQ\nf1LLOHdbZghnn8bO6Zj5xmHst83bVs3uxMXrnSMSlecTbTNTtyW/cwejWJ9x832u\nZW1hhfSTS62fpgYA4bJ0VWtg8UIHWk0wQ7HbWafIZHUDpJt/NANFsesblND3TrZG\nMaEvf4f8s0so9ufwgmEhOw==\n-----END PRIVATE KEY-----';
    const calendarId = 'tuytecnologia@gmail.com';

    console.log('🔑 Using hardcoded credentials...');

    // Crear autenticación
    const auth = new google.auth.JWT(
      serviceAccountEmail,
      undefined,
      privateKey,
      ['https://www.googleapis.com/auth/calendar']
    );

    console.log('🔐 Auth created, getting calendar...');

    // Crear cliente de calendar
    const calendar = google.calendar({ version: 'v3', auth });

    console.log('📅 Calendar client created, testing connection...');

    // Probar conexión con una operación más específica
    console.log('📅 Testing calendar access with specific calendar ID...');

    // Intentar obtener información del calendario específico
    const response = await calendar.calendars.get({
      calendarId: calendarId,
    });

    console.log('✅ Connection successful!');
    console.log('📊 Calendar info:', JSON.stringify(response.data, null, 2));

    return new Response(
      JSON.stringify(
        {
          success: true,
          message: 'Direct Google Calendar connection successful',
          calendarId: response.data.id,
          summary: response.data.summary,
          accessRole: response.data.accessRole,
          response: response.data,
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
    console.error('❌ Direct Google Calendar connection failed:', error);

    return new Response(
      JSON.stringify(
        {
          success: false,
          error: 'Direct Google Calendar connection failed',
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
