/**
 * Upload Routes - маршруты для загрузки файлов
 */

import { Router, Request, Response, NextFunction } from 'express';
import { uploadAvatar as uploadAvatarController, uploadCover, uploadAudio } from '../controllers/upload.controller';
import { uploadAvatar, uploadCover as uploadCoverMiddleware, uploadAudio as uploadAudioMiddleware } from '../config/upload.config';
import { authenticateToken } from '../middleware/auth.middleware';
import { requireArtist } from '../middleware/rbac.middleware';

const router = Router();

// Обработчик ошибок Multer
const handleMulterError = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err) {
    console.error('Multer error:', err);
    return res.status(400).json({ 
      error: err.message || 'Ошибка загрузки файла' 
    });
  }
  next();
};

// Загрузка аватара (доступно всем авторизованным)
router.post('/avatar', 
  authenticateToken, 
  (req, res, next) => {
    uploadAvatar.single('avatar')(req, res, (err) => {
      if (err) {
        console.error('Avatar upload error:', err);
        return res.status(400).json({ error: err.message });
      }
      next();
    });
  },
  uploadAvatarController
);

// Загрузка обложки (только артисты и админы)
router.post('/cover', 
  authenticateToken, 
  requireArtist,
  (req, res, next) => {
    uploadCoverMiddleware.single('cover')(req, res, (err) => {
      if (err) {
        console.error('Cover upload error:', err);
        return res.status(400).json({ error: err.message });
      }
      next();
    });
  },
  uploadCover
);

// Загрузка аудио (только артисты и админы)
router.post('/audio', 
  authenticateToken, 
  requireArtist,
  (req, res, next) => {
    uploadAudioMiddleware.single('audio')(req, res, (err) => {
      if (err) {
        console.error('Audio upload error:', err);
        return res.status(400).json({ error: err.message });
      }
      next();
    });
  },
  uploadAudio
);

export default router;
