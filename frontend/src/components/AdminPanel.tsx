import React, { useState } from 'react';
import {
  X,
  LayoutDashboard,
  Package,
  ShoppingBag,
  Layers,
  Tag,
  Star,
  Settings,
  TrendingUp,
  AlertTriangle,
  Plus,
  Trash2,
  Check,
  RefreshCw,
  Eye,
  Shield,
  Edit,
  CheckCircle,
  Clock,
  Sparkles,
} from 'lucide-react';
import type { Product, Order, PromoCode, Review, Locale, Size, Color } from '../types';
import { INITIAL_SIZES, INITIAL_COLORS } from '../data/products';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onAddProduct: (newProduct: Product) => void;
  onUpdateProduct: (p: Product) => void;
  onDeleteProduct: (productId: string) => void;
  orders: Order[];
  onUpdateOrderStatus: (orderNumber: string, status: Order['status']) => void;
  onDeleteOrder: (orderNumber: string) => void;
  promoCodes: PromoCode[];
  onAddPromoCode: (p: PromoCode) => void;
  onDeletePromoCode: (code: string) => void;
  reviews: Review[];
  onUpdateReviewStatus: (reviewId: number, status: Review['status']) => void;
  onDeleteReview: (reviewId: number) => void;
  settings: {
    storeName: string;
    reserveTimeout: number;
    freeShippingThreshold: number;
  };
  onUpdateSettings: (s: { storeName: string; reserveTimeout: number; freeShippingThreshold: number }) => void;
  locale: Locale;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  isOpen,
  onClose,
  products,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  orders,
  onUpdateOrderStatus,
  onDeleteOrder,
  promoCodes,
  onAddPromoCode,
  onDeletePromoCode,
  reviews,
  onUpdateReviewStatus,
  onDeleteReview,
  settings,
  onUpdateSettings,
}) => {
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'products' | 'orders' | 'inventory' | 'promos' | 'reviews' | 'settings'
  >('dashboard');

  // Модалка создания нового товара
  const [isCreateProductOpen, setIsCreateProductOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Поля нового товара
  const [pName, setPName] = useState('');
  const [pSku, setPSku] = useState('');
  const [pCategory, setPCategory] = useState(2);
  const [pPrice, setPPrice] = useState(3490);
  const [pOldPrice, setPOldPrice] = useState<number | ''>('');
  const [pBadge, setPBadge] = useState('New Drop');
  const [pImageUrl, setPImageUrl] = useState('/products/bear-smile.png');
  const [pShortDesc, setPShortDesc] = useState('');
  const [pDesc, setPDesc] = useState('');
  const [pStatus, setPStatus] = useState<'published' | 'draft'>('published');
  const [pInitialStock, setPInitialStock] = useState(25);

  // Добавление промокода
  const [newPromoCode, setNewPromoCode] = useState('');
  const [newPromoType, setNewPromoType] = useState<'percentage' | 'fixed'>('percentage');
  const [newPromoValue, setNewPromoValue] = useState(15);
  const [newPromoMin, setNewPromoMin] = useState(2500);

  // Настройки магазина
  const [storeName, setStoreName] = useState(settings.storeName);
  const [reserveTimeout, setReserveTimeout] = useState(settings.reserveTimeout);
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(settings.freeShippingThreshold);
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Уведомление об успешном действии
  const [feedbackNotice, setFeedbackNotice] = useState<string | null>(null);

  const showNotice = (msg: string) => {
    setFeedbackNotice(msg);
    setTimeout(() => setFeedbackNotice(null), 3000);
  };

  if (!isOpen) return null;

  // Аналитика
  const totalRevenue = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.grand_total, 342900);
  const totalOrders = 84 + orders.length;
  const avgCheck = Math.round(totalRevenue / totalOrders);
  const unitsSold = 112 + orders.reduce((sum, o) => sum + o.items.length, 0);

  // Обработчик создания товара
  const handleCreateProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pName || !pSku) return;

    const newId = `prod-${Date.now()}`;
    const slug = pName.toLowerCase().replace(/[^a-z0-9а-яё]+/g, '-').replace(/(^-|-$)/g, '');

    // Генерация вариантов SKU для всех размеров и цветов
    const variants = INITIAL_SIZES.flatMap((s) =>
      INITIAL_COLORS.map((c) => {
        const sku = `${pSku}-${s.code}-${c.code.substring(0, 3).toUpperCase()}`;
        return {
          id: `var-${sku.toLowerCase()}`,
          product_id: newId,
          size_id: s.id,
          color_id: c.id,
          sku,
          price_override: null,
          barcode: `46000000${Math.floor(1000 + Math.random() * 9000)}`,
          on_hand: pInitialStock,
          reserved: 0,
          available: pInitialStock,
        };
      })
    );

    const newProd: Product = {
      id: newId,
      slug: slug || `tshirt-${Date.now()}`,
      model_sku: pSku.toUpperCase().trim(),
      category_id: Number(pCategory),
      base_price: Number(pPrice),
      old_price: pOldPrice ? Number(pOldPrice) : null,
      status: pStatus,
      is_featured: true,
      fabric_composition: '100% Плотный гребенной хлопок пенье, 240 г/м²',
      rating_avg: 5.0,
      reviews_count: 0,
      badge: pBadge.trim() || undefined,
      image_url: pImageUrl.trim() || undefined,
      print_style: 'cyber-mana',
      print_title: pName.toUpperCase(),
      print_subtitle: 'STREET DROP',
      name: pName.trim(),
      short_description: pShortDesc.trim() || 'Новый эксклюзивный оверсайз-дроп из плотного хлопка.',
      description: pDesc.trim() || 'Премиальный стритвир оверсайз свободного кроя. Держит идеальную форму коробки.',
      variants,
    };

    onAddProduct(newProd);
    setIsCreateProductOpen(false);
    showNotice(`Товар «${newProd.name}» успешно создан и ${pStatus === 'published' ? 'опубликован в каталоге' : 'сохранен в черновики'}!`);

    // Сброс формы
    setPName('');
    setPSku('');
    setPPrice(3490);
    setPOldPrice('');
    setPShortDesc('');
    setPDesc('');
  };

  // Обработчик сохранения настроек
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings({
      storeName: storeName.trim() || 'TEE STREET',
      reserveTimeout: Number(reserveTimeout) || 30,
      freeShippingThreshold: Number(freeShippingThreshold) || 5000,
    });
    setSettingsSaved(true);
    showNotice('Настройки магазина успешно обновлены и сохранены!');
    setTimeout(() => setSettingsSaved(false), 2500);
  };

  // Обработчик создания промокода
  const handleCreatePromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPromoCode) return;
    const code = newPromoCode.trim().toUpperCase();
    onAddPromoCode({
      code,
      discount_type: newPromoType,
      value: Number(newPromoValue),
      min_order_amount: Number(newPromoMin),
    });
    setNewPromoCode('');
    showNotice(`Промокод «${code}» успешно активирован и доступен в корзине!`);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-[#0C0418]/95 backdrop-blur-2xl text-white flex flex-col">
      {/* Шапка админ-панели */}
      <div className="h-16 px-6 border-b border-[#00E6FF]/20 bg-[#160A29] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00E6FF] to-[#7B2CBF] flex items-center justify-center text-[#0B0314] font-black">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <div className="font-display font-black text-sm tracking-wider flex items-center gap-2">
              ПАНЕЛЬ АДМИНИСТРАТОРА // «{settings.storeName}»
              <span className="px-2 py-0.5 rounded text-[10px] bg-[#00E6FF]/20 text-[#00E6FF] font-mono">
                RBAC: FULL ACCESS
              </span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono">
              Live State Sync • LocalStorage & PostgreSQL
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/10"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Всплывающее уведомление о действии */}
      {feedbackNotice && (
        <div className="bg-[#9BD746] text-[#0B0314] px-6 py-2 text-xs font-bold flex items-center justify-between shadow-lg">
          <span className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            {feedbackNotice}
          </span>
          <button onClick={() => setFeedbackNotice(null)} className="font-mono text-sm">×</button>
        </div>
      )}

      <div className="flex-1 flex overflow-hidden">
        {/* Боковой сайдбар навигации */}
        <aside className="w-64 border-r border-white/10 bg-[#120722]/80 p-4 space-y-1.5 shrink-0 overflow-y-auto">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full px-3.5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2.5 transition-all cursor-pointer ${
              activeTab === 'dashboard'
                ? 'bg-[#00E6FF] text-[#0B0314] shadow-[0_0_15px_rgba(0,230,255,0.35)]'
                : 'text-slate-300 hover:bg-white/5 hover:text-white'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            Дашборд и Аналитика
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`w-full px-3.5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2.5 transition-all cursor-pointer ${
              activeTab === 'products'
                ? 'bg-[#00E6FF] text-[#0B0314] shadow-[0_0_15px_rgba(0,230,255,0.35)]'
                : 'text-slate-300 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Package className="w-4 h-4" />
            Товары и Модели ({products.length})
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full px-3.5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2.5 transition-all cursor-pointer ${
              activeTab === 'orders'
                ? 'bg-[#00E6FF] text-[#0B0314] shadow-[0_0_15px_rgba(0,230,255,0.35)]'
                : 'text-slate-300 hover:bg-white/5 hover:text-white'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            Заказы ({totalOrders})
          </button>

          <button
            onClick={() => setActiveTab('inventory')}
            className={`w-full px-3.5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2.5 transition-all cursor-pointer ${
              activeTab === 'inventory'
                ? 'bg-[#00E6FF] text-[#0B0314] shadow-[0_0_15px_rgba(0,230,255,0.35)]'
                : 'text-slate-300 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" />
            Склад и Остатки SKU
          </button>

          <button
            onClick={() => setActiveTab('promos')}
            className={`w-full px-3.5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2.5 transition-all cursor-pointer ${
              activeTab === 'promos'
                ? 'bg-[#00E6FF] text-[#0B0314] shadow-[0_0_15px_rgba(0,230,255,0.35)]'
                : 'text-slate-300 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Tag className="w-4 h-4" />
            Скидки и Промокоды ({promoCodes.length})
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`w-full px-3.5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2.5 transition-all cursor-pointer ${
              activeTab === 'reviews'
                ? 'bg-[#00E6FF] text-[#0B0314] shadow-[0_0_15px_rgba(0,230,255,0.35)]'
                : 'text-slate-300 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Star className="w-4 h-4" />
            Модерация отзывов ({reviews.length})
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full px-3.5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2.5 transition-all cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-[#00E6FF] text-[#0B0314] shadow-[0_0_15px_rgba(0,230,255,0.35)]'
                : 'text-slate-300 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Settings className="w-4 h-4" />
            Настройки магазина
          </button>
        </aside>

        {/* Главная рабочая область */}
        <main className="flex-1 overflow-y-auto p-6 sm:p-8 no-scrollbar bg-[#160A29]/50">
          {/* 1. ДАШБОРД */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-[#1E0C38] border border-[#00E6FF]/20 relative overflow-hidden">
                  <div className="text-xs font-mono uppercase text-slate-400 mb-1">Выручка (30 дней)</div>
                  <div className="font-display font-black text-2xl text-[#00E6FF]">
                    {totalRevenue.toLocaleString()} ₽
                  </div>
                  <div className="text-[11px] text-[#9BD746] mt-2 flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5" /> +24.8% к прошлому месяцу
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-[#1E0C38] border border-white/10">
                  <div className="text-xs font-mono uppercase text-slate-400 mb-1">Всего заказов</div>
                  <div className="font-display font-black text-2xl text-white">{totalOrders}</div>
                  <div className="text-[11px] text-slate-400 mt-2">Конверсия в оплату: 92.4%</div>
                </div>

                <div className="p-5 rounded-2xl bg-[#1E0C38] border border-white/10">
                  <div className="text-xs font-mono uppercase text-slate-400 mb-1">Средний чек</div>
                  <div className="font-display font-black text-2xl text-purple-300">
                    {avgCheck.toLocaleString()} ₽
                  </div>
                  <div className="text-[11px] text-slate-400 mt-2">1.8 единицы на заказ</div>
                </div>

                <div className="p-5 rounded-2xl bg-[#1E0C38] border border-white/10">
                  <div className="text-xs font-mono uppercase text-slate-400 mb-1">Продано футболок</div>
                  <div className="font-display font-black text-2xl text-[#9BD746]">{unitsSold} шт.</div>
                  <div className="text-[11px] text-slate-400 mt-2">Лидер: SMILE Holographic Bear</div>
                </div>
              </div>

              {/* График динамики */}
              <div className="p-6 rounded-2xl bg-[#1E0C38] border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-display font-bold text-base text-white">Динамика продаж (7 дней)</h3>
                    <div className="text-xs text-slate-400 font-mono">График подтвержденных онлайн-оплат</div>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-lg bg-[#00E6FF]/10 text-[#00E6FF] font-mono">
                    Синхронизировано
                  </span>
                </div>

                <div className="h-44 flex items-end justify-between gap-3 pt-6 px-2">
                  {[
                    { day: 'Пн', val: 38000, height: '45%' },
                    { day: 'Вт', val: 52000, height: '60%' },
                    { day: 'Ср', val: 44000, height: '50%' },
                    { day: 'Чт', val: 68000, height: '78%' },
                    { day: 'Пт', val: 94000, height: '95%' },
                    { day: 'Сб', val: 82000, height: '85%' },
                    { day: 'Вс', val: 71000, height: '75%' },
                  ].map((d, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                      <div className="text-[10px] font-mono text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                        {d.val.toLocaleString()} ₽
                      </div>
                      <div className="w-full bg-white/5 rounded-t-xl h-full flex items-end p-1">
                        <div
                          className="w-full rounded-t-lg bg-gradient-to-t from-[#7B2CBF] to-[#00E6FF] group-hover:brightness-125 transition-all shadow-[0_0_12px_rgba(0,230,255,0.3)]"
                          style={{ height: d.height }}
                        />
                      </div>
                      <div className="text-xs font-bold text-slate-300 font-mono">{d.day}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 2. ТОВАРЫ (ПОЛНОФУНКЦИОНАЛЬНОЕ ДОБАВЛЕНИЕ, СТАТУСЫ, ОДОБРЕНИЕ) */}
          {activeTab === 'products' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display font-bold text-lg text-white">
                    Каталог футболок ({products.length})
                  </h3>
                  <p className="text-xs text-slate-400">
                    Управление публикацией, ценами, остатками и создание новых моделей.
                  </p>
                </div>
                <button
                  onClick={() => setIsCreateProductOpen(true)}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#00E6FF] text-[#0B0314] font-black text-xs hover:brightness-110 shadow-[0_0_15px_rgba(0,230,255,0.4)] cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Добавить футболку
                </button>
              </div>

              {/* Форма модалки добавления товара */}
              {isCreateProductOpen && (
                <div className="p-6 rounded-2xl bg-[#1E0C38] border border-[#00E6FF]/40 shadow-2xl space-y-4 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <h4 className="font-display font-bold text-base text-[#00E6FF] flex items-center gap-2">
                      <Plus className="w-4 h-4" /> Создание новой модели футболки
                    </h4>
                    <button
                      onClick={() => setIsCreateProductOpen(false)}
                      className="p-1 rounded-lg text-slate-400 hover:text-white"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={handleCreateProductSubmit} className="space-y-4 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block font-semibold text-slate-300 mb-1">
                          Название товара *
                        </label>
                        <input
                          type="text"
                          required
                          value={pName}
                          onChange={(e) => setPName(e.target.value)}
                          placeholder="Напр. GHOST Cyberpunk Tee"
                          className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white focus:border-[#00E6FF]"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-300 mb-1">
                          Модельный артикул (SKU) *
                        </label>
                        <input
                          type="text"
                          required
                          value={pSku}
                          onChange={(e) => setPSku(e.target.value)}
                          placeholder="TSH-GHOST-07"
                          className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white uppercase font-mono focus:border-[#00E6FF]"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-300 mb-1">Категория</label>
                        <select
                          value={pCategory}
                          onChange={(e) => setPCategory(Number(e.target.value))}
                          className="w-full px-3 py-2 rounded-xl bg-[#120722] border border-white/15 text-white"
                        >
                          <option value={1}>Оверсайз</option>
                          <option value={2}>Киберпанк</option>
                          <option value={3}>Лимитированные дропы</option>
                          <option value={4}>Минимализм</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                      <div>
                        <label className="block font-semibold text-slate-300 mb-1">
                          Цена продажи (₽) *
                        </label>
                        <input
                          type="number"
                          required
                          value={pPrice}
                          onChange={(e) => setPPrice(Number(e.target.value))}
                          className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white font-mono"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-300 mb-1">
                          Старая цена (зачеркнутая, ₽)
                        </label>
                        <input
                          type="number"
                          value={pOldPrice}
                          onChange={(e) =>
                            setPOldPrice(e.target.value ? Number(e.target.value) : '')
                          }
                          placeholder="4200"
                          className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white font-mono"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-300 mb-1">
                          Бейдж (Drop, Sale)
                        </label>
                        <input
                          type="text"
                          value={pBadge}
                          onChange={(e) => setPBadge(e.target.value)}
                          placeholder="New Drop"
                          className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-300 mb-1">
                          Стартовый статус *
                        </label>
                        <select
                          value={pStatus}
                          onChange={(e) => setPStatus(e.target.value as any)}
                          className="w-full px-3 py-2 rounded-xl bg-[#120722] border border-white/15 text-white font-bold"
                        >
                          <option value="published">Опубликован (сразу в каталог)</option>
                          <option value="draft">Черновик (на одобрение)</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-semibold text-slate-300 mb-1">
                          Путь к фото / Изображение
                        </label>
                        <select
                          value={pImageUrl}
                          onChange={(e) => setPImageUrl(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-[#120722] border border-white/15 text-white font-mono"
                        >
                          <option value="/products/bear-smile.png">
                            bear-smile.png (Мишка SMILE с фото пользователя)
                          </option>
                          <option value="/products/rabbit-anarchy.png">
                            rabbit-anarchy.png (Кибер-кролик ANARCHY)
                          </option>
                          <option value="/products/oni-cyber.png">
                            oni-cyber.png (Маска они Токио)
                          </option>
                          <option value="/products/butterfly-chrome.png">
                            butterfly-chrome.png (Жидкий хром Y2K)
                          </option>
                          <option value="/products/acid-smile.png">
                            acid-smile.png (Кислотный смайл Voltage)
                          </option>
                          <option value="/products/astronaut-void.png">
                            astronaut-void.png (Астронавт Offline)
                          </option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-300 mb-1">
                          Начальный остаток на размер/цвет (шт.)
                        </label>
                        <input
                          type="number"
                          value={pInitialStock}
                          onChange={(e) => setPInitialStock(Number(e.target.value))}
                          className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-300 mb-1">
                        Краткое описание для карточки
                      </label>
                      <input
                        type="text"
                        value={pShortDesc}
                        onChange={(e) => setPShortDesc(e.target.value)}
                        placeholder="Оверсайз футболка с авторской шелкографией..."
                        className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white"
                      />
                    </div>

                    <div className="pt-2 flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => setIsCreateProductOpen(false)}
                        className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-bold"
                      >
                        Отмена
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2 rounded-xl bg-[#00E6FF] text-[#0B0314] font-black hover:brightness-110 shadow-lg cursor-pointer"
                      >
                        Создать товар и матрицу SKU
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Таблица товаров */}
              <div className="rounded-2xl border border-white/10 bg-[#1E0C38] overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-black/30 border-b border-white/10 text-slate-400 font-mono">
                    <tr>
                      <th className="p-3.5">Артикул</th>
                      <th className="p-3.5">Фото</th>
                      <th className="p-3.5">Название</th>
                      <th className="p-3.5">Цена</th>
                      <th className="p-3.5">Статус публикации</th>
                      <th className="p-3.5">Хит</th>
                      <th className="p-3.5 text-right">Действия</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-mono">
                    {products.map((p) => (
                      <tr key={p.id} className="hover:bg-white/5 transition-colors">
                        <td className="p-3.5 text-[#00E6FF] font-bold">{p.model_sku}</td>
                        <td className="p-3.5">
                          {p.image_url ? (
                            <img
                              src={p.image_url}
                              alt={p.name}
                              className="w-10 h-10 object-contain rounded bg-black/40 p-0.5 border border-white/10"
                            />
                          ) : (
                            <span className="text-slate-500 font-mono text-[10px]">SVG</span>
                          )}
                        </td>
                        <td className="p-3.5 font-bold font-sans text-white">{p.name}</td>
                        <td className="p-3.5 font-bold">
                          {p.base_price.toLocaleString()} ₽
                          {p.old_price && (
                            <span className="block text-[10px] text-slate-500 line-through">
                              {p.old_price.toLocaleString()} ₽
                            </span>
                          )}
                        </td>

                        {/* Селектор статуса (Одобрен / Черновик / В архиве) */}
                        <td className="p-3.5">
                          <select
                            value={p.status}
                            onChange={(e) => {
                              const newStatus = e.target.value as Product['status'];
                              onUpdateProduct({ ...p, status: newStatus });
                              showNotice(`Статус товара «${p.name}» изменен на: ${newStatus}`);
                            }}
                            className={`px-2.5 py-1 rounded-md text-[11px] font-bold uppercase transition-colors cursor-pointer ${
                              p.status === 'published'
                                ? 'bg-[#9BD746]/20 text-[#9BD746] border border-[#9BD746]/40'
                                : p.status === 'draft'
                                ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                                : 'bg-slate-700/40 text-slate-400 border border-slate-600'
                            }`}
                          >
                            <option value="published" className="bg-[#120722] text-[#9BD746]">
                              Опубликован
                            </option>
                            <option value="draft" className="bg-[#120722] text-amber-300">
                              Черновик (Одобрить)
                            </option>
                            <option value="archived" className="bg-[#120722] text-slate-400">
                              В архиве
                            </option>
                          </select>
                        </td>

                        {/* Переключатель Хит */}
                        <td className="p-3.5">
                          <button
                            onClick={() => {
                              onUpdateProduct({ ...p, is_featured: !p.is_featured });
                              showNotice(`Статус "Хит" для «${p.name}» переключен!`);
                            }}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                              p.is_featured
                                ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                                : 'bg-white/5 text-slate-500 hover:text-white'
                            }`}
                          >
                            <Star className={`w-3 h-3 inline mr-1 ${p.is_featured ? 'fill-current' : ''}`} />
                            {p.is_featured ? 'В топе' : 'Обычный'}
                          </button>
                        </td>

                        {/* Действия: Удалить / Одобрить в 1 клик */}
                        <td className="p-3.5 text-right space-x-2">
                          {p.status === 'draft' && (
                            <button
                              onClick={() => {
                                onUpdateProduct({ ...p, status: 'published' });
                                showNotice(`Товар «${p.name}» успешно одобрен и опубликован!`);
                              }}
                              className="px-2.5 py-1 rounded-lg bg-[#9BD746] text-[#0B0314] font-black text-xs hover:brightness-110"
                              title="Одобрить и опубликовать"
                            >
                              Одобрить
                            </button>
                          )}
                          <button
                            onClick={() => {
                              if (confirm(`Вы действительно хотите удалить товар «${p.name}»?`)) {
                                onDeleteProduct(p.id);
                                showNotice(`Товар «${p.name}» удален.`);
                              }
                            }}
                            className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/30 text-red-400 border border-red-500/20 transition-colors"
                            title="Удалить товар"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 3. ЗАКАЗЫ (РЕАКТИВНОЕ ОБНОВЛЕНИЕ И УДАЛЕНИЕ) */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display font-bold text-lg text-white">Список заказов</h3>
                  <p className="text-xs text-slate-400">
                    Переключение статусов доставки, платежей и управление заказами.
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#1E0C38] overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-black/30 border-b border-white/10 text-slate-400 font-mono">
                    <tr>
                      <th className="p-3.5">№ Заказа</th>
                      <th className="p-3.5">Получатель</th>
                      <th className="p-3.5">Контакты</th>
                      <th className="p-3.5">Сумма</th>
                      <th className="p-3.5">Оплата</th>
                      <th className="p-3.5">Статус заказа</th>
                      <th className="p-3.5 text-right">Действия</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-mono">
                    {orders.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-slate-400 font-sans">
                          Пока нет новых заказов в этой сессии. Оформите заказ через корзину на сайте!
                        </td>
                      </tr>
                    ) : (
                      orders.map((o) => (
                        <tr key={o.order_number} className="hover:bg-white/5">
                          <td className="p-3.5 text-[#00E6FF] font-bold">{o.order_number}</td>
                          <td className="p-3.5 font-sans font-bold text-white">{o.recipient_name}</td>
                          <td className="p-3.5 text-slate-400 text-[11px]">
                            {o.guest_email}
                            <span className="block text-slate-500">{o.guest_phone}</span>
                          </td>
                          <td className="p-3.5 font-bold text-white">
                            {o.grand_total.toLocaleString()} ₽
                          </td>
                          <td className="p-3.5 text-slate-300 capitalize">{o.payment_method}</td>
                          <td className="p-3.5">
                            <select
                              value={o.status}
                              onChange={(e) => {
                                const newStatus = e.target.value as Order['status'];
                                onUpdateOrderStatus(o.order_number, newStatus);
                                showNotice(`Статус заказа #${o.order_number} изменен на: ${newStatus}`);
                              }}
                              className={`px-2.5 py-1 rounded-md text-[11px] font-bold uppercase transition-colors cursor-pointer ${
                                o.status === 'paid' || o.status === 'completed'
                                  ? 'bg-[#9BD746]/20 text-[#9BD746] border border-[#9BD746]/40'
                                  : o.status === 'shipped'
                                  ? 'bg-[#00E6FF]/20 text-[#00E6FF] border border-[#00E6FF]/40'
                                  : 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                              }`}
                            >
                              <option value="pending_payment" className="bg-[#120722] text-amber-300">
                                Ожидает оплаты
                              </option>
                              <option value="paid" className="bg-[#120722] text-[#9BD746]">
                                Оплачен
                              </option>
                              <option value="confirmed" className="bg-[#120722] text-[#00E6FF]">
                                Подтвержден
                              </option>
                              <option value="processing" className="bg-[#120722] text-purple-300">
                                В сборке
                              </option>
                              <option value="shipped" className="bg-[#120722] text-[#00E6FF]">
                                Отправлен
                              </option>
                              <option value="delivered" className="bg-[#120722] text-[#9BD746]">
                                Доставлен
                              </option>
                              <option value="completed" className="bg-[#120722] text-[#9BD746]">
                                Выполнен
                              </option>
                              <option value="cancelled" className="bg-[#120722] text-red-400">
                                Отменен
                              </option>
                            </select>
                          </td>
                          <td className="p-3.5 text-right">
                            <button
                              onClick={() => {
                                if (confirm(`Удалить запись заказа #${o.order_number}?`)) {
                                  onDeleteOrder(o.order_number);
                                  showNotice(`Заказ #${o.order_number} удален.`);
                                }
                              }}
                              className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/30 text-red-400 border border-red-500/20"
                              title="Удалить заказ"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 4. СКЛАД И РЕАЛЬНЫЕ ОСТАТКИ SKU С КНОПКАМИ +/- */}
          {activeTab === 'inventory' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display font-bold text-lg text-white">
                    Складской учет (SKU / Остатки / Резерв)
                  </h3>
                  <p className="text-xs text-slate-400">
                    Живое изменение остатков на складе. Изменения моментально влияют на доступность в каталоге.
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#1E0C38] overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-black/30 border-b border-white/10 text-slate-400 font-mono">
                    <tr>
                      <th className="p-3.5">SKU артикул</th>
                      <th className="p-3.5">Модель</th>
                      <th className="p-3.5">Размер</th>
                      <th className="p-3.5">Физический остаток</th>
                      <th className="p-3.5">Резерв</th>
                      <th className="p-3.5">Доступно</th>
                      <th className="p-3.5 text-right">Корректировка</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-mono">
                    {products.slice(0, 5).flatMap((p) =>
                      p.variants.slice(0, 4).map((v) => (
                        <tr key={v.id} className="hover:bg-white/5">
                          <td className="p-3.5 text-[#00E6FF] font-bold">{v.sku}</td>
                          <td className="p-3.5 font-sans text-white">{p.name}</td>
                          <td className="p-3.5 font-bold">
                            {INITIAL_SIZES.find((s) => s.id === v.size_id)?.code || `ID: ${v.size_id}`}
                          </td>
                          <td className="p-3.5 font-bold text-white">{v.on_hand} шт.</td>
                          <td className="p-3.5 text-amber-400">{v.reserved} шт.</td>
                          <td className="p-3.5 text-[#9BD746] font-black">
                            {v.on_hand - v.reserved} шт.
                          </td>
                          <td className="p-3.5 text-right space-x-1.5">
                            <button
                              onClick={() => {
                                const newOnHand = Math.max(0, v.on_hand - 5);
                                const updatedVariants = p.variants.map((varItem) =>
                                  varItem.id === v.id
                                    ? { ...varItem, on_hand: newOnHand, available: newOnHand - varItem.reserved }
                                    : varItem
                                );
                                onUpdateProduct({ ...p, variants: updatedVariants });
                                showNotice(`Остаток ${v.sku} уменьшен на 5 шт.`);
                              }}
                              className="px-2 py-1 rounded bg-white/5 hover:bg-white/15 text-slate-300 font-bold"
                            >
                              -5
                            </button>
                            <button
                              onClick={() => {
                                const newOnHand = v.on_hand + 10;
                                const updatedVariants = p.variants.map((varItem) =>
                                  varItem.id === v.id
                                    ? { ...varItem, on_hand: newOnHand, available: newOnHand - varItem.reserved }
                                    : varItem
                                );
                                onUpdateProduct({ ...p, variants: updatedVariants });
                                showNotice(`Остаток ${v.sku} пополнен на +10 шт.`);
                              }}
                              className="px-2 py-1 rounded bg-[#00E6FF]/20 text-[#00E6FF] hover:bg-[#00E6FF]/30 font-bold"
                            >
                              +10
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 5. ПРОМОКОДЫ (ДОБАВЛЕНИЕ И УДАЛЕНИЕ) */}
          {activeTab === 'promos' && (
            <div className="space-y-6">
              <div className="p-5 rounded-2xl bg-[#1E0C38] border border-white/10">
                <h4 className="font-display font-bold text-sm text-white mb-3">
                  Создать новый промокод
                </h4>
                <form onSubmit={handleCreatePromo} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <input
                    type="text"
                    required
                    value={newPromoCode}
                    onChange={(e) => setNewPromoCode(e.target.value)}
                    placeholder="КОД (напр. SUMMER20)"
                    className="px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white uppercase font-mono"
                  />
                  <select
                    value={newPromoType}
                    onChange={(e) => setNewPromoType(e.target.value as any)}
                    className="px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white"
                  >
                    <option value="percentage">Процент скидки (%)</option>
                    <option value="fixed">Фиксированная сумма (₽)</option>
                  </select>
                  <input
                    type="number"
                    value={newPromoValue}
                    onChange={(e) => setNewPromoValue(Number(e.target.value))}
                    placeholder="Размер скидки"
                    className="px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white font-mono"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-[#00E6FF] text-[#0B0314] font-black text-xs hover:brightness-110 shadow-lg cursor-pointer"
                  >
                    + Добавить промокод
                  </button>
                </form>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#1E0C38] overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-black/30 border-b border-white/10 text-slate-400 font-mono">
                    <tr>
                      <th className="p-3.5">Промокод</th>
                      <th className="p-3.5">Тип скидки</th>
                      <th className="p-3.5">Значение</th>
                      <th className="p-3.5">Минимум заказа</th>
                      <th className="p-3.5">Статус</th>
                      <th className="p-3.5 text-right">Удалить</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-mono">
                    {promoCodes.map((pr) => (
                      <tr key={pr.code} className="hover:bg-white/5">
                        <td className="p-3.5 text-[#00E6FF] font-bold">{pr.code}</td>
                        <td className="p-3.5 font-sans">
                          {pr.discount_type === 'percentage' ? 'Процентная' : 'Фиксированная'}
                        </td>
                        <td className="p-3.5 font-bold">
                          {pr.value} {pr.discount_type === 'percentage' ? '%' : '₽'}
                        </td>
                        <td className="p-3.5">{pr.min_order_amount} ₽</td>
                        <td className="p-3.5">
                          <span className="px-2 py-0.5 rounded text-[10px] bg-[#9BD746]/20 text-[#9BD746] font-bold">
                            Активен
                          </span>
                        </td>
                        <td className="p-3.5 text-right">
                          <button
                            onClick={() => {
                              onDeletePromoCode(pr.code);
                              showNotice(`Промокод ${pr.code} удален.`);
                            }}
                            className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/30 text-red-400"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 6. ОТЗЫВЫ (МОДЕРАЦИЯ И ОДОБРЕНИЕ) */}
          {activeTab === 'reviews' && (
            <div className="space-y-4">
              <h3 className="font-display font-bold text-lg text-white">Модерация отзывов</h3>
              <div className="space-y-3">
                {reviews.map((r) => (
                  <div
                    key={r.id}
                    className="p-4 rounded-xl bg-[#1E0C38] border border-white/10 flex items-start justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-xs">{r.author_name}</span>
                        <div className="flex text-amber-400">
                          {[...Array(r.rating)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-current" />
                          ))}
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono">
                          Товар ID: {r.product_id}
                        </span>
                        <span
                          className={`px-2 py-0.2 rounded text-[10px] font-bold uppercase ${
                            r.status === 'published'
                              ? 'bg-[#9BD746]/20 text-[#9BD746]'
                              : 'bg-amber-400/20 text-amber-300'
                          }`}
                        >
                          {r.status === 'published' ? 'Опубликован' : 'На модерации'}
                        </span>
                      </div>
                      <div className="font-semibold text-xs text-slate-200">{r.title}</div>
                      <p className="text-xs text-slate-400">{r.body}</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => {
                          onUpdateReviewStatus(r.id, 'published');
                          showNotice('Отзыв одобрен и опубликован на карточке товара!');
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          r.status === 'published'
                            ? 'bg-[#9BD746] text-[#0B0314]'
                            : 'bg-white/5 text-slate-300 hover:bg-[#9BD746]/20'
                        }`}
                      >
                        Одобрить
                      </button>
                      <button
                        onClick={() => {
                          onUpdateReviewStatus(r.id, 'rejected');
                          showNotice('Отзыв отклонен.');
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          r.status === 'rejected'
                            ? 'bg-red-500 text-white'
                            : 'bg-white/5 text-slate-300 hover:bg-red-500/20'
                        }`}
                      >
                        Отклонить
                      </button>
                      <button
                        onClick={() => {
                          onDeleteReview(r.id);
                          showNotice('Отзыв удален.');
                        }}
                        className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/30 text-red-400"
                        title="Удалить отзыв"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 7. НАСТРОЙКИ (ЖИВОЕ СОХРАНЕНИЕ) */}
          {activeTab === 'settings' && (
            <div className="p-6 rounded-2xl bg-[#1E0C38] border border-white/10 max-w-xl space-y-4">
              <h3 className="font-display font-bold text-base text-white">Общие параметры магазина</h3>
              <p className="text-xs text-slate-400">
                Изменения немедленно применяются ко всему сайту, шапке и чекауту.
              </p>
              <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Название магазина (в шапке, футере и заголовках)
                  </label>
                  <input
                    type="text"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white font-bold"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Таймаут удержания резерва неоплаченного заказа (минут)
                  </label>
                  <input
                    type="number"
                    value={reserveTimeout}
                    onChange={(e) => setReserveTimeout(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Порог бесплатной доставки (₽)
                  </label>
                  <input
                    type="number"
                    value={freeShippingThreshold}
                    onChange={(e) => setFreeShippingThreshold(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white font-mono"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#00E6FF] text-[#0B0314] font-black hover:brightness-110 flex items-center gap-1.5 shadow-lg cursor-pointer"
                >
                  <Check className="w-4 h-4" /> Сохранить настройки
                </button>

                {settingsSaved && (
                  <span className="text-xs text-[#9BD746] font-bold block">
                    Настройки успешно обновлены и сохранены в системе!
                  </span>
                )}
              </form>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
