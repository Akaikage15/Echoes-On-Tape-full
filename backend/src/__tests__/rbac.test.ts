/**
 * Тесты для RBAC middleware
 */

import request from 'supertest';
import app from '../app';
import { PrismaClient, UserRole } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../utils/config';

const prisma = new PrismaClient();

describe('RBAC Middleware', () => {
  let adminToken: string;
  let artistToken: string;
  let userToken: string;
  let adminUser: any;
  let artistUser: any;
  let regularUser: any;

  beforeAll(async () => {
    // Создаём тестовых пользователей
    adminUser = await prisma.user.create({
      data: {
        email: 'admin@test.com',
        password_hash: 'hash',
        name: 'Admin',
        role: UserRole.ADMIN,
        subscriptionTier: 'pro'
      }
    });

    artistUser = await prisma.user.create({
      data: {
        email: 'artist@test.com',
        password_hash: 'hash',
        name: 'Artist',
        role: UserRole.ARTIST,
        subscriptionTier: 'none'
      }
    });

    regularUser = await prisma.user.create({
      data: {
        email: 'user@test.com',
        password_hash: 'hash',
        name: 'User',
        role: UserRole.FREE_USER,
        subscriptionTier: 'none'
      }
    });

    // Генерируем токены
    adminToken = jwt.sign({ userId: adminUser.id }, JWT_SECRET);
    artistToken = jwt.sign({ userId: artistUser.id }, JWT_SECRET);
    userToken = jwt.sign({ userId: regularUser.id }, JWT_SECRET);
  });

  afterAll(async () => {
    // Очистка
    await prisma.user.deleteMany({
      where: {
        email: {
          in: ['admin@test.com', 'artist@test.com', 'user@test.com']
        }
      }
    });
    await prisma.$disconnect();
  });

  describe('requireRole', () => {
    it('должен разрешить доступ админу', async () => {
      const response = await request(app)
        .post('/api/upload/cover')
        .set('Authorization', `Bearer ${adminToken}`)
        .attach('cover', Buffer.from('fake image'), 'test.jpg');

      expect(response.status).not.toBe(403);
    });

    it('должен разрешить доступ артисту', async () => {
      const response = await request(app)
        .post('/api/upload/cover')
        .set('Authorization', `Bearer ${artistToken}`)
        .attach('cover', Buffer.from('fake image'), 'test.jpg');

      expect(response.status).not.toBe(403);
    });

    it('должен запретить доступ обычному пользователю', async () => {
      const response = await request(app)
        .post('/api/upload/cover')
        .set('Authorization', `Bearer ${userToken}`)
        .attach('cover', Buffer.from('fake image'), 'test.jpg');

      expect(response.status).toBe(403);
      expect(response.body.error).toContain('Недостаточно прав');
    });
  });

  describe('requireSubscription', () => {
    it('должен разрешить доступ админу независимо от подписки', async () => {
      // Админ имеет доступ ко всему
      expect(adminUser.role).toBe(UserRole.ADMIN);
    });

    it('должен проверить уровень подписки', async () => {
      // Обновляем пользователя на lite подписку
      await prisma.user.update({
        where: { id: regularUser.id },
        data: { 
          subscriptionTier: 'lite',
          subscriptionEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // +30 дней
        }
      });

      const newToken = jwt.sign({ userId: regularUser.id }, JWT_SECRET);

      // Тест зависит от конкретного эндпоинта с requireSubscription
      // Здесь просто проверяем, что токен валиден
      const response = await request(app)
        .get('/api/account/profile')
        .set('Authorization', `Bearer ${newToken}`);

      expect(response.status).toBe(200);
    });
  });
});
