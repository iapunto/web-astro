export async function GET() {
  const results = {
    timestamp: new Date().toISOString(),
    tests: [],
  };

  // Test 1: Variables de entorno
  const envVars = {
    STRAPI_API_URL: import.meta.env.STRAPI_API_URL || 'No configurado',
    STRAPI_API_TOKEN: import.meta.env.STRAPI_API_TOKEN ? 'Configurado' : 'No configurado',
    NODE_ENV: import.meta.env.NODE_ENV || 'development',
  };
  
  results.tests.push({
    name: 'Variables de entorno',
    success: true,
    data: envVars,
  });

  // Test 2: Conectividad básica
  try {
    const response = await fetch('https://httpbin.org/get', {
      method: 'GET',
      headers: { 'User-Agent': 'IA-Punto-Blog-Test' },
    });
    
    results.tests.push({
      name: 'Conectividad básica (httpbin.org)',
      success: response.ok,
      status: response.status,
      data: { message: 'Conectividad externa funciona' },
    });
  } catch (error) {
    results.tests.push({
      name: 'Conectividad básica (httpbin.org)',
      success: false,
      error: error instanceof Error ? error.message : String(error),
    });
  }

  // Test 3: Conectividad a Strapi (sin autenticación)
  try {
    const response = await fetch('https://strapi.iapunto.com/api/', {
      method: 'GET',
      headers: { 'User-Agent': 'IA-Punto-Blog-Test' },
    });
    
    results.tests.push({
      name: 'Conectividad a Strapi (sin auth)',
      success: true,
      status: response.status,
      data: { message: 'Strapi responde' },
    });
  } catch (error) {
    results.tests.push({
      name: 'Conectividad a Strapi (sin auth)',
      success: false,
      error: error instanceof Error ? error.message : String(error),
    });
  }

  // Test 4: Conectividad a Strapi (con autenticación)
  const STRAPI_API_TOKEN = import.meta.env.STRAPI_API_TOKEN;
  if (STRAPI_API_TOKEN) {
    try {
      const response = await fetch('https://strapi.iapunto.com/api/articles?pagination[pageSize]=1', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${STRAPI_API_TOKEN}`,
          'User-Agent': 'IA-Punto-Blog-Test',
        },
      });
      
      results.tests.push({
        name: 'Conectividad a Strapi (con auth)',
        success: response.ok,
        status: response.status,
        data: { 
          message: response.ok ? 'Autenticación exitosa' : 'Error de autenticación',
          articlesCount: response.ok ? 'Verificar en respuesta' : 'N/A',
        },
      });
    } catch (error) {
      results.tests.push({
        name: 'Conectividad a Strapi (con auth)',
        success: false,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  } else {
    results.tests.push({
      name: 'Conectividad a Strapi (con auth)',
      success: false,
      error: 'Token no configurado',
    });
  }

  // Test 5: Resolución DNS
  try {
    const dns = await import('dns');
    const { promisify } = await import('util');
    const lookup = promisify(dns.lookup);
    
    const dnsResult = await lookup('strapi.iapunto.com');
    
    results.tests.push({
      name: 'Resolución DNS',
      success: true,
      data: {
        address: dnsResult.address,
        family: dnsResult.family,
      },
    });
  } catch (error) {
    results.tests.push({
      name: 'Resolución DNS',
      success: false,
      error: error instanceof Error ? error.message : String(error),
    });
  }

  const overallSuccess = results.tests.every(test => test.success);
  
  return new Response(JSON.stringify({
    ...results,
    summary: {
      totalTests: results.tests.length,
      passedTests: results.tests.filter(t => t.success).length,
      failedTests: results.tests.filter(t => !t.success).length,
      overallSuccess,
    },
  }, null, 2), {
    status: overallSuccess ? 200 : 500,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
    },
  });
}
