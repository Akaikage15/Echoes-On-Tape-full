/**
 * Release Repository
 * Слой доступа к данным релизов
 */

import prisma from '../lib/prisma';
import { Release, Artist } from '@prisma/client';

export type ReleaseWithArtist = Release & { artist: Artist };

export class ReleaseRepository {
  /**
   * Получить все релизы с информацией об артистах
   */
  async findAll(): Promise<ReleaseWithArtist[]> {
    return await prisma.release.findMany({
      include: {
        artist: true,
      },
      orderBy: {
        release_date: 'desc',
      },
    });
  }

  /**
   * Найти релиз по ID
   */
  async findById(id: string): Promise<ReleaseWithArtist | null> {
    return await prisma.release.findUnique({
      where: { id },
      include: {
        artist: true,
      },
    });
  }

  /**
   * Найти релизы по артисту
   */
  async findByArtistId(artistId: string): Promise<ReleaseWithArtist[]> {
    return await prisma.release.findMany({
      where: { artist_id: artistId },
      include: {
        artist: true,
      },
      orderBy: {
        release_date: 'desc',
      },
    });
  }
}

export const releaseRepository = new ReleaseRepository();
