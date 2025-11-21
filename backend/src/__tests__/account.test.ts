/**
 * Тесты для Account Controller
 * Проверка получения и обновления профиля
 */

import request from 'supertest';
import app from '../app';
import { prisma } from './setup';

describe('Account Controller', () => {
  let token: string;
  let userId: string;

  beforeEach(async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'account@example.com',
        password: 'Test123!',
        name: 'Account User',
      });
    token = response.body.token;
    userId = response.body.user.id;
  });

  describe('GET /api/account/profile', () => {
    it('должен вернуть профиль пользователя с подпиской', async () => {
      const response = await request(app)
        .get('/api/account/profile')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('subscription');
      expect(response.body.user.email).toBe('account@example.com');
    });

    it('должен вернуть 401 без токена', async () => {
      const response = await request(app).get('/api/account/profile');

      expect(response.status).toBe(401);
    });
  });

  describe('PUT /api/account/profile', () => {
    it('должен обновить имя пользователя', async () => {
      const response = await request(app)
        .put('/api/account/profile')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Updated Name' });

      expect(response.status).toBe(200);
      expect(response.body.name).toBe('Updated Name');
    });

    it('должен обновить email пользователя', async () => {
      const response = await request(app)
        .put('/api/account/profile')
        .set('Authorization', `Bearer ${token}`)
        .send({ email: 'newemail@example.com' });

      expect(response.status).toBe(200);
      expect(response.body.email).toBe('newemail@example.com');
    });

    it('должен вернуть 400 при невалидных данных', async () => {
      const response = await request(app)
        .put('/api/account/profile')
        .set('Authorization', `Bearer ${token}`)
        .send({ email: 'invalid-email' });

      expect(response.status).toBe(400);
    });

    it('должен вернуть 401 без токена', async () => {
      const response = await request(app)
        .put('/api/account/profile')
        .send({ name: 'New Name' });

      expect(response.status).toBe(401);
    });
  });

  describe('PUT /api/account/password', () => {
    it('должен изменить пароль с правильным текущим паролем', async () => {
      const response = await request(app)
        .put('/api/account/password')
        .set('Authorization', `Bearer ${token}`)
        .send({
          currentPassword: 'Test123!',
          newPassword: 'NewTest123!',
          confirmPassword: 'NewTest123!',
        });

      expect(response.status).toBe(200);
      expect(response.body.message).toContain('Пароль успешно изменён');
    });

    it('должен вернуть 400 при неправильном текущем пароле', async () => {
      const response = await request(app)
        .put('/api/account/password')
        .set('Authorization', `Bearer ${token}`)
        .send({
          currentPassword: 'WrongPassword',
          newPassword: 'NewTest123!',
          confirmPassword: 'NewTest123!',
        });

      expect(response.status).toBe(400);
    });

    it('должен вернуть 400 при несовпадении паролей', async () => {
      const response = await request(app)
        .put('/api/account/password')
        .set('Authorization', `Bearer ${token}`)
        .send({
          currentPassword: 'Test123!',
          newPassword: 'NewTest123!',
          confirmPassword: 'DifferentPassword',
        });

      expect(response.status).toBe(400);
    });
  });

  describe('DELETE /api/account', () => {
    it('должен удалить аккаунт', async () => {
      const response = await request(app)
        .delete('/api/account')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toContain('Аккаунт удалён');

      // Проверяем, что пользователь действительно удалён
      const user = await prisma.user.findUnique({ where: { id: userId } });
      expect(user).toBeNull();
    });

    it('должен вернуть 401 без токена', async () => {
      const response = await request(app).delete('/api/account');

      expect(response.status).toBe(401);
    });
  });
});
