/**
 * Release Controller
 * Обработчики HTTP-запросов для релизов
 */

import { Request, Response, NextFunction } from 'express';
import { releaseService } from '../services';

export class ReleaseController {
  /**
   * GET /api/releases
   * Получить все релизы
   */
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const releases = await releaseService.getAllReleases();
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
      const release = await releaseService.getReleaseById(req.params.id);
      res.status(200).json(release);
    } catch (error) {
      next(error);
    }
  }
}

export const releaseController = new ReleaseController();
