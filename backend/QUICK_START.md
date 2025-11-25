# ⚡ Быстрый старт с PostgreSQL

## 📋 Что нужно сделать

### 1️⃣ Установить PostgreSQL

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

**macOS:**
```bash
brew install postgresql@16
brew services start postgresql@16
```

### 2️⃣ Создать базу данных

```bash
# Войти в PostgreSQL
sudo -u postgres psql

# Выполнить команды:
CREATE DATABASE echoes_on_tape;
CREATE USER echoes_user WITH ENCRYPTED PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE echoes_on_tape TO echoes_user;
\q
```

### 3️⃣ Настроить .env

```bash
cd backend
cp .env.example .env
```

Отредактируйте `.env`:
```env
DATABASE_URL="postgresql://echoes_user:your_password@localhost:5432/echoes_on_tape?schema=public"
JWT_SECRET=your_very_secret_key_here
PORT=3001
```

### 4️⃣ Установить зависимости

```bash
npm install
```

**⚠️ Если возникла ошибка ECONNRESET:**
```bash
export PRISMA_ENGINES_MIRROR=https://registry.npmmirror.com/-/binary/prisma
npm install
```

См. [INSTALL_PRISMA.md](./INSTALL_PRISMA.md) для подробностей.

### 5️⃣ Сгенерировать Prisma Client

```bash
npx prisma generate
```

### 6️⃣ Запустить миграции

```bash
npm run prisma:migrate
```

### 7️⃣ Заполнить БД данными

```bash
npx prisma db seed
```

### 8️⃣ Активировать новый код

```bash
# Переименовать файлы
mv src/index.ts src/index.old.ts
mv src/index.new.ts src/index.ts
```

### 9️⃣ Запустить сервер

```bash
npm start
```

## ✅ Готово!

Сервер запущен на `http://localhost:3001`

**Тестовые аккаунты:**
- `admin@echoes.tape` / `password123` (Pro)
- `test@test.com` / `password123` (Fan)
- `free@test.com` / `password123` (Free)

## 🔍 Проверка

Откройте в браузере:
- http://localhost:3001 - должно показать "Echoes On Tape Backend is running with PostgreSQL + Prisma! 🚀"
- http://localhost:3001/api/releases - должен вернуть список релизов

## 🎨 Prisma Studio

Для визуального просмотра БД:
```bash
npm run prisma:studio
```

Откроется GUI на `http://localhost:5555`

## ❓ Проблемы?

См. [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) раздел Troubleshooting
