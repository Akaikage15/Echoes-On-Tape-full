/**
 * Тесты для auth валидаторов
 * Проверяют корректность схем валидации
 */

import { registerSchema, loginSchema } from '../auth.validator';

describe('Auth Validators', () => {
  describe('registerSchema', () => {
    it('должен валидировать корректные данные', () => {
      const validData = {
        email: 'test@example.com',
        password: 'Password123',
        name: 'Test User',
      };

      const result = registerSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('должен отклонять некорректный email', () => {
      const invalidData = {
        email: 'invalid-email',
        password: 'Password123',
        name: 'Test User',
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('должен отклонять короткий пароль', () => {
      const invalidData = {
        email: 'test@example.com',
        password: 'Pass1',
        name: 'Test User',
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('должен отклонять пароль без цифр', () => {
      const invalidData = {
        email: 'test@example.com',
        password: 'PasswordOnly',
        name: 'Test User',
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('должен отклонять короткое имя', () => {
      const invalidData = {
        email: 'test@example.com',
        password: 'Password123',
        name: 'T',
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('loginSchema', () => {
    it('должен валидировать корректные данные', () => {
      const validData = {
        email: 'test@example.com',
        password: 'anypassword',
      };

      const result = loginSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('должен отклонять некорректный email', () => {
      const invalidData = {
        email: 'not-an-email',
        password: 'anypassword',
      };

      const result = loginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('должен отклонять пустой пароль', () => {
      const invalidData = {
        email: 'test@example.com',
        password: '',
      };

      const result = loginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });
});
