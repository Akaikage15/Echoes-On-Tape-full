/**
 * Poll Controller
 * Контроллер для голосований
 */

import { Request, Response, NextFunction } from 'express';
import { pollRepository } from '../repositories/poll.repository';

/**
 * Получить все голосования
 * GET /api/polls
 */
export const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const polls = await pollRepository.findAll();
    res.status(200).json(polls);
  } catch (error) {
    next(error);
  }
};

/**
 * Получить голосование по ID
 * GET /api/polls/:id
 */
export const getById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const poll = await pollRepository.findById(req.params.id);
    
    if (!poll) {
      return res.status(404).json({ message: 'Голосование не найдено' });
    }
    
    res.status(200).json(poll);
  } catch (error) {
    next(error);
  }
};

/**
 * Проголосовать
 * POST /api/polls/:id/vote
 */
export const vote = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { optionId } = req.body;
    const userId = (req as any).user?.id;
    
    if (!optionId) {
      return res.status(400).json({ message: 'optionId обязателен' });
    }
    
    if (!userId) {
      return res.status(401).json({ message: 'Требуется авторизация' });
    }
    
    const result = await pollRepository.vote(userId, req.params.id, optionId);
    
    res.status(200).json(result);
  } catch (error: any) {
    if (error.message === 'Вы уже проголосовали в этом опросе') {
      return res.status(409).json({ message: error.message });
    } else if (error.message === 'Голосование не найдено') {
      return res.status(404).json({ message: error.message });
    }
    next(error);
  }
};
