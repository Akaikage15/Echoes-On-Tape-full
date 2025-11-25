/**
 * Auth Controller
 * Обработчики HTTP-запросов для аутентификации
 */

import { Request, Response, NextFunction } from 'express';
import { authService } from '../services';
import { AuthRequest } from '../middleware/auth.middleware';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken, revokeRefreshToken } from '../services/token.service';

export class AuthController {
  /**
   * POST /api/auth/register
   * Регистрация нового пользователя
   * Возвращает: accessToken, refreshToken
   */
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password, name } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: 'Email и пароль обязательны' });
      }

      const result = await authService.register(email, password, name);
      
      // Генерация refresh token
      const refreshToken = await generateRefreshToken(result.user.id);

      // Установка refresh token в httpOnly cookie
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 дней
      });

      res.status(201).json({
        message: 'Пользователь успешно зарегистрирован',
        accessToken: result.token,
        refreshToken,
        user: result.user,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/auth/login
   * Вход пользователя
   * Возвращает: accessToken, refreshToken
   */
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: 'Email и пароль обязательны' });
      }

      const result = await authService.login(email, password);
      
      // Генерация refresh token
      const refreshToken = await generateRefreshToken(result.user.id);

      // Установка refresh token в httpOnly cookie
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 дней
      });

      res.status(200).json({
        message: 'Вход выполнен успешно',
        accessToken: result.token,
        refreshToken,
        user: result.user,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/auth/refresh
   * Обновление access token с помощью refresh token
   */
  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

      if (!refreshToken) {
        return res.status(401).json({ message: 'Refresh token отсутствует' });
      }

      const userId = await verifyRefreshToken(refreshToken);

      if (!userId) {
        return res.status(401).json({ message: 'Невалидный или истёкший refresh token' });
      }

      // Получение данных пользователя
      const user = await authService.getProfile(userId);

      // Генерация нового access token
      const accessToken = generateAccessToken(userId, user.email);

      res.status(200).json({
        message: 'Токен обновлён',
        accessToken,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/auth/logout
   * Выход пользователя (удаление refresh token)
   */
  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

      if (refreshToken) {
        await revokeRefreshToken(refreshToken);
      }

      res.clearCookie('refreshToken');

      res.status(200).json({
        message: 'Выход выполнен успешно',
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

      const user = await authService.getProfile(req.user.id);

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
