# План миграции на микросервисную архитектуру (Phase 4.1)

## 🎯 Цель
Разделить монолитное приложение `backend` на независимые микросервисы для улучшения масштабируемости, отказоустойчивости и независимого деплоя.

## 🏗 Новая архитектура

### 1. API Gateway (Шлюз)
- **Технология:** Express Gateway / Nginx / Custom Node.js Proxy
- **Роль:** Единая точка входа для фронтенда.
- **Функции:**
  - Маршрутизация запросов (`/api/auth` -> Auth Service, `/api/music` -> Content Service).
  - Rate Limiting.
  - Предварительная валидация токенов (опционально).

### 2. Сервисы (Services)

#### 🔐 Auth Service (Сервис Аутентификации)
- **Ответственность:** Регистрация, Вход, Refresh Token, Сброс пароля.
- **Данные:** Таблицы `users` (минимальные данные: email, password_hash, role), `refresh_tokens`.
- **API:**
  - `POST /auth/register`
  - `POST /auth/login`
  - `POST /auth/refresh`

#### 👤 User Profile Service (Сервис Профилей)
- **Ответственность:** Управление профилем пользователя, настройки, аватарки.
- **Данные:** Расширенная таблица `user_profiles` (bio, social_links, avatar), `subscriptions`.
- **Связь:** Получает `userId` из токена.

#### 🎵 Content Service (Сервис Контента)
- **Ответственность:** Релизы, Артисты, Треки, Демо.
- **Данные:** `artists`, `releases`, `exclusive_content`, `demos`.
- **Особенность:** Самый нагруженный сервис (чтение).

#### 🛒 Store Service (Магазин и Подписки)
- **Ответственность:** Мерч, Оплата подписок.
- **Данные:** `merch_items`, `orders`, `payments`.

#### 💬 Interaction Service (Интерактивы)
- **Ответственность:** Голосования, Комментарии, Блог.
- **Данные:** `polls`, `poll_options`, `user_votes`, `posts`.

### 3. Инфраструктура

- **Message Broker (RabbitMQ / Kafka):** Для асинхронного общения (например, после регистрации Auth Service шлет событие `USER_CREATED`, и User Service создает пустой профиль).
- **Service Discovery:** (На первом этапе не требуется, используем Docker Compose DNS).
- **Database:**
  - *Этап 1:* Общая БД, разные схемы.
  - *Этап 2:* Database per Service.

## 🚀 Этапы миграции (Strangler Fig Pattern)

1.  **Подготовка:** Создание структуры Monorepo.
2.  **API Gateway:** Настройка прокси, который шлет ВСЕ запросы в старый монолит.
3.  **Auth Extraction:** Вынос логики авторизации в `auth-service`. Переключение роутов `/api/auth` на новый сервис.
4.  **Content Extraction:** Вынос логики релизов и артистов.
5.  **Finalize:** Удаление старого кода из монолита.

## 📂 Структура папок

```
backend/
├── apps/
│   ├── gateway/         # API Gateway
│   ├── auth/            # Auth Service
│   ├── content/         # Content Service
│   └── legacy-monolith/ # Старый бэкенд (переименован)
├── libs/
│   ├── shared-types/    # Общие типы
│   └── shared-utils/    # Логгеры, валидаторы
├── docker-compose.yml   # Оркестрация
└── package.json         # Workspace root
```
