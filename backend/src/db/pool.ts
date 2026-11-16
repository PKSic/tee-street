import fs from 'node:fs';
import path from 'node:path';
import pg from 'pg';
import { CONFIG } from '../config.js';
import { INITIAL_SEED_DATA, type LocalStoreData } from './seed-data.js';

let pgPool: pg.Pool | null = null;
let isPgConnected = false;

// Инициализация файлового хранилища
if (!fs.existsSync(CONFIG.DATA_DIR)) {
  fs.mkdirSync(CONFIG.DATA_DIR, { recursive: true });
}

let storeData: LocalStoreData = { ...INITIAL_SEED_DATA };

if (fs.existsSync(CONFIG.STORE_FILE)) {
  try {
    const raw = fs.readFileSync(CONFIG.STORE_FILE, 'utf-8');
    storeData = JSON.parse(raw);
    // Дополняем отсутствующие поля дефолтными
    storeData = { ...INITIAL_SEED_DATA, ...storeData };
  } catch (err) {
    console.warn('⚠️ Ошибка чтения файла storeData, используются seed данные:', err);
    saveStore();
  }
} else {
  saveStore();
}

function saveStore() {
  try {
    fs.writeFileSync(CONFIG.STORE_FILE, JSON.stringify(storeData, null, 2), 'utf-8');
  } catch (err) {
    console.error('❌ Ошибка сохранения storeData:', err);
  }
}

// Попытка подключения к PostgreSQL
async function initPg() {
  if (!CONFIG.DATABASE_URL) {
    console.log('ℹ️ DATABASE_URL не задана — используется быстрый локальный Dual-Engine Store');
    return;
  }

  try {
    pgPool = new pg.Pool({
      connectionString: CONFIG.DATABASE_URL,
      ssl: CONFIG.DATABASE_URL.includes('sslmode=require') ? { rejectUnauthorized: false } : undefined,
      connectionTimeoutMillis: 5000,
    });

    const res = await pgPool.query('SELECT 1');
    if (res) {
      isPgConnected = true;
      console.log('✅ Успешное подключение к PostgreSQL 16!');
    }
  } catch (err: any) {
    isPgConnected = false;
    console.warn('ℹ️ PostgreSQL недоступен (' + err.message + ') — продолжение работы с локальным JSON-хранилищем');
  }
}

initPg();

export const db = {
  isPg: () => isPgConnected,
  getPool: () => pgPool,
  getData: (): LocalStoreData => storeData,
  saveData: () => saveStore(),

  // Транзакционное резервирование складских позиций
  atomicReserve: async (
    items: Array<{ variant_id: string; quantity: number }>,
    orderId: string,
    actorId?: string
  ): Promise<{ success: boolean; error?: string }> => {
    // 1. Проверяем доступность всех позиций
    for (const item of items) {
      const inv = storeData.inventory[item.variant_id];
      if (!inv) {
        return { success: false, error: `Вариант товара ${item.variant_id} не найден на складе` };
      }
      const available = inv.on_hand - inv.reserved;
      if (available < item.quantity) {
        return {
          success: false,
          error: `Недостаточно остатка на складе. Доступно: ${available} шт., запрошено: ${item.quantity} шт.`,
        };
      }
    }

    // 2. Атомарно резервируем
    const now = new Date().toISOString();
    for (const item of items) {
      const inv = storeData.inventory[item.variant_id];
      inv.reserved += item.quantity;
      inv.updated_at = now;

      storeData.inventory_movements.push({
        id: storeData.inventory_movements.length + 1,
        variant_id: item.variant_id,
        movement_type: 'reserve',
        quantity: item.quantity,
        reference_type: 'order',
        reference_id: orderId,
        reason: 'Резерв при оформлении заказа',
        created_by: actorId || null,
        created_at: now,
      });
    }

    saveStore();
    return { success: true };
  },

  // Списание зарезервированного товара при успешной оплате
  atomicCommit: async (
    items: Array<{ variant_id: string; quantity: number }>,
    orderId: string,
    actorId?: string
  ): Promise<void> => {
    const now = new Date().toISOString();
    for (const item of items) {
      const inv = storeData.inventory[item.variant_id];
      if (!inv) continue;

      inv.reserved = Math.max(0, inv.reserved - item.quantity);
      inv.on_hand = Math.max(0, inv.on_hand - item.quantity);
      inv.updated_at = now;

      storeData.inventory_movements.push({
        id: storeData.inventory_movements.length + 1,
        variant_id: item.variant_id,
        movement_type: 'sale',
        quantity: item.quantity,
        reference_type: 'order',
        reference_id: orderId,
        reason: 'Списание остатка после успешной оплаты',
        created_by: actorId || null,
        created_at: now,
      });
    }
    saveStore();
  },

  // Освобождение резерва (отмена или таймаут)
  atomicRelease: async (
    items: Array<{ variant_id: string; quantity: number }>,
    orderId: string,
    reason: string = 'Отмена заказа / истечение таймаута',
    actorId?: string
  ): Promise<void> => {
    const now = new Date().toISOString();
    for (const item of items) {
      const inv = storeData.inventory[item.variant_id];
      if (!inv) continue;

      inv.reserved = Math.max(0, inv.reserved - item.quantity);
      inv.updated_at = now;

      storeData.inventory_movements.push({
        id: storeData.inventory_movements.length + 1,
        variant_id: item.variant_id,
        movement_type: 'unreserve',
        quantity: item.quantity,
        reference_type: 'order',
        reference_id: orderId,
        reason,
        created_by: actorId || null,
        created_at: now,
      });
    }
    saveStore();
  },
};
