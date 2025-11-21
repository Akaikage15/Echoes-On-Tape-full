import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

/**
 * Middleware для валидации данных с помощью Zod схем
 * 
 * @param schema - Zod схема для валидации
 * @param source - источник данных ('body', 'query', 'params')
 * @returns Express middleware функция
 * 
 * Использование:
 * router.post('/register', validate(registerSchema, 'body'), authController.register);
 * 
 * При ошибке валидации возвращает 400 с детальным описанием ошибок
 */
export const validate = (schema: ZodSchema, source: 'body' | 'query' | 'params' = 'body') => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req[source];
      const validated = await schema.parseAsync(data);
      
      // Для body можно напрямую присваивать
      if (source === 'body') {
        req.body = validated;
      } else {
        // Для query и params используем Object.assign для обхода readonly
        Object.assign(req[source], validated);
      }
      
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.issues.map((err: any) => ({
          field: err.path.join('.'),
          message: err.message,
        }));

        return res.status(400).json({
          success: false,
          message: 'Ошибка валидации данных',
          errors,
        });
      }

      // Непредвиденная ошибка
      console.error('Validation middleware error:', error);
      return res.status(500).json({
        success: false,
        message: 'Внутренняя ошибка сервера',
      });
    }
  };
};

/**
 * Middleware для валидации нескольких источников одновременно
 * 
 * @param schemas - объект с Zod схемами для разных источников
 * @returns Express middleware функция
 * 
 * Использование:
 * router.get('/releases', 
 *   validateMultiple({ 
 *     query: getReleaseQuerySchema,
 *     params: idParamSchema 
 *   }), 
 *   releaseController.getAll
 * );
 */
export const validateMultiple = (schemas: {
  body?: ZodSchema;
  query?: ZodSchema;
  params?: ZodSchema;
}) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors: Array<{ field: string; message: string }> = [];

      // Валидация body
      if (schemas.body) {
        try {
          req.body = await schemas.body.parseAsync(req.body);
        } catch (error) {
          if (error instanceof ZodError) {
            errors.push(
              ...error.issues.map((err: any) => ({
                field: `body.${err.path.join('.')}`,
                message: err.message,
              }))
            );
          }
        }
      }

      // Валидация query
      if (schemas.query) {
        try {
          const validated = await schemas.query.parseAsync(req.query);
          Object.assign(req.query, validated);
        } catch (error) {
          if (error instanceof ZodError) {
            errors.push(
              ...error.issues.map((err: any) => ({
                field: `query.${err.path.join('.')}`,
                message: err.message,
              }))
            );
          }
        }
      }

      // Валидация params
      if (schemas.params) {
        try {
          const validated = await schemas.params.parseAsync(req.params);
          Object.assign(req.params, validated);
        } catch (error) {
          if (error instanceof ZodError) {
            errors.push(
              ...error.issues.map((err: any) => ({
                field: `params.${err.path.join('.')}`,
                message: err.message,
              }))
            );
          }
        }
      }

      if (errors.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Ошибка валидации данных',
          errors,
        });
      }

      next();
    } catch (error) {
      console.error('Validation middleware error:', error);
      return res.status(500).json({
        success: false,
        message: 'Внутренняя ошибка сервера',
      });
    }
  };
};
