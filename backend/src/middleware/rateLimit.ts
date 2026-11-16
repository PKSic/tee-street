import type { Request, Response, NextFunction } from 'express';

const buckets = new Map<string, { count: number; resetAt: number }>();

// Периодическая очистка устаревших корзин
setInterval(() => {
  const now = Date.now();
  for (const [key, val] of buckets.entries()) {
    if (now > val.resetAt) buckets.delete(key);
  }
}, 5 * 60 * 1000).unref();

export function rateLimit(maxRequests: number = 120, windowMs: number = 60 * 1000) {
  return (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip || req.socket.remoteAddress || '127.0.0.1';
    const key = `${req.path}:${ip}`;
    const now = Date.now();
    const bucket = buckets.get(key);

    if (!bucket || now > bucket.resetAt) {
      buckets.set(key, { count: 1, resetAt: now + windowMs });
      return next();
    }

    if (bucket.count >= maxRequests) {
      return res.status(429).json({
        error: 'Слишком много запросов. Пожалуйста, подождите минуту.',
      });
    }

    bucket.count += 1;
    next();
  };
}
