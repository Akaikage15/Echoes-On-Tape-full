/**
 * Artist Service
 * Бизнес-логика артистов
 */

import { artistRepository } from '../repositories';
import { AppError } from '../middleware/error.middleware';

export class ArtistService {
  /**
   * Получить всех артистов
   */
  async getAllArtists() {
    return await artistRepository.findAll();
  }

  /**
   * Получить артиста по ID
   */
  async getArtistById(id: string) {
    const artist = await artistRepository.findById(id);
    if (!artist) {
      throw new AppError('Артист не найден', 404);
    }
    return artist;
  }
}

export const artistService = new ArtistService();
