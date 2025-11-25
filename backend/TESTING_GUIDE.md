# 🧪 Руководство по тестированию

## Запуск тестов

### Все тесты
```bash
npm test
```

### Тесты с покрытием
```bash
npm run test:coverage
```

### Тесты в watch-режиме (для разработки)
```bash
npm run test:watch
```

## Структура тестов

```
backend/src/__tests__/
├── setup.ts              # Настройка тестового окружения
├── auth.test.ts          # Тесты аутентификации
├── account.test.ts       # Тесты личного кабинета
└── releases.test.ts      # Тесты релизов
```

## Покрытие кода

Минимальное требование: **70%** покрытия для:
- Branches (ветвления)
- Functions (функции)
- Lines (строки)
- Statements (выражения)

## Тестовая база данных

Используется отдельная БД для тестов: `echoes_test`

Настройка в `.env.test`:
```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/echoes_test?schema=public"
```

## Написание новых тестов

### Структура теста
```typescript
import request from 'supertest';
import app from '../app';
import { prisma } from './setup';

describe('Feature Name', () => {
  let token: string;

  beforeEach(async () => {
    // Подготовка данных
    const response = await request(app)
      .post('/api/auth/register')
      .send({ email: 'test@example.com', password: 'Test123!', name: 'Test' });
    token = response.body.token;
  });

  describe('GET /api/endpoint', () => {
    it('должен вернуть данные', async () => {
      const response = await request(app)
        .get('/api/endpoint')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
    });
  });
});
```

## Лучшие практики

1. **Изоляция тестов**: каждый тест должен быть независимым
2. **Очистка данных**: используйте `beforeEach` для очистки БД
3. **Осмысленные названия**: описывайте, что тест проверяет
4. **Проверка граничных случаев**: тестируйте не только happy path
5. **Тестирование ошибок**: проверяйте обработку ошибок

## CI/CD

Тесты автоматически запускаются при:
- Push в любую ветку
- Создании Pull Request
- Перед мержем в `dev`

## Отладка тестов

### Запуск одного теста
```bash
npm test -- auth.test.ts
```

### Запуск с подробным выводом
```bash
npm test -- --verbose
```

### Отладка в VS Code
Добавьте конфигурацию в `.vscode/launch.json`:
```json
{
  "type": "node",
  "request": "launch",
  "name": "Jest Debug",
  "program": "${workspaceFolder}/backend/node_modules/.bin/jest",
  "args": ["--runInBand"],
  "console": "integratedTerminal",
  "internalConsoleOptions": "neverOpen"
}
```
