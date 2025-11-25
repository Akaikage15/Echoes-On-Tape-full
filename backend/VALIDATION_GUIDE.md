# 📋 Руководство по валидации данных

## Обзор

В проекте используется библиотека **Zod** для валидации входящих данных на всех API эндпоинтах.

## Структура

```
backend/src/
├── validators/              # Схемы валидации
│   ├── auth.validator.ts    # Валидация аутентификации
│   ├── account.validator.ts # Валидация профиля
│   ├── release.validator.ts # Валидация релизов
│   ├── post.validator.ts    # Валидация постов
│   ├── artist.validator.ts  # Валидация артистов
│   ├── subscription.validator.ts # Валидация подписок
│   ├── common.validator.ts  # Общие схемы
│   └── index.ts            # Экспорт всех валидаторов
└── middleware/
    └── validate.middleware.ts # Middleware для валидации
```

## Использование

### Базовая валидация

```typescript
import { validate } from '../middleware/validate.middleware';
import { registerSchema } from '../validators';

// Валидация body
router.post('/register', validate(registerSchema, 'body'), controller.register);

// Валидация query параметров
router.get('/releases', validate(getReleaseQuerySchema, 'query'), controller.getAll);

// Валидация params (например, :id)
router.get('/releases/:id', validate(uuidParamSchema, 'params'), controller.getById);
```

### Валидация нескольких источников

```typescript
import { validateMultiple } from '../middleware/validate.middleware';

router.put(
  '/releases/:id',
  validateMultiple({
    params: uuidParamSchema,
    body: updateReleaseSchema,
  }),
  controller.update
);
```

## Создание новых схем

### Простая схема

```typescript
import { z } from 'zod';

export const mySchema = z.object({
  name: z.string().min(1, 'Имя обязательно'),
  age: z.number().int().positive(),
  email: z.string().email('Некорректный email'),
});

export type MyDto = z.infer<typeof mySchema>;
```

### Схема с опциональными полями

```typescript
export const updateSchema = z.object({
  name: z.string().min(1).optional(),
  age: z.number().int().positive().optional(),
});
```

### Схема с вложенными объектами

```typescript
export const profileSchema = z.object({
  name: z.string(),
  socialLinks: z.object({
    twitter: z.string().url().optional(),
    instagram: z.string().url().optional(),
  }).optional(),
});
```

### Схема с кастомной валидацией

```typescript
export const passwordSchema = z
  .object({
    password: z.string().min(8),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Пароли не совпадают',
    path: ['confirmPassword'],
  });
```

## Доступные валидаторы

### Auth
- `registerSchema` - регистрация (email, password, name)
- `loginSchema` - вход (email, password)

### Account
- `updateProfileSchema` - обновление профиля
- `changePasswordSchema` - смена пароля

### Release
- `createReleaseSchema` - создание релиза
- `updateReleaseSchema` - обновление релиза
- `getReleaseQuerySchema` - параметры запроса релизов

### Post
- `createPostSchema` - создание поста
- `updatePostSchema` - обновление поста
- `getPostQuerySchema` - параметры запроса постов

### Artist
- `createArtistSchema` - создание артиста
- `updateArtistSchema` - обновление артиста
- `getArtistQuerySchema` - параметры запроса артистов

### Subscription
- `purchaseSubscriptionSchema` - покупка подписки
- `cancelSubscriptionSchema` - отмена подписки

### Common
- `uuidParamSchema` - валидация UUID в params
- `paginationSchema` - пагинация (page, limit)
- `sortSchema` - сортировка (sortBy, order)
- `searchSchema` - поиск (search)
- `listQuerySchema` - комбинация пагинации, сортировки и поиска

## Формат ответа при ошибке валидации

```json
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

## Примеры типичных валидаций

### Email
```typescript
z.string().email('Некорректный email')
```

### URL
```typescript
z.string().url('Некорректный URL')
```

### UUID
```typescript
z.string().uuid('Некорректный ID')
```

### Enum
```typescript
z.enum(['ALBUM', 'EP', 'SINGLE'], {
  errorMap: () => ({ message: 'Некорректный тип' }),
})
```

### Число в диапазоне
```typescript
z.number().int().min(1).max(100)
```

### Массив с ограничением
```typescript
z.array(z.string()).max(10, 'Максимум 10 элементов')
```

### Дата
```typescript
z.string().datetime('Некорректная дата')
```

### Regex
```typescript
z.string().regex(/^[A-Z]/, 'Должно начинаться с заглавной буквы')
```

## Best Practices

1. **Всегда валидируйте входящие данные** - это первая линия защиты
2. **Используйте понятные сообщения об ошибках** на русском языке
3. **Переиспользуйте схемы** - используйте `common.validator.ts` для общих паттернов
4. **Типизируйте DTO** - используйте `z.infer<typeof schema>` для автоматической генерации типов
5. **Валидируйте все источники** - body, query, params
6. **Документируйте схемы** - добавляйте комментарии к сложным валидациям

## Тестирование валидации

```typescript
import { registerSchema } from '../validators';

describe('Register Schema', () => {
  it('should validate correct data', () => {
    const data = {
      email: 'test@example.com',
      password: 'Password123',
      name: 'Test User',
    };
    
    expect(() => registerSchema.parse(data)).not.toThrow();
  });

  it('should reject invalid email', () => {
    const data = {
      email: 'invalid-email',
      password: 'Password123',
      name: 'Test User',
    };
    
    expect(() => registerSchema.parse(data)).toThrow();
  });
});
```

## Troubleshooting

### Ошибка: "Expected string, received number"
Используйте `z.coerce.number()` для автоматического преобразования query параметров:
```typescript
z.object({
  page: z.coerce.number().int().positive(),
})
```

### Ошибка: "Required" для опциональных полей
Добавьте `.optional()` или используйте `.partial()` для всей схемы:
```typescript
const updateSchema = createSchema.partial();
```

### Кастомные сообщения об ошибках
```typescript
z.string().min(8, { message: 'Минимум 8 символов' })
// или
z.string().min(8, 'Минимум 8 символов')
```
