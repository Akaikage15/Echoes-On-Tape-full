import { z } from 'zod';

/**
 * Схема валидации покупки подписки
 * - tier: тип подписки (lite, fan, pro)
 */
export const purchaseSubscriptionSchema = z.object({
  tier: z.enum(['lite', 'fan', 'pro'], {
    message: 'Некорректный тип подписки. Доступны: lite, fan, pro',
  }),
});

/**
 * Схема валидации отмены подписки
 */
export const cancelSubscriptionSchema = z.object({
  reason: z.string().max(500, 'Причина слишком длинная').optional(),
});

export type PurchaseSubscriptionDto = z.infer<typeof purchaseSubscriptionSchema>;
export type CancelSubscriptionDto = z.infer<typeof cancelSubscriptionSchema>;
