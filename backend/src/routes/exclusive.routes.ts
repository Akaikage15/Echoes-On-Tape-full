/**
 * Exclusive Routes
 * Маршруты для эксклюзивного контента
 */

import { Router } from 'express';
import * as exclusiveController from '../controllers/exclusive.controller';
import { validate } from '../middleware/validate.middleware';
import { uuidParamSchema } from '../validators';

const router = Router();

// GET /api/exclusives - получить весь эксклюзивный контент
router.get('/', (req, res, next) => exclusiveController.getAll(req, res, next));

// GET /api/exclusives/:id - получить контент по ID
router.get('/:id', validate(uuidParamSchema, 'params'), (req, res, next) =>
  exclusiveController.getById(req, res, next)
);

export default router;
