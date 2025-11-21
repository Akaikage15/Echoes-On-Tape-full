import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const ACCESS_TOKEN_EXPIRY = '15m'; // 15 минут
const REFRESH_TOKEN_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7 дней в миллисекундах

/**
 * Генерирует access token (JWT)
 * Срок действия: 15 минут
 */
export const generateAccessToken = (userId: string, email: string): string => {
  return jwt.sign({ userId, email }, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
};

/**
 * Генерирует refresh token (случайная строка)
 * Сохраняет в БД с датой истечения
 * Срок действия: 7 дней
 */
export const generateRefreshToken = async (userId: string): Promise<string> => {
  const token = crypto.randomBytes(64).toString('hex');
  const expiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRY);

  await prisma.refreshToken.create({
    data: {
      user_id: userId,
      token,
      expires_at: expiresAt,
    },
  });

  return token;
};

/**
 * Проверяет валидность refresh token
 * Возвращает userId, если токен валиден
 */
export const verifyRefreshToken = async (token: string): Promise<string | null> => {
  const refreshToken = await prisma.refreshToken.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!refreshToken) {
    return null;
  }

  // Проверка срока действия
  if (new Date() > refreshToken.expires_at) {
    await prisma.refreshToken.delete({ where: { id: refreshToken.id } });
    return null;
  }

  return refreshToken.user_id;
};

/**
 * Удаляет refresh token (logout)
 */
export const revokeRefreshToken = async (token: string): Promise<void> => {
  await prisma.refreshToken.deleteMany({
    where: { token },
  });
};

/**
 * Удаляет все refresh токены пользователя (logout from all devices)
 */
export const revokeAllUserTokens = async (userId: string): Promise<void> => {
  await prisma.refreshToken.deleteMany({
    where: { user_id: userId },
  });
};

/**
 * Очищает истёкшие токены (для cron-задачи)
 */
export const cleanupExpiredTokens = async (): Promise<void> => {
  await prisma.refreshToken.deleteMany({
    where: {
      expires_at: {
        lt: new Date(),
      },
    },
  });
};
