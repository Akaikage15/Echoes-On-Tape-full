/**
 * Subscription Service
 * Бизнес-логика подписок
 */

import { userRepository } from '../repositories';
import { NotFoundError, BadRequestError } from '../utils/errors';

export class SubscriptionService {
  /**
   * Покупка подписки
   */
  async purchaseSubscription(userId: string, tier: string) {
    // Валидация tier
    const validTiers = ['lite', 'fan', 'pro'];
    if (!validTiers.includes(tier)) {
      throw new BadRequestError('Неверный тип подписки');
    }

    // Проверка существования пользователя
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('Пользователь не найден');
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
      throw new NotFoundError('Пользователь не найден');
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
