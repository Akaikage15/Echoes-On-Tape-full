/**
 * Routes Index
 * Главный роутер приложения
 */

import { Router } from 'express';
import authRoutes from './auth.routes';
import subscriptionRoutes from './subscription.routes';
import releaseRoutes from './release.routes';

const router = Router();

// Подключение роутов
router.use('/auth', authRoutes);
router.use('/subscriptions', subscriptionRoutes);
router.use('/releases', releaseRoutes);

export default router;
