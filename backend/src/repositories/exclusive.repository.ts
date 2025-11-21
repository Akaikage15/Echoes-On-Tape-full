/**
 * Exclusive Content Repository
 * Слой доступа к эксклюзивному контенту
 */

import prisma from '../lib/prisma';
import { ExclusiveContent } from '@prisma/client';

export class ExclusiveRepository {
  /**
   * Получить весь эксклюзивный контент
   */
  async findAll(): Promise<ExclusiveContent[]> {
    return await prisma.exclusiveContent.findMany({
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  /**
   * Найти эксклюзивный контент по ID
   */
  async findById(id: string): Promise<ExclusiveContent | null> {
    return await prisma.exclusiveContent.findUnique({
      where: { id },
    });
  }
}

export const exclusiveRepository = new ExclusiveRepository();
