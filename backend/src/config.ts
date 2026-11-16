import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const CONFIG = {
  PORT: Number(process.env.PORT || 3001),
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL: process.env.DATABASE_URL || '',
  JWT_SECRET: process.env.JWT_SECRET || 'tshirt_store_dev_super_secret_jwt_key_2026',
  WEBHOOK_SECRET: process.env.PAYMENT_WEBHOOK_SECRET || 'tshirt_store_payment_hmac_secret_2026',
  DATA_DIR: path.resolve(__dirname, '../../data'),
  STORE_FILE: path.resolve(__dirname, '../../data/tshirt-store.json'),
  DEFAULT_LOCALE: 'ru',
  SUPPORTED_LOCALES: ['ru', 'en', 'zh-CN'] as const,
  RESERVE_TIMEOUT_MINUTES: 30,
  FREE_SHIPPING_THRESHOLD: 5000,
  CURRENCY: 'RUB',
  CURRENCY_SYMBOL: '₽',
};
