import request from 'supertest';
import app from '../app';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

describe('Account Controller', () => {
  let authToken: string;
  let userId: string;

  beforeAll(async () => {
    // Создаём тестового пользователя
    const hashedPassword = await bcrypt.hash('testpassword123', 10);
    const user = await prisma.user.create({
      data: {
        email: 'account-test@example.com',
        password_hash: hashedPassword,
        name: 'Test User',
      },
    });
    userId = user.id;

    // Логинимся для получения токена
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'account-test@example.com',
        password: 'testpassword123',
      });

    authToken = loginResponse.body.accessToken;
  });

  afterAll(async () => {
    // Очистка тестовых данных
    await prisma.user.deleteMany({
      where: { email: 'account-test@example.com' },
    });
    await prisma.$disconnect();
  });

  describe('GET /api/account/profile', () => {
    it('должен вернуть профиль пользователя с подпиской', async () => {
      const response = await request(app)
        .get('/api/account/profile')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('subscription');
      expect(response.body.user.email).toBe('account-test@example.com');
    });

    it('должен вернуть 401 без токена', async () => {
      const response = await request(app).get('/api/account/profile');

      expect(response.status).toBe(401);
    });
  });

  describe('PUT /api/account/profile', () => {
    it('должен обновить профиль пользователя', async () => {
      const response = await request(app)
        .put('/api/account/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Updated Name',
          bio: 'New bio',
        });

      expect(response.status).toBe(200);
      expect(response.body.name).toBe('Updated Name');
      expect(response.body.bio).toBe('New bio');
    });

    it('должен вернуть ошибку при попытке использовать занятый email', async () => {
      // Создаём другого пользователя
      await prisma.user.create({
        data: {
          email: 'another@example.com',
          password_hash: await bcrypt.hash('password', 10),
          name: 'Another User',
        },
      });

      const response = await request(app)
        .put('/api/account/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          email: 'another@example.com',
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Email уже используется');

      // Очистка
      await prisma.user.deleteMany({
        where: { email: 'another@example.com' },
      });
    });

    it('должен вернуть ошибку валидации при некорректных данных', async () => {
      const response = await request(app)
        .put('/api/account/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          email: 'invalid-email',
        });

      expect(response.status).toBe(400);
    });
  });

  describe('PUT /api/account/password', () => {
    it('должен изменить пароль пользователя', async () => {
      const response = await request(app)
        .put('/api/account/password')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          currentPassword: 'testpassword123',
          newPassword: 'NewPassword123',
          confirmPassword: 'NewPassword123',
        });

      expect(response.status).toBe(200);
      expect(response.body.message).toContain('Пароль успешно изменён');

      // Проверяем, что новый пароль работает
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'account-test@example.com',
          password: 'NewPassword123',
        });

      expect(loginResponse.status).toBe(200);

      // Возвращаем старый пароль для других тестов
      await prisma.user.update({
        where: { id: userId },
        data: { password_hash: await bcrypt.hash('testpassword123', 10) },
      });
    });

    it('должен вернуть ошибку при неверном текущем пароле', async () => {
      const response = await request(app)
        .put('/api/account/password')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          currentPassword: 'wrongpassword',
          newPassword: 'NewPassword123',
          confirmPassword: 'NewPassword123',
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Неверный текущий пароль');
    });

    it('должен вернуть ошибку валидации при несовпадении паролей', async () => {
      const response = await request(app)
        .put('/api/account/password')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          currentPassword: 'testpassword123',
          newPassword: 'NewPassword123',
          confirmPassword: 'DifferentPassword123',
        });

      expect(response.status).toBe(400);
    });
  });

  describe('DELETE /api/account', () => {
    it('должен удалить аккаунт пользователя', async () => {
      // Создаём отдельного пользователя для удаления
      const hashedPassword = await bcrypt.hash('deletetest', 10);
      const userToDelete = await prisma.user.create({
        data: {
          email: 'delete-test@example.com',
          password_hash: hashedPassword,
          name: 'Delete Test',
        },
      });

      // Логинимся
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'delete-test@example.com',
          password: 'deletetest',
        });

      const deleteToken = loginResponse.body.accessToken;

      // Удаляем аккаунт
      const response = await request(app)
        .delete('/api/account')
        .set('Authorization', `Bearer ${deleteToken}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toContain('Аккаунт успешно удалён');

      // Проверяем, что пользователь действительно удалён
      const deletedUser = await prisma.user.findUnique({
        where: { id: userToDelete.id },
      });

      expect(deletedUser).toBeNull();
    });
  });
});
