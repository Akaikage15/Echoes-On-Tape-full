/**
 * Express Application
 * Конфигурация приложения
 */

import express from 'express';
import cors from 'cors';
import routes from './routes';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';
import { requestLogger } from './middleware/logger.middleware';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(requestLogger);

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
