/**
 * Routes Index
 * Главный роутер приложения
 */

import { Router } from 'express';
import authRoutes from './auth.routes';
import subscriptionRoutes from './subscription.routes';
import releaseRoutes from './release.routes';
import artistRoutes from './artist.routes';
import postRoutes from './post.routes';
import accountRoutes from './account.routes';

const router = Router();

// Подключение роутов
router.use('/auth', authRoutes);
router.use('/subscriptions', subscriptionRoutes);
router.use('/releases', releaseRoutes);
router.use('/artists', artistRoutes);
router.use('/posts', postRoutes);
router.use('/account', accountRoutes);

export default router;
