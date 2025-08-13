import type { APIRoute } from 'astro';
import OAuth2Service from '../../../lib/services/oauth2Service.js';

export const GET: APIRoute = async () => {
  try {
    console.log('🧪 ===== PRUEBA OAUTH2 =====');

    const oauth2Service = new OAuth2Service();
    
    // 1. Verificar configuración OAuth2
    console.log('1️⃣ Verificando configuración OAuth2...');
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri = process.env.GOOGLE_REDIRECT_URI;

    const oauth2Config = {
      clientId: clientId ? '✅ Configurado' : '❌ No configurado',
      clientSecret: clientSecret ? '✅ Configurado' : '❌ No configurado',
      redirectUri: redirectUri ? '✅ Configurado' : '❌ No configurado',
    };

    // 2. Verificar tokens existentes
    console.log('2️⃣ Verificando tokens existentes...');
    const tokensLoaded = oauth2Service.setTokensFromEnv();
    const authStatus = oauth2Service.getAuthStatus();

    // 3. Verificar conexión si hay tokens
    console.log('3️⃣ Verificando conexión...');
    let connectionStatus = 'No probado';
    let calendarInfo = null;

    if (tokensLoaded) {
      try {
        const isConnected = await oauth2Service.verifyConnection();
        connectionStatus = isConnected ? '✅ Conectado' : '❌ Falló';
        
        if (isConnected) {
          const userInfo = await oauth2Service.getUserInfo();
          calendarInfo = {
            userEmail: userInfo?.email,
            userName: userInfo?.name,
            userPicture: userInfo?.picture
          };
        }
      } catch (error) {
        connectionStatus = `❌ Error: ${error instanceof Error ? error.message : 'Error desconocido'}`;
      }
    } else {
      connectionStatus = '⚠️ No hay tokens configurados';
    }

    // 4. Generar URL de autorización
    console.log('4️⃣ Generando URL de autorización...');
    const authUrl = oauth2Service.generateAuthUrl();

    return new Response(JSON.stringify({
      success: true,
      message: 'Prueba OAuth2 completada',
      timestamp: new Date().toISOString(),
      results: {
        oauth2Config,
        authStatus,
        connectionStatus,
        calendarInfo,
        authUrl: authUrl,
        instructions: [
          tokensLoaded ? 
            '✅ OAuth2 está configurado y funcionando' :
            '📋 Para configurar OAuth2:',
          tokensLoaded ? 
            '🔑 Los tokens están listos para usar' :
            '1. Visita la URL de autorización generada',
          tokensLoaded ? 
            '📅 Puedes crear eventos con invitados' :
            '2. Inicia sesión con tu cuenta de Google',
          tokensLoaded ? 
            '📧 Las invitaciones se enviarán automáticamente' :
            '3. Concede permisos para Google Calendar',
          tokensLoaded ? 
            '' :
            '4. Serás redirigido de vuelta con tokens'
        ].filter(Boolean),
        nextSteps: tokensLoaded ? [
          'Usa /api/calendar/book-oauth2 para crear citas',
          'Los eventos incluirán invitados automáticamente',
          'Las invitaciones se enviarán por email'
        ] : [
          'Configura las credenciales OAuth2 en Google Cloud Console',
          'Ejecuta el flujo de autenticación',
          'Guarda los tokens en las variables de entorno'
        ]
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('❌ Error en prueba OAuth2:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
      timestamp: new Date().toISOString(),
      recommendations: [
        'Verifica la configuración OAuth2 en Google Cloud Console',
        'Asegúrate de que las variables de entorno estén configuradas',
        'Revise los logs del servidor para más detalles'
      ]
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
