import { Router } from 'express';
import { getProfile, updateProfile, changePassword, deleteAccount } from '../controllers/account.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { updateProfileSchema, changePasswordSchema } from '../validators/account.validator';
import { profileAuditLogger, accountActionLogger } from '../middleware/logger.middleware';

const router = Router();

/**
 * Все роуты требуют аутентификации
 */

// GET /api/account/profile - Получить данные профиля
router.get('/profile', authenticateToken, getProfile);

// PUT /api/account/profile - Обновить профиль
router.put(
  '/profile', 
  authenticateToken, 
  profileAuditLogger,
  validate(updateProfileSchema), 
  updateProfile
);

// PUT /api/account/password - Изменить пароль
router.put(
  '/password', 
  authenticateToken, 
  accountActionLogger('change_password'),
  validate(changePasswordSchema), 
  changePassword
);

// DELETE /api/account - Удалить аккаунт
router.delete(
  '/', 
  authenticateToken, 
  accountActionLogger('delete_account'),
  deleteAccount
);

export default router;
