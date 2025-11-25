/**
 * Post Controller
 * Обработчики HTTP-запросов для постов
 */

import { Request, Response, NextFunction } from 'express';
import { postService } from '../services/post.service';

export class PostController {
  /**
   * GET /api/posts
   * Получить все посты
   */
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const posts = await postService.getAllPosts();
      res.status(200).json(posts);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/posts/:id
   * Получить пост по ID
   */
  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const post = await postService.getPostById(req.params.id);
      res.status(200).json(post);
    } catch (error) {
      next(error);
    }
  }
}

export const postController = new PostController();
