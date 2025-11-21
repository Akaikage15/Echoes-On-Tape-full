import { z } from 'zod';

/**
 * Схема валидации создания артиста
 * - name: от 1 до 100 символов
 * - bio: опционально, до 2000 символов
 * - avatarUrl: опционально, валидный URL
 * - genres: опционально, массив жанров
 * - socialLinks: опционально, объект с URL социальных сетей
 */
export const createArtistSchema = z.object({
  name: z.string().min(1, 'Имя обязательно').max(100, 'Имя слишком длинное'),
  bio: z.string().max(2000, 'Биография слишком длинная').optional(),
  avatarUrl: z.string().url('Некорректный URL аватара').optional(),
  genres: z.array(z.string().max(50)).max(10, 'Максимум 10 жанров').optional(),
  socialLinks: z
    .object({
      instagram: z.string().url('Некорректный URL Instagram').optional(),
      twitter: z.string().url('Некорректный URL Twitter').optional(),
      spotify: z.string().url('Некорректный URL Spotify').optional(),
      soundcloud: z.string().url('Некорректный URL SoundCloud').optional(),
    })
    .optional(),
});

/**
 * Схема валидации обновления артиста
 * Все поля опциональны
 */
export const updateArtistSchema = createArtistSchema.partial();

/**
 * Схема валидации параметров запроса артистов
 * - page: положительное число
 * - limit: от 1 до 50
 * - genre: опционально, строка
 * - search: опционально, поисковый запрос
 */
export const getArtistQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
  genre: z.string().optional(),
  search: z.string().max(100).optional(),
});

export type CreateArtistDto = z.infer<typeof createArtistSchema>;
export type UpdateArtistDto = z.infer<typeof updateArtistSchema>;
export type GetArtistQueryDto = z.infer<typeof getArtistQuerySchema>;
