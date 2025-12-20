import rateLimit from 'express-rate-limit';
import { TooManyRequestsError } from '../utils/errors';
import { logWarn } from '../utils/logger';

/**
 * Общий ограничитель запросов для API
 * 100 запросов за 15 минут
 */
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 100, // Лимит для каждого IP
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req, res, next, options) => {
    logWarn(`Rate limit exceeded for IP: ${req.ip}`);
    next(new TooManyRequestsError('Слишком много запросов, попробуйте позже'));
  },
});

/**
 * Строгий ограничитель для Auth эндпоинтов
 * 10 запросов за 15 минут (для предотвращения брутфорса)
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next, options) => {
    logWarn(`Auth rate limit exceeded for IP: ${req.ip}`);
    next(new TooManyRequestsError('Слишком много попыток входа, попробуйте позже'));
  },
});
