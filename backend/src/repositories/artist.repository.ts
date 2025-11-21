/**
 * Artist Repository
 * Слой доступа к данным артистов
 */

import prisma from '../lib/prisma';
import { Artist } from '@prisma/client';

export class ArtistRepository {
  /**
   * Получить всех артистов
   */
  async findAll(): Promise<Artist[]> {
    return await prisma.artist.findMany({
      orderBy: {
        name: 'asc',
      },
    });
  }

  /**
   * Найти артиста по ID
   */
  async findById(id: string): Promise<Artist | null> {
    return await prisma.artist.findUnique({
      where: { id },
    });
  }
}

export const artistRepository = new ArtistRepository();
