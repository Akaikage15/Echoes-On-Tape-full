import Redis from 'ioredis';
import { logInfo, logError } from '../utils/logger';

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

export const redis = new Redis(redisUrl, {
  maxRetriesPerRequest: 3,
  retryStrategy(times) {
    // Не подключаться, если не настроен URL в dev режиме (чтобы не спамить ошибками если нет redis)
    if (process.env.NODE_ENV === 'development' && !process.env.REDIS_URL) {
      return null;
    }
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  // Не падать при ошибке подключения в dev режиме
  lazyConnect: process.env.NODE_ENV === 'development',
});

redis.on('connect', () => {
  logInfo('Connected to Redis');
});

redis.on('error', (err) => {
  // Логируем ошибку только если это не ECONNREFUSED в dev режиме (нет запущенного Redis)
  if (process.env.NODE_ENV === 'development' && err.message.includes('ECONNREFUSED')) {
    // silently ignore in dev if local redis is not running
  } else {
    logError('Redis connection error', err);
  }
});
