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
import merchRoutes from './merch.routes';
import exclusiveRoutes from './exclusive.routes';
import pollRoutes from './poll.routes';
import proLibraryRoutes from './pro-library.routes';
import demoRoutes from './demo.routes';
import uploadRoutes from './upload.routes';
import healthRoutes from './health.routes';

const router = Router();

// Health checks (без префикса /api)
router.use('/', healthRoutes);

// Подключение роутов
router.use('/auth', authRoutes);
router.use('/subscriptions', subscriptionRoutes);
router.use('/releases', releaseRoutes);
router.use('/artists', artistRoutes);
router.use('/posts', postRoutes);
router.use('/account', accountRoutes);
router.use('/merch', merchRoutes);
router.use('/exclusives', exclusiveRoutes);
router.use('/polls', pollRoutes);
router.use('/pro-library', proLibraryRoutes);
router.use('/demos', demoRoutes);
router.use('/upload', uploadRoutes);

export default router;
