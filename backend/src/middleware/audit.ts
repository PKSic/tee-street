import type { Request, Response, NextFunction } from 'express';
import { db } from '../db/pool.js';
import type { AuthenticatedRequest } from './auth.js';

export function logAudit(action: string, entityType: string, getEntityId?: (req: Request) => string) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const originalJson = res.json.bind(res);

    res.json = function (body: any) {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        try {
          const store = db.getData();
          store.audit_logs.unshift({
            id: store.audit_logs.length + 1,
            actor_id: req.user?.id || null,
            actor_email: req.user?.email || 'anonymous',
            action,
            entity_type: entityType,
            entity_id: getEntityId ? getEntityId(req) : req.params.id || null,
            before_data: null,
            after_data: typeof body === 'object' ? JSON.stringify(body).slice(0, 500) : null,
            ip_address: req.ip || req.socket.remoteAddress || null,
            user_agent: req.headers['user-agent'] || null,
            created_at: new Date().toISOString(),
          });
          db.saveData();
        } catch (e) {
          console.error('Audit logging error:', e);
        }
      }
      return originalJson(body);
    };

    next();
  };
}
