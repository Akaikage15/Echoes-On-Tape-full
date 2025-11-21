/**
 * Subscription Routes
 * Маршруты для подписок
 */

import { Router } from 'express';
import { subscriptionController } from '../controllers';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

// POST /api/subscriptions/purchase (требует авторизации)
router.post('/purchase', authenticateToken, (req, res, next) =>
  subscriptionController.purchase(req, res, next)
);

// POST /api/subscriptions/cancel (требует авторизации)
router.post('/cancel', authenticateToken, (req, res, next) =>
  subscriptionController.cancel(req, res, next)
);

export default router;
