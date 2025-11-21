/**
 * Middleware для логирования HTTP-запросов
 * Логирует все входящие запросы и ответы
 */

import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();

  // Логируем запрос
  logger.info(`→ ${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get('user-agent'),
    body: req.method !== 'GET' ? req.body : undefined,
  });

  // Перехватываем ответ
  const originalSend = res.send;
  res.send = function (data: any) {
    const duration = Date.now() - startTime;
    
    logger.info(`← ${req.method} ${req.path} ${res.statusCode} ${duration}ms`, {
      statusCode: res.statusCode,
      duration: `${duration}ms`,
    });

    return originalSend.call(this, data);
  };

  next();
};

/**
 * Middleware для логирования действий в личном кабинете
 */
export const accountActionLogger = (action: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user?.id;
    
    logger.info(`Account action: ${action}`, {
      userId,
      action,
      ip: req.ip,
      timestamp: new Date().toISOString(),
    });

    next();
  };
};

/**
 * Middleware для аудита изменений профиля
 */
export const profileAuditLogger = (req: Request, res: Response, next: NextFunction) => {
  const userId = (req as any).user?.id;
  const changes = req.body;

  logger.info('Profile update attempt', {
    userId,
    changes: Object.keys(changes),
    ip: req.ip,
    timestamp: new Date().toISOString(),
  });

  // Перехватываем успешный ответ
  const originalJson = res.json;
  res.json = function (data: any) {
    if (res.statusCode === 200) {
      logger.info('Profile updated successfully', {
        userId,
        updatedFields: Object.keys(changes),
      });
    }
    return originalJson.call(this, data);
  };

  next();
};
