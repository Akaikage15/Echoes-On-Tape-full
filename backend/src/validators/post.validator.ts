import { z } from 'zod';

/**
 * Схема валидации создания поста
 * - title: от 1 до 200 символов
 * - content: от 1 до 10000 символов
 * - authorId: UUID автора
 * - coverImage: опционально, валидный URL
 * - tags: опционально, массив строк
 */
export const createPostSchema = z.object({
  title: z.string().min(1, 'Заголовок обязателен').max(200, 'Заголовок слишком длинный'),
  content: z.string().min(1, 'Контент обязателен').max(10000, 'Контент слишком длинный'),
  authorId: z.string().uuid('Некорректный ID автора'),
  coverImage: z.string().url('Некорректный URL изображения').optional(),
  tags: z.array(z.string().max(50)).max(10, 'Максимум 10 тегов').optional(),
});

/**
 * Схема валидации обновления поста
 * Все поля опциональны
 */
export const updatePostSchema = createPostSchema.partial();

/**
 * Схема валидации параметров запроса постов
 * - page: положительное число
 * - limit: от 1 до 50
 * - authorId: опционально, UUID
 * - tag: опционально, строка
 */
export const getPostQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
  authorId: z.string().uuid().optional(),
  tag: z.string().optional(),
});

export type CreatePostDto = z.infer<typeof createPostSchema>;
export type UpdatePostDto = z.infer<typeof updatePostSchema>;
export type GetPostQueryDto = z.infer<typeof getPostQuerySchema>;
