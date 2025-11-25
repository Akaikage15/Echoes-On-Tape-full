/**
 * Конфигурация загрузки файлов
 * 
 * Поддерживаемые типы:
 * - Аватары: jpg, png, webp (макс 5MB)
 * - Обложки: jpg, png, webp (макс 10MB)
 * - Аудио: mp3, wav, flac (макс 100MB)
 */

import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Создание директорий для загрузок
const uploadDir = path.join(__dirname, '../../uploads');
const avatarsDir = path.join(uploadDir, 'avatars');
const coversDir = path.join(uploadDir, 'covers');
const audioDir = path.join(uploadDir, 'audio');

[uploadDir, avatarsDir, coversDir, audioDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Хранилище для аватаров
const avatarStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, avatarsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `avatar-${uniqueSuffix}${ext}`);
  }
});

// Хранилище для обложек
const coverStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, coversDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `cover-${uniqueSuffix}${ext}`);
  }
});

// Хранилище для аудио
const audioStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, audioDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `audio-${uniqueSuffix}${ext}`);
  }
});

// Фильтры файлов
const imageFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Недопустимый формат изображения. Разрешены: JPG, PNG, WEBP'));
  }
};

const audioFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = ['audio/mpeg', 'audio/wav', 'audio/flac', 'audio/x-flac'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Недопустимый формат аудио. Разрешены: MP3, WAV, FLAC'));
  }
};

// Экспорт конфигураций
export const uploadAvatar = multer({
  storage: avatarStorage,
  fileFilter: imageFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

export const uploadCover = multer({
  storage: coverStorage,
  fileFilter: imageFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  }
});

export const uploadAudio = multer({
  storage: audioStorage,
  fileFilter: audioFilter,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB
  }
});
