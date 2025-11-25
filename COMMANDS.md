# 🎯 Быстрые команды для деплоя

## Первый деплой (выполните по порядку)

```bash
# 1. Установка Vercel CLI
npm i -g vercel

# 2. Вход в аккаунт
vercel login

# 3. Деплой
./deploy.sh
# или
vercel --prod

# 4. Скачать production env
vercel env pull .env.production.local

# 5. Применить миграции БД
cd backend
npx prisma migrate deploy
npx prisma db seed
cd ..
```

## Генерация JWT_SECRET

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Скопируйте результат и добавьте в Vercel Dashboard:
Settings → Environment Variables → Add → JWT_SECRET

## Локальное тестирование

```bash
# Создать билд
npm run build

# Запустить локально
vercel dev

# Проверить билд
ls -la dist/
ls -la backend/api/
```

## Обновление проекта

```bash
# После изменений в коде
git add .
git commit -m "Update features"
git push

# Vercel автоматически задеплоит
# Или вручную:
vercel --prod
```

## Проверка деплоя

```bash
# Посмотреть список деплоев
vercel ls

# Посмотреть логи
vercel logs

# Посмотреть последние логи
vercel logs --follow

# Информация о проекте
vercel inspect
```

## Работа с БД

```bash
# Скачать production env
vercel env pull .env.production.local

# Применить миграции
cd backend
npx prisma migrate deploy

# Посмотреть БД в браузере
npx prisma studio

# Создать новую миграцию
npx prisma migrate dev --name migration_name

# Сгенерировать Prisma Client
npx prisma generate

# Seed данные
npx prisma db seed
```

## Переменные окружения

```bash
# Посмотреть все env переменные
vercel env ls

# Добавить новую переменную
vercel env add

# Удалить переменную
vercel env rm VARIABLE_NAME

# Скачать все переменные
vercel env pull
```

## Откат (Rollback)

```bash
# Посмотреть историю деплоев
vercel ls

# В Dashboard:
# Deployments → выбрать нужный → Promote to Production
```

## Удаление

```bash
# Удалить конкретный деплой
vercel rm [deployment-url]

# Удалить весь проект
vercel remove [project-name]
```

## Troubleshooting

```bash
# Проверить статус Vercel
curl https://www.vercel-status.com/api/v2/status.json

# Проверить что файлы на месте
ls -la vercel.json
ls -la backend/api/index.ts
cat vercel.json

# Пересобрать проект
npm run build
vercel --prod --force

# Проверить Prisma
cd backend
npx prisma validate
npx prisma generate

# Проверить подключение к БД
npx prisma db pull
```

## Полезные ссылки

```bash
# Открыть проект в браузере
vercel open

# Открыть Dashboard
open https://vercel.com/dashboard

# Документация Vercel
open https://vercel.com/docs
```

## Мониторинг

```bash
# Логи в реальном времени
vercel logs --follow

# Логи за последний час
vercel logs --since 1h

# Логи конкретного деплоя
vercel logs [deployment-url]
```

## Тестирование

```bash
# Запустить все тесты
npm test
cd backend && npm test

# Запустить тесты с покрытием
npm run test:coverage
cd backend && npm run test:coverage

# Запустить тесты в watch mode
npm run test:watch
```

## Быстрая проверка после деплоя

```bash
# Получить URL проекта
vercel ls | head -n 2

# Проверить API
curl https://your-project.vercel.app/api/
curl https://your-project.vercel.app/api/health

# Проверить frontend
curl https://your-project.vercel.app/
```

---

## 🎯 Самая быстрая последовательность

```bash
npm i -g vercel && \
vercel login && \
./deploy.sh && \
vercel env pull .env.production.local && \
cd backend && \
npx prisma migrate deploy && \
npx prisma db seed
```

После этого только добавьте `JWT_SECRET` в Vercel Dashboard!

---

**Готово!** Все команды под рукой 🚀
