import React, { useState, useEffect, useMemo } from 'react';
import {
  Sparkles,
  Filter,
  Check,
  ShoppingBag,
  Star,
  Layers,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  QrCode,
  Truck,
  RotateCcw,
} from 'lucide-react';
import type {
  Locale,
  ThemeMode,
  Product,
  CartItem,
  PromoCode,
  Size,
  Color,
  Order,
  Review,
  User,
} from './types';
import {
  INITIAL_PRODUCTS,
  INITIAL_SIZES,
  INITIAL_COLORS,
  INITIAL_SHIPPING_METHODS,
  INITIAL_PICKUP_POINTS,
  INITIAL_PROMO_CODES,
  INITIAL_REVIEWS,
  INITIAL_ORDERS,
} from './data/products';
import { translations } from './i18n/translations';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ProductCard } from './components/ProductCard';
import { TeeMockup } from './components/TeeMockup';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { ProductDetailModal } from './components/ProductDetailModal';
import { AdminPanel } from './components/AdminPanel';
import { StaticPagesModal } from './components/StaticPagesModal';
import { AuthModal } from './components/AuthModal';

export const App: React.FC = () => {
  // Локализация и Тема
  const [locale, setLocale] = useState<Locale>(() => {
    return (localStorage.getItem('test_locale') as Locale) || 'ru';
  });
  const [theme, setTheme] = useState<ThemeMode>(() => {
    return (localStorage.getItem('test_theme') as ThemeMode) || 'dark';
  });

  // Утвержденный официальный стиль TEE STREET — Cyber Crimson & Blood Red
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'crimson');
    localStorage.setItem('tee_street_active_theme', 'crimson');
  }, []);

  useEffect(() => {
    localStorage.setItem('test_locale', locale);
  }, [locale]);

  useEffect(() => {
    const root = document.documentElement;
    const applyTheme = (mode: ThemeMode) => {
      const isDark =
        mode === 'dark' ||
        (mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
      root.classList.toggle('dark', isDark);
      root.classList.toggle('light', !isDark);
      root.setAttribute('data-color-scheme', isDark ? 'dark' : 'light');
    };
    applyTheme(theme);
    localStorage.setItem('test_theme', theme);

    if (theme === 'system') {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      const listener = () => applyTheme('system');
      mq.addEventListener('change', listener);
      return () => mq.removeEventListener('change', listener);
    }
  }, [theme]);

  // Данные магазина с локальной персистентностью и актуальными фото и остатками по цветам
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('test_products_v8');
      if (saved) return JSON.parse(saved);
      localStorage.setItem('test_products_v8', JSON.stringify(INITIAL_PRODUCTS));
      return INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });
  const [sizes] = useState<Size[]>(INITIAL_SIZES);
  const [colors] = useState<Color[]>(INITIAL_COLORS);
  const [shippingMethods] = useState(INITIAL_SHIPPING_METHODS);
  const [pickupPoints] = useState(INITIAL_PICKUP_POINTS);
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>(() => {
    try {
      const saved = localStorage.getItem('test_promos_v3');
      return saved ? JSON.parse(saved) : INITIAL_PROMO_CODES;
    } catch {
      return INITIAL_PROMO_CODES;
    }
  });
  const [reviews, setReviews] = useState<Review[]>(() => {
    try {
      const saved = localStorage.getItem('test_reviews_v3');
      return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
    } catch {
      return INITIAL_REVIEWS;
    }
  });
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('test_orders_v4');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });
  const [siteSettings, setSiteSettings] = useState<{
    storeName: string;
    reserveTimeout: number;
    freeShippingThreshold: number;
  }>(() => {
    try {
      const saved = localStorage.getItem('test_settings_v4');
      return saved
        ? JSON.parse(saved)
        : {
            storeName: 'TEE STREET',
            reserveTimeout: 30,
            freeShippingThreshold: 5000,
          };
    } catch {
      return {
        storeName: 'TEE STREET',
        reserveTimeout: 30,
        freeShippingThreshold: 5000,
      };
    }
  });

  useEffect(() => {
    localStorage.setItem('test_products_v8', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('test_orders_v4', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('test_promos_v3', JSON.stringify(promoCodes));
  }, [promoCodes]);

  useEffect(() => {
    localStorage.setItem('test_reviews_v3', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('test_settings_v4', JSON.stringify(siteSettings));
  }, [siteSettings]);

  // Пользователь (по умолчанию авторизован клиент для доступа к заказам и возвратам)
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('test_user');
      if (saved) return JSON.parse(saved);
      return {
        id: 'usr-client-0001',
        email: 'vlad@cyberdrop.ru',
        first_name: 'Владислав',
        last_name: 'Озеров',
        phone: '+7 (999) 420-20-26',
        birth_date: '1998-07-24',
        address: 'г. Москва, Пресненская наб., д. 12, оф. 45',
        role: 'user',
      };
    } catch {
      return null;
    }
  });

  // Корзина и Избранное
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('test_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('test_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);

  useEffect(() => {
    localStorage.setItem('test_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('test_favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Фильтрация и поиск
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'popular' | 'price_asc' | 'price_desc' | 'rating'>('popular');
  const [selectedSizeFilter, setSelectedSizeFilter] = useState<string | null>(null);
  const [selectedColorFilter, setSelectedColorFilter] = useState<string | null>(null);
  const [inStockOnly, setInStockOnly] = useState(false);

  // Модальные окна
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);
  const [staticPageSlug, setStaticPageSlug] = useState<string | null>(null);
  const [orderSuccessData, setOrderSuccessData] = useState<any | null>(null);

  const t = translations[locale];

  // Корзина: добавить товар
  const handleAddToCart = (product: Product, size: Size, color: Color, quantity: number = 1) => {
    const variantId = `var-${product.model_sku}-${size.code}-${color.code.substring(0, 3).toUpperCase()}`.toLowerCase();
    setCart((prev) => {
      const existing = prev.find((item) => item.variant_id === variantId);
      if (existing) {
        return prev.map((item) =>
          item.variant_id === variantId
            ? {
                ...item,
                quantity: item.quantity + quantity,
                line_total: (item.quantity + quantity) * item.unit_price,
              }
            : item
        );
      }
      return [
        ...prev,
        {
          id: `ci-${Date.now()}-${Math.random()}`,
          variant_id: variantId,
          product,
          size,
          color,
          quantity,
          unit_price: product.base_price,
          line_total: product.base_price * quantity,
        },
      ];
    });
  };

  const handleUpdateQty = (variantId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.variant_id === variantId) {
            const newQty = item.quantity + delta;
            return newQty > 0
              ? { ...item, quantity: newQty, line_total: newQty * item.unit_price }
              : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveItem = (variantId: string) => {
    setCart((prev) => prev.filter((item) => item.variant_id !== variantId));
  };

  const handleClearCart = () => {
    setCart([]);
    setAppliedPromo(null);
  };

  const handleApplyPromo = (code: string): boolean => {
    const found = promoCodes.find((p) => p.code.toUpperCase() === code.toUpperCase());
    if (found) {
      setAppliedPromo(found);
      return true;
    }
    return false;
  };

  // Избранное
  const handleToggleFavorite = (product: Product) => {
    setFavorites((prev) =>
      prev.includes(product.id) ? prev.filter((id) => id !== product.id) : [...prev, product.id]
    );
  };

  // Отзывы
  const handleAddReview = (
    productId: string,
    rating: number,
    title: string,
    body: string,
    author: string
  ) => {
    const newRev: Review = {
      id: Date.now(),
      product_id: productId,
      rating,
      title,
      body,
      author_name: author,
      status: 'published',
      created_at: new Date().toISOString(),
    };
    setReviews((prev) => [newRev, ...prev]);
  };

  // Фильтрация товаров (только одобренные опубликованные товары для покупателей)
  const filteredProducts = useMemo(() => {
    let result = products.filter((p) => p.status === 'published');

    // Категория
    if (activeCategory === 'oversize') result = result.filter((p) => p.category_id === 1);
    else if (activeCategory === 'cyberpunk') result = result.filter((p) => p.category_id === 2);
    else if (activeCategory === 'limited-drops') result = result.filter((p) => p.category_id === 3);
    else if (activeCategory === 'minimal') result = result.filter((p) => p.category_id === 4);

    // Поиск
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.model_sku.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    // Фильтр по размеру
    if (selectedSizeFilter) {
      result = result.filter((p) =>
        p.variants.some((v) => v.sku.includes(`-${selectedSizeFilter}-`))
      );
    }

    // Сортировка
    if (sortBy === 'price_asc') {
      result.sort((a, b) => a.base_price - b.base_price);
    } else if (sortBy === 'price_desc') {
      result.sort((a, b) => b.base_price - a.base_price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating_avg - a.rating_avg);
    } else {
      // popular
      result.sort((a, b) => b.reviews_count - a.reviews_count);
    }

    return result;
  }, [products, activeCategory, searchQuery, sortBy, selectedSizeFilter]);

  const cartTotal = cart.reduce((sum, item) => sum + item.line_total, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-[#120722] text-slate-100 selection:bg-[#00E6FF] selection:text-[#120722]">
      {/* Мягкое фоновое радиальное свечение Palette 4 */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_0%,rgba(0,230,255,0.08),transparent_50%)] z-0" />
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_80%_60%,rgba(123,44,191,0.07),transparent_50%)] z-0" />

      {/* Верхняя навигация */}
      <Navbar
        locale={locale}
        setLocale={setLocale}
        theme={theme}
        setTheme={setTheme}
        cartCount={cartCount}
        cartTotal={cartTotal}
        favoritesCount={favorites.length}
        openCart={() => setIsCartOpen(true)}
        openFavorites={() => {
          setActiveCategory('all');
          const el = document.getElementById('catalog-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        openAuth={() => setIsAuthOpen(true)}
        openAdmin={() => setIsAdminOpen(true)}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        openStaticPage={(slug) => setStaticPageSlug(slug)}
        storeName={siteSettings.storeName}
        currentUser={currentUser}
      />

      <main className="flex-1 relative z-10">
        {/* ГЕРОЙ-СЕКЦИЯ (HERO BANNER) В СТИЛЕ PALETTE 4 */}
        <section className="relative overflow-hidden pt-6 pb-12 sm:pt-8 sm:pb-16 lg:py-20 border-b border-[#00E6FF]/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 items-center">
              {/* Левый блок текста и CTA */}
              <div className="lg:col-span-7 space-y-4 sm:space-y-6 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-full bg-[#00E6FF]/10 border border-[#00E6FF]/30 text-[11px] sm:text-xs font-black tracking-wider text-[#00E6FF] shadow-[0_0_15px_rgba(0,230,255,0.25)]">
                  <Sparkles className="w-3.5 h-3.5" />
                  {t.hero.badge}
                </div>

                <h1 className="font-display font-black text-2xl min-[400px]:text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-[1.1] uppercase">
                  {t.hero.title.split(' ')[0]}{' '}
                  <span className="bg-gradient-to-r from-[#00E6FF] via-[#7B2CBF] to-[#FF286E] bg-clip-text text-transparent">
                    {t.hero.title.split(' ').slice(1).join(' ')}
                  </span>
                </h1>

                <p className="text-xs sm:text-base text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed font-light">
                  {t.hero.subtitle}
                </p>

                <div className="text-[11px] sm:text-xs font-mono text-[#00E6FF] flex items-center justify-center lg:justify-start gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#00E6FF] animate-ping" />
                  {t.hero.specs}
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2">
                  <button
                    onClick={() => {
                      const el = document.getElementById('catalog-section');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="w-full sm:w-auto px-7 py-3.5 sm:px-8 sm:py-4 rounded-2xl bg-gradient-to-r from-[#00E6FF] via-[#0297DE] to-[#7B2CBF] text-[#0B0314] font-black text-xs sm:text-sm shadow-[0_0_30px_rgba(0,230,255,0.45)] hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>{t.hero.cta}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setStaticPageSlug('about')}
                    className="w-full sm:w-auto px-5 py-3.5 sm:px-6 sm:py-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    О производстве
                  </button>
                </div>
              </div>

              {/* Правый блок: Главное видео дропа (Showcase) */}
              <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
                <div className="relative w-full max-w-lg aspect-video rounded-2xl sm:rounded-3xl overflow-hidden border border-[#00E6FF]/40 shadow-[0_0_50px_rgba(255,30,68,0.35)] bg-[#120722] group">
                  {/* Верхний бейдж видео */}
                  <div className="absolute top-2.5 left-2.5 sm:top-3.5 sm:left-3.5 z-10 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl bg-black/70 border border-[#00E6FF]/40 backdrop-blur-md text-[10px] sm:text-[11px] font-mono text-[#00E6FF] flex items-center gap-2 shadow-lg">
                    <span className="w-2 h-2 rounded-full bg-[#00E6FF] animate-ping" />
                    <span>Live Drop // 2026 Showcase</span>
                  </div>

                  {/* Нижний бейдж качества */}
                  <div className="absolute bottom-2.5 right-2.5 sm:bottom-3.5 sm:right-3.5 z-10 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl bg-black/70 border border-[#FF286E]/40 backdrop-blur-md text-[10px] sm:text-[11px] font-mono text-[#FF286E] flex items-center gap-1.5 shadow-lg">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Heavyweight 240g Boxy Fit</span>
                  </div>

                  {/* Само видео */}
                  <video
                    src="/hero-video.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />

                  {/* Мягкий градиент снизу */}
                  <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#120722]/40 via-transparent to-transparent" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* КАТАЛОГ С ФИЛЬТРАМИ И ПОИСКОМ */}
        <section id="catalog-section" className="py-10 sm:py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Заголовок каталога */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 sm:gap-4 mb-6 sm:mb-8">
            <div>
              <div className="text-xs font-mono uppercase text-[#00E6FF] tracking-wider mb-1">
                Каталог // Коллекция 2026
              </div>
              <h2 className="font-display font-black text-2xl sm:text-3xl text-white">
                {t.catalog.title}
              </h2>
            </div>
            <div className="text-xs text-slate-400 font-mono">
              {t.catalog.foundCount.replace('{count}', String(filteredProducts.length))}
            </div>
          </div>

          {/* Панель фильтров и сортировки */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-[#1E0C38]/70 border border-[#00E6FF]/15 mb-6 sm:mb-8 backdrop-blur-md space-y-3 sm:space-y-4">
            {/* Категории (Pills с горизонтальным скроллом на мобилке) */}
            <div className="flex overflow-x-auto no-scrollbar gap-2 pb-1 -mx-1 px-1 sm:mx-0 sm:px-0 sm:flex-wrap">
              {[
                { id: 'all', label: t.catalog.all },
                { id: 'oversize', label: 'Оверсайз' },
                { id: 'cyberpunk', label: 'Киберпанк' },
                { id: 'limited-drops', label: 'Лимитированные дропы' },
                { id: 'minimal', label: 'Минимализм' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 sm:shrink ${
                    activeCategory === cat.id
                      ? 'bg-[#00E6FF] text-[#0B0314] shadow-[0_0_16px_rgba(0,230,255,0.4)]'
                      : 'bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:border-[#00E6FF]/40'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Вторая строка: фильтр по размеру и сортировка */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-white/5 text-xs">
              {/* Размеры (скролл на мобилке) */}
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
                <span className="text-slate-400 font-semibold shrink-0">{t.catalog.size}:</span>
                <div className="flex gap-1 shrink-0">
                  {sizes.map((s) => (
                    <button
                      key={s.id}
                      onClick={() =>
                        setSelectedSizeFilter(selectedSizeFilter === s.code ? null : s.code)
                      }
                      className={`px-2.5 py-1 rounded-lg font-bold border transition-all cursor-pointer ${
                        selectedSizeFilter === s.code
                          ? 'bg-[#00E6FF] text-[#0B0314] border-[#00E6FF]'
                          : 'border-white/10 text-slate-400 hover:text-white hover:border-white/30'
                      }`}
                    >
                      {s.code}
                    </button>
                  ))}
                  {selectedSizeFilter && (
                    <button
                      onClick={() => setSelectedSizeFilter(null)}
                      className="text-slate-400 hover:text-white text-[11px] underline ml-1 cursor-pointer"
                    >
                      Сброс
                    </button>
                  )}
                </div>
              </div>

              {/* Сортировка */}
              <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto">
                <span className="text-slate-400 font-semibold">{t.catalog.sortBy}</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-3 py-1.5 rounded-xl bg-[#120722] border border-white/10 text-white font-semibold text-xs focus:outline-none focus:border-[#00E6FF]"
                >
                  <option value="popular">{t.catalog.sortPopular}</option>
                  <option value="price_asc">{t.catalog.sortPriceAsc}</option>
                  <option value="price_desc">{t.catalog.sortPriceDesc}</option>
                  <option value="rating">{t.catalog.sortRating}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Сетка товаров */}
          {filteredProducts.length === 0 ? (
            <div className="p-10 sm:p-16 text-center rounded-2xl bg-[#1E0C38]/40 border border-white/5">
              <ShoppingBag className="w-12 h-12 text-[#00E6FF] mx-auto opacity-50 mb-3" />
              <div className="font-display font-bold text-lg text-white mb-1">
                {t.catalog.empty}
              </div>
              <button
                onClick={() => {
                  setActiveCategory('all');
                  setSearchQuery('');
                  setSelectedSizeFilter(null);
                }}
                className="mt-4 px-5 py-2.5 rounded-xl bg-[#00E6FF] text-[#0B0314] font-bold text-xs cursor-pointer"
              >
                {t.catalog.resetFilters}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {filteredProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  sizes={sizes}
                  colors={colors}
                  isFavorite={favorites.includes(p.id)}
                  onToggleFavorite={handleToggleFavorite}
                  onAddToCart={(prod, sz, clr) => handleAddToCart(prod, sz, clr, 1)}
                  onOpenDetails={(prod) => setDetailProduct(prod)}
                />
              ))}
            </div>
          )}
        </section>

        {/* СЕКЦИЯ ЛУКБУКА / СТИЛЯ / ПРЕИМУЩЕСТВ */}
        <section className="py-10 sm:py-16 bg-[#160A29]/70 border-t border-b border-[#00E6FF]/15">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8 items-center">
              <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-[#1E0C38] border border-white/10 relative overflow-hidden">
                <div className="text-xs font-mono uppercase text-[#00E6FF] mb-2">Технические детали</div>
                <h3 className="font-display font-bold text-lg sm:text-xl text-white mb-2 sm:mb-3">Хлопок высшего сорта</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Мы используем исключительно длинноволокнистый гребенной хлопок пенье. Полотно проходит процесс декатировки и энзимной стирки.
                </p>
              </div>

              <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-[#1E0C38] border border-[#00E6FF]/30 relative overflow-hidden shadow-[0_0_30px_rgba(0,230,255,0.15)]">
                <div className="text-xs font-mono uppercase text-[#FF286E] mb-2">Шелкография</div>
                <h3 className="font-display font-bold text-lg sm:text-xl text-white mb-2 sm:mb-3">Вытравная печать</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Принт не создает жесткую «резиновую» пленку на ткани — краситель проникает в структуру волокон, вещь дышит даже в жару.
                </p>
              </div>

              <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-[#1E0C38] border border-white/10 relative overflow-hidden">
                <div className="text-xs font-mono uppercase text-[#9BD746] mb-2">Логистика</div>
                <h3 className="font-display font-bold text-lg sm:text-xl text-white mb-2 sm:mb-3">Примерка перед покупкой</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Курьер подождет 15 минут, пока вы примерите вещь. Бесплатная доставка от 5000 ₽ в любой город РФ.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Футер */}
      <Footer
        locale={locale}
        openStaticPage={(slug) => setStaticPageSlug(slug)}
        setActiveCategory={(cat) => {
          setActiveCategory(cat);
          const el = document.getElementById('catalog-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Выдвижная корзина */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQty={handleUpdateQty}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        appliedPromo={appliedPromo}
        onApplyPromo={handleApplyPromo}
        onRemovePromo={() => setAppliedPromo(null)}
        onProceedToCheckout={() => setIsCheckoutOpen(true)}
        locale={locale}
        freeShippingThreshold={siteSettings.freeShippingThreshold}
      />

      {/* Модальное окно оформления заказа */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cart}
        appliedPromo={appliedPromo}
        shippingMethods={shippingMethods}
        pickupPoints={pickupPoints}
        onOrderSuccess={(orderData) => {
          setOrders((prev) => [orderData, ...prev]);
          setCart([]);
          setAppliedPromo(null);
          setIsCheckoutOpen(false);
          setOrderSuccessData(orderData);
        }}
        locale={locale}
      />

      {/* Модалка успешного заказа */}
      {orderSuccessData && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-4">
          <div
            onClick={() => setOrderSuccessData(null)}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />
          <div className="relative w-full max-w-lg rounded-3xl bg-[#160A29] border border-[#00E6FF]/40 text-white shadow-2xl p-6 sm:p-8 text-center z-10 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-[#9BD746]/20 border border-[#9BD746]/40 flex items-center justify-center text-[#9BD746] mx-auto shadow-[0_0_20px_rgba(155,215,70,0.4)]">
              <Check className="w-8 h-8" />
            </div>

            <h3 className="font-display font-black text-2xl text-white">
              {orderSuccessData.status === 'paid'
                ? 'Оплата успешно принята!'
                : t.orderSuccess.title}
            </h3>

            <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2 text-xs">
              <div className="text-slate-400">
                {t.orderSuccess.orderNumber}{' '}
                <strong className="text-[#00E6FF] text-base font-mono">
                  {orderSuccessData.order_number}
                </strong>
              </div>
              <div className="text-slate-300">
                {t.orderSuccess.status}{' '}
                {orderSuccessData.status === 'paid' ? (
                  <span className="px-2.5 py-1 rounded-full bg-[#9BD746]/20 border border-[#9BD746]/40 text-[#9BD746] font-mono font-black text-xs inline-flex items-center gap-1">
                    <Check className="w-3.5 h-3.5 text-[#9BD746]" />
                    ОПЛАЧЕН (СБП)
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded bg-[#00E6FF]/20 text-[#00E6FF] font-bold uppercase">
                    {orderSuccessData.status}
                  </span>
                )}
              </div>
              <div className="text-slate-300 text-[11px] leading-relaxed">
                {orderSuccessData.status === 'paid'
                  ? 'Оплата по СБП прошла успешно (0% комиссии). Заказ уже передан на склад и готовится к отправке!'
                  : t.orderSuccess.trackingNotice}
              </div>
            </div>

            {/* ЕСЛИ ЗАКАЗ ОПЛАЧЕН ЧЕРЕЗ СБП — ПЕРЕХОД К ТРЕКИНГУ ЗАКАЗА В ПРОФИЛЕ */}
            {orderSuccessData.status === 'paid' ? (
              <button
                onClick={() => {
                  setOrderSuccessData(null);
                  setIsAuthOpen(true);
                }}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#00E6FF] to-[#7B2CBF] text-[#0B0314] font-black text-sm shadow-[0_0_20px_rgba(0,230,255,0.4)] hover:brightness-110 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Truck className="w-4 h-4" />
                <span>Посмотреть заказ и трекинг доставки</span>
              </button>
            ) : orderSuccessData.payment_method !== 'cash_on_delivery' ? (
              <button
                onClick={() => {
                  alert(
                    `[Тестовый платёжный шлюз]: Эмуляция успешной оплаты заказа #${orderSuccessData.order_number} на сумму ${orderSuccessData.grand_total} ₽.`
                  );
                  orderSuccessData.status = 'paid';
                  setOrders([...orders]);
                }}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#00E6FF] to-[#7B2CBF] text-[#0B0314] font-black text-sm shadow-[0_0_20px_rgba(0,230,255,0.4)] hover:brightness-110 cursor-pointer"
              >
                {t.orderSuccess.payNow}
              </button>
            ) : null}

            <button
              onClick={() => setOrderSuccessData(null)}
              className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-slate-300 hover:text-white cursor-pointer"
            >
              {t.orderSuccess.backHome}
            </button>
          </div>
        </div>
      )}

      {/* Быстрый просмотр / Карточка товара */}
      <ProductDetailModal
        product={detailProduct}
        onClose={() => setDetailProduct(null)}
        sizes={sizes}
        colors={colors}
        reviews={reviews}
        onAddReview={handleAddReview}
        onAddToCart={(prod, sz, clr, q) => {
          handleAddToCart(prod, sz, clr, q);
          setIsCartOpen(true);
        }}
        isFavorite={detailProduct ? favorites.includes(detailProduct.id) : false}
        onToggleFavorite={handleToggleFavorite}
        locale={locale}
      />

      {/* Панель администратора */}
      <AdminPanel
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        products={products}
        onAddProduct={(newP) => setProducts((prev) => [newP, ...prev])}
        onUpdateProduct={(upd) =>
          setProducts((prev) => prev.map((p) => (p.id === upd.id ? upd : p)))
        }
        onDeleteProduct={(id) =>
          setProducts((prev) => prev.filter((p) => p.id !== id))
        }
        orders={orders}
        onUpdateOrderStatus={(num, status) => {
          setOrders((prev) =>
            prev.map((o) => (o.order_number === num ? { ...o, status } : o))
          );
        }}
        onDeleteOrder={(num) =>
          setOrders((prev) => prev.filter((o) => o.order_number !== num))
        }
        promoCodes={promoCodes}
        onAddPromoCode={(pr) => setPromoCodes((prev) => [pr, ...prev])}
        onDeletePromoCode={(code) =>
          setPromoCodes((prev) => prev.filter((pr) => pr.code !== code))
        }
        reviews={reviews}
        onUpdateReviewStatus={(id, status) => {
          setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
        }}
        onDeleteReview={(id) =>
          setReviews((prev) => prev.filter((r) => r.id !== id))
        }
        settings={siteSettings}
        onUpdateSettings={(s) => setSiteSettings(s)}
        locale={locale}
      />

      {/* Информационные статические страницы */}
      <StaticPagesModal
        slug={staticPageSlug}
        onClose={() => setStaticPageSlug(null)}
        locale={locale}
      />

      {/* Авторизация / Личный кабинет */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        currentUser={currentUser}
        onLogin={(u) => {
          setCurrentUser(u);
          localStorage.setItem('test_user', JSON.stringify(u));
        }}
        onLogout={() => {
          setCurrentUser(null);
          localStorage.removeItem('test_user');
        }}
        locale={locale}
        orders={orders}
        onUpdateOrder={(upd) =>
          setOrders((prev) => prev.map((o) => (o.id === upd.id ? upd : o)))
        }
        onUpdateUser={(u) => {
          setCurrentUser(u);
          localStorage.setItem('test_user', JSON.stringify(u));
        }}
      />
    </div>
  );
};
