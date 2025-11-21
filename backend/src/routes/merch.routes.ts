/**
 * Merch Routes
 * Маршруты для товаров мерча
 */

import { Router } from 'express';
import * as merchController from '../controllers/merch.controller';
import { validate } from '../middleware/validate.middleware';
import { uuidParamSchema } from '../validators';

const router = Router();

// GET /api/merch - получить все товары
router.get('/', (req, res, next) => merchController.getAll(req, res, next));

// GET /api/merch/:id - получить товар по ID
router.get('/:id', validate(uuidParamSchema, 'params'), (req, res, next) =>
  merchController.getById(req, res, next)
);

export default router;
