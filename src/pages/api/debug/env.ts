import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  try {
    const envVars = {
      // OAuth2 Variables (using process.env - FIXED!)
      GOOGLE_CLIENT_ID: !!process.env.GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET: !!process.env.GOOGLE_CLIENT_SECRET,
      GOOGLE_REDIRECT_URI: !!process.env.GOOGLE_REDIRECT_URI,
      
      // Service Account Variables (preferidas)
      GOOGLE_SERVICE_ACCOUNT_EMAIL: !!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      GOOGLE_PRIVATE_KEY: !!process.env.GOOGLE_PRIVATE_KEY,
      
      // Common Variables
      GOOGLE_CALENDAR_ID: !!process.env.GOOGLE_CALENDAR_ID,
      TIMEZONE: process.env.TIMEZONE || 'not_set',
      BUSINESS_HOURS_START: process.env.BUSINESS_HOURS_START || 'not_set',
      BUSINESS_HOURS_END: process.env.BUSINESS_HOURS_END || 'not_set',
      NODE_ENV: process.env.NODE_ENV || 'not_set',
    };

    // Debug adicional: mostrar primeros caracteres de las variables (sin exponer valores completos)
    const debugInfo = {
      GOOGLE_CLIENT_ID_PREFIX: process.env.GOOGLE_CLIENT_ID ? process.env.GOOGLE_CLIENT_ID.substring(0, 10) + '...' : 'not_found',
      GOOGLE_CLIENT_SECRET_PREFIX: process.env.GOOGLE_CLIENT_SECRET ? 'GOCSPX-...' : 'not_found',
      GOOGLE_CALENDAR_ID_PREFIX: process.env.GOOGLE_CALENDAR_ID ? process.env.GOOGLE_CALENDAR_ID.substring(0, 10) + '...' : 'not_found',
      GOOGLE_SERVICE_ACCOUNT_EMAIL_PREFIX: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL ? process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL.split('@')[0] + '@...' : 'not_found',
      GOOGLE_PRIVATE_KEY_PREFIX: process.env.GOOGLE_PRIVATE_KEY ? '-----BEGIN PRIVATE KEY-----...' : 'not_found',
      ALL_ENV_KEYS: Object.keys(process.env).filter(key => key.startsWith('GOOGLE')),
      AUTH_TYPE: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL ? 'Service Account' : process.env.GOOGLE_CLIENT_ID ? 'OAuth2' : 'None',
    };

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Environment variables status (updated)',
        variables: envVars,
        debug: debugInfo,
        timestamp: new Date().toISOString(),
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: 'Debug endpoint error',
        message: error instanceof Error ? error.message : 'Unknown error',
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
