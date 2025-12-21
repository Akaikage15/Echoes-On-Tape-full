/**
 * Demo Controller
 * Контроллер для демо-треков
 */

import { Request, Response, NextFunction } from 'express';
import { demoRepository } from '../repositories/demo.repository';

/**
 * Получить все демо
 * GET /api/demos
 */
export const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const demos = await demoRepository.findAll();
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
    const demo = await demoRepository.findById(req.params.id);
    
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
    
    const { artist_name, email, track_url, genre, comment } = req.body;
    
    if (!artist_name || !email || !track_url || !genre) {
      return res.status(400).json({ 
        message: 'artist_name, email, track_url и genre обязательны' 
      });
    }
    
    const demo = await demoRepository.create({
      user_id: userId,
      artist_name,
      email,
      track_url,
      genre,
      comment: comment || '',
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
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({ message: 'status обязателен' });
    }
    
    // updateDemoStatus принимает только id и status
    // feedback можно добавить в будущем, расширив функцию
    const demo = await demoRepository.updateStatus(req.params.id, status);
    
    if (!demo) {
      return res.status(404).json({ message: 'Демо не найдено' });
    }
    
    res.status(200).json(demo);
  } catch (error) {
    next(error);
  }
};
