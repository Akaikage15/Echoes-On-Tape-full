/**
 * Vercel Serverless Function Entry Point
 * Экспортирует Express app для Vercel
 */

// Загружаем переменные окружения (только для локальной разработки)
// В production Vercel использует свои Environment Variables
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({ path: '../backend/.env' });
}

// Проверяем критичные переменные окружения
if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL не установлен!');
  console.error('Установите переменную окружения в Vercel Dashboard:');
  console.error('https://vercel.com/akaikages-projects/echoes-on-tape/settings/environment-variables');
}

if (!process.env.JWT_SECRET) {
  console.error('❌ JWT_SECRET не установлен!');
  console.error('Сгенерируйте: node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"');
}

// Импортируем Express app
import app from '../backend/src/app';

// Экспортируем app для Vercel
// Vercel автоматически обернет Express app в serverless функцию
export default app;
