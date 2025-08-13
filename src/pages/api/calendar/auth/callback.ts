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

export const GET: APIRoute = async ({ request }) => {
  try {
    console.log('🚀 ===== CALLBACK OAUTH2 RECIBIDO =====');
    
    const url = new URL(request.url);
    const code = url.searchParams.get('code');
    const error = url.searchParams.get('error');

    if (error) {
      console.error('❌ Error en autorización:', error);
      return new Response(JSON.stringify({
        success: false,
        error: 'Error en autorización',
        details: error
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (!code) {
      console.error('❌ No se recibió código de autorización');
      return new Response(JSON.stringify({
        success: false,
        error: 'No se recibió código de autorización'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    console.log('✅ Código de autorización recibido');

    // Intercambiar código por tokens
    const { tokens } = await oauth2Client.getToken(code);
    
    console.log('✅ Tokens obtenidos exitosamente');
    console.log('🔑 Access Token:', tokens.access_token ? '✅ Presente' : '❌ Ausente');
    console.log('🔄 Refresh Token:', tokens.refresh_token ? '✅ Presente' : '❌ Ausente');
    console.log('⏰ Expires In:', tokens.expires_in);

    // Obtener información del usuario
    oauth2Client.setCredentials(tokens);
    const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
    const userInfo = await oauth2.userinfo.get();

    console.log('👤 Usuario autenticado:', userInfo.data.email);

    // Guardar tokens en variables de entorno (en producción usar base de datos)
    // Por ahora los devolvemos en la respuesta
    const tokenData = {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      scope: tokens.scope,
      token_type: tokens.token_type,
      expiry_date: tokens.expiry_date,
      user_email: userInfo.data.email,
      user_name: userInfo.data.name
    };

    console.log('💾 Tokens guardados para uso posterior');

    return new Response(JSON.stringify({
      success: true,
      message: 'Autenticación exitosa',
      user: {
        email: userInfo.data.email,
        name: userInfo.data.name,
        picture: userInfo.data.picture
      },
      tokens: tokenData,
      instructions: [
        '✅ Autenticación completada exitosamente',
        '🔑 Los tokens están listos para usar',
        '📅 Ahora puedes crear eventos con invitados',
        '📧 Las invitaciones se enviarán automáticamente'
      ]
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('❌ Error en callback OAuth2:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: 'Error procesando autorización',
      details: error instanceof Error ? error.message : 'Error desconocido'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
