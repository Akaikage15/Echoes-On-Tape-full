/**
 * Artist Routes
 * Маршруты для артистов
 */

import { Router } from 'express';
import { artistController } from '../controllers/artist.controller';
import { validate } from '../middleware/validate.middleware';
import { getArtistQuerySchema, uuidParamSchema } from '../validators';

const router = Router();

// GET /api/artists - с валидацией query параметров
router.get('/', validate(getArtistQuerySchema, 'query'), (req, res, next) =>
  artistController.getAll(req, res, next)
);

// GET /api/artists/:id - с валидацией UUID
router.get('/:id', validate(uuidParamSchema, 'params'), (req, res, next) =>
  artistController.getById(req, res, next)
);

export default router;
