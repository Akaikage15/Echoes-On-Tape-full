# Документация по веткам Git

Этот документ описывает назначение и текущий статус веток в репозитории.

## 🚀 Основные ветки

### `main`
- **Назначение:** Stable production ветка.
- **Статус:** **RELEASE v1.0.0** (21.12.2025). Содержит функционал Фаз 0-3.
- **Обновление:** Только через Pull Request из `dev`.

### `dev`
- **Назначение:** Основная ветка разработки.
- **Статус:** Active. Старт **Фазы 4** (Future).

---

## 🔄 Активные ветки разработки (Фаза 4)

| Ветка | Назначение | Статус |
|-------|------------|--------|
| `feature/microservices-init` | 4.1 Начальная структура микросервисов, Gateway, Auth Service | Active 🟢 |

---

## ✅ Завершённые и слитые ветки (Merged)

### Фаза 3: Nice-to-Have (v1.0.0 Release)
| Ветка | Описание | Дата слияния |
|-------|----------|--------------|
| `feature/phase-3-ui-improvements` | UI доработки, улучшение UX подписок, новые карточки | 20.12.2025 |
| `feature/phase-3-caching-optimization` | Внедрение Redis, кеширование релизов | 20.12.2025 |
| `feature/rate-limiting` | Защита API (express-rate-limit) | 20.12.2025 |
| `feature/api-docs` | Swagger документация (/api-docs) | 20.12.2025 |
| `feature/e2e-tests` | Настройка Playwright и первые E2E тесты | 20.12.2025 |

### Фаза 2: Core & Security
| Ветка | Описание | Дата слияния |
|-------|----------|--------------|
| `feature/rbac-and-file-upload` | Ролевая модель (RBAC), загрузка файлов (Multer), CI/CD | 25.11.2024 |
| `feature/phase-2-account-settings-refresh-tokens` | Настройки аккаунта, соцсети, Refresh Tokens, Security | 21.11.2024 |

### Фаза 1: Backend Foundation
| Ветка | Описание | Дата слияния |
|-------|----------|--------------|
| `feature/phase-1-database-architecture` | PostgreSQL, Prisma, Слоистая архитектура, Jest, Zod, Winston | 20.11.2024 |

### Фаза 0: MVP & Frontend Fixes
| Ветка | Описание | Статус |
|-------|----------|--------|
| `feature/account-page-fix` | Исправление логики подписок и ЛК | Merged |
| `feature/replace-mock-data` | Переход с моков на реальное API | Merged |
| `feature/auth-backend` | Базовая аутентификация | Merged |
| `feature/blog-posts-api` | API для блога | Merged |
| `feature/subscription-system` | Система подписок (Backend + Frontend) | Merged |
| `feature/submit-demo-frontend` | Форма отправки демо | Merged |
| `feature/redesign` | Редизайн (Liquid Glass, цвета) | Merged |

---

## 📦 Правила именования веток

- `feature/<name>` — новая функциональность
- `fix/<name>` — исправление ошибок
- `refactor/<name>` — рефакторинг кода
- `docs/<name>` — обновление документации
- `test/<name>` — добавление тестов

## 🔄 Процесс работы (Workflow)

1. Создать ветку от `dev`: `git checkout -b feature/my-feature dev`
2. Выполнить задачу, сделать коммиты (`feat: ...`, `fix: ...`).
3. Открыть Pull Request в `dev`.
4. После Code Review и прохождения тестов — Merge.
5. После завершения фазы/релиза — Merge `dev` -> `main`.