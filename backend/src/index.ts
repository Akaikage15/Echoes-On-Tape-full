import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { findUserByEmail, createUser, findUserById } from './utils/db';
import { JWT_SECRET, PORT } from './utils/config';

const app = express();
const port = PORT;

app.use(cors());
app.use(express.json());

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
app.get('/api/releases', (req, res) => {
  res.status(200).json([]); // Пример ответа
});
app.get('/api/releases/:id', (req, res) => {
  res.status(200).json({}); // Пример ответа
});


app.get('/', (req, res) => {
  res.send('Echoes On Tape Backend is running!');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
