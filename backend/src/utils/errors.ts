/**
 * Кастомные классы ошибок для приложения
 */

/**
 * Базовый класс для всех кастомных ошибок
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly context?: Record<string, any>;

  constructor(
    message: string,
    statusCode: number = 500,
    isOperational: boolean = true,
    context?: Record<string, any>
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.context = context;

    // Сохраняем правильный stack trace
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * 400 Bad Request - некорректный запрос
 */
export class BadRequestError extends AppError {
  constructor(message: string = 'Некорректный запрос', context?: Record<string, any>) {
    super(message, 400, true, context);
  }
}

/**
 * 401 Unauthorized - не авторизован
 */
export class UnauthorizedError extends AppError {
  constructor(message: string = 'Требуется авторизация', context?: Record<string, any>) {
    super(message, 401, true, context);
  }
}

/**
 * 403 Forbidden - доступ запрещён
 */
export class ForbiddenError extends AppError {
  constructor(message: string = 'Доступ запрещён', context?: Record<string, any>) {
    super(message, 403, true, context);
  }
}

/**
 * 404 Not Found - ресурс не найден
 */
export class NotFoundError extends AppError {
  constructor(message: string = 'Ресурс не найден', context?: Record<string, any>) {
    super(message, 404, true, context);
  }
}

/**
 * 409 Conflict - конфликт (например, дубликат email)
 */
export class ConflictError extends AppError {
  constructor(message: string = 'Конфликт данных', context?: Record<string, any>) {
    super(message, 409, true, context);
  }
}

/**
 * 422 Unprocessable Entity - ошибка валидации
 */
export class ValidationError extends AppError {
  constructor(message: string = 'Ошибка валидации данных', context?: Record<string, any>) {
    super(message, 422, true, context);
  }
}

/**
 * 429 Too Many Requests - превышен лимит запросов
 */
export class TooManyRequestsError extends AppError {
  constructor(message: string = 'Слишком много запросов', context?: Record<string, any>) {
    super(message, 429, true, context);
  }
}

/**
 * 500 Internal Server Error - внутренняя ошибка сервера
 */
export class InternalServerError extends AppError {
  constructor(message: string = 'Внутренняя ошибка сервера', context?: Record<string, any>) {
    super(message, 500, false, context);
  }
}

/**
 * 503 Service Unavailable - сервис недоступен
 */
export class ServiceUnavailableError extends AppError {
  constructor(message: string = 'Сервис временно недоступен', context?: Record<string, any>) {
    super(message, 503, true, context);
  }
}

/**
 * Проверка, является ли ошибка операционной (ожидаемой)
 */
export const isOperationalError = (error: Error): boolean => {
  if (error instanceof AppError) {
    return error.isOperational;
  }
  return false;
};

/**
 * Форматирование ошибки для ответа клиенту
 */
export const formatErrorResponse = (error: AppError | Error) => {
  if (error instanceof AppError) {
    return {
      success: false,
      message: error.message,
      statusCode: error.statusCode,
      ...(error.context && { context: error.context }),
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
    };
  }

  // Для неизвестных ошибок
  return {
    success: false,
    message: 'Внутренняя ошибка сервера',
    statusCode: 500,
    ...(process.env.NODE_ENV === 'development' && {
      originalMessage: error.message,
      stack: error.stack,
    }),
  };
};
