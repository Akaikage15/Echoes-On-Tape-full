/**
 * Account Routes
 * Маршруты для управления аккаунтом
 */

import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { updateProfileSchema, changePasswordSchema } from '../validators';

const router = Router();

// Placeholder контроллер (будет создан в следующих задачах)
const accountController = {
  getProfile: async (req: any, res: any, next: any) => {
    res.status(501).json({ message: 'Not implemented yet' });
  },
  updateProfile: async (req: any, res: any, next: any) => {
    res.status(501).json({ message: 'Not implemented yet' });
  },
  changePassword: async (req: any, res: any, next: any) => {
    res.status(501).json({ message: 'Not implemented yet' });
  },
  deleteAccount: async (req: any, res: any, next: any) => {
    res.status(501).json({ message: 'Not implemented yet' });
  },
};

// GET /api/account/profile - получить профиль (требует авторизации)
router.get('/profile', authenticateToken, (req, res, next) =>
  accountController.getProfile(req, res, next)
);

// PUT /api/account/profile - обновить профиль (требует авторизации + валидация)
router.put(
  '/profile',
  authenticateToken,
  validate(updateProfileSchema, 'body'),
  (req, res, next) => accountController.updateProfile(req, res, next)
);

// PUT /api/account/password - изменить пароль (требует авторизации + валидация)
router.put(
  '/password',
  authenticateToken,
  validate(changePasswordSchema, 'body'),
  (req, res, next) => accountController.changePassword(req, res, next)
);

// DELETE /api/account - удалить аккаунт (требует авторизации)
router.delete('/', authenticateToken, (req, res, next) =>
  accountController.deleteAccount(req, res, next)
);

export default router;
