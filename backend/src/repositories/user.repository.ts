/**
 * User Repository
 * Слой доступа к данным пользователей
 */

import prisma from '../lib/prisma';
import { User } from '@prisma/client';

export class UserRepository {
  /**
   * Найти пользователя по email
   */
  async findByEmail(email: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { email },
    });
  }

  /**
   * Найти пользователя по ID
   */
  async findById(id: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { id },
    });
  }

  /**
   * Создать нового пользователя
   */
  async create(data: {
    email: string;
    password_hash: string;
    name?: string;
  }): Promise<User> {
    return await prisma.user.create({
      data: {
        email: data.email,
        password_hash: data.password_hash,
        name: data.name,
        subscriptionTier: 'none',
      },
    });
  }

  /**
   * Обновить подписку пользователя
   */
  async updateSubscription(
    userId: string,
    tier: string,
    endDate: Date
  ): Promise<User> {
    return await prisma.user.update({
      where: { id: userId },
      data: {
        subscriptionTier: tier,
        subscriptionEndDate: endDate,
      },
    });
  }

  /**
   * Обновить данные пользователя
   */
  async update(
    userId: string,
    data: Partial<Pick<User, 'name' | 'avatar_url'>>
  ): Promise<User> {
    return await prisma.user.update({
      where: { id: userId },
      data,
    });
  }
}

export const userRepository = new UserRepository();
