# 🏗️ Архитектура Backend

## 📊 Обзор

Backend построен по **Layered Architecture** (слоистая архитектура) с четким разделением ответственности:

```
┌─────────────────────────────────────┐
│         HTTP Request                │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│      Routes (Маршрутизация)         │
│   - auth.routes.ts                  │
│   - subscription.routes.ts          │
│   - release.routes.ts               │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│    Middleware (Промежуточный слой)  │
│   - authenticateToken               │
│   - errorHandler                    │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│    Controllers (Обработчики)        │
│   - auth.controller.ts              │
│   - subscription.controller.ts      │
│   - release.controller.ts           │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│    Services (Бизнес-логика)         │
│   - auth.service.ts                 │
│   - subscription.service.ts         │
│   - release.service.ts              │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│    Repositories (Доступ к данным)   │
│   - user.repository.ts              │
│   - release.repository.ts           │
│   - artist.repository.ts            │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│      Prisma Client → PostgreSQL     │
└─────────────────────────────────────┘
```

---

## 📁 Структура проекта

```
backend/src/
├── app.ts                    # Конфигурация Express приложения
├── server.ts                 # Entry point, запуск сервера
│
├── controllers/              # HTTP обработчики
│   ├── auth.controller.ts
│   ├── subscription.controller.ts
│   ├── release.controller.ts
│   └── index.ts
│
├── services/                 # Бизнес-логика
│   ├── auth.service.ts
│   ├── subscription.service.ts
│   ├── release.service.ts
│   └── index.ts
│
├── repositories/             # Доступ к данным
│   ├── user.repository.ts
│   ├── artist.repository.ts
│   ├── release.repository.ts
│   ├── post.repository.ts
│   ├── exclusive.repository.ts
│   ├── merch.repository.ts
│   ├── poll.repository.ts
│   ├── pro-library.repository.ts
│   ├── demo.repository.ts
│   └── index.ts
│
├── routes/                   # Определение маршрутов
│   ├── auth.routes.ts
│   ├── subscription.routes.ts
│   ├── release.routes.ts
│   └── index.ts
│
├── middleware/               # Промежуточные обработчики
│   ├── auth.middleware.ts
│   └── error.middleware.ts
│
├── lib/                      # Утилиты и клиенты
│   └── prisma.ts
│
└── utils/                    # Вспомогательные функции
    └── config.ts
```

---

## 🔄 Поток данных

### Пример: Регистрация пользователя

```typescript
1. HTTP Request
   POST /api/auth/register
   Body: { email, password, name }
   
   ↓

2. Route (auth.routes.ts)
   router.post('/register', authController.register)
   
   ↓

3. Controller (auth.controller.ts)
   - Валидация входных данных
   - Вызов сервиса
   async register(req, res, next) {
     const result = await authService.register(email, password, name);
     res.status(201).json(result);
   }
   
   ↓

4. Service (auth.service.ts)
   - Бизнес-логика
   - Проверка существования пользователя
   - Хеширование пароля
   - Генерация токена
   async register(email, password, name) {
     const existingUser = await userRepository.findByEmail(email);
     if (existingUser) throw new AppError('User exists', 409);
     
     const password_hash = await bcrypt.hash(password, 10);
     const user = await userRepository.create({ email, password_hash, name });
     const token = this.generateToken(user.id);
     
     return { user, token };
   }
   
   ↓

5. Repository (user.repository.ts)
   - Работа с БД через Prisma
   async create(data) {
     return await prisma.user.create({ data });
   }
   
   ↓

6. Prisma Client → PostgreSQL
   INSERT INTO users ...
   
   ↓

7. HTTP Response
   Status: 201 Created
   Body: { user, token }
```

---

## 📝 Описание слоев

### 1. Routes (Маршруты)

**Ответственность:**
- Определение HTTP маршрутов
- Связывание URL с контроллерами
- Применение middleware (auth, validation)

**Пример:**
```typescript
// routes/auth.routes.ts
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/profile', authenticateToken, authController.getProfile);
```

---

### 2. Middleware (Промежуточный слой)

**Ответственность:**
- Аутентификация (проверка JWT)
- Обработка ошибок
- Валидация данных (будет добавлено в 1.3)
- Логирование (будет добавлено в 1.5)

