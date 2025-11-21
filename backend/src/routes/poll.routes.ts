/**
 * Poll Routes
 * Маршруты для голосований
 */

import { Router } from 'express';
import * as pollController from '../controllers/poll.controller';
import { validate } from '../middleware/validate.middleware';
import { uuidParamSchema } from '../validators';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

// GET /api/polls - получить все голосования
router.get('/', (req, res, next) => pollController.getAll(req, res, next));

// GET /api/polls/:id - получить голосование по ID
router.get('/:id', validate(uuidParamSchema, 'params'), (req, res, next) =>
  pollController.getById(req, res, next)
);

// POST /api/polls/:id/vote - проголосовать (требует авторизации)
router.post(
  '/:id/vote',
  authenticateToken,
  validate(uuidParamSchema, 'params'),
  (req, res, next) => pollController.vote(req, res, next)
);

export default router;
