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
- **Текущее состояние (21.12.2025):**
    - Синхронизирована с `main`.
    - Готова к внедрению микросервисов и новых фич.

---

## ✅ Завершённые и слитые ветки (Merged)

### Фаза 3: Желательные улучшения (Nice-to-Have)
| Ветка | Назначение | Статус |
|-------|------------|--------|
| `feature/ui-improvements` | P3.1 Визуальные доработки (карточки подписок, UI) | Merged → `dev` |
| `feature/redis-cache` | P3.2 Кэширование (Redis, CacheService) | Merged → `dev` |
| `feature/rate-limiting` | P3.3 Защита API (Rate Limiting Middleware) | Merged → `dev` |
| `feature/api-docs` | P3.4 Документация (Swagger/OpenAPI) | Merged → `dev` |
| `feature/e2e-tests` | P3.6 E2E тесты (Playwright) - *Частично* | Merged → `dev` |

### Фаза 2: Важные улучшения (Should-Have)
| Ветка | Назначение | Статус |
|-------|------------|--------|
| `feature/phase-2-account-settings-refresh-tokens` | P2.1 Настройки аккаунта, P2.2 Refresh-токены | Merged → `dev` |
| `feature/rbac-and-file-upload` | P2.3 RBAC, P2.4 Загрузка файлов (Multer), P2.5 Профиль | Merged → `dev` |
| `feature/ci-cd-error-handling` | P2.6 CI/CD, P2.7 Обработка ошибок | Merged → `dev` |

### Фаза 1: Критические улучшения (Must-Have)
| Ветка | Назначение | Статус |
|-------|------------|--------|
| `feature/phase-1-database-architecture` | P1.1 БД, P1.2 Архитектура, P1.3 Валидация, P1.4 Тесты | Merged → `dev` |

### Фаза 0: Hotfix
| Ветка | Назначение | Статус |
|-------|------------|--------|
| `feature/account-page-fix` | Исправление багов ЛК | Merged → `dev` |
| `feature/replace-mock-data` | Замена моков на API | Merged → `dev` |

---

## 🛠️ Правила работы с ветками

1. **Создание:** Всегда от `dev`.
   ```bash
   git checkout dev && git pull
   git checkout -b feature/<название-задачи>
   ```

2. **Именование:**
   - `feature/...` — новый функционал
   - `fix/...` — багфиксы
   - `refactor/...` — рефакторинг
   - `docs/...` — документация

3. **Коммиты:**
   - Формат: `type: message` (напр. `feat: добавил кэширование`, `fix: исправил валидацию`)
   - Язык: Русский

4. **Мерж:**
   - Через Pull Request (или merge локально при одиночной разработке).
   - Обязательно: Прохождение тестов перед мержем.
   - Удаление ветки после мержа.

---

## 📊 Текущий статус проекта

**Прогресс по Roadmap:**
- [x] Фаза 0: Hotfix
- [x] Фаза 1: Critical (Architecture, DB, Tests)
- [x] Фаза 2: Important (Auth, Uploads, Account)
- [x] Фаза 3: Nice-to-Have (UI, Cache, Limits, Docs) - *Основные задачи выполнены*
- [ ] Фаза 4: Future (Microservices, etc.)

**Следующие шаги:**
- Финальная проверка перед деплоем.
- Настройка мониторинга (Prometheus/Grafana) - *Опционально*.
- Запуск на сервере.