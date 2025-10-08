// Endpoint para diagnosticar el runtime y capacidades del contenedor

export async function GET() {
  const info: any = {
    timestamp: new Date().toISOString(),
    runtime: {
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch,
      pid: process.pid,
      execPath: process.execPath,
      argv: process.argv,
    },
    features: {
      canImportNodeFetch: false,
      canImportHttps: false,
      canImportHttp: false,
      fetchAvailable: typeof fetch !== 'undefined',
      globalFetch: typeof globalThis.fetch !== 'undefined',
    },
    env: {
      NODE_ENV: process.env.NODE_ENV,
      // Ver si hay restricciones de red
      HTTP_PROXY: process.env.HTTP_PROXY || 'not set',
      HTTPS_PROXY: process.env.HTTPS_PROXY || 'not set',
      NO_PROXY: process.env.NO_PROXY || 'not set',
    },
    container: {
      isDocker: false,
      dockerEnv: process.env.DOCKER || 'not set',
      hostname: process.env.HOSTNAME || 'unknown',
    },
  };

  // Detectar si estamos en Docker
  try {
    const fs = await import('fs');
    info.container.isDocker = fs.existsSync('/.dockerenv');
  } catch (e) {
    info.container.isDocker = false;
  }

  // Probar imports
  try {
    await import('node-fetch');
    info.features.canImportNodeFetch = true;
  } catch (e) {
    info.features.canImportNodeFetch = false;
    info.features.nodeFetchError = e instanceof Error ? e.message : String(e);
  }

  try {
    await import('https');
    info.features.canImportHttps = true;
  } catch (e) {
    info.features.canImportHttps = false;
  }

  try {
    await import('http');
    info.features.canImportHttp = true;
  } catch (e) {
    info.features.canImportHttp = false;
  }

  // Probar fetch simple
  info.fetchTest = {
    toGoogle: { success: false, error: null, time: 0 },
    toLocalhost: { success: false, error: null, time: 0 },
  };

  // Test 1: Fetch a Google (conexión externa básica)
  try {
    const start = Date.now();
    const res = await fetch('https://www.google.com', {
      method: 'HEAD',
      signal: AbortSignal.timeout(3000),
    });
    info.fetchTest.toGoogle.success = res.ok;
    info.fetchTest.toGoogle.status = res.status;
    info.fetchTest.toGoogle.time = Date.now() - start;
  } catch (e) {
    info.fetchTest.toGoogle.error = e instanceof Error ? e.message : String(e);
  }

  // Test 2: Fetch a localhost
  try {
    const start = Date.now();
    const res = await fetch('http://localhost:1337', {
      method: 'HEAD',
      signal: AbortSignal.timeout(1000),
    });
    info.fetchTest.toLocalhost.success = res.ok;
    info.fetchTest.toLocalhost.status = res.status;
    info.fetchTest.toLocalhost.time = Date.now() - start;
  } catch (e) {
    info.fetchTest.toLocalhost.error = e instanceof Error ? e.message : String(e);
  }

  return new Response(JSON.stringify(info, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
    },
  });
}
