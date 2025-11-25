import { z } from 'zod';

/**
 * Схема валидации создания релиза
 * - title: от 1 до 200 символов
 * - artistId: UUID артиста
 * - releaseDate: валидная дата
 * - type: один из допустимых типов релиза
 * - coverUrl: опционально, валидный URL
 * - description: опционально, до 2000 символов
 */
export const createReleaseSchema = z.object({
  title: z.string().min(1, 'Название обязательно').max(200, 'Название слишком длинное'),
  artistId: z.string().uuid('Некорректный ID артиста'),
  releaseDate: z.string().datetime('Некорректная дата релиза'),
  type: z.enum(['ALBUM', 'EP', 'SINGLE', 'COMPILATION'], {
    message: 'Некорректный тип релиза',
  }),
  coverUrl: z.string().url('Некорректный URL обложки').optional(),
  description: z.string().max(2000, 'Описание слишком длинное').optional(),
});

/**
 * Схема валидации обновления релиза
 * Все поля опциональны
 */
export const updateReleaseSchema = createReleaseSchema.partial();

/**
 * Схема валидации параметров запроса релизов
 * - page: положительное число
 * - limit: от 1 до 100
 * - artistId: опционально, UUID
 * - type: опционально, тип релиза
 */
export const getReleaseQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  artistId: z.string().uuid().optional(),
  type: z.enum(['ALBUM', 'EP', 'SINGLE', 'COMPILATION']).optional(),
});

export type CreateReleaseDto = z.infer<typeof createReleaseSchema>;
export type UpdateReleaseDto = z.infer<typeof updateReleaseSchema>;
export type GetReleaseQueryDto = z.infer<typeof getReleaseQuerySchema>;
