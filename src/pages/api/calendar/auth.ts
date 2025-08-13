import type { APIRoute } from 'astro';
import { google } from 'googleapis';
import * as dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

// Configurar OAuth2
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI || 'https://iapunto.com/api/calendar/auth/callback'
);

const SCOPES = [
  'https://www.googleapis.com/auth/calendar',
  'https://www.googleapis.com/auth/calendar.events',
  'https://www.googleapis.com/auth/calendar.readonly'
];

export const GET: APIRoute = async ({ request }) => {
  try {
    console.log('🚀 ===== INICIANDO FLUJO OAUTH2 =====');
    
    // Generar URL de autorización
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline', // Para obtener refresh token
      scope: SCOPES,
      prompt: 'consent', // Forzar consentimiento para obtener refresh token
      include_granted_scopes: true
    });

    console.log('✅ URL de autorización generada');
    console.log('🔗 Auth URL:', authUrl);

    return new Response(JSON.stringify({
      success: true,
      authUrl: authUrl,
      message: 'URL de autorización generada exitosamente',
      scopes: SCOPES,
      instructions: [
        '1. Visita la URL de autorización',
        '2. Inicia sesión con tu cuenta de Google',
        '3. Concede permisos para Google Calendar',
        '4. Serás redirigido de vuelta con un código de autorización'
      ]
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('❌ Error generando URL de autorización:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: 'Error generando URL de autorización',
      details: error instanceof Error ? error.message : 'Error desconocido'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
