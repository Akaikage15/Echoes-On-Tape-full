# 🚨 Руководство по обработке ошибок

## Обзор

Реализована централизованная система обработки ошибок с кастомными классами, единообразным форматом ответов и автоматическим логированием.

---

## 📚 Кастомные классы ошибок

### Базовый класс `AppError`

```typescript
import { AppError } from '../utils/errors';

throw new AppError('Сообщение об ошибке', 400, true, { userId: 123 });
```

**Параметры:**
- `message` - текст ошибки
- `statusCode` - HTTP статус-код (по умолчанию 500)
- `isOperational` - операционная ли ошибка (по умолчанию true)
- `context` - дополнительный контекст (опционально)

### Готовые классы ошибок

#### `BadRequestError` (400)
Некорректный запрос от клиента.

```typescript
import { BadRequestError } from '../utils/errors';

throw new BadRequestError('Неверный формат данных');
```

#### `UnauthorizedError` (401)
Требуется авторизация.

```typescript
import { UnauthorizedError } from '../utils/errors';

throw new UnauthorizedError('Токен не предоставлен');
```

#### `ForbiddenError` (403)
Доступ запрещён (недостаточно прав).

```typescript
import { ForbiddenError } from '../utils/errors';

throw new ForbiddenError('Недостаточно прав для выполнения действия');
```

#### `NotFoundError` (404)
Ресурс не найден.

```typescript
import { NotFoundError } from '../utils/errors';

throw new NotFoundError('Пользователь не найден', { userId: req.params.id });
```

#### `ConflictError` (409)
Конфликт данных (например, дубликат email).

```typescript
import { ConflictError } from '../utils/errors';

throw new ConflictError('Email уже зарегистрирован', { email: req.body.email });
```

#### `ValidationError` (422)
Ошибка валидации данных.

```typescript
import { ValidationError } from '../utils/errors';

throw new ValidationError('Некорректные данные профиля');
```

#### `TooManyRequestsError` (429)
Превышен лимит запросов.

```typescript
import { TooManyRequestsError } from '../utils/errors';

throw new TooManyRequestsError('Слишком много попыток входа');
```

#### `InternalServerError` (500)
Внутренняя ошибка сервера.

```typescript
import { InternalServerError } from '../utils/errors';

throw new InternalServerError('Не удалось обработать запрос');
```

#### `ServiceUnavailableError` (503)
Сервис временно недоступен.

```typescript
import { ServiceUnavailableError } from '../utils/errors';

throw new ServiceUnavailableError('База данных недоступна');
```

---

## 🎯 Использование в контроллерах

### Пример 1: Простая ошибка

```typescript
import { NotFoundError } from '../utils/errors';

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await userRepository.findById(req.params.id);
    
    if (!user) {
      throw new NotFoundError('Пользователь не найден', { userId: req.params.id });
    }
    
    res.json({ user });
  } catch (error) {
    next(error); // Передаём в error handler
  }
};
```

### Пример 2: Ошибка с контекстом

```typescript
import { ForbiddenError } from '../utils/errors';

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await userRepository.findById(req.params.id);
    
    if (user.role === 'ADMIN' && req.user.role !== 'ADMIN') {
      throw new ForbiddenError('Нельзя удалить администратора', {
        targetUserId: user.id,
        currentUserRole: req.user.role,
      });
    }
    
    await userRepository.delete(user.id);
    res.json({ message: 'Пользователь удалён' });
  } catch (error) {
    next(error);
  }
};
```

### Пример 3: Обработка Prisma ошибок

```typescript
import { ConflictError, InternalServerError } from '../utils/errors';
import { Prisma } from '@prisma/client';

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await prisma.user.create({
      data: req.body,
    });
    
    res.status(201).json({ user });
  } catch (error) {
    // Prisma автоматически обработается в error middleware
    // Но можно обработать вручную:
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return next(new ConflictError('Email уже зарегистрирован'));
      }
    }
    
    next(error);
  }
};
```

---

## 🔄 Автоматическая обработка

### 1. Zod валидация

Ошибки валидации автоматически обрабатываются:

```typescript
// Клиент получит:
{
  "success": false,
  "message": "Ошибка валидации данных",
  "errors": [
    {
      "field": "email",
      "message": "Некорректный email"
    },
    {
      "field": "password",
      "message": "Пароль должен содержать минимум 8 символов"
    }
  ]
}
```

### 2. Prisma ошибки

Автоматически обрабатываются коды:
- **P2002** (Unique constraint) → 409 Conflict
- **P2025** (Record not found) → 404 Not Found
- Другие → 400 Bad Request

