import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// URLs сервисов
const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://localhost:3001';
const NOTIFICATION_SERVICE_URL = process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:3002';
const PAYMENT_SERVICE_URL = process.env.PAYMENT_SERVICE_URL || 'http://localhost:3003';
const MONOLITH_URL = process.env.MONOLITH_URL || 'http://localhost:5000';

app.use(cors());
app.use(helmet());

app.use((req, res, next) => {
  console.log(`[Gateway] ${req.method} ${req.url}`);
  next();
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'API Gateway' });
});

// Proxy to Auth Service
app.use('/api/auth', createProxyMiddleware({
  target: AUTH_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: { '^/api/auth': '/auth' },
  onError: (err, req, res) => res.status(503).json({ error: 'Auth Service unavailable' })
}));

// Proxy to Payment Service
app.use('/api/payments', createProxyMiddleware({
  target: PAYMENT_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: { '^/api/payments': '/payments' },
  onError: (err, req, res) => res.status(503).json({ error: 'Payment Service unavailable' })
}));

// Proxy to Notification Service (WebSockets)
app.use('/socket.io', createProxyMiddleware({
  target: NOTIFICATION_SERVICE_URL,
  changeOrigin: true,
  ws: true,
  onError: (err, req, res) => console.error('[Gateway] Socket Error:', err)
}));

// Proxy to Monolith
app.use('/', createProxyMiddleware({
  target: MONOLITH_URL,
  changeOrigin: true,
  onError: (err, req, res) => res.status(503).json({ error: 'Service unavailable' })
}));

app.listen(PORT, () => {
  console.log(`🚀 API Gateway running on port ${PORT}`);
  console.log(`➡️ Auth Service: ${AUTH_SERVICE_URL}`);
  console.log(`➡️ Payment Service: ${PAYMENT_SERVICE_URL}`);
  console.log(`➡️ Notification Service: ${NOTIFICATION_SERVICE_URL}`);
  console.log(`➡️ Monolith: ${MONOLITH_URL}`);
});
