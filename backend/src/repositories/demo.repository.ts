/**
 * Demo Repository
 * Слой доступа к демо-трекам
 */

import prisma from '../lib/prisma';
import { Demo } from '@prisma/client';

export class DemoRepository {
  /**
   * Получить все демо
   */
  async findAll(): Promise<Demo[]> {
    return await prisma.demo.findMany({
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  /**
   * Получить демо пользователя
   */
  async findByUserId(userId: string): Promise<Demo[]> {
    return await prisma.demo.findMany({
      where: { user_id: userId },
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  /**
   * Найти демо по ID
   */
  async findById(id: string): Promise<Demo | null> {
    return await prisma.demo.findUnique({
      where: { id },
    });
  }

  /**
   * Создать демо
   */
  async create(data: {
    user_id: string;
    artist_name: string;
    email: string;
    track_url: string;
    genre: string;
    comment?: string;
  }): Promise<Demo> {
    return await prisma.demo.create({
      data: {
        ...data,
        upload_date: new Date(),
        status: 'pending',
      },
    });
  }

  /**
   * Обновить статус демо
   */
  async updateStatus(id: string, status: string): Promise<Demo> {
    return await prisma.demo.update({
      where: { id },
      data: { status },
    });
  }
}

export const demoRepository = new DemoRepository();
