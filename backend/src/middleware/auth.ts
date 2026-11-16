import type { Request, Response, NextFunction } from 'express';
import { db } from '../db/pool.js';
import { AppError } from '../utils/errors.js';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
    first_name: string;
    last_name: string;
  };
}

export function authMiddleware(required: boolean = true) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    let token = '';

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    } else if (req.query.token) {
      token = String(req.query.token);
    }

    if (!token) {
      if (required) {
        return res.status(401).json({ error: 'Требуется авторизация' });
      }
      return next();
    }

    const store = db.getData();
    // Ищем пользователя по токену сессии
    // В упрощенной схеме или токене jwt/session token
    let user: any = null;

    if (token.startsWith('usr-') || token.startsWith('demo-') || token.includes('@')) {
      // Прямой id/email или токен сессии
      user = store.users.find((u) => u.id === token || u.email === token);
    } else {
      // Ищем в списке сессий или декодируем токен
      const parts = Buffer.from(token, 'base64').toString('utf-8').split(':');
      if (parts.length >= 2) {
        user = store.users.find((u) => u.id === parts[0]);
      } else {
        user = store.users.find((u) => u.id === token);
      }
    }

    if (!user) {
      if (required) {
        return res.status(401).json({ error: 'Недействительный токен сессии' });
      }
      return next();
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      first_name: user.first_name,
      last_name: user.last_name,
    };

    next();
  };
}

/**
 * Проверка RBAC ролей (admin, manager, content_manager)
 */
export function requireRole(allowedRoles: string[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Требуется авторизация' });
    }

    if (req.user.role === 'admin') {
      return next(); // Администратор имеет полный доступ
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: `Недостаточно прав. Требуется одна из ролей: ${allowedRoles.join(', ')}`,
      });
    }

    next();
  };
}
