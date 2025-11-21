/**
 * Release Routes
 * Маршруты для релизов
 */

import { Router } from 'express';
import { releaseController } from '../controllers';

const router = Router();

// GET /api/releases
router.get('/', (req, res, next) => releaseController.getAll(req, res, next));

// GET /api/releases/:id
router.get('/:id', (req, res, next) => releaseController.getById(req, res, next));

export default router;
