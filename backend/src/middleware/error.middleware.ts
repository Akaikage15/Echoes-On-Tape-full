/**
 * Error Handling Middleware
 * Централизованная обработка ошибок
 */

import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';
import { logError, logWarn } from '../utils/logger';
import { AppError, formatErrorResponse, isOperationalError } from '../utils/errors';

/**
 * Глобальный обработчик ошибок
 * Централизованная обработка всех типов ошибок
 */
export const errorHandler = (
  err: Error | AppError | ZodError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // 1. Обработка ZodError (ошибки валидации)
  if (err instanceof ZodError) {
    logWarn('Validation error', {
      path: req.path,
      method: req.method,
      errors: err.errors,
    });

    return res.status(422).json({
      success: false,
      message: 'Ошибка валидации данных',
      errors: err.errors.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      })),
    });
  }

  // 2. Обработка Prisma ошибок
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    logError('Prisma error', err, {
      path: req.path,
      method: req.method,
      code: err.code,
    });

    // P2002: Unique constraint violation
    if (err.code === 'P2002') {
      return res.status(409).json({
        success: false,
        message: 'Запись с такими данными уже существует',
        field: (err.meta?.target as string[])?.join(', '),
      });
    }

    // P2025: Record not found
    if (err.code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: 'Запись не найдена',
      });
    }

    // Другие Prisma ошибки
    return res.status(400).json({
      success: false,
      message: 'Ошибка работы с базой данных',
      ...(process.env.NODE_ENV === 'development' && { code: err.code }),
    });
  }

  // 3. Обработка AppError (кастомные ошибки)
  if (err instanceof AppError) {
    // Логируем в зависимости от типа ошибки
    if (err.isOperational) {
      logWarn('Operational error', {
        path: req.path,
        method: req.method,
        statusCode: err.statusCode,
        message: err.message,
        context: err.context,
      });
    } else {
      logError('Non-operational error', err, {
        path: req.path,
        method: req.method,
        statusCode: err.statusCode,
        context: err.context,
      });
    }

    const response = formatErrorResponse(err);
    return res.status(err.statusCode).json(response);
  }

  // 4. Обработка неизвестных ошибок
  logError('Unexpected error', err, {
    path: req.path,
    method: req.method,
    body: req.body,
    query: req.query,
    params: req.params,
  });

  // В production не показываем детали ошибки
  const statusCode = 500;
  const message = process.env.NODE_ENV === 'production'
    ? 'Внутренняя ошибка сервера'
    : err.message;

  return res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && {
      stack: err.stack,
      name: err.name,
    }),
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

/**
 * Обработчик необработанных промисов
 */
export const handleUnhandledRejection = (reason: Error, promise: Promise<any>) => {
  logError('Unhandled Promise Rejection', reason, {
    promise: promise.toString(),
  });

  // В production можно завершить процесс
  if (process.env.NODE_ENV === 'production' && !isOperationalError(reason)) {
    console.error('💥 Критическая ошибка. Завершение процесса...');
    process.exit(1);
  }
};

/**
 * Обработчик необработанных исключений
 */
export const handleUncaughtException = (error: Error) => {
  logError('Uncaught Exception', error);

  // Всегда завершаем процесс при uncaught exception
  console.error('💥 Критическая ошибка. Завершение процесса...');
  process.exit(1);
};
