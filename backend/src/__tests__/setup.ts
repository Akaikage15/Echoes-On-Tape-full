/**
 * Настройка тестового окружения
 * Выполняется перед запуском всех тестов
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Очистка БД перед каждым тестом
beforeEach(async () => {
  // Очищаем таблицы в правильном порядке (из-за foreign keys)
  await prisma.subscription.deleteMany();
  await prisma.user.deleteMany();
  await prisma.release.deleteMany();
  await prisma.artist.deleteMany();
  await prisma.post.deleteMany();
  await prisma.exclusive.deleteMany();
  await prisma.merch.deleteMany();
  await prisma.poll.deleteMany();
  await prisma.demo.deleteMany();
  await prisma.proLibraryItem.deleteMany();
});

// Закрытие соединения после всех тестов
afterAll(async () => {
  await prisma.$disconnect();
});

export { prisma };
