/**
 * Auth Controller
 * Обработчики HTTP-запросов для аутентификации
 */

import { Request, Response, NextFunction } from 'express';
import { authService } from '../services';
import { AuthRequest } from '../middleware/auth.middleware';

export class AuthController {
  /**
   * POST /api/auth/register
   * Регистрация нового пользователя
   */
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password, name } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: 'Email и пароль обязательны' });
      }

      const result = await authService.register(email, password, name);

      res.status(201).json({
        message: 'Пользователь успешно зарегистрирован',
        ...result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/auth/login
   * Вход пользователя
   */
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: 'Email и пароль обязательны' });
      }

      const result = await authService.login(email, password);

      res.status(200).json({
        message: 'Вход выполнен успешно',
        ...result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/auth/profile
   * Получение профиля пользователя
   */
  async getProfile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Не авторизован' });
      }

      const user = await authService.getProfile(req.user.userId);

      res.status(200).json({
        message: 'Профиль пользователя',
        user,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();
