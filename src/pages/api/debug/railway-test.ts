import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  try {
    // Test básico: ¿Astro puede acceder a process.env?
    const processEnvTest = {
      NODE_ENV: process.env.NODE_ENV,
      RAILWAY_ENVIRONMENT: process.env.RAILWAY_ENVIRONMENT,
      RAILWAY_PROJECT_NAME: process.env.RAILWAY_PROJECT_NAME,
      RAILWAY_SERVICE_NAME: process.env.RAILWAY_SERVICE_NAME,
      PORT: process.env.PORT,
    };

    // Test de import.meta.env
    const importMetaEnvTest = {
      NODE_ENV: import.meta.env.NODE_ENV,
      PROD: import.meta.env.PROD,
      DEV: import.meta.env.DEV,
      MODE: import.meta.env.MODE,
    };

    // Contar todas las variables disponibles
    const allProcessEnvKeys = Object.keys(process.env);
    const allImportMetaEnvKeys = Object.keys(import.meta.env);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Railway environment test',
        processEnv: processEnvTest,
        importMetaEnv: importMetaEnvTest,
        counts: {
          processEnvKeys: allProcessEnvKeys.length,
          importMetaEnvKeys: allImportMetaEnvKeys.length,
        },
        railwayKeys: allProcessEnvKeys.filter(key => key.includes('RAILWAY')),
        googleKeys: {
          process: allProcessEnvKeys.filter(key => key.startsWith('GOOGLE')),
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
