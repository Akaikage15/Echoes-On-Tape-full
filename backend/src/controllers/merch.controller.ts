/**
 * Merch Controller
 * Контроллер для товаров мерча
 */

import { Request, Response, NextFunction } from 'express';
import { merchRepository } from '../repositories/merch.repository';

/**
 * Получить все товары мерча
 * GET /api/merch
 */
export const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const merchItems = await merchRepository.findAll();
    res.status(200).json(merchItems);
  } catch (error) {
    next(error);
  }
};

/**
 * Получить товар по ID
 * GET /api/merch/:id
 */
export const getById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const merchItem = await merchRepository.findById(req.params.id);
    
    if (!merchItem) {
      return res.status(404).json({ message: 'Товар не найден' });
    }
    
    res.status(200).json(merchItem);
  } catch (error) {
    next(error);
  }
};
