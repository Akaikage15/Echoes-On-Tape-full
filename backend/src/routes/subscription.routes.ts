/**
 * Subscription Routes
 * Маршруты для подписок
 */

import { Router } from 'express';
import { subscriptionController } from '../controllers';
import { authenticateToken } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { purchaseSubscriptionSchema, cancelSubscriptionSchema } from '../validators';

const router = Router();

// POST /api/subscriptions/purchase (требует авторизации + валидация)
router.post(
  '/purchase',
  authenticateToken,
  validate(purchaseSubscriptionSchema, 'body'),
  (req, res, next) => subscriptionController.purchase(req, res, next)
);

// POST /api/subscriptions/cancel (требует авторизации + валидация)
router.post(
  '/cancel',
  authenticateToken,
  validate(cancelSubscriptionSchema, 'body'),
  (req, res, next) => subscriptionController.cancel(req, res, next)
);

export default router;
