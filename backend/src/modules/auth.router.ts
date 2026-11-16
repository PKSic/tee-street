import { Router } from 'express';
import { db } from '../db/pool.js';
import { hashPassword, verifyPassword, generateRandomToken } from '../utils/crypto.js';
import { AppError, handleApiError } from '../utils/errors.js';
import { authMiddleware, type AuthenticatedRequest } from '../middleware/auth.js';

export const authRouter = Router();

// Регистрация нового покупателя
authRouter.post('/register', async (req, res) => {
  try {
    const { email, password, first_name, last_name, phone } = req.body;
    if (!email || !password || !first_name) {
      throw new AppError('Email, пароль и имя обязательны для заполнения', 400);
    }

    const store = db.getData();
    const normalizedEmail = String(email).trim().toLowerCase();

    if (store.users.some((u) => u.email.toLowerCase() === normalizedEmail)) {
      throw new AppError('Пользователь с таким email уже зарегистрирован', 409);
    }

    const password_hash = await hashPassword(password);
    const userId = `usr-${generateRandomToken(8)}`;
    const now = new Date().toISOString();

    const newUser = {
      id: userId,
      email: normalizedEmail,
      password_hash,
      first_name: String(first_name).trim(),
      last_name: String(last_name || '').trim(),
      phone: phone || null,
      role: 'user',
      status: 'active',
      preferred_locale: 'ru',
      theme: 'dark',
      created_at: now,
      updated_at: now,
    };

    store.users.push(newUser);
    db.saveData();

    // Создаем сессионный токен
    const token = `${newUser.id}:${generateRandomToken(16)}`;

    return res.status(201).json({
      message: 'Регистрация успешно завершена',
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        first_name: newUser.first_name,
        last_name: newUser.last_name,
        role: newUser.role,
        preferred_locale: newUser.preferred_locale,
        theme: newUser.theme,
      },
    });
  } catch (err) {
    handleApiError(res, err);
  }
});

// Авторизация
authRouter.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new AppError('Укажите email и пароль', 400);
    }

    const store = db.getData();
    const normalizedEmail = String(email).trim().toLowerCase();
    const user = store.users.find((u) => u.email.toLowerCase() === normalizedEmail);

    if (!user) {
      throw new AppError('Неверный email или пароль', 401);
    }

    const isValid = await verifyPassword(password, user.password_hash);
    if (!isValid) {
      throw new AppError('Неверный email или пароль', 401);
    }

    if (user.status !== 'active') {
      throw new AppError('Аккаунт заблокирован или ожидает подтверждения', 403);
    }

    const token = `${user.id}:${generateRandomToken(16)}`;

    return res.json({
      message: 'Успешная авторизация',
      token,
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        phone: user.phone,
        role: user.role,
        preferred_locale: user.preferred_locale,
        theme: user.theme,
      },
    });
  } catch (err) {
    handleApiError(res, err);
  }
});

// Получение текущего пользователя
authRouter.get('/me', authMiddleware(true), (req: AuthenticatedRequest, res) => {
  try {
    const store = db.getData();
    const user = store.users.find((u) => u.id === req.user?.id);
    if (!user) {
      throw new AppError('Пользователь не найден', 404);
    }

    return res.json({
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        phone: user.phone,
        role: user.role,
        preferred_locale: user.preferred_locale,
        theme: user.theme,
      },
    });
  } catch (err) {
    handleApiError(res, err);
  }
});

// Обновление профиля
authRouter.patch('/profile', authMiddleware(true), (req: AuthenticatedRequest, res) => {
  try {
    const { first_name, last_name, phone, preferred_locale, theme } = req.body;
    const store = db.getData();
    const user = store.users.find((u) => u.id === req.user?.id);
    if (!user) {
      throw new AppError('Пользователь не найден', 404);
    }

    if (first_name !== undefined) user.first_name = String(first_name).trim();
    if (last_name !== undefined) user.last_name = String(last_name).trim();
    if (phone !== undefined) user.phone = String(phone).trim();
    if (preferred_locale && ['ru', 'en', 'zh-CN'].includes(preferred_locale)) {
      user.preferred_locale = preferred_locale;
    }
    if (theme && ['light', 'dark', 'system'].includes(theme)) {
      user.theme = theme;
    }

    user.updated_at = new Date().toISOString();
    db.saveData();

    return res.json({
      message: 'Профиль обновлен',
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        phone: user.phone,
        role: user.role,
        preferred_locale: user.preferred_locale,
        theme: user.theme,
      },
    });
  } catch (err) {
    handleApiError(res, err);
  }
});
