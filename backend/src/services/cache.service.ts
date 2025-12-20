import { redis } from '../lib/redis';
import { logError } from '../utils/logger';

export class CacheService {
  /**
   * Получить данные из кэша
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      if (redis.status !== 'ready') return null;
      const data = await redis.get(key);
      if (!data) return null;
      return JSON.parse(data) as T;
    } catch (error) {
      logError(`Cache get error for key ${key}`, error);
      return null;
    }
  }

  /**
   * Сохранить данные в кэш
   * @param ttl Время жизни в секундах (по умолчанию 1 час)
   */
  async set(key: string, data: any, ttl: number = 3600): Promise<void> {
    try {
      if (redis.status !== 'ready') return;
      await redis.setex(key, ttl, JSON.stringify(data));
    } catch (error) {
      logError(`Cache set error for key ${key}`, error);
    }
  }

  /**
   * Удалить данные из кэша
   */
  async del(key: string): Promise<void> {
    try {
      if (redis.status !== 'ready') return;
      await redis.del(key);
    } catch (error) {
      logError(`Cache del error for key ${key}`, error);
    }
  }

  /**
   * Удалить данные по шаблону
   */
  async deletePattern(pattern: string): Promise<void> {
    try {
      if (redis.status !== 'ready') return;
      const keys = await redis.keys(pattern);
      if (keys.length > 0) {
        await redis.del(...keys);
      }
    } catch (error) {
      logError(`Cache deletePattern error for pattern ${pattern}`, error);
    }
  }
}

export const cacheService = new CacheService();
