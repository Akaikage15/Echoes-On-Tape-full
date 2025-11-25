/**
 * Merch Controller
 * Контроллер для товаров мерча
 */

import { Request, Response, NextFunction } from 'express';
import { getAllMerchItems, getMerchItemById } from '../utils/merch-db';

/**
 * Получить все товары мерча
 * GET /api/merch
 */
export const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const merchItems = await getAllMerchItems();
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
    const merchItem = await getMerchItemById(req.params.id);
    
    if (!merchItem) {
      return res.status(404).json({ message: 'Товар не найден' });
    }
    
    res.status(200).json(merchItem);
  } catch (error) {
    next(error);
  }
};
