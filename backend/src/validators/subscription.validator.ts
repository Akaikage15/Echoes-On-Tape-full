import { z } from 'zod';

/**
 * Схема валидации покупки подписки
 * - type: тип подписки (BASIC или PREMIUM)
 * - paymentMethod: метод оплаты
 * - duration: длительность в месяцах (1, 3, 6, 12)
 */
export const purchaseSubscriptionSchema = z.object({
  type: z.enum(['BASIC', 'PREMIUM'], {
    message: 'Некорректный тип подписки',
  }),
  paymentMethod: z.enum(['CARD', 'PAYPAL', 'CRYPTO'], {
    message: 'Некорректный метод оплаты',
  }),
  duration: z.union([z.literal(1), z.literal(3), z.literal(6), z.literal(12)], {
    message: 'Некорректная длительность подписки',
  }),
});

/**
 * Схема валидации отмены подписки
 * - reason: опционально, причина отмены (до 500 символов)
 */
export const cancelSubscriptionSchema = z.object({
  reason: z.string().max(500, 'Причина слишком длинная').optional(),
});

export type PurchaseSubscriptionDto = z.infer<typeof purchaseSubscriptionSchema>;
export type CancelSubscriptionDto = z.infer<typeof cancelSubscriptionSchema>;
