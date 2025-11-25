/**
 * Poll Controller
 * Контроллер для голосований
 */

import { Request, Response, NextFunction } from 'express';
import { getAllPolls, getPollById, submitVote } from '../utils/polls-db';

/**
 * Получить все голосования
 * GET /api/polls
 */
export const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const polls = await getAllPolls();
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
    const poll = await getPollById(req.params.id);
    
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
    
    // submitVote принимает только pollId и optionId
    // В реальном приложении нужно добавить userId в функцию для предотвращения повторных голосов
    const result = await submitVote(req.params.id, optionId);
    
    if (!result) {
      return res.status(404).json({ message: 'Голосование или опция не найдены' });
    }
    
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
