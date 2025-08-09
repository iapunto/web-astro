import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  try {
    // Test directo con process.env (Node.js nativo)
    const processEnvGoogle = {
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || 'not_found',
      GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ? 'found' : 'not_found',
      GOOGLE_CALENDAR_ID: process.env.GOOGLE_CALENDAR_ID || 'not_found',
      GOOGLE_REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI || 'not_found',
      TIMEZONE: process.env.TIMEZONE || 'not_found',
    };

    // Test con import.meta.env (Astro)
    const importMetaEnvGoogle = {
      GOOGLE_CLIENT_ID: import.meta.env.GOOGLE_CLIENT_ID || 'not_found',
      GOOGLE_CLIENT_SECRET: import.meta.env.GOOGLE_CLIENT_SECRET ? 'found' : 'not_found',
      GOOGLE_CALENDAR_ID: import.meta.env.GOOGLE_CALENDAR_ID || 'not_found',
      GOOGLE_REDIRECT_URI: import.meta.env.GOOGLE_REDIRECT_URI || 'not_found',
      TIMEZONE: import.meta.env.TIMEZONE || 'not_found',
    };

    // Contar todas las variables
    const allProcessEnvKeys = Object.keys(process.env);
    const allImportMetaEnvKeys = Object.keys(import.meta.env);

    // Variables Railway específicas
    const railwayInfo = {
      RAILWAY_ENVIRONMENT: process.env.RAILWAY_ENVIRONMENT,
      RAILWAY_PROJECT_NAME: process.env.RAILWAY_PROJECT_NAME,
      RAILWAY_SERVICE_NAME: process.env.RAILWAY_SERVICE_NAME,
      PORT: process.env.PORT,
    };

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Direct environment variable test',
        processEnv: processEnvGoogle,
        importMetaEnv: importMetaEnvGoogle,
        railwayInfo: railwayInfo,
        counts: {
          processEnvTotal: allProcessEnvKeys.length,
          importMetaEnvTotal: allImportMetaEnvKeys.length,
          googleKeysInProcessEnv: allProcessEnvKeys.filter(key => key.startsWith('GOOGLE')).length,
          googleKeysInImportMeta: allImportMetaEnvKeys.filter(key => key.startsWith('GOOGLE')).length,
        },
        googleKeysFound: {
          processEnv: allProcessEnvKeys.filter(key => key.startsWith('GOOGLE')),
          importMeta: allImportMetaEnvKeys.filter(key => key.startsWith('GOOGLE')),
        },
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
        error: 'Test failed',
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
