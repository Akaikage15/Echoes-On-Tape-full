import { z } from 'zod';

/**
 * Схема валидации регистрации пользователя
 * - email: валидный email
 * - password: минимум 8 символов, содержит буквы и цифры
 * - name: от 2 до 100 символов
 */
export const registerSchema = z.object({
  email: z.string().email('Некорректный email'),
  password: z
    .string()
    .min(8, 'Пароль должен содержать минимум 8 символов')
    .regex(/^(?=.*[a-zA-Z])(?=.*\d)/, 'Пароль должен содержать буквы и цифры'),
  name: z.string().min(2, 'Имя должно содержать минимум 2 символа').max(100, 'Имя слишком длинное'),
});

/**
 * Схема валидации входа
 * - email: валидный email
 * - password: не пустой
 */
export const loginSchema = z.object({
  email: z.string().email('Некорректный email'),
  password: z.string().min(1, 'Пароль обязателен'),
});

export type RegisterDto = z.infer<typeof registerSchema>;
export type LoginDto = z.infer<typeof loginSchema>;
