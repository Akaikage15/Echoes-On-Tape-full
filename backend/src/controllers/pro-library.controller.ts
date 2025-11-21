/**
 * Pro Library Controller
 * Контроллер для PRO-библиотеки
 */

import { Request, Response, NextFunction } from 'express';
import { getAllProLibraryItems, getProLibraryItemById } from '../utils/pro-library-db';

/**
 * Получить все элементы PRO-библиотеки
 * GET /api/pro-library
 */
export const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const items = await getAllProLibraryItems();
    res.status(200).json(items);
  } catch (error) {
    next(error);
  }
};

/**
 * Получить элемент по ID
 * GET /api/pro-library/:id
 */
export const getById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const item = await getProLibraryItemById(req.params.id);
    
    if (!item) {
      return res.status(404).json({ message: 'Элемент не найден' });
    }
    
    res.status(200).json(item);
  } catch (error) {
    next(error);
  }
};
