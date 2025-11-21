/**
 * Настройка тестового окружения
 * Выполняется перед запуском всех тестов
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Очистка БД перед каждым тестом отключена
// Каждый тест должен сам управлять своими данными

// Закрытие соединения после всех тестов
afterAll(async () => {
  await prisma.$disconnect();
});

export { prisma };
