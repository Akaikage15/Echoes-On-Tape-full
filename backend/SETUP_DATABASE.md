# 🗄️ Настройка PostgreSQL

## ⚠️ Важно!

Новая архитектура требует PostgreSQL. Без БД сервер не запустится.

## 🚀 Быстрая установка

### Ubuntu/Debian:
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### Проверка установки:
```bash
psql --version
# Должно показать: psql (PostgreSQL) 14.x или выше
```

## 📝 Создание базы данных

### 1. Войти в PostgreSQL:
```bash
sudo -u postgres psql
```

### 2. Создать БД и пользователя:
```sql
CREATE DATABASE echoes_on_tape;
CREATE USER postgres WITH ENCRYPTED PASSWORD 'password';
GRANT ALL PRIVILEGES ON DATABASE echoes_on_tape TO postgres;
\q
```

### 3. Проверить подключение:
```bash
psql -U postgres -d echoes_on_tape -h localhost
# Введите пароль: password
```

## ⚙️ Настройка .env

Файл `backend/.env` уже создан с настройками по умолчанию:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/echoes_on_tape?schema=public"
```

Если вы использовали другие credentials, обновите DATABASE_URL.

## 🔄 Запуск миграций

После создания БД:

```bash
cd backend

# Сгенерировать Prisma Client
npx prisma generate

# Запустить миграции
npx prisma migrate dev --name init

# Заполнить БД тестовыми данными
npx prisma db seed
```

## ✅ Проверка

Запустите сервер:
```bash
npm start
```

Должно показать:
```
🚀 Server is running on http://localhost:3001
📊 Database: PostgreSQL + Prisma
🏗️  Architecture: Layered (MVC)
```

Откройте http://localhost:3001 - должен вернуть JSON с информацией о сервере.

## 🔧 Альтернатива: Использовать старую версию без БД

Если не хотите устанавливать PostgreSQL прямо сейчас:

```bash
# Запустить старую версию с in-memory данными
npm run start:old
```

Но помните: данные будут теряться при перезапуске!

## ❓ Проблемы?

См. [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) раздел Troubleshooting
