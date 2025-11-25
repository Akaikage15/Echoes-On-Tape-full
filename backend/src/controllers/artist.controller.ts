/**
 * Artist Controller
 * Обработчики HTTP-запросов для артистов
 */

import { Request, Response, NextFunction } from 'express';
import { artistService } from '../services/artist.service';

export class ArtistController {
  /**
   * GET /api/artists
   * Получить всех артистов
   */
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const artists = await artistService.getAllArtists();
      res.status(200).json(artists);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/artists/:id
   * Получить артиста по ID
   */
  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const artist = await artistService.getArtistById(req.params.id);
      res.status(200).json(artist);
    } catch (error) {
      next(error);
    }
  }
}

export const artistController = new ArtistController();
