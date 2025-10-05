import type { APIRoute } from 'astro';
import { hybridCacheService } from '../../../lib/cache/hybridCacheService.js';

export const GET: APIRoute = async () => {
  try {
    const stats = await hybridCacheService.getStats();
    
    return new Response(
      JSON.stringify({
        success: true,
        timestamp: new Date().toISOString(),
        cache: stats
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        }
      }
    );
  } catch (error) {
    console.error('❌ Error obteniendo estado del caché:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Error obteniendo estado del caché',
        details: error instanceof Error ? error.message : 'Error desconocido'
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};

export const DELETE: APIRoute = async ({ url }) => {
  try {
    const pattern = url.searchParams.get('pattern') || '*';
    
    if (pattern === '*') {
      await hybridCacheService.clearAllAvailabilityCache();
    } else {
      await hybridCacheService.flushPattern(pattern);
    }
    
    return new Response(
      JSON.stringify({
        success: true,
        message: `Caché limpiado con patrón: ${pattern}`,
        timestamp: new Date().toISOString()
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('❌ Error limpiando caché:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Error limpiando caché',
        details: error instanceof Error ? error.message : 'Error desconocido'
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};
