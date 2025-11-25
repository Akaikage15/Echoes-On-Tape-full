/**
 * Artist Service
 * Бизнес-логика артистов
 */

import { artistRepository } from '../repositories';
import { NotFoundError } from '../utils/errors';

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
      throw new NotFoundError('Артист не найден');
    }
    return artist;
  }
}

export const artistService = new ArtistService();
