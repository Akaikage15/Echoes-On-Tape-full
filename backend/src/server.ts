/**
 * Server Entry Point
 * Запуск HTTP сервера
 */

// Загрузка переменных окружения ДОЛЖНА быть первой
import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import { PORT } from './utils/config';
import { cleanupLogs } from './utils/cleanup-logs';
import { handleUnhandledRejection, handleUncaughtException } from './middleware/error.middleware';
import { logInfo, logError } from './utils/logger';

const port = PORT || 3001;

// Обработчики глобальных ошибок
process.on('unhandledRejection', handleUnhandledRejection);
process.on('uncaughtException', handleUncaughtException);

// Очистка старых логов при запуске
cleanupLogs();

const server = app.listen(port, () => {
  logInfo('Server started', {
    port,
    environment: process.env.NODE_ENV || 'development',
    database: 'PostgreSQL + Prisma',
    architecture: 'Layered (MVC)',
  });

  console.log('🚀 ========================================');
  console.log(`🚀 Server is running on http://localhost:${port}`);
  console.log('📊 Database: PostgreSQL + Prisma');
  console.log('🏗️  Architecture: Layered (MVC)');
  console.log('✅ Error handling: Enabled');
  console.log('🚀 ========================================');
});

// Graceful shutdown
const gracefulShutdown = (signal: string) => {
  logInfo(`${signal} signal received: closing HTTP server`);
  console.log(`\n${signal} signal received: closing HTTP server`);

  server.close(() => {
    logInfo('HTTP server closed');
    console.log('✅ HTTP server closed');
    process.exit(0);
  });

  // Принудительное завершение через 10 секунд
  setTimeout(() => {
    logError('Could not close connections in time, forcefully shutting down');
    console.error('❌ Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
