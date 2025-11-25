/**
 * Auth Service
 * Бизнес-логика аутентификации
 */

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { userRepository } from '../repositories';
import { JWT_SECRET } from '../utils/config';
import { AppError } from '../middleware/error.middleware';

export class AuthService {
  /**
   * Регистрация нового пользователя
   */
  async register(email: string, password: string, name?: string) {
    // Проверка существования пользователя
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      throw new AppError('Пользователь с таким email уже существует', 409);
    }

    // Хеширование пароля
    const password_hash = await bcrypt.hash(password, 10);

    // Создание пользователя
    const user = await userRepository.create({ email, password_hash, name });

    // Генерация токена
    const token = this.generateToken(user.id);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        subscriptionTier: user.subscriptionTier,
        subscriptionEndDate: user.subscriptionEndDate,
      },
      token,
    };
  }

  /**
   * Вход пользователя
   */
  async login(email: string, password: string) {
    // Поиск пользователя
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new AppError('Неверный email или пароль', 401);
    }

    // Проверка пароля
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      throw new AppError('Неверный email или пароль', 401);
    }

    // Генерация токена
    const token = this.generateToken(user.id);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        subscriptionTier: user.subscriptionTier,
        subscriptionEndDate: user.subscriptionEndDate,
      },
      token,
    };
  }

  /**
   * Получение профиля пользователя
   */
  async getProfile(userId: string) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new AppError('Пользователь не найден', 404);
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      avatar_url: user.avatar_url,
      bio: user.bio,
      social_links: user.social_links,
      role: user.role,
      subscriptionTier: user.subscriptionTier,
      subscriptionEndDate: user.subscriptionEndDate,
    };
  }

  /**
   * Генерация JWT токена
   */
  private generateToken(userId: string): string {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '1h' });
  }
}

export const authService = new AuthService();
