import { z } from 'zod';

/**
 * Общие схемы валидации для переиспользования
 */

/**
 * Схема валидации UUID параметра
 * Используется для валидации :id в URL
 */
export const uuidParamSchema = z.object({
  id: z.string().uuid('Некорректный ID'),
});

/**
 * Схема валидации пагинации
 * - page: положительное число, по умолчанию 1
 * - limit: от 1 до 100, по умолчанию 20
 */
export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

/**
 * Схема валидации сортировки
 * - sortBy: поле для сортировки
 * - order: направление сортировки (asc/desc)
 */
export const sortSchema = z.object({
  sortBy: z.string().optional(),
  order: z.enum(['asc', 'desc']).default('desc'),
});

/**
 * Схема валидации поиска
 * - search: поисковый запрос (до 100 символов)
 */
export const searchSchema = z.object({
  search: z.string().max(100, 'Поисковый запрос слишком длинный').optional(),
});

/**
 * Комбинированная схема для списков с пагинацией, сортировкой и поиском
 */
export const listQuerySchema = paginationSchema.merge(sortSchema).merge(searchSchema);

export type UuidParamDto = z.infer<typeof uuidParamSchema>;
export type PaginationDto = z.infer<typeof paginationSchema>;
export type SortDto = z.infer<typeof sortSchema>;
export type SearchDto = z.infer<typeof searchSchema>;
export type ListQueryDto = z.infer<typeof listQuerySchema>;
