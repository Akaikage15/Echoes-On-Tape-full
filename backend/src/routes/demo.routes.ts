/**
 * Demo Routes
 * Маршруты для демо-треков
 */

import { Router } from 'express';
import * as demoController from '../controllers/demo.controller';
import { validate } from '../middleware/validate.middleware';
import { uuidParamSchema } from '../validators';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

// GET /api/demos - получить все демо
router.get('/', (req, res, next) => demoController.getAll(req, res, next));

// GET /api/demos/:id - получить демо по ID
router.get('/:id', validate(uuidParamSchema, 'params'), (req, res, next) =>
  demoController.getById(req, res, next)
);

// POST /api/demos - создать новое демо (требует авторизации)
router.post('/', authenticateToken, (req, res, next) => demoController.create(req, res, next));

// PUT /api/demos/:id/status - обновить статус демо
router.put('/:id/status', validate(uuidParamSchema, 'params'), (req, res, next) =>
  demoController.updateStatus(req, res, next)
);

export default router;