**Пример:**
```typescript
// middleware/auth.middleware.ts
export const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.sendStatus(401);
  
  const decoded = jwt.verify(token, JWT_SECRET);
  req.user = decoded;
  next();
};
```

---

### 3. Controllers (Контроллеры)

**Ответственность:**
- Обработка HTTP запросов/ответов
- Базовая валидация входных данных
- Вызов сервисов
- Формирование HTTP ответов

**НЕ должны:**
- Содержать бизнес-логику
- Напрямую работать с БД
- Содержать сложные вычисления

**Пример:**
```typescript
// controllers/auth.controller.ts
async register(req, res, next) {
  try {
    const { email, password, name } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email и пароль обязательны' });
    }
    
    const result = await authService.register(email, password, name);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}
```

---

### 4. Services (Сервисы)

**Ответственность:**
- Бизнес-логика приложения
- Валидация бизнес-правил
- Координация между репозиториями
- Обработка транзакций

**НЕ должны:**
- Знать о HTTP (req, res)
- Напрямую работать с Prisma
- Формировать HTTP ответы

**Пример:**
```typescript
// services/auth.service.ts
async register(email, password, name) {
  // Бизнес-правило: email должен быть уникальным
  const existingUser = await userRepository.findByEmail(email);
  if (existingUser) {
    throw new AppError('Пользователь уже существует', 409);
  }
  
  // Бизнес-логика: хеширование пароля
  const password_hash = await bcrypt.hash(password, 10);
  
  // Создание пользователя
  const user = await userRepository.create({ email, password_hash, name });
  
  // Генерация токена
  const token = this.generateToken(user.id);
  
  return { user, token };
}
```

---

### 5. Repositories (Репозитории)

**Ответственность:**
- Работа с БД через Prisma
- CRUD операции
- Сложные запросы с JOIN
- Абстракция доступа к данным

**НЕ должны:**
- Содержать бизнес-логику
- Знать о HTTP
- Выполнять валидацию бизнес-правил

**Пример:**
```typescript
// repositories/user.repository.ts
async findByEmail(email: string) {
  return await prisma.user.findUnique({
    where: { email },
  });
}

async create(data) {
  return await prisma.user.create({
    data: {
      ...data,
      subscriptionTier: 'none',
    },
  });
}
```

---

## ✅ Преимущества архитектуры

### 1. Разделение ответственности (SoC)
- Каждый слой имеет четкую задачу
- Легко понять, где искать код

### 2. Тестируемость
- Сервисы можно тестировать без HTTP
- Репозитории можно мокать
- Контроллеры тестируются отдельно

### 3. Переиспользование
- Сервисы можно вызывать из разных контроллеров
- Репозитории используются разными сервисами

### 4. Масштабируемость
- Легко добавлять новые домены
- Можно выделить сервисы в микросервисы

### 5. Поддерживаемость
- Изменения в одном слое не влияют на другие
- Легко найти и исправить баги

---

## 🔧 Добавление нового функционала

### Пример: Добавить управление артистами

#### 1. Создать сервис
```typescript
// services/artist.service.ts
export class ArtistService {
  async getAllArtists() {
    return await artistRepository.findAll();
  }
  
  async getArtistById(id: string) {
    const artist = await artistRepository.findById(id);
    if (!artist) throw new AppError('Артист не найден', 404);
    return artist;
  }
}
```

#### 2. Создать контроллер
```typescript
// controllers/artist.controller.ts
export class ArtistController {
  async getAll(req, res, next) {
    try {
      const artists = await artistService.getAllArtists();
      res.json(artists);
    } catch (error) {
      next(error);
    }
  }
}
```

#### 3. Создать роуты
```typescript
// routes/artist.routes.ts
const router = Router();
router.get('/', artistController.getAll);
router.get('/:id', artistController.getById);
export default router;
```

#### 4. Подключить в главный роутер
```typescript
// routes/index.ts
import artistRoutes from './artist.routes';
router.use('/artists', artistRoutes);
```

---

## 📚 Дополнительные материалы

- [Layered Architecture Pattern](https://www.oreilly.com/library/view/software-architecture-patterns/9781491971437/ch01.html)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)

---

## 🎯 Следующие шаги

- [ ] Добавить валидацию (Zod) - Задача 1.3
- [ ] Добавить логирование (Winston) - Задача 1.5
- [ ] Добавить тесты - Задача 1.4
- [ ] Добавить остальные контроллеры (artists, posts, etc.)
