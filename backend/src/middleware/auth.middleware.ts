/**
 * Authentication Middleware
 * Проверка JWT токена
 */

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../utils/config';

// Расширяем Request для добавления user
export interface AuthRequest extends Request {
  user?: {
    userId: string;
  };
}

/**
 * Middleware для проверки JWT токена
 */
export const authenticateToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.sendStatus(401);
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    req.user = decoded;
    next();
  } catch (error) {
    res.sendStatus(403);
  }
};
