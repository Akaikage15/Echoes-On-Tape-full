/**
 * Upload Controller - управление загрузкой файлов
 * 
 * Эндпоинты:
 * - POST /api/upload/avatar - загрузка аватара пользователя
 * - POST /api/upload/cover - загрузка обложки релиза
 * - POST /api/upload/audio - загрузка аудио-файла
 * 
 * Возвращает URL загруженного файла
 */

import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import path from 'path';

const prisma = new PrismaClient();

/**
 * Загрузка аватара пользователя
 * Обновляет avatar_url в профиле
 */
export const uploadAvatar = async (req: Request, res: Response) => {
  try {
    console.log('uploadAvatar вызван');
    console.log('req.file:', req.file);
    console.log('req.user:', req.user);
    
    if (!req.file) {
      console.log('Файл не найден в запросе');
      return res.status(400).json({ error: 'Файл не загружен' });
    }

    if (!req.user) {
      console.log('Пользователь не авторизован');
      return res.status(401).json({ error: 'Требуется аутентификация' });
    }

    // Формируем URL файла
    const fileUrl = `/uploads/avatars/${req.file.filename}`;
    console.log('Сформирован URL:', fileUrl);

    // Обновляем профиль пользователя
    console.log('Обновление пользователя:', req.user.id);
    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: { avatar_url: fileUrl },
      select: {
        id: true,
        email: true,
        name: true,
        avatar_url: true,
        bio: true,
        role: true,
        subscriptionTier: true
      }
    });

    console.log('Пользователь обновлён:', updatedUser);

    res.json({
      message: 'Аватар успешно загружен',
      url: fileUrl,
      user: updatedUser
    });
  } catch (error) {
    console.error('Ошибка загрузки аватара:', error);
    res.status(500).json({ error: 'Ошибка загрузки файла' });
  }
};

/**
 * Загрузка обложки релиза
 * Возвращает URL для использования при создании/обновлении релиза
 */
export const uploadCover = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Файл не загружен' });
    }

    const fileUrl = `/uploads/covers/${req.file.filename}`;

    res.json({
      message: 'Обложка успешно загружена',
      url: fileUrl,
      filename: req.file.filename,
      size: req.file.size
    });
  } catch (error) {
    console.error('Ошибка загрузки обложки:', error);
    res.status(500).json({ error: 'Ошибка загрузки файла' });
  }
};

/**
 * Загрузка аудио-файла
 * Возвращает URL для использования при создании контента
 */
export const uploadAudio = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Файл не загружен' });
    }

    const fileUrl = `/uploads/audio/${req.file.filename}`;

    res.json({
      message: 'Аудио успешно загружено',
      url: fileUrl,
      filename: req.file.filename,
      size: req.file.size,
      mimetype: req.file.mimetype
    });
  } catch (error) {
    console.error('Ошибка загрузки аудио:', error);
    res.status(500).json({ error: 'Ошибка загрузки файла' });
  }
};
