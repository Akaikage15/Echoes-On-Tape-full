import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// URLs сервисов (будут браться из .env или дефолтные для docker-compose)
const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://localhost:3001';
const MONOLITH_URL = process.env.MONOLITH_URL || 'http://localhost:5000';

app.use(cors());
app.use(helmet());

// Логирование запросов
app.use((req, res, next) => {
  console.log(`[Gateway] ${req.method} ${req.url}`);
  next();
});

// Проверка здоровья
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'API Gateway' });
});

// Маршрутизация на Auth Service
app.use('/api/auth', createProxyMiddleware({
  target: AUTH_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: {
    '^/api/auth': '/auth', // Убираем префикс /api если нужно, или оставляем
  },
  onError: (err, req, res) => {
    console.error('[Gateway] Auth Service Error:', err);
    res.status(503).json({ error: 'Auth Service unavailable' });
  }
}));

// Все остальные запросы -> в Монолит
app.use('/', createProxyMiddleware({
  target: MONOLITH_URL,
  changeOrigin: true,
  onError: (err, req, res) => {
    console.error('[Gateway] Monolith Error:', err);
    res.status(503).json({ error: 'Service unavailable' });
  }
}));

app.listen(PORT, () => {
  console.log(`🚀 API Gateway running on port ${PORT}`);
  console.log(`➡️ Auth Service: ${AUTH_SERVICE_URL}`);
  console.log(`➡️ Monolith: ${MONOLITH_URL}`);
});
