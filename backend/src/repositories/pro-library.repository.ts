/**
 * Pro Library Repository
 * Слой доступа к PRO-библиотеке
 */

import prisma from '../lib/prisma';
import { ProLibraryItem } from '@prisma/client';

export class ProLibraryRepository {
  /**
   * Получить все элементы PRO-библиотеки
   */
  async findAll(): Promise<ProLibraryItem[]> {
    return await prisma.proLibraryItem.findMany({
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  /**
   * Найти элемент по ID
   */
  async findById(id: string): Promise<ProLibraryItem | null> {
    return await prisma.proLibraryItem.findUnique({
      where: { id },
    });
  }
}

export const proLibraryRepository = new ProLibraryRepository();
