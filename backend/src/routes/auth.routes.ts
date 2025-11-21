/**
 * Auth Routes
 * Маршруты для аутентификации
 */

import { Router } from 'express';
import { authController } from '../controllers';
import { authenticateToken } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { registerSchema, loginSchema } from '../validators';

const router = Router();

// POST /api/auth/register - с валидацией
router.post('/register', validate(registerSchema, 'body'), (req, res, next) =>
  authController.register(req, res, next)
);

// POST /api/auth/login - с валидацией
router.post('/login', validate(loginSchema, 'body'), (req, res, next) =>
  authController.login(req, res, next)
);

// GET /api/auth/profile (требует авторизации)
router.get('/profile', authenticateToken, (req, res, next) =>
  authController.getProfile(req, res, next)
);

export default router;
