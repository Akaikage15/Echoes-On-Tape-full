import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { findUserByEmail, createUser, findUserById } from './utils/db';
import { getAllReleases, getReleaseById, getAllArtists, getArtistById } from './utils/releases-db';
import { getAllPosts, getPostById } from './utils/posts-db';
import { getAllExclusives, getExclusiveById } from './utils/exclusives-db';
import { getAllMerchItems, getMerchItemById } from './utils/merch-db';
import { getAllPolls, getPollById, submitVote } from './utils/polls-db';
import { getAllProLibraryItems, getProLibraryItemById } from './utils/pro-library-db';
import { getAllDemos, getDemoById, createDemo, updateDemoStatus } from './utils/demos-db';
import { JWT_SECRET, PORT } from './utils/config';

const app = express();
const port = PORT;

app.use(cors());
app.use(express.json());

// Auth Middleware (simple example for demonstration)
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
  const { email, password, name } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email и пароль обязательны' });
  }

  if (await findUserByEmail(email)) {
    return res.status(409).json({ message: 'Пользователь с таким email уже существует' });
  }

  const password_hash = await bcrypt.hash(password, 10);
  const user = await createUser(email, password_hash, name);

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });

  res.status(201).json({
    message: 'Пользователь успешно зарегистрирован',
    user: { id: user.id, email: user.email, name: user.name },
    token,
  });
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email и пароль обязательны' });
  }

  const user = await findUserByEmail(email);
  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    return res.status(401).json({ message: 'Неверный email или пароль' });
  }

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });

  res.status(200).json({
    message: 'Вход выполнен успешно',
    user: { id: user.id, email: user.email, name: user.name },
    token,
  });
});

app.get('/api/auth/profile', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'Отсутствует токен авторизации' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Токен не предоставлен' });
  }

  try {
    const decoded: any = jwt.verify(token, JWT_SECRET);
    const user = await findUserById(decoded.userId);

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
        subscriptionEndDate: user.subscriptionEndDate
      },
    });
  } catch (error) {
    return res.status(403).json({ message: 'Недействительный или просроченный токен' });
  }
});

// Subscriptions (simulated)
app.post('/api/subscriptions/purchase', authenticateToken, async (req: any, res) => {
  const { tier } = req.body;
  const userId = req.user.userId;

  if (!userId || !tier) {
    return res.status(400).json({ message: 'Требуется User ID и тип подписки' });
  }

  const user = await findUserById(userId);
  if (user) {
    user.subscriptionTier = tier;
    user.subscriptionEndDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
    user.updated_at = new Date();
    
    return res.status(200).json({ 
      message: `Подписка на уровень "${tier}" успешно оформлена.`, 
      user: { 
        id: user.id, 
        email: user.email, 
        name: user.name, 
        subscriptionTier: user.subscriptionTier, 
        subscriptionEndDate: user.subscriptionEndDate 
      } 
    });
  } else {
    return res.status(404).json({ message: 'Пользователь не найден' });
  }
});


// Releases
app.get('/api/releases', async (req, res) => {
  const releases = await getAllReleases();
  res.status(200).json(releases);
});

app.get('/api/releases/:id', async (req, res) => {
  const release = await getReleaseById(req.params.id);
  if (release) {
    res.status(200).json(release);
  } else {
    res.status(404).json({ message: 'Релиз не найден' });
  }
});

// Artists
app.get('/api/artists', async (req, res) => {
  const artists = await getAllArtists();
  res.status(200).json(artists);
});

app.get('/api/artists/:id', async (req, res) => {
  const artist = await getArtistById(req.params.id);
  if (artist) {
    res.status(200).json(artist);
  } else {
    res.status(404).json({ message: 'Артист не найден' });
  }
});

// Posts
app.get('/api/posts', async (req, res) => {
  const posts = await getAllPosts();
  res.status(200).json(posts);
});

app.get('/api/posts/:id', async (req, res) => {
  const post = await getPostById(req.params.id);
  if (post) {
    res.status(200).json(post);
  } else {
    res.status(404).json({ message: 'Пост не найден' });
  }
});

