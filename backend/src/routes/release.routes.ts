/**
 * Release Routes
 * Маршруты для релизов
 */

import { Router } from 'express';
import { releaseController } from '../controllers';
import { validate, validateMultiple } from '../middleware/validate.middleware';
import { getReleaseQuerySchema, uuidParamSchema } from '../validators';

const router = Router();

// GET /api/releases - с валидацией query параметров
router.get('/', validate(getReleaseQuerySchema, 'query'), (req, res, next) =>
  releaseController.getAll(req, res, next)
);

// GET /api/releases/:id - с валидацией UUID
router.get('/:id', validate(uuidParamSchema, 'params'), (req, res, next) =>
  releaseController.getById(req, res, next)
);

export default router;
