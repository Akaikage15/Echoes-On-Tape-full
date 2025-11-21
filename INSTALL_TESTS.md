# Установка зависимостей для тестирования

## Проблема
Отсутствуют зависимости для запуска тестов. Ошибка:
```
Не удается найти модуль "@testing-library/react"
```

## Решение

Выполни следующие команды:

### 1. Установка зависимостей для тестирования
```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event @types/jest jest jest-environment-jsdom
```

### 2. Добавь скрипт в package.json
Открой `package.json` и добавь в секцию `"scripts"`:
```json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "test": "jest",
  "test:watch": "jest --watch"
}
```

### 3. После установки
Тесты будут работать корректно. Запуск:
```bash
npm test
```

## Альтернатива (если тесты не нужны сейчас)
Можно временно удалить файлы тестов:
```bash
rm -rf src/**/__tests__
```

Но рекомендуется установить зависимости для полноценной разработки.
