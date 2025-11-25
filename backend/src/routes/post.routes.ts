/**
 * Post Routes
 * Маршруты для постов
 */

import { Router } from 'express';
import { postController } from '../controllers/post.controller';
import { validate } from '../middleware/validate.middleware';
import { getPostQuerySchema, uuidParamSchema } from '../validators';

const router = Router();

// GET /api/posts - с валидацией query параметров
router.get('/', validate(getPostQuerySchema, 'query'), (req, res, next) =>
  postController.getAll(req, res, next)
);

// GET /api/posts/:id - с валидацией UUID
router.get('/:id', validate(uuidParamSchema, 'params'), (req, res, next) =>
  postController.getById(req, res, next)
);

export default router;
