import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { UpdateProfileDto, ChangePasswordDto } from '../validators/account.validator';
import { AuthRequest } from '../middleware/auth.middleware';

const prisma = new PrismaClient();

/**
 * Получить данные профиля текущего пользователя
 * Возвращает: user (без password_hash), subscription
 */
export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Не авторизован' });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        avatar_url: true,
        bio: true,
        social_links: true,
        subscriptionTier: true,
        subscriptionEndDate: true,
        created_at: true,
        updated_at: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    res.json({
      user,
      subscription: {
        type: user.subscriptionTier,
        status: user.subscriptionEndDate && new Date(user.subscriptionEndDate) > new Date() ? 'ACTIVE' : 'EXPIRED',
        expiresAt: user.subscriptionEndDate,
      },
    });
  } catch (error) {
    console.error('Ошибка получения профиля:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

/**
 * Обновить профиль пользователя
 * Принимает: name, email, bio, avatar, socialLinks
 * Возвращает: обновлённые данные пользователя
 */
export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const updates: UpdateProfileDto = req.body;

    console.log('updateProfile called:', { userId, updates });

    if (!userId) {
      return res.status(401).json({ error: 'Не авторизован' });
    }

    // Проверка уникальности email, если он меняется
    if (updates.email) {
      const existingUser = await prisma.user.findFirst({
        where: {
          email: updates.email,
          NOT: { id: userId },
        },
      });

      if (existingUser) {
        return res.status(400).json({ error: 'Email уже используется' });
      }
    }

    console.log('Updating user with data:', {
      name: updates.name,
      email: updates.email,
      bio: updates.bio,
      social_links: updates.socialLinks,
    });

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name: updates.name,
        email: updates.email,
        bio: updates.bio,
        avatar_url: updates.avatar,
        social_links: updates.socialLinks,
      },
      select: {
        id: true,
        email: true,
        name: true,
        avatar_url: true,
        bio: true,
        social_links: true,
        subscriptionTier: true,
        subscriptionEndDate: true,
        updated_at: true,
      },
    });

    res.json(updatedUser);
  } catch (error) {
    console.error('Ошибка обновления профиля:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

/**
 * Изменить пароль пользователя
 * Принимает: currentPassword, newPassword, confirmPassword
 * Проверяет текущий пароль, хеширует новый
 */
export const changePassword = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { currentPassword, newPassword }: ChangePasswordDto = req.body;

    if (!userId) {
      return res.status(401).json({ error: 'Не авторизован' });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    // Проверка текущего пароля
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Неверный текущий пароль' });
    }

    // Хеширование нового пароля
    const newPasswordHash = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: userId },
      data: { password_hash: newPasswordHash },
    });

    res.json({ message: 'Пароль успешно изменён' });
  } catch (error) {
    console.error('Ошибка смены пароля:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

/**
 * Удалить аккаунт пользователя (soft delete)
 * Удаляет все связанные данные через каскадное удаление
 */
export const deleteAccount = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Не авторизован' });
    }

    await prisma.user.delete({
      where: { id: userId },
    });

    res.json({ message: 'Аккаунт успешно удалён' });
  } catch (error) {
    console.error('Ошибка удаления аккаунта:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};
