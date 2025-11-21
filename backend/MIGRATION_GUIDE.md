# 🔄 Руководство по миграции на PostgreSQL + Prisma

## 📋 Что изменилось

### До (in-memory)
- Данные хранились в массивах в файлах `src/utils/*-db.ts`
- Данные терялись при перезапуске сервера
- Нет персистентности

### После (PostgreSQL + Prisma)
- Данные хранятся в реальной БД PostgreSQL
- Полная персистентность данных
- Миграции для версионирования схемы
- Type-safe доступ к данным через Prisma Client

---

## 🚀 Установка и настройка

### 1. Установка PostgreSQL

#### Linux (Ubuntu/Debian):
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

#### macOS (Homebrew):
```bash
brew install postgresql@16
brew services start postgresql@16
```

#### Windows:
Скачайте установщик с https://www.postgresql.org/download/windows/

### 2. Создание базы данных

```bash
# Войти в PostgreSQL
sudo -u postgres psql

# Создать БД и пользователя
CREATE DATABASE echoes_on_tape;
CREATE USER echoes_user WITH ENCRYPTED PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE echoes_on_tape TO echoes_user;
\q
```

### 3. Настройка .env файла

Создайте файл `backend/.env`:

```env
PORT=3001
JWT_SECRET=your_very_secret_jwt_key_here_change_in_production

# PostgreSQL Connection
DATABASE_URL="postgresql://echoes_user:your_password@localhost:5432/echoes_on_tape?schema=public"
```

### 4. Установка зависимостей

```bash
cd backend
npm install
```

### 5. Запуск миграций

```bash
# Создать и применить миграции
npm run prisma:migrate

# Или вручную:
npx prisma migrate dev --name init
```

### 6. Заполнение БД тестовыми данными

```bash
# Запустить seed скрипт
npx prisma db seed
```

### 7. Генерация Prisma Client

```bash
npm run prisma:generate
```

---

## 📝 Изменения в коде

### Старый подход (in-memory):

```typescript
// backend/src/utils/db.ts
const users: User[] = [];

export const findUserByEmail = async (email: string) => {
  return users.find(u => u.email === email);
};
```

### Новый подход (Prisma):

```typescript
// backend/src/repositories/user.repository.ts
import prisma from '../lib/prisma';

export class UserRepository {
  async findByEmail(email: string) {
    return await prisma.user.findUnique({
      where: { email },
    });
  }
}
```

---

## 🗂️ Новая структура файлов

```
backend/
├── prisma/
│   ├── schema.prisma          # Схема БД
│   ├── seed.ts                # Seed данные
│   └── migrations/            # История миграций
├── src/
│   ├── lib/
│   │   └── prisma.ts          # Prisma Client singleton
│   ├── repositories/          # Слой доступа к данным
│   │   ├── user.repository.ts
│   │   ├── artist.repository.ts
│   │   ├── release.repository.ts
│   │   └── ...
│   ├── utils/
│   │   └── config.ts          # Конфигурация (без *-db.ts)
│   └── index.ts               # Обновленный с репозиториями
└── .env                       # Переменные окружения
```

---

## 🔧 Полезные команды Prisma

```bash
# Открыть Prisma Studio (GUI для БД)
npm run prisma:studio

# Создать новую миграцию
npx prisma migrate dev --name migration_name

# Применить миграции в production
npx prisma migrate deploy

# Сбросить БД (ОСТОРОЖНО!)
npx prisma migrate reset

# Обновить Prisma Client после изменения схемы
npm run prisma:generate

# Форматировать schema.prisma
npx prisma format
```

---

## 🧪 Тестирование

После миграции проверьте:

1. ✅ Регистрация нового пользователя
2. ✅ Вход существующего пользователя
3. ✅ Получение списка релизов
4. ✅ Получение списка артистов
5. ✅ Создание поста
6. ✅ Голосование в опросе
7. ✅ Отправка демо

---

## 🐛 Troubleshooting

### Ошибка: "Can't reach database server"
- Проверьте, запущен ли PostgreSQL: `sudo systemctl status postgresql`
- Проверьте DATABASE_URL в .env файле
- Проверьте firewall и доступность порта 5432

### Ошибка: "Authentication failed"
- Проверьте username и password в DATABASE_URL
- Убедитесь, что пользователь имеет права на БД

### Ошибка: "Prisma Client not generated"
```bash
npm run prisma:generate
```

### Ошибка при seed: "Foreign key constraint"
```bash
# Сбросить БД и запустить заново
npx prisma migrate reset
```

---

## 📚 Дополнительные ресурсы

- [Prisma Documentation](https://www.prisma.io/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Prisma Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)

---

## ✅ Чеклист миграции

- [ ] PostgreSQL установлен и запущен
- [ ] БД создана
- [ ] .env файл настроен
- [ ] Зависимости установлены (`npm install`)
- [ ] Миграции применены (`npm run prisma:migrate`)
- [ ] Seed данные загружены (`npx prisma db seed`)
- [ ] Prisma Client сгенерирован (`npm run prisma:generate`)
- [ ] Старые `*-db.ts` файлы удалены или помечены как deprecated
- [ ] `index.ts` обновлен для использования репозиториев
- [ ] Тестирование всех эндпоинтов пройдено
- [ ] Документация обновлена
