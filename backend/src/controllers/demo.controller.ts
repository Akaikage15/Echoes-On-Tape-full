/**
 * Demo Controller
 * Контроллер для демо-треков
 */

import { Request, Response, NextFunction } from 'express';
import { getAllDemos, getDemoById, createDemo, updateDemoStatus } from '../utils/demos-db';

/**
 * Получить все демо
 * GET /api/demos
 */
export const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const demos = await getAllDemos();
    res.status(200).json(demos);
  } catch (error) {
    next(error);
  }
};

/**
 * Получить демо по ID
 * GET /api/demos/:id
 */
export const getById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const demo = await getDemoById(req.params.id);
    
    if (!demo) {
      return res.status(404).json({ message: 'Демо не найдено' });
    }
    
    res.status(200).json(demo);
  } catch (error) {
    next(error);
  }
};

/**
 * Создать новое демо
 * POST /api/demos
 */
export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.id;
    
    if (!userId) {
      return res.status(401).json({ message: 'Требуется авторизация' });
    }
    
    const { artistName, trackTitle, genre, fileUrl, description } = req.body;
    
    if (!artistName || !trackTitle || !genre || !fileUrl) {
      return res.status(400).json({ 
        message: 'artistName, trackTitle, genre и fileUrl обязательны' 
      });
    }
    
    const demo = await createDemo({
      artistName,
      trackTitle,
      genre,
      fileUrl,
      description,
      submittedBy: userId,
    });
    
    res.status(201).json(demo);
  } catch (error) {
    next(error);
  }
};

/**
 * Обновить статус демо
 * PUT /api/demos/:id/status
 */
export const updateStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status, feedback } = req.body;
    
    if (!status) {
      return res.status(400).json({ message: 'status обязателен' });
    }
    
    const demo = await updateDemoStatus(req.params.id, status, feedback);
    
    if (!demo) {
      return res.status(404).json({ message: 'Демо не найдено' });
    }
    
    res.status(200).json(demo);
  } catch (error) {
    next(error);
  }
};