// Exclusives
app.get('/api/exclusives', async (req, res) => {
  const exclusives = await getAllExclusives();
  res.status(200).json(exclusives);
});

app.get('/api/exclusives/:id', async (req, res) => {
  const exclusive = await getExclusiveById(req.params.id);
  if (exclusive) {
    res.status(200).json(exclusive);
  } else {
    res.status(404).json({ message: 'Эксклюзивный контент не найден' });
  }
});

// Merch
app.get('/api/merch', async (req, res) => {
  const merchItems = await getAllMerchItems();
  res.status(200).json(merchItems);
});

app.get('/api/merch/:id', async (req, res) => {
  const merchItem = await getMerchItemById(req.params.id);
  if (merchItem) {
    res.status(200).json(merchItem);
  } else {
    res.status(404).json({ message: 'Товар не найден' });
  }
});

// Polls
app.get('/api/polls', async (req, res) => {
  const polls = await getAllPolls();
  res.status(200).json(polls);
});

app.get('/api/polls/:id', async (req, res) => {
  const poll = await getPollById(req.params.id);
  if (poll) {
    res.status(200).json(poll);
  } else {
    res.status(404).json({ message: 'Голосование не найдено' });
  }
});

app.post('/api/polls/:id/vote', authenticateToken, async (req: any, res) => {
  const { id } = req.params;
  const { optionId } = req.body;
  const userId = req.user.userId;

  if (!optionId) {
    return res.status(400).json({ message: 'ID опции для голосования обязателен' });
  }

  // In a real application, you'd check if the user has already voted
  // and if they meet the required tier, and persist the vote.
  const updatedPoll = await submitVote(id, optionId);

  if (updatedPoll) {
    res.status(200).json({ message: 'Голос успешно учтен', poll: updatedPoll });
  } else {
    res.status(404).json({ message: 'Голосование или опция не найдены' });
  }
});

// Pro Library
app.get('/api/pro-library', async (req, res) => {
  const proLibraryItems = await getAllProLibraryItems();
  res.status(200).json(proLibraryItems);
});

app.get('/api/pro-library/:id', async (req, res) => {
  const proLibraryItem = await getProLibraryItemById(req.params.id);
  if (proLibraryItem) {
    res.status(200).json(proLibraryItem);
  } else {
    res.status(404).json({ message: 'Элемент PRO-библиотеки не найден' });
  }
});

// Demos
app.get('/api/demos', authenticateToken, async (req, res) => {
  const demos = await getAllDemos();
  // In a real app, filter by user_id for regular users, or show all for admin
  res.status(200).json(demos);
});

app.get('/api/demos/:id', authenticateToken, async (req, res) => {
  const demo = await getDemoById(req.params.id);
  if (demo) {
    res.status(200).json(demo);
  } else {
    res.status(404).json({ message: 'Демо не найдено' });
  }
});

app.post('/api/demos', authenticateToken, async (req: any, res) => {
  const { artist_name, email, track_url, genre, comment } = req.body;
  const user_id = req.user.userId;

  if (!artist_name || !email || !track_url || !genre) {
    return res.status(400).json({ message: 'Необходимо заполнить все обязательные поля' });
  }

  const newDemo = await createDemo({ user_id, artist_name, email, track_url, genre, comment, upload_date: new Date().toISOString() });
  res.status(201).json({ message: 'Демо успешно отправлено', demo: newDemo });
});

app.put('/api/demos/:id/status', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  // In a real app, check for admin role
  if (!['pending', 'reviewed', 'accepted', 'rejected'].includes(status)) {
    return res.status(400).json({ message: 'Неверный статус' });
  }

  const updatedDemo = await updateDemoStatus(id, status);
  if (updatedDemo) {
    res.status(200).json({ message: 'Статус демо обновлен', demo: updatedDemo });
  } else {
    res.status(404).json({ message: 'Демо не найдено' });
  }
});


app.get('/', (req, res) => {
  res.send('Echoes On Tape Backend is running!');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
