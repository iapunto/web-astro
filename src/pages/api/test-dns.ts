// Probar resolución DNS de strapi.iapunto.com

export async function GET() {
  const diagnostics: any = {
    timestamp: new Date().toISOString(),
    dns: {},
    connectivity: {},
  };
  
  // Test 1: Resolver DNS usando Node.js dns module
  try {
    const dns = await import('dns');
    const { promisify } = await import('util');
    const resolve4 = promisify(dns.resolve4);
    const resolve6 = promisify(dns.resolve6);
    
    console.log('🔍 [DNS] Resolviendo strapi.iapunto.com...');
    
    try {
      const ipv4 = await resolve4('strapi.iapunto.com');
      diagnostics.dns.ipv4 = ipv4;
      diagnostics.dns.ipv4Success = true;
      console.log('✅ [DNS] IPv4:', ipv4);
    } catch (e) {
      diagnostics.dns.ipv4Error = e instanceof Error ? e.message : String(e);
      console.error('❌ [DNS] Error IPv4:', e);
    }
    
    try {
      const ipv6 = await resolve6('strapi.iapunto.com');
      diagnostics.dns.ipv6 = ipv6;
      diagnostics.dns.ipv6Success = true;
      console.log('✅ [DNS] IPv6:', ipv6);
    } catch (e) {
      diagnostics.dns.ipv6Error = e instanceof Error ? e.message : String(e);
      console.error('⚠️ [DNS] No IPv6 (normal)');
    }
  } catch (error) {
    diagnostics.dns.error = error instanceof Error ? error.message : String(error);
  }
  
  // Test 2: Probar conectividad a diferentes servicios
  const connectivityTests = [
    { name: 'Google (HTTPS)', url: 'https://www.google.com' },
    { name: 'Cloudflare (HTTPS)', url: 'https://1.1.1.1' },
    { name: 'Strapi Dominio', url: 'https://strapi.iapunto.com/api/articles?pagination[pageSize]=1' },
    { name: 'Strapi IP directa', url: 'https://190.146.4.75/api/articles?pagination[pageSize]=1' },
  ];
  
  for (const test of connectivityTests) {
    const result: any = { name: test.name, success: false, time: 0, error: null };
    const start = Date.now();
    
    try {
      const response = await fetch(test.url, {
        method: 'HEAD',
        signal: AbortSignal.timeout(5000),
        headers: test.name.includes('Strapi') ? {
          'Host': 'strapi.iapunto.com',
        } : {},
      });
      
      result.success = response.ok;
      result.status = response.status;
      result.time = Date.now() - start;
      console.log(`${result.success ? '✅' : '❌'} [CONN] ${test.name}: ${result.status} (${result.time}ms)`);
    } catch (error) {
      result.time = Date.now() - start;
      result.error = error instanceof Error ? error.message : String(error);
      console.error(`❌ [CONN] ${test.name}: ${result.error}`);
    }
    
    diagnostics.connectivity[test.name] = result;
  }
  
  return new Response(JSON.stringify(diagnostics, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
    },
  });
}
