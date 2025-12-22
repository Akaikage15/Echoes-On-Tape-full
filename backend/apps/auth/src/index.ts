import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'Auth Service' });
});

// Тестовый роут
app.post('/auth/login', (req, res) => {
  // TODO: Реализовать логику входа
  res.json({ message: 'Login endpoint from Microservice' });
});

app.post('/auth/register', (req, res) => {
  // TODO: Реализовать логику регистрации
  res.json({ message: 'Register endpoint from Microservice' });
});

app.listen(PORT, () => {
  console.log(`🔐 Auth Service running on port ${PORT}`);
});
