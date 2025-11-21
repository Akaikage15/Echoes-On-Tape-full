/**
 * Release Service
 * Бизнес-логика релизов
 */

import { releaseRepository } from '../repositories';
import { AppError } from '../middleware/error.middleware';

export class ReleaseService {
  /**
   * Получить все релизы
   */
  async getAllReleases() {
    return await releaseRepository.findAll();
  }

  /**
   * Получить релиз по ID
   */
  async getReleaseById(id: string) {
    const release = await releaseRepository.findById(id);
    if (!release) {
      throw new AppError('Релиз не найден', 404);
    }
    return release;
  }

  /**
   * Получить релизы артиста
   */
  async getReleasesByArtist(artistId: string) {
    return await releaseRepository.findByArtistId(artistId);
  }
}

export const releaseService = new ReleaseService();
