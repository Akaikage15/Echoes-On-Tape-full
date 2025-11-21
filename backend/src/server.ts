/**
 * Server Entry Point
 * Запуск HTTP сервера
 */

import app from './app';
import { PORT } from './utils/config';

const port = PORT || 3001;

app.listen(port, () => {
  console.log('🚀 ========================================');
  console.log(`🚀 Server is running on http://localhost:${port}`);
  console.log('📊 Database: PostgreSQL + Prisma');
  console.log('🏗️  Architecture: Layered (MVC)');
  console.log('🚀 ========================================');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  process.exit(0);
});
