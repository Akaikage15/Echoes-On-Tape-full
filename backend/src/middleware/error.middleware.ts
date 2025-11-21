/**
 * Error Handling Middleware
 * Централизованная обработка ошибок
 */

import { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Глобальный обработчик ошибок
 */
export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
    return;
  }

  // Неожиданные ошибки
  console.error('Unexpected error:', err);
  res.status(500).json({
    status: 'error',
    message: 'Внутренняя ошибка сервера',
  });
};

/**
 * Обработчик для несуществующих маршрутов
 */
export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const error = new AppError(`Маршрут ${req.originalUrl} не найден`, 404);
  next(error);
};
