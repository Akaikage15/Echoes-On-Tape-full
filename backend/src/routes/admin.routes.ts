import { Router } from 'express';
import { adminController } from '../controllers/admin.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/rbac.middleware';

const router = Router();

// Все роуты защищены: только для ADMIN
router.use(authenticateToken, requireRole(['ADMIN']));

router.get('/users', adminController.getAllUsers);
router.get('/stats', adminController.getStats);
router.delete('/users/:id', adminController.deleteUser);

export default router;
