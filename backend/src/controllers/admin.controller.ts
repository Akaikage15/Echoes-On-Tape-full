import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { NotFoundError, ForbiddenError } from '../utils/errors';

const prisma = new PrismaClient();

export class AdminController {
  /**
   * Получение списка всех пользователей
   */
  async getAllUsers(req: Request, res: Response) {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        skip,
        take: limit,
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          created_at: true,
          subscriptionTier: true
        },
        orderBy: { created_at: 'desc' }
      }),
      prisma.user.count()
    ]);

    res.json({
      data: users,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  }

  /**
   * Получение статистики платформы
   */
  async getStats(req: Request, res: Response) {
    const [usersCount, artistsCount, releasesCount, activeSubs] = await Promise.all([
      prisma.user.count(),
      prisma.artist.count(),
      prisma.release.count(),
      prisma.user.count({ where: { subscriptionTier: { not: 'none' } } })
    ]);

    res.json({
      users: usersCount,
      artists: artistsCount,
      releases: releasesCount,
      activeSubscriptions: activeSubs
    });
  }

  /**
   * Бан пользователя (удаление)
   */
  async deleteUser(req: Request, res: Response) {
    const { id } = req.params;
    
    // Нельзя удалить самого себя или другого админа
    const targetUser = await prisma.user.findUnique({ where: { id } });
    if (!targetUser) throw new NotFoundError('User not found');
    if (targetUser.role === 'ADMIN') throw new ForbiddenError('Cannot delete admin');

    await prisma.user.delete({ where: { id } });
    res.json({ message: 'User deleted' });
  }
}

export const adminController = new AdminController();
