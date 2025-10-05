import { createClient, RedisClientType } from 'redis';

export class RedisService {
  private client: RedisClientType | null = null;
  private isConnected: boolean = false;

  constructor() {
    this.initializeRedis();
  }

  private async initializeRedis() {
    try {
      const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
      
      this.client = createClient({
        url: redisUrl,
        socket: {
          reconnectStrategy: (retries) => {
            if (retries > 10) {
              console.error('❌ Redis: Máximo de reintentos alcanzado');
              return false;
            }
            return Math.min(retries * 100, 3000);
          }
        }
      });

      this.client.on('error', (err) => {
        console.error('❌ Redis Client Error:', err);
        this.isConnected = false;
      });

      this.client.on('connect', () => {
        console.log('🔗 Redis: Conectando...');
      });

      this.client.on('ready', () => {
        console.log('✅ Redis: Conectado y listo');
        this.isConnected = true;
      });

      this.client.on('end', () => {
        console.log('🔌 Redis: Conexión cerrada');
        this.isConnected = false;
      });

      await this.client.connect();
    } catch (error) {
      console.error('❌ Error inicializando Redis:', error);
      this.isConnected = false;
    }
  }

  async get(key: string): Promise<string | null> {
    if (!this.isConnected || !this.client) {
      console.warn('⚠️ Redis no disponible, usando fallback');
      return null;
    }

    try {
      const value = await this.client.get(key);
      if (value) {
        console.log(`💾 Redis GET: ${key}`);
      }
      return value;
    } catch (error) {
      console.error(`❌ Error obteniendo ${key} de Redis:`, error);
      return null;
    }
  }

  async set(key: string, value: string, ttlSeconds?: number): Promise<boolean> {
    if (!this.isConnected || !this.client) {
      console.warn('⚠️ Redis no disponible, usando fallback');
      return false;
    }

    try {
      if (ttlSeconds) {
        await this.client.setEx(key, ttlSeconds, value);
        console.log(`💾 Redis SET: ${key} (TTL: ${ttlSeconds}s)`);
      } else {
        await this.client.set(key, value);
        console.log(`💾 Redis SET: ${key}`);
      }
      return true;
    } catch (error) {
      console.error(`❌ Error guardando ${key} en Redis:`, error);
      return false;
    }
  }

  async del(key: string): Promise<boolean> {
    if (!this.isConnected || !this.client) {
      console.warn('⚠️ Redis no disponible, usando fallback');
      return false;
    }

    try {
      await this.client.del(key);
      console.log(`🗑️ Redis DEL: ${key}`);
      return true;
    } catch (error) {
      console.error(`❌ Error eliminando ${key} de Redis:`, error);
      return false;
    }
  }

  async exists(key: string): Promise<boolean> {
    if (!this.isConnected || !this.client) {
      return false;
    }

    try {
      const result = await this.client.exists(key);
      return result === 1;
    } catch (error) {
      console.error(`❌ Error verificando existencia de ${key} en Redis:`, error);
      return false;
    }
  }

  async flushPattern(pattern: string): Promise<boolean> {
    if (!this.isConnected || !this.client) {
      console.warn('⚠️ Redis no disponible, usando fallback');
      return false;
    }

    try {
      const keys = await this.client.keys(pattern);
      if (keys.length > 0) {
        await this.client.del(keys);
        console.log(`🗑️ Redis FLUSH: ${keys.length} claves eliminadas (patrón: ${pattern})`);
      }
      return true;
    } catch (error) {
      console.error(`❌ Error eliminando patrón ${pattern} de Redis:`, error);
      return false;
    }
  }

  async getStats(): Promise<any> {
    if (!this.isConnected || !this.client) {
      return { connected: false };
    }

    try {
      const info = await this.client.info('memory');
      const keyspace = await this.client.info('keyspace');
      
      return {
        connected: true,
        memory: info,
        keyspace: keyspace
      };
    } catch (error) {
      console.error('❌ Error obteniendo estadísticas de Redis:', error);
      return { connected: false, error: error.message };
    }
  }

  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.disconnect();
      this.isConnected = false;
      console.log('🔌 Redis: Desconectado');
    }
  }

  isRedisAvailable(): boolean {
    return this.isConnected && this.client !== null;
  }
}

// Instancia singleton
export const redisService = new RedisService();
