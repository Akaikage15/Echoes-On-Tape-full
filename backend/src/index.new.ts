/**
 * Echoes On Tape Backend
 * Обновленная версия с Prisma + PostgreSQL
 */

import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { JWT_SECRET, PORT } from './utils/config';
import {
  userRepository,
  artistRepository,
  releaseRepository,
  postRepository,
  exclusiveRepository,
  merchRepository,
  pollRepository,
  proLibraryRepository,
  demoRepository,
} from './repositories';

const app = express();
const port = PORT;

app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true,
}));
app.use(express.json());

// Auth Middleware
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// --- API Routes ---

// Auth
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email и пароль обязательны' });
    }

    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: 'Пользователь с таким email уже существует' });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const user = await userRepository.create({ email, password_hash, name });

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({
      message: 'Пользователь успешно зарегистрирован',
      user: { id: user.id, email: user.email, name: user.name },
      token,
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email и пароль обязательны' });
    }

    const user = await userRepository.findByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({ message: 'Неверный email или пароль' });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({
      message: 'Вход выполнен успешно',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        subscriptionTier: user.subscriptionTier,
        subscriptionEndDate: user.subscriptionEndDate,
      },
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

app.get('/api/auth/profile', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: 'Отсутствует токен авторизации' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Токен не предоставлен' });
    }

    const decoded: any = jwt.verify(token, JWT_SECRET);
    const user = await userRepository.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    res.status(200).json({
      message: 'Профиль пользователя',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar_url: user.avatar_url,
        subscriptionTier: user.subscriptionTier,
        subscriptionEndDate: user.subscriptionEndDate,
      },
    });
  } catch (error) {
    console.error('Profile error:', error);
    return res.status(403).json({ message: 'Недействительный или просроченный токен' });
  }
});

