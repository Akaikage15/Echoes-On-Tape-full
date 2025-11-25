/**
 * Authentication Middleware
 * Проверка JWT токена и загрузка данных пользователя
 */

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { JWT_SECRET } from '../utils/config';

const prisma = new PrismaClient();

// Используем глобальный тип из rbac.middleware.ts
export interface AuthRequest extends Request {}

/**
 * Middleware для проверки JWT токена
 * Загружает полную информацию о пользователе из БД
 */
export const authenticateToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.sendStatus(401);
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email?: string };
    
    // Загружаем данные пользователя из БД
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        role: true,
        subscriptionTier: true,
        subscriptionEndDate: true
      }
    });

    if (!user) {
      res.status(401).json({ error: 'Пользователь не найден' });
      return;
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      subscriptionTier: user.subscriptionTier,
      subscriptionEndDate: user.subscriptionEndDate
    };
    
    next();
  } catch (error) {
    res.sendStatus(403);
  }
};
