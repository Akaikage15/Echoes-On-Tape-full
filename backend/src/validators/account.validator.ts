import { z } from 'zod';

/**
 * Схема валидации обновления профиля
 * - name: опционально, от 2 до 100 символов
 * - email: опционально, валидный email
 * - bio: опционально, до 500 символов
 * - avatar: опционально, валидный URL
 * - socialLinks: опционально, объект с URL социальных сетей
 */
export const updateProfileSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  email: z.string().email('Некорректный email').optional(),
  bio: z.string().max(500, 'Биография слишком длинная').optional(),
  avatar: z.string().url('Некорректный URL аватара').optional(),
  socialLinks: z
    .record(z.string())
    .optional(),
});

/**
 * Схема валидации смены пароля
 * - currentPassword: минимум 6 символов
 * - newPassword: минимум 8 символов, содержит буквы, цифры и спецсимволы
 * - confirmPassword: должен совпадать с newPassword
 */
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(6, 'Текущий пароль слишком короткий'),
    newPassword: z
      .string()
      .min(8, 'Новый пароль должен содержать минимум 8 символов')
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Пароль должен содержать строчные, заглавные буквы и цифры'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Пароли не совпадают',
    path: ['confirmPassword'],
  });

export type UpdateProfileDto = z.infer<typeof updateProfileSchema>;
export type ChangePasswordDto = z.infer<typeof changePasswordSchema>;