// Subscriptions
app.post('/api/subscriptions/purchase', authenticateToken, async (req: any, res) => {
  try {
    const { tier } = req.body;
    const userId = req.user.userId;

    if (!userId || !tier) {
      return res.status(400).json({ message: 'Требуется User ID и тип подписки' });
    }

    const endDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    const user = await userRepository.updateSubscription(userId, tier, endDate);

    return res.status(200).json({
      message: `Подписка на уровень "${tier}" успешно оформлена.`,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        subscriptionTier: user.subscriptionTier,
        subscriptionEndDate: user.subscriptionEndDate,
      },
    });
  } catch (error) {
    console.error('Purchase subscription error:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Releases
app.get('/api/releases', async (req, res) => {
  try {
    const releases = await releaseRepository.findAll();
    res.status(200).json(releases);
  } catch (error) {
    console.error('Get releases error:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

app.get('/api/releases/:id', async (req, res) => {
  try {
    const release = await releaseRepository.findById(req.params.id);
    if (release) {
      res.status(200).json(release);
    } else {
      res.status(404).json({ message: 'Релиз не найден' });
    }
  } catch (error) {
    console.error('Get release error:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Artists
app.get('/api/artists', async (req, res) => {
  try {
    const artists = await artistRepository.findAll();
    res.status(200).json(artists);
  } catch (error) {
    console.error('Get artists error:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

app.get('/api/artists/:id', async (req, res) => {
  try {
    const artist = await artistRepository.findById(req.params.id);
    if (artist) {
      res.status(200).json(artist);
    } else {
      res.status(404).json({ message: 'Артист не найден' });
    }
  } catch (error) {
    console.error('Get artist error:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Posts
app.get('/api/posts', async (req, res) => {
  try {
    const posts = await postRepository.findAll();
    res.status(200).json(posts);
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

app.get('/api/posts/:id', async (req, res) => {
  try {
    const post = await postRepository.findById(req.params.id);
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: 'Пост не найден' });
    }
  } catch (error) {
    console.error('Get post error:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Exclusives
app.get('/api/exclusives', async (req, res) => {
  try {
    const exclusives = await exclusiveRepository.findAll();
    res.status(200).json(exclusives);
  } catch (error) {
    console.error('Get exclusives error:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

app.get('/api/exclusives/:id', async (req, res) => {
  try {
    const exclusive = await exclusiveRepository.findById(req.params.id);
    if (exclusive) {
      res.status(200).json(exclusive);
    } else {
      res.status(404).json({ message: 'Эксклюзивный контент не найден' });
    }
  } catch (error) {
    console.error('Get exclusive error:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Merch
app.get('/api/merch', async (req, res) => {
  try {
    const merchItems = await merchRepository.findAll();
    res.status(200).json(merchItems);
  } catch (error) {
    console.error('Get merch error:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

app.get('/api/merch/:id', async (req, res) => {
  try {
    const merchItem = await merchRepository.findById(req.params.id);
    if (merchItem) {
      res.status(200).json(merchItem);
    } else {
      res.status(404).json({ message: 'Товар не найден' });
    }
  } catch (error) {
    console.error('Get merch item error:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Polls
app.get('/api/polls', async (req, res) => {
  try {
    const polls = await pollRepository.findAll();
    res.status(200).json(polls);
  } catch (error) {
    console.error('Get polls error:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

app.get('/api/polls/:id', async (req, res) => {
  try {
    const poll = await pollRepository.findById(req.params.id);
    if (poll) {
      res.status(200).json(poll);
    } else {
      res.status(404).json({ message: 'Голосование не найдено' });
    }
  } catch (error) {
    console.error('Get poll error:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

app.post('/api/polls/:id/vote', authenticateToken, async (req: any, res) => {
  try {
    const { id } = req.params;
    const { optionId } = req.body;
    const userId = req.user.userId;

    if (!optionId) {
      return res.status(400).json({ message: 'ID опции для голосования обязателен' });
    }

    const updatedPoll = await pollRepository.vote(userId, id, optionId);
    res.status(200).json({ message: 'Голос успешно учтен', poll: updatedPoll });
  } catch (error: any) {
    console.error('Vote error:', error);
    if (error.message === 'Вы уже проголосовали в этом опросе') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Pro Library
app.get('/api/pro-library', async (req, res) => {
  try {
    const proLibraryItems = await proLibraryRepository.findAll();
    res.status(200).json(proLibraryItems);
  } catch (error) {
    console.error('Get pro library error:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

app.get('/api/pro-library/:id', async (req, res) => {
  try {
    const proLibraryItem = await proLibraryRepository.findById(req.params.id);
    if (proLibraryItem) {
      res.status(200).json(proLibraryItem);
    } else {
      res.status(404).json({ message: 'Элемент PRO-библиотеки не найден' });
    }
  } catch (error) {
    console.error('Get pro library item error:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Demos
app.get('/api/demos', authenticateToken, async (req: any, res) => {
  try {
    const userId = req.user.userId;
    const demos = await demoRepository.findByUserId(userId);
    res.status(200).json(demos);
  } catch (error) {
    console.error('Get demos error:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

app.get('/api/demos/:id', authenticateToken, async (req, res) => {
  try {
    const demo = await demoRepository.findById(req.params.id);
    if (demo) {
      res.status(200).json(demo);
    } else {
      res.status(404).json({ message: 'Демо не найдено' });
    }
  } catch (error) {
    console.error('Get demo error:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

app.post('/api/demos', authenticateToken, async (req: any, res) => {
  try {
    const { artist_name, email, track_url, genre, comment } = req.body;
    const user_id = req.user.userId;

    if (!artist_name || !email || !track_url || !genre) {
      return res.status(400).json({ message: 'Необходимо заполнить все обязательные поля' });
    }

    const newDemo = await demoRepository.create({
      user_id,
      artist_name,
      email,
      track_url,
      genre,
      comment,
    });

    res.status(201).json({ message: 'Демо успешно отправлено', demo: newDemo });
  } catch (error) {
    console.error('Create demo error:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

app.put('/api/demos/:id/status', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'reviewed', 'accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Неверный статус' });
    }

    const updatedDemo = await demoRepository.updateStatus(id, status);
    res.status(200).json({ message: 'Статус демо обновлен', demo: updatedDemo });
  } catch (error) {
    console.error('Update demo status error:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

app.get('/', (req, res) => {
  res.send('Echoes On Tape Backend is running with PostgreSQL + Prisma! 🚀');
});

app.listen(port, () => {
  console.log(`🚀 Server is running on http://localhost:${port}`);
  console.log(`📊 Database: PostgreSQL + Prisma`);
});
