import type { Response } from 'express';

export class AppError extends Error {
  public statusCode: number;
  public details?: any;

  constructor(message: string, statusCode: number = 400, details?: any) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export function handleApiError(res: Response, error: unknown) {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      error: error.message,
      details: error.details,
    });
  }

  const err = error as Error;
  console.error('[API Error]:', err?.stack || err?.message || error);
  return res.status(500).json({
    error: 'Внутренняя ошибка сервера. Пожалуйста, повторите попытку позже.',
  });
}
