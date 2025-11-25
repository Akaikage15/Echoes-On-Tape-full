/**
 * Upload Routes - маршруты для загрузки файлов
 */

import { Router } from 'express';
import { uploadAvatar as uploadAvatarController, uploadCover, uploadAudio } from '../controllers/upload.controller';
import { uploadAvatar, uploadCover as uploadCoverMiddleware, uploadAudio as uploadAudioMiddleware } from '../config/upload.config';
import { authenticateToken } from '../middleware/auth.middleware';
import { requireArtist } from '../middleware/rbac.middleware';

const router = Router();

// Загрузка аватара (доступно всем авторизованным)
router.post('/avatar', 
  authenticateToken, 
  uploadAvatar.single('avatar'), 
  uploadAvatarController
);

// Загрузка обложки (только артисты и админы)
router.post('/cover', 
  authenticateToken, 
  requireArtist,
  uploadCoverMiddleware.single('cover'), 
  uploadCover
);

// Загрузка аудио (только артисты и админы)
router.post('/audio', 
  authenticateToken, 
  requireArtist,
  uploadAudioMiddleware.single('audio'), 
  uploadAudio
);

export default router;
