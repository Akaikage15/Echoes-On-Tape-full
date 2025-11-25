/**
 * Express Application
 * Конфигурация приложения
 */

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import routes from './routes';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';
import { requestLogger } from './middleware/logger.middleware';

const app = express();

// Middleware
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  // Vercel автоматически добавит production URL
  ...(process.env.VERCEL_URL ? [`https://${process.env.VERCEL_URL}`] : []),
];

app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? (origin, callback) => {
        // В production разрешаем все Vercel URLs и настроенные origins
        if (!origin || origin.includes('.vercel.app') || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      }
    : allowedOrigins,
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use(requestLogger);

// Статические файлы (загруженные файлы)
app.use('/uploads', express.static('uploads'));

// Health check
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Echoes On Tape Backend is running with PostgreSQL + Prisma! 🚀',
    version: '2.0.0',
    architecture: 'Layered (Controllers → Services → Repositories)',
  });
});

// API Routes
app.use('/api', routes);

// Error Handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
