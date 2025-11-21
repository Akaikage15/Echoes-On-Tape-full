/**
 * Subscription Service
 * Бизнес-логика подписок
 */

import { userRepository } from '../repositories';
import { AppError } from '../middleware/error.middleware';

export class SubscriptionService {
  /**
   * Покупка подписки
   */
  async purchaseSubscription(userId: string, tier: string) {
    // Валидация tier
    const validTiers = ['lite', 'fan', 'pro'];
    if (!validTiers.includes(tier)) {
      throw new AppError('Неверный тип подписки', 400);
    }

    // Проверка существования пользователя
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new AppError('Пользователь не найден', 404);
    }

    // Расчет даты окончания (30 дней)
    const endDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    // Обновление подписки
    const updatedUser = await userRepository.updateSubscription(userId, tier, endDate);

    return {
      id: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
      subscriptionTier: updatedUser.subscriptionTier,
      subscriptionEndDate: updatedUser.subscriptionEndDate,
    };
  }

  /**
   * Отмена подписки
   */
  async cancelSubscription(userId: string) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new AppError('Пользователь не найден', 404);
    }

    // Установка подписки в 'none'
    const updatedUser = await userRepository.updateSubscription(
      userId,
      'none',
      new Date()
    );

    return {
      id: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
      subscriptionTier: updatedUser.subscriptionTier,
      subscriptionEndDate: updatedUser.subscriptionEndDate,
    };
  }
}

export const subscriptionService = new SubscriptionService();
