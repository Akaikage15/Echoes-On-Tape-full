/**
 * Subscription Controller
 * Обработчики HTTP-запросов для подписок
 */

import { Response, NextFunction } from 'express';
import { subscriptionService } from '../services';
import { AuthRequest } from '../middleware/auth.middleware';

export class SubscriptionController {
  /**
   * POST /api/subscriptions/purchase
   * Покупка подписки
   */
  async purchase(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { tier } = req.body;

      if (!req.user) {
        return res.status(401).json({ message: 'Не авторизован' });
      }

      if (!tier) {
        return res.status(400).json({ message: 'Требуется тип подписки' });
      }

      const user = await subscriptionService.purchaseSubscription(req.user.userId, tier);

      res.status(200).json({
        message: `Подписка на уровень "${tier}" успешно оформлена.`,
        user,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/subscriptions/cancel
   * Отмена подписки
   */
  async cancel(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Не авторизован' });
      }

      const user = await subscriptionService.cancelSubscription(req.user.userId);

      res.status(200).json({
        message: 'Подписка отменена',
        user,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const subscriptionController = new SubscriptionController();
