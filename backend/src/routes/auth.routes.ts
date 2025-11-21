/**
 * Auth Routes
 * Маршруты для аутентификации
 */

import { Router } from 'express';
import { authController } from '../controllers';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

// POST /api/auth/register
router.post('/register', (req, res, next) => authController.register(req, res, next));

// POST /api/auth/login
router.post('/login', (req, res, next) => authController.login(req, res, next));

// GET /api/auth/profile (требует авторизации)
router.get('/profile', authenticateToken, (req, res, next) =>
  authController.getProfile(req, res, next)
);

export default router;
