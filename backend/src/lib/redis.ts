import Redis from 'ioredis';
import { logInfo, logError, logWarn } from '../utils/logger';

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

export const redis = new Redis(redisUrl, {
  maxRetriesPerRequest: 3,
  retryStrategy(times) {
    // Если мы в dev-режиме и Redis недоступен, не пытаемся реконнектиться бесконечно
    if (process.env.NODE_ENV !== 'production' && times > 3) {
      logWarn('Redis unavailable, caching disabled for this session.');
      return null; // Stop retrying
    }
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  // Не падать при ошибке подключения
  lazyConnect: true,
});

redis.connect().catch((err) => {
  if (process.env.NODE_ENV !== 'production') {
    logWarn('Failed to connect to Redis. Caching will be disabled.');
  } else {
    logError('Redis connection failed', err);
  }
});

redis.on('connect', () => {
  logInfo('Connected to Redis');
});

redis.on('error', (err) => {
  // Игнорируем ошибки соединения в dev режиме после неудачной попытки
  if (process.env.NODE_ENV !== 'production') {
    // silent
  } else {
    logError('Redis error', err);
  }
});
