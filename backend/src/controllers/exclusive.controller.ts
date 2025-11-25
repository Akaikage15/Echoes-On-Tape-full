/**
 * Exclusive Controller
 * Контроллер для эксклюзивного контента
 */

import { Request, Response, NextFunction } from 'express';
import { getAllExclusives, getExclusiveById } from '../utils/exclusives-db';

/**
 * Получить весь эксклюзивный контент
 * GET /api/exclusives
 */
export const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const exclusives = await getAllExclusives();
    res.status(200).json(exclusives);
  } catch (error) {
    next(error);
  }
};

/**
 * Получить эксклюзивный контент по ID
 * GET /api/exclusives/:id
 */
export const getById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const exclusive = await getExclusiveById(req.params.id);
    
    if (!exclusive) {
      return res.status(404).json({ message: 'Контент не найден' });
    }
    
    res.status(200).json(exclusive);
  } catch (error) {
    next(error);
  }
};
