/**
 * Post Repository
 * Слой доступа к данным постов
 */

import prisma from '../lib/prisma';
import { Post } from '@prisma/client';

export class PostRepository {
  /**
   * Получить все посты
   */
  async findAll(): Promise<Post[]> {
    return await prisma.post.findMany({
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  /**
   * Найти пост по ID
   */
  async findById(id: string): Promise<Post | null> {
    return await prisma.post.findUnique({
      where: { id },
    });
  }
}

export const postRepository = new PostRepository();
