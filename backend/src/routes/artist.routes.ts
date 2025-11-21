/**
 * Artist Routes
 * Маршруты для артистов
 */

import { Router } from 'express';
import { artistController } from '../controllers/artist.controller';

const router = Router();

// GET /api/artists
router.get('/', (req, res, next) => artistController.getAll(req, res, next));

// GET /api/artists/:id
router.get('/:id', (req, res, next) => artistController.getById(req, res, next));

export default router;
