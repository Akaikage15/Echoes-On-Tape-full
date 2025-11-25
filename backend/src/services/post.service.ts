/**
 * Post Service
 * Бизнес-логика постов
 */

import { postRepository } from '../repositories';
import { NotFoundError } from '../utils/errors';

export class PostService {
  /**
   * Получить все посты
   */
  async getAllPosts() {
    return await postRepository.findAll();
  }

  /**
   * Получить пост по ID
   */
  async getPostById(id: string) {
    const post = await postRepository.findById(id);
    if (!post) {
      throw new NotFoundError('Пост не найден');
    }
    return post;
  }
}

export const postService = new PostService();
