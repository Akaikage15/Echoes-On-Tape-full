# Руководство по RBAC (Role-Based Access Control)

## Обзор

Система ролевого доступа позволяет гибко управлять правами пользователей в приложении.

## Роли пользователей

### ADMIN
- Полный доступ ко всем функциям
- Управление пользователями
- Модерация контента
- Загрузка любых файлов

### ARTIST
- Управление своим контентом
- Загрузка обложек и аудио
- Создание релизов
- Доступ к аналитике

### PREMIUM_USER
- Доступ к PRO контенту
- Загрузка аватара
- Участие в голосованиях
- Доступ к эксклюзивам

### FREE_USER
- Базовый доступ
- Просмотр публичного контента
- Загрузка аватара
- Регистрация демо

## Использование middleware

### requireRole

Проверяет, что у пользователя есть одна из требуемых ролей:

```typescript
import { requireRole, requireAdmin, requireArtist } from '../middleware/rbac.middleware';
import { UserRole } from '@prisma/client';

// Только админы
router.delete('/users/:id', requireAdmin, deleteUser);

// Админы и артисты
router.post('/releases', requireArtist, createRelease);

// Кастомная комбинация ролей
router.get('/analytics', requireRole([UserRole.ADMIN, UserRole.ARTIST]), getAnalytics);
```

### requireSubscription

Проверяет уровень подписки пользователя:

```typescript
import { requireSubscription } from '../middleware/rbac.middleware';

// Требуется минимум lite подписка
router.get('/exclusives', requireSubscription('lite'), getExclusives);

// Требуется pro подписка
router.get('/pro-library', requireSubscription('pro'), getProLibrary);
```

**Уровни подписок:**
- `none` (0) - бесплатный доступ
- `lite` (1) - базовая подписка
- `fan` (2) - расширенная подписка
- `pro` (3) - полный доступ

### requireOwnership

Проверяет, что пользователь владеет ресурсом:

```typescript
import { requireOwnership } from '../middleware/rbac.middleware';

// Проверка владения постом
router.put('/posts/:id', 
  requireOwnership('id', async (postId) => {
    const post = await prisma.post.findUnique({ where: { id: postId } });
    return post?.author_id || null;
  }),
  updatePost
);
```

## Примеры использования

### Защита эндпоинта загрузки

```typescript
// routes/upload.routes.ts
import { requireArtist } from '../middleware/rbac.middleware';

// Только артисты и админы могут загружать обложки
router.post('/cover', 
  authenticateToken, 
  requireArtist,
  uploadCoverMiddleware.single('cover'), 
  uploadCover
);
```

### Комбинирование проверок

```typescript
// Требуется роль артиста И активная подписка
router.post('/premium-release',
  authenticateToken,
  requireArtist,
  requireSubscription('pro'),
  createPremiumRelease
);
```

### Проверка в контроллере

```typescript
// controllers/content.controller.ts
export const getContent = async (req: Request, res: Response) => {
  const user = req.user!;

  // Админы видят всё
  if (user.role === UserRole.ADMIN) {
    const allContent = await prisma.content.findMany();
    return res.json(allContent);
  }

  // Остальные видят только публичный контент
  const publicContent = await prisma.content.findMany({
    where: { is_public: true }
  });
  
  res.json(publicContent);
};
```

## Обработка ошибок

### 401 Unauthorized
Пользователь не авторизован (нет токена или токен невалиден)

### 403 Forbidden
Пользователь авторизован, но не имеет прав доступа:

```json
{
  "error": "Недостаточно прав доступа",
  "required": ["ADMIN", "ARTIST"],
  "current": "FREE_USER"
}
```

### 403 Subscription Required
Требуется более высокий уровень подписки:

```json
{
  "error": "Требуется более высокий уровень подписки",
  "required": "pro",
  "current": "lite"
}
```

## Миграция существующих эндпоинтов

### До:
```typescript
router.post('/content', authenticateToken, createContent);
```

### После:
```typescript
router.post('/content', 
  authenticateToken, 
  requireArtist, 
  createContent
);
```

## Best Practices

1. **Всегда используйте authenticateToken перед RBAC middleware**
   ```typescript
   router.post('/endpoint', authenticateToken, requireRole([...]), handler);
   ```

2. **Админы имеют полный доступ**
   - Не нужно явно проверять админа в каждом middleware
   - `requireRole` и `requireOwnership` автоматически пропускают админов

3. **Используйте готовые хелперы**
   ```typescript
   requireAdmin  // вместо requireRole([UserRole.ADMIN])
   requireArtist // вместо requireRole([UserRole.ADMIN, UserRole.ARTIST])
   ```

4. **Комбинируйте проверки логично**
   ```typescript
   // ✅ Правильно
   router.post('/upload', authenticateToken, requireArtist, upload);
   
   // ❌ Неправильно (избыточно)
   router.post('/upload', authenticateToken, requireAdmin, requireArtist, upload);
   ```

5. **Проверяйте подписку для платного контента**
   ```typescript
   router.get('/premium-content', 
     authenticateToken, 
     requireSubscription('pro'), 
     getContent
   );
   ```

## Тестирование

Пример теста для RBAC:

```typescript
describe('RBAC', () => {
  it('должен запретить доступ обычному пользователю', async () => {
    const response = await request(app)
      .post('/api/upload/cover')
      .set('Authorization', `Bearer ${userToken}`)
      .attach('cover', buffer, 'test.jpg');

    expect(response.status).toBe(403);
  });

  it('должен разрешить доступ артисту', async () => {
    const response = await request(app)
      .post('/api/upload/cover')
      .set('Authorization', `Bearer ${artistToken}`)
      .attach('cover', buffer, 'test.jpg');

    expect(response.status).not.toBe(403);
  });
});
```

## Расширение системы

### Добавление новой роли

1. Обновите enum в `schema.prisma`:
```prisma
enum UserRole {
  ADMIN
  ARTIST
  PREMIUM_USER
  FREE_USER
  MODERATOR  // новая роль
}
```

2. Создайте миграцию:
```bash
npx prisma migrate dev --name add_moderator_role
```

3. Используйте в middleware:
```typescript
export const requireModerator = requireRole([
  UserRole.ADMIN, 
  UserRole.MODERATOR
]);
```

### Добавление нового уровня подписки

1. Обновите `tierLevels` в `rbac.middleware.ts`:
```typescript
const tierLevels: Record<string, number> = {
  none: 0,
  lite: 1,
  fan: 2,
  pro: 3,
  ultimate: 4  // новый уровень
};
```

2. Обновите схему БД и типы фронтенда.
