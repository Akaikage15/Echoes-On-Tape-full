# 🔧 Исправление проблемы аутентификации PostgreSQL

## ❌ Проблема

```
Error: P1000: Authentication failed against database server
```

## ✅ Решение

### Вариант 1: Сбросить пароль postgres

```bash
# 1. Войти в PostgreSQL как суперпользователь
sudo -u postgres psql

# 2. Установить новый пароль (без специальных символов)
ALTER USER postgres WITH PASSWORD 'simplepassword123';

# 3. Выйти
\q
```

### Вариант 2: Создать нового пользователя

```bash
# 1. Войти в PostgreSQL
sudo -u postgres psql

# 2. Создать нового пользователя
CREATE USER echoes_user WITH PASSWORD 'echoes_password_123';

# 3. Дать права на БД
GRANT ALL PRIVILEGES ON DATABASE echoes_on_tape TO echoes_user;

# 4. Выйти
\q
```

Затем обновите `backend/.env`:
```env
DATABASE_URL="postgresql://echoes_user:echoes_password_123@localhost:5432/echoes_on_tape?schema=public"
```

### Вариант 3: Использовать peer authentication (без пароля)

Если PostgreSQL настроен на peer authentication:

```bash
# 1. Создать системного пользователя
sudo useradd -m echoes_user

# 2. Войти в PostgreSQL
sudo -u postgres psql

# 3. Создать пользователя БД
CREATE USER echoes_user;
GRANT ALL PRIVILEGES ON DATABASE echoes_on_tape TO echoes_user;
\q
```

Обновите `backend/.env`:
```env
DATABASE_URL="postgresql://echoes_user@localhost:5432/echoes_on_tape?schema=public"
```

## 🧪 Проверка подключения

После изменения пароля проверьте:

```bash
# Замените USER и PASSWORD на ваши
PGPASSWORD='your_password' psql -U your_user -h localhost -d echoes_on_tape -c "SELECT version();"
```

Должно показать версию PostgreSQL без ошибок.

## 🚀 Продолжение

После успешного подключения:

```bash
cd backend

# Запустить миграции
npx prisma migrate dev --name init

# Заполнить БД
npx prisma db seed

# Запустить сервер
npm start
```

## 💡 Совет

Используйте простые пароли без специальных символов (+, @, /, etc.) для локальной разработки.

Примеры хороших паролей:
- `password123`
- `simplepass`
- `echoes2024`

Примеры проблемных паролей:
- `pass+word` (содержит +)
- `user@pass` (содержит @)
- `my/pass` (содержит /)
