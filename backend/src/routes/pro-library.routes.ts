/**
 * Pro Library Routes
 * Маршруты для PRO-библиотеки
 */

import { Router } from 'express';
import * as proLibraryController from '../controllers/pro-library.controller';
import { validate } from '../middleware/validate.middleware';
import { uuidParamSchema } from '../validators';

const router = Router();

// GET /api/pro-library - получить все элементы
router.get('/', (req, res, next) => proLibraryController.getAll(req, res, next));

// GET /api/pro-library/:id - получить элемент по ID
router.get('/:id', validate(uuidParamSchema, 'params'), (req, res, next) =>
  proLibraryController.getById(req, res, next)
);

export default router;
