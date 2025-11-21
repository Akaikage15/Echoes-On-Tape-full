/**
 * Merch Repository
 * Слой доступа к товарам мерча
 */

import prisma from '../lib/prisma';
import { MerchItem } from '@prisma/client';

export class MerchRepository {
  /**
   * Получить все товары
   */
  async findAll(): Promise<MerchItem[]> {
    return await prisma.merchItem.findMany({
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  /**
   * Найти товар по ID
   */
  async findById(id: string): Promise<MerchItem | null> {
    return await prisma.merchItem.findUnique({
      where: { id },
    });
  }
}

export const merchRepository = new MerchRepository();
