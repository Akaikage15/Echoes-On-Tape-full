/**
 * Release Service
 * Бизнес-логика релизов
 */

import { releaseRepository } from '../repositories';
import { NotFoundError } from '../utils/errors';

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
      throw new NotFoundError('Релиз не найден');
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
