import request from 'supertest';
import app from '../app';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { generateRefreshToken, verifyRefreshToken, revokeRefreshToken } from '../services/token.service';

const prisma = new PrismaClient();

describe('Refresh Token Flow', () => {
  let userId: string;
  let refreshToken: string;

  beforeAll(async () => {
    // Создаём тестового пользователя
    const hashedPassword = await bcrypt.hash('testpassword', 10);
    const user = await prisma.user.create({
      data: {
        email: 'refresh-test@example.com',
        password_hash: hashedPassword,
        name: 'Refresh Test User',
      },
    });
    userId = user.id;
  });

  afterAll(async () => {
    // Очистка
    await prisma.refreshToken.deleteMany({
      where: { user_id: userId },
    });
    await prisma.user.deleteMany({
      where: { email: 'refresh-test@example.com' },
    });
    await prisma.$disconnect();
  });

  describe('POST /api/auth/login', () => {
    it('должен вернуть access и refresh токены при логине', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'refresh-test@example.com',
          password: 'testpassword',
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('refreshToken');

      refreshToken = response.body.refreshToken;
    });
  });

  describe('POST /api/auth/refresh', () => {
    it('должен обновить access token с помощью refresh token', async () => {
      const response = await request(app)
        .post('/api/auth/refresh')
        .send({
          refreshToken,
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('accessToken');
      expect(response.body.message).toContain('Токен обновлён');
    });

    it('должен вернуть 401 при отсутствии refresh token', async () => {
      const response = await request(app).post('/api/auth/refresh').send({});

      expect(response.status).toBe(401);
      expect(response.body.message).toContain('Refresh token отсутствует');
    });

    it('должен вернуть 401 при невалидном refresh token', async () => {
      const response = await request(app)
        .post('/api/auth/refresh')
        .send({
          refreshToken: 'invalid-token-12345',
        });

      expect(response.status).toBe(401);
      expect(response.body.message).toContain('Невалидный или истёкший refresh token');
    });
  });

  describe('POST /api/auth/logout', () => {
    it('должен удалить refresh token при выходе', async () => {
      const response = await request(app)
        .post('/api/auth/logout')
        .send({
          refreshToken,
        });

      expect(response.status).toBe(200);
      expect(response.body.message).toContain('Выход выполнен успешно');

      // Проверяем, что токен больше не работает
      const refreshResponse = await request(app)
        .post('/api/auth/refresh')
        .send({
          refreshToken,
        });

      expect(refreshResponse.status).toBe(401);
    });
  });

  describe('Token Service', () => {
    it('должен генерировать и верифицировать refresh token', async () => {
      const token = await generateRefreshToken(userId);
      expect(token).toBeTruthy();
      expect(typeof token).toBe('string');

      const verifiedUserId = await verifyRefreshToken(token);
      expect(verifiedUserId).toBe(userId);
    });

    it('должен отзывать refresh token', async () => {
      const token = await generateRefreshToken(userId);
      await revokeRefreshToken(token);

      const verifiedUserId = await verifyRefreshToken(token);
      expect(verifiedUserId).toBeNull();
    });

    it('должен вернуть null для истёкшего токена', async () => {
      // Создаём токен с истёкшей датой
      const expiredToken = await prisma.refreshToken.create({
        data: {
          user_id: userId,
          token: 'expired-token-test',
          expires_at: new Date(Date.now() - 1000), // Истёк 1 секунду назад
        },
      });

      const verifiedUserId = await verifyRefreshToken(expiredToken.token);
      expect(verifiedUserId).toBeNull();

      // Проверяем, что истёкший токен был удалён
      const deletedToken = await prisma.refreshToken.findUnique({
        where: { token: expiredToken.token },
      });
      expect(deletedToken).toBeNull();
    });
  });
});