```typescript
// Клиент получит:
{
  "success": false,
  "message": "Запись с такими данными уже существует",
  "field": "email"
}
```

### 3. Неизвестные ошибки

Все необработанные ошибки логируются и возвращают:

```typescript
// Production:
{
  "success": false,
  "message": "Внутренняя ошибка сервера"
}

// Development:
{
  "success": false,
  "message": "Original error message",
  "stack": "Error stack trace..."
}
```

---

## 📝 Формат ответов

### Успешный ответ

```json
{
  "success": true,
  "data": { ... },
  "message": "Операция выполнена успешно"
}
```

### Ошибка (AppError)

```json
{
  "success": false,
  "message": "Пользователь не найден",
  "statusCode": 404,
  "context": {
    "userId": "123"
  }
}
```

### Ошибка валидации

```json
{
  "success": false,
  "message": "Ошибка валидации данных",
  "errors": [
    {
      "field": "email",
      "message": "Некорректный email"
    }
  ]
}
```

---

## 🔍 Логирование

### Операционные ошибки (ожидаемые)

Логируются как **WARN**:
- 400 Bad Request
- 401 Unauthorized
- 403 Forbidden
- 404 Not Found
- 409 Conflict
- 422 Validation Error

### Неоперационные ошибки (неожиданные)

Логируются как **ERROR**:
- 500 Internal Server Error
- Необработанные исключения
- Prisma ошибки

### Пример лога

```
2024-11-25 15:30:45 [WARN] Operational error {
  "path": "/api/users/123",
  "method": "GET",
  "statusCode": 404,
  "message": "Пользователь не найден",
  "context": { "userId": "123" }
}
```

---

## 🛡️ Глобальные обработчики

### Unhandled Promise Rejection

```typescript
process.on('unhandledRejection', (reason, promise) => {
  // Автоматически логируется
  // В production завершает процесс при критических ошибках
});
```

### Uncaught Exception

```typescript
process.on('uncaughtException', (error) => {
  // Автоматически логируется
  // Всегда завершает процесс
});
```

---

## ✅ Best Practices

### 1. Всегда используй кастомные классы

❌ **Плохо:**
```typescript
throw new Error('User not found');
```

✅ **Хорошо:**
```typescript
throw new NotFoundError('Пользователь не найден', { userId });
```

### 2. Передавай контекст

❌ **Плохо:**
```typescript
throw new ForbiddenError('Access denied');
```

✅ **Хорошо:**
```typescript
throw new ForbiddenError('Доступ запрещён', {
  userId: req.user.id,
  requiredRole: 'ADMIN',
  currentRole: req.user.role,
});
```

### 3. Используй try-catch в async функциях

❌ **Плохо:**
```typescript
export const getUser = async (req, res) => {
  const user = await userRepository.findById(req.params.id);
  res.json({ user });
};
```

✅ **Хорошо:**
```typescript
export const getUser = async (req, res, next) => {
  try {
    const user = await userRepository.findById(req.params.id);
    if (!user) {
      throw new NotFoundError('Пользователь не найден');
    }
    res.json({ user });
  } catch (error) {
    next(error);
  }
};
```

### 4. Не показывай чувствительные данные

❌ **Плохо:**
```typescript
throw new UnauthorizedError('Invalid password for user@example.com');
```

✅ **Хорошо:**
```typescript
throw new UnauthorizedError('Неверный email или пароль');
```

### 5. Используй правильные статус-коды

- **400** - некорректный запрос (синтаксис)
- **401** - не авторизован
- **403** - недостаточно прав
- **404** - не найдено
- **409** - конфликт (дубликат)
- **422** - ошибка валидации (семантика)
- **500** - внутренняя ошибка

---

## 🧪 Тестирование ошибок

```typescript
describe('Error Handling', () => {
  it('should return 404 for non-existent user', async () => {
    const response = await request(app)
      .get('/api/users/non-existent-id')
      .set('Authorization', `Bearer ${token}`);
    
    expect(response.status).toBe(404);
    expect(response.body).toMatchObject({
      success: false,
      message: expect.stringContaining('не найден'),
    });
  });

  it('should return 403 for insufficient permissions', async () => {
    const response = await request(app)
      .delete('/api/users/admin-id')
      .set('Authorization', `Bearer ${userToken}`);
    
    expect(response.status).toBe(403);
    expect(response.body.success).toBe(false);
  });
});
```

---

## 📊 Мониторинг ошибок

### Интеграция с Sentry (опционально)

```typescript
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});

// В error middleware:
if (!err.isOperational) {
  Sentry.captureException(err);
}
```

---

**Готово! Система обработки ошибок настроена.** 🎉
