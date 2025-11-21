/**
 * Post Routes
 * Маршруты для постов
 */

import { Router } from 'express';
import { postController } from '../controllers/post.controller';

const router = Router();

// GET /api/posts
router.get('/', (req, res, next) => postController.getAll(req, res, next));

// GET /api/posts/:id
router.get('/:id', (req, res, next) => postController.getById(req, res, next));

export default router;
