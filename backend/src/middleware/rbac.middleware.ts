/**
 * RBAC Middleware - проверка ролей и прав доступа
 * 
 * Функции:
 * - requireRole: проверяет, что у пользователя есть одна из требуемых ролей
 * - requireSubscription: проверяет уровень подписки
 * - requireOwnership: проверяет, что пользователь владеет ресурсом
 */

import { Request, Response, NextFunction } from 'express';
import { UserRole } from '@prisma/client';

// Расширяем Request для типизации user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: UserRole;
        subscriptionTier: string;
      };
    }
  }
}

/**
 * Проверка роли пользователя
 * @param allowedRoles - массив разрешённых ролей
 */
export const requireRole = (allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Требуется аутентификация' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'Недостаточно прав доступа',
        required: allowedRoles,
        current: req.user.role
      });
    }

    next();
  };
};

/**
 * Проверка уровня подписки
 * @param requiredTier - минимальный требуемый уровень (none, lite, fan, pro)
 */
export const requireSubscription = (requiredTier: string) => {
  const tierLevels: Record<string, number> = {
    none: 0,
    lite: 1,
    fan: 2,
    pro: 3
  };

  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Требуется аутентификация' });
    }

    // Админы и артисты имеют полный доступ
    if (req.user.role === UserRole.ADMIN || req.user.role === UserRole.ARTIST) {
      return next();
    }

    const userLevel = tierLevels[req.user.subscriptionTier] || 0;
    const requiredLevel = tierLevels[requiredTier] || 0;

    if (userLevel < requiredLevel) {
      return res.status(403).json({ 
        error: 'Требуется более высокий уровень подписки',
        required: requiredTier,
        current: req.user.subscriptionTier
      });
    }

    // Проверка срока действия подписки
    if (req.user.subscriptionTier !== 'none') {
      const now = new Date();
      const endDate = req.user.subscriptionEndDate ? new Date(req.user.subscriptionEndDate) : null;
      
      if (endDate && endDate < now) {
        return res.status(403).json({ 
          error: 'Подписка истекла',
          expiredAt: endDate
        });
      }
    }

    next();
  };
};

/**
 * Проверка владения ресурсом
 * @param resourceIdParam - имя параметра с ID ресурса
 * @param getUserIdFromResource - функция получения userId из ресурса
 */
export const requireOwnership = (
  resourceIdParam: string,
  getUserIdFromResource: (resourceId: string) => Promise<string | null>
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Требуется аутентификация' });
    }

    // Админы могут всё
    if (req.user.role === UserRole.ADMIN) {
      return next();
    }

    const resourceId = req.params[resourceIdParam];
    if (!resourceId) {
      return res.status(400).json({ error: 'ID ресурса не указан' });
    }

    try {
      const ownerId = await getUserIdFromResource(resourceId);
      
      if (!ownerId) {
        return res.status(404).json({ error: 'Ресурс не найден' });
      }

      if (ownerId !== req.user.id) {
        return res.status(403).json({ error: 'Доступ запрещён: вы не владелец ресурса' });
      }

      next();
    } catch (error) {
      console.error('Ошибка проверки владения:', error);
      res.status(500).json({ error: 'Ошибка проверки прав доступа' });
    }
  };
};

/**
 * Проверка, что пользователь - админ
 */
export const requireAdmin = requireRole([UserRole.ADMIN]);

/**
 * Проверка, что пользователь - артист или админ
 */
export const requireArtist = requireRole([UserRole.ADMIN, UserRole.ARTIST]);
