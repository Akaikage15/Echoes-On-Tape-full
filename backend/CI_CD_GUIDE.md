# 🚀 CI/CD Guide для Echoes On Tape Backend

## Обзор

Настроен полный CI/CD pipeline для автоматического тестирования, сборки и деплоя бэкенда.

---

## 📋 Структура Pipeline

### 1. **Test Job** (Тестирование)
- Запускается при каждом push/PR в ветки `dev` и `main`
- Поднимает PostgreSQL в Docker
- Устанавливает зависимости
- Запускает миграции
- Выполняет тесты с coverage
- Загружает отчёт о покрытии в Codecov

### 2. **Lint Job** (Проверка кода)
- TypeScript type checking
- Проверка синтаксиса

### 3. **Build Job** (Сборка)
- Компиляция TypeScript → JavaScript
- Сохранение артефактов сборки

### 4. **Deploy Staging** (Деплой на staging)
- Запускается только при push в `dev`
- Автоматический деплой на staging окружение
- URL: `https://staging-api.echoes-on-tape.com`

### 5. **Deploy Production** (Деплой на production)
- Запускается только при push в `main`
- Требует ручного подтверждения (GitHub Environment)
- Запускает миграции БД
- URL: `https://api.echoes-on-tape.com`

---

## 🔧 Настройка

### 1. GitHub Secrets

Добавь в **Settings → Secrets and variables → Actions**:

```bash
# JWT секреты
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-super-secret-refresh-key

# Database (для production)
DATABASE_URL=postgresql://user:password@host:5432/echoes_on_tape

# Деплой (Railway/Render/DigitalOcean)
RAILWAY_TOKEN=your-railway-token
# или
RENDER_API_KEY=your-render-api-key
```

### 2. GitHub Environments

Создай окружения в **Settings → Environments**:

#### **staging**
- URL: `https://staging-api.echoes-on-tape.com`
- Secrets: staging-специфичные переменные
- Protection rules: нет (автоматический деплой)

#### **production**
- URL: `https://api.echoes-on-tape.com`
- Secrets: production переменные
- Protection rules:
  - ✅ Required reviewers (1-2 человека)
  - ✅ Wait timer: 5 минут

---

## 🐳 Docker

### Локальная сборка

```bash
# Сборка образа
cd backend
docker build -t echoes-backend .

# Запуск контейнера
docker run -p 3001:3001 \
  -e DATABASE_URL="postgresql://..." \
  -e JWT_SECRET="..." \
  echoes-backend
```

### Docker Compose (для локальной разработки)

```bash
# Запуск всего стека (PostgreSQL + Backend)
docker-compose up -d

# Просмотр логов
docker-compose logs -f backend

# Остановка
docker-compose down

# Остановка с удалением данных
docker-compose down -v
```

---

## 🚀 Деплой

### Вариант 1: Railway

1. Установи Railway CLI:
```bash
npm install -g @railway/cli
```

2. Залогинься:
```bash
railway login
```

3. Создай проект:
```bash
railway init
```

4. Добавь PostgreSQL:
```bash
railway add postgresql
```

5. Деплой:
```bash
railway up
```

6. Настрой переменные окружения в Railway Dashboard

### Вариант 2: Render

1. Создай новый Web Service в Render Dashboard
2. Подключи GitHub репозиторий
3. Настрой:
   - **Build Command:** `cd backend && npm install && npm run build`
   - **Start Command:** `cd backend && node dist/server.js`
   - **Environment:** Docker (или Node)
4. Добавь PostgreSQL из Render Dashboard
5. Настрой Environment Variables

### Вариант 3: DigitalOcean App Platform

1. Создай новый App в DigitalOcean
2. Подключи GitHub репозиторий
3. Настрой компонент:
   - **Type:** Web Service
   - **Dockerfile Path:** `backend/Dockerfile`
   - **HTTP Port:** 3001
4. Добавь Managed PostgreSQL Database
5. Настрой Environment Variables

---

## 📊 Мониторинг

### Healthcheck эндпоинт

```typescript
// backend/src/routes/health.routes.ts
import { Router } from 'express';
import { prisma } from '../lib/prisma';

const router = Router();

router.get('/health', async (req, res) => {
  try {
    // Проверка подключения к БД
    await prisma.$queryRaw`SELECT 1`;
    
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: 'connected',
    });
  } catch (error) {
    res.status(503).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      database: 'disconnected',
    });
  }
});

export default router;
```

### Логи

```bash
# Просмотр логов в Docker
docker logs echoes-backend -f

# Просмотр логов в Railway
railway logs

# Просмотр логов в Render
# Через Dashboard → Logs
```

---

## 🔄 Workflow

### Разработка новой фичи

```bash
# 1. Создай ветку от dev
git checkout dev
git pull origin dev
git checkout -b feature/new-feature

# 2. Разработка + коммиты
git add .
git commit -m "feat: добавлена новая фича"

# 3. Push и создание PR
git push origin feature/new-feature
# Создай PR в GitHub: feature/new-feature → dev

# 4. CI автоматически запустит тесты
# Если тесты прошли → мерж в dev

# 5. После мержа в dev → автоматический деплой на staging
```

### Релиз в production

```bash
# 1. Создай PR: dev → main
# 2. Code review
# 3. Мерж в main
# 4. CI запустит деплой на production (с подтверждением)
```

---

## 🛠️ Troubleshooting

### Тесты падают в CI

```bash
# Проверь локально с той же БД
docker-compose up -d postgres
npm test

# Проверь миграции
npx prisma migrate status
```

### Деплой не работает

```bash
# Проверь переменные окружения
railway variables

# Проверь логи
railway logs

# Проверь healthcheck
curl https://your-app.railway.app/health
```

### База данных недоступна

```bash
# Проверь DATABASE_URL
echo $DATABASE_URL

# Проверь подключение
npx prisma db pull
```

---

## 📈 Метрики

### Цели

- ✅ Время сборки: < 5 минут
- ✅ Время деплоя: < 3 минут
- ✅ Покрытие тестами: ≥ 70%
- ✅ Uptime: ≥ 99.5%

### Мониторинг

- **GitHub Actions:** статус билдов
- **Codecov:** покрытие кода
- **Railway/Render:** метрики приложения
- **Sentry (опционально):** отслеживание ошибок

---

## 🔐 Безопасность

### Секреты

- ❌ Никогда не коммить `.env` файлы
- ✅ Использовать GitHub Secrets
- ✅ Разные секреты для staging/production
- ✅ Ротация JWT секретов раз в 3 месяца

### Database

- ✅ Использовать SSL для подключения к БД
- ✅ Регулярные бэкапы (автоматические в Railway/Render)
- ✅ Ограничение доступа по IP (если возможно)

---

## 📚 Дополнительные ресурсы

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Railway Documentation](https://docs.railway.app/)
- [Render Documentation](https://render.com/docs)
- [Docker Documentation](https://docs.docker.com/)
- [Prisma Deployment](https://www.prisma.io/docs/guides/deployment)

---

**Готово! CI/CD настроен и готов к использованию.** 🎉
