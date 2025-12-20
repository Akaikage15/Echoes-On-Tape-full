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
import { globalLimiter } from './middleware/rate-limit.middleware';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger.config';

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true, // Разрешить отправку cookies
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

// Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rate Limiting
app.use('/api', globalLimiter);

// API Routes
app.use('/api', routes);

// Error Handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
