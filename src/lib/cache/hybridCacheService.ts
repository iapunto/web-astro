import { redisService } from './redisService.js';

interface CacheItem {
  data: any;
  timestamp: number;
  ttl: number;
}

export class HybridCacheService {
  private memoryCache: Map<string, CacheItem> = new Map();
  private defaultTTL: number = 5 * 60 * 1000; // 5 minutos

  constructor() {
    // Limpiar caché de memoria cada 10 minutos
    setInterval(() => {
      this.cleanupMemoryCache();
    }, 10 * 60 * 1000);
  }

  private cleanupMemoryCache(): void {
    const now = Date.now();
    let cleaned = 0;
    
    for (const [key, item] of this.memoryCache.entries()) {
      if (now - item.timestamp > item.ttl) {
        this.memoryCache.delete(key);
        cleaned++;
      }
    }
    
    if (cleaned > 0) {
      console.log(`🧹 Limpieza de caché de memoria: ${cleaned} elementos eliminados`);
    }
  }

  async get(key: string): Promise<any | null> {
    // Intentar Redis primero
    if (redisService.isRedisAvailable()) {
      try {
        const redisValue = await redisService.get(key);
        if (redisValue) {
          console.log(`💾 Caché HÍBRIDO: Redis GET ${key}`);
          return JSON.parse(redisValue);
        }
      } catch (error) {
        console.error(`❌ Error en Redis GET ${key}:`, error);
      }
    }

    // Fallback a memoria
    const memoryItem = this.memoryCache.get(key);
    if (memoryItem) {
      const now = Date.now();
      if (now - memoryItem.timestamp < memoryItem.ttl) {
        console.log(`💾 Caché HÍBRIDO: Memoria GET ${key}`);
        return memoryItem.data;
      } else {
        // Expiró, eliminar
        this.memoryCache.delete(key);
      }
    }

    return null;
  }

  async set(key: string, data: any, ttlMs?: number): Promise<boolean> {
    const ttl = ttlMs || this.defaultTTL;
    const ttlSeconds = Math.ceil(ttl / 1000);

    // Guardar en Redis si está disponible
    if (redisService.isRedisAvailable()) {
      try {
        const success = await redisService.set(key, JSON.stringify(data), ttlSeconds);
        if (success) {
          console.log(`💾 Caché HÍBRIDO: Redis SET ${key} (TTL: ${ttlSeconds}s)`);
        }
      } catch (error) {
        console.error(`❌ Error en Redis SET ${key}:`, error);
      }
    }

    // Siempre guardar en memoria como backup
    this.memoryCache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
    console.log(`💾 Caché HÍBRIDO: Memoria SET ${key} (TTL: ${ttl}ms)`);

    return true;
  }

  async del(key: string): Promise<boolean> {
    // Eliminar de Redis
    if (redisService.isRedisAvailable()) {
      try {
        await redisService.del(key);
        console.log(`🗑️ Caché HÍBRIDO: Redis DEL ${key}`);
      } catch (error) {
        console.error(`❌ Error en Redis DEL ${key}:`, error);
      }
    }

    // Eliminar de memoria
    const existed = this.memoryCache.has(key);
    this.memoryCache.delete(key);
    if (existed) {
      console.log(`🗑️ Caché HÍBRIDO: Memoria DEL ${key}`);
    }

    return true;
  }

  async flushPattern(pattern: string): Promise<boolean> {
    // Limpiar Redis
    if (redisService.isRedisAvailable()) {
      try {
        await redisService.flushPattern(pattern);
      } catch (error) {
        console.error(`❌ Error limpiando patrón ${pattern} en Redis:`, error);
      }
    }

    // Limpiar memoria (búsqueda simple)
    const keysToDelete: string[] = [];
    for (const key of this.memoryCache.keys()) {
      if (key.includes(pattern.replace('*', ''))) {
        keysToDelete.push(key);
      }
    }

    keysToDelete.forEach(key => this.memoryCache.delete(key));
    if (keysToDelete.length > 0) {
      console.log(`🗑️ Caché HÍBRIDO: Memoria FLUSH ${keysToDelete.length} claves (patrón: ${pattern})`);
    }

    return true;
  }

  async getStats(): Promise<any> {
    const redisStats = redisService.isRedisAvailable() 
      ? await redisService.getStats() 
      : { connected: false };

    return {
      redis: redisStats,
      memory: {
        size: this.memoryCache.size,
        keys: Array.from(this.memoryCache.keys())
      },
      hybrid: {
        redisAvailable: redisService.isRedisAvailable(),
        memorySize: this.memoryCache.size
      }
    };
  }

  // Métodos específicos para el sistema de citas
  async getAvailability(date: string): Promise<string[] | null> {
    return await this.get(`availability:${date}`);
  }

  async setAvailability(date: string, slots: string[], ttlMs?: number): Promise<boolean> {
    return await this.set(`availability:${date}`, slots, ttlMs);
  }

  async getDailyCount(date: string): Promise<number | null> {
    return await this.get(`daily_count:${date}`);
  }

  async setDailyCount(date: string, count: number, ttlMs?: number): Promise<boolean> {
    return await this.set(`daily_count:${date}`, count, ttlMs);
  }

  async clearAvailabilityCache(date: string): Promise<boolean> {
    await this.del(`availability:${date}`);
    await this.del(`daily_count:${date}`);
    return true;
  }

  async clearAllAvailabilityCache(): Promise<boolean> {
    await this.flushPattern('availability:*');
    await this.flushPattern('daily_count:*');
    return true;
  }
}

// Instancia singleton
export const hybridCacheService = new HybridCacheService();
