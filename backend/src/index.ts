import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { findUserByEmail, createUser, findUserById } from './utils/db';
import { getAllReleases, getReleaseById, getAllArtists, getArtistById } from './utils/releases-db';
import { getAllPosts, getPostById } from './utils/posts-db';
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
      user: { id: user.id, email: user.email, name: user.name, avatar_url: user.avatar_url },
    });
  } catch (error) {
    return res.status(403).json({ message: 'Недействительный или просроченный токен' });
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


app.get('/', (req, res) => {
  res.send('Echoes On Tape Backend is running!');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
