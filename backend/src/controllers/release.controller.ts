/**
 * Release Controller
 * Обработчики HTTP-запросов для релизов
 */

import { Request, Response, NextFunction } from 'express';
import { releaseService } from '../services';
import { cacheService } from '../services/cache.service';

export class ReleaseController {
  /**
   * GET /api/releases
   * Получить все релизы
   */
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      // Пытаемся получить из кэша
      const cacheKey = `releases:${req.originalUrl}`;
      const cached = await cacheService.get(cacheKey);

      if (cached) {
        return res.status(200).json(cached);
      }

      const releases = await releaseService.getAllReleases();
      
      // Кэшируем результат на 5 минут
      await cacheService.set(cacheKey, releases, 300);
      
      res.status(200).json(releases);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/releases/:id
   * Получить релиз по ID
   */
  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const cacheKey = `release:${id}`;
      const cached = await cacheService.get(cacheKey);

      if (cached) {
        return res.status(200).json(cached);
      }

      const release = await releaseService.getReleaseById(id);
      
      await cacheService.set(cacheKey, release, 300);
      
      res.status(200).json(release);
    } catch (error) {
      next(error);
    }
  }
}

export const releaseController = new ReleaseController();
