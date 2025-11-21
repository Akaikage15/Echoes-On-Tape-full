# 📝 Руководство по логированию

## Система логирования

Используется **Winston** для структурированного логирования.

## Уровни логирования

- **error**: Критические ошибки, требующие внимания
- **warn**: Предупреждения о потенциальных проблемах
- **info**: Информационные сообщения (запросы, действия)
- **debug**: Детальная информация для отладки

## Использование

### Импорт
```typescript
import { logInfo, logError, logWarn, logDebug } from '../utils/logger';
```

### Примеры

#### Информационное сообщение
```typescript
logInfo('User registered successfully', { userId: user.id, email: user.email });
```

#### Ошибка
```typescript
try {
  // код
} catch (error) {
  logError('Failed to create user', error);
  throw error;
}
```

#### Предупреждение
```typescript
logWarn('Rate limit approaching', { ip: req.ip, requests: count });
```

#### Отладка
```typescript
logDebug('Processing payment', { amount, currency, userId });
```

## Автоматическое логирование

### HTTP-запросы
Все запросы автоматически логируются через `requestLogger` middleware:
```
→ POST /api/auth/login
← POST /api/auth/login 200 45ms
```

### Действия в личном кабинете
```typescript
import { accountActionLogger } from '../middleware/logger.middleware';

router.get('/profile', 
  authenticateToken, 
  accountActionLogger('view_profile'),
  getProfile
);
```

### Аудит изменений профиля
```typescript
import { profileAuditLogger } from '../middleware/logger.middleware';

router.put('/profile',
  authenticateToken,
  profileAuditLogger,
  updateProfile
);
```

## Файлы логов

Логи сохраняются в `backend/logs/`:
- `error.log` — только ошибки
- `combined.log` — все логи

### Ротация логов
- Максимальный размер файла: 5MB
- Количество файлов: 5
- Старые логи автоматически архивируются

## Конфигурация

### Development
- Логи выводятся в консоль с цветами
- Уровень: `debug`

### Production
- Логи только в файлы
- Уровень: `info`

## Мониторинг логов

### Просмотр в реальном времени
```bash
tail -f backend/logs/combined.log
```

### Поиск ошибок
```bash
grep "error" backend/logs/error.log
```

### Фильтрация по пользователю
```bash
grep "userId: abc123" backend/logs/combined.log
```

## Лучшие практики

1. **Не логируйте чувствительные данные**: пароли, токены, номера карт
2. **Используйте структурированные логи**: передавайте объекты с метаданными
3. **Логируйте контекст**: userId, ip, timestamp
4. **Не переусердствуйте**: избегайте логирования в циклах
5. **Используйте правильный уровень**: error для ошибок, info для событий

## Примеры использования

### Контроллер
```typescript
export const createRelease = async (req: Request, res: Response) => {
  try {
    logInfo('Creating new release', { userId: req.user.id, title: req.body.title });
    
    const release = await releaseService.create(req.body);
    
    logInfo('Release created successfully', { releaseId: release.id });
    res.status(201).json(release);
  } catch (error) {
    logError('Failed to create release', error);
    throw error;
  }
};
```

### Сервис
```typescript
export const processPayment = async (userId: string, amount: number) => {
  logDebug('Processing payment', { userId, amount });
  
  try {
    const result = await paymentGateway.charge(amount);
    logInfo('Payment processed', { userId, transactionId: result.id });
    return result;
  } catch (error) {
    logError('Payment failed', { userId, amount, error });
    throw error;
  }
};
```

## Интеграция с мониторингом

В будущем логи можно интегрировать с:
- **Sentry** — для отслеживания ошибок
- **Datadog** — для мониторинга и аналитики
- **ELK Stack** — для централизованного хранения логов
