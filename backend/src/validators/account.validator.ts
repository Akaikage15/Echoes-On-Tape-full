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
    .object({
      instagram: z.string().url('Некорректный URL Instagram').or(z.literal('')).optional(),
      vk: z.string().url('Некорректный URL ВКонтакте').or(z.literal('')).optional(),
      telegram: z.string().url('Некорректный URL Telegram').or(z.literal('')).optional(),
      discord: z.string().url('Некорректный URL Discord').or(z.literal('')).optional(),
      tiktok: z.string().url('Некорректный URL TikTok').or(z.literal('')).optional(),
      youtube: z.string().url('Некорректный URL YouTube').or(z.literal('')).optional(),
      spotify: z.string().url('Некорректный URL Spotify').or(z.literal('')).optional(),
      yandex_music: z.string().url('Некорректный URL Яндекс Музыка').or(z.literal('')).optional(),
      bandlink: z.string().url('Некорректный URL Band.link').or(z.literal('')).optional(),
    })
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
