import React, { useState } from 'react';
import {
  ShoppingBag,
  Heart,
  Search,
  Moon,
  Sun,
  Monitor,
  Globe,
  User,
  Shield,
  Menu,
  X,
  Sparkles,
} from 'lucide-react';
import type { Locale, ThemeMode, User as UserType } from '../types';
import { translations } from '../i18n/translations';

interface NavbarProps {
  locale: Locale;
  setLocale: (l: Locale) => void;
  theme: ThemeMode;
  setTheme: (t: ThemeMode) => void;
  cartCount: number;
  cartTotal: number;
  favoritesCount: number;
  openCart: () => void;
  openFavorites: () => void;
  openAuth: () => void;
  openAdmin: () => void;
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  openStaticPage: (slug: string) => void;
  storeName?: string;
  currentUser?: UserType | null;
}

export const Navbar: React.FC<NavbarProps> = ({
  locale,
  setLocale,
  theme,
  setTheme,
  cartCount,
  cartTotal,
  favoritesCount,
  openCart,
  openFavorites,
  openAuth,
  openAdmin,
  activeCategory,
  setActiveCategory,
  searchQuery,
  setSearchQuery,
  openStaticPage,
  storeName = 'TEE STREET',
  currentUser,
}) => {
  const t = translations[locale].nav;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  const cycleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const getThemeIcon = () => {
    if (theme === 'light') return <Sun className="w-4 h-4 text-amber-400" />;
    return <Moon className="w-4 h-4 text-[#00E6FF]" />;
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#120722]/90 border-b border-[#00E6FF]/15 transition-all">
      {/* Верхняя строка дропа */}
      <div className="bg-gradient-to-r from-[#00E6FF]/10 via-[#7B2CBF]/20 to-[#00E6FF]/10 border-b border-[#00E6FF]/10 py-1 text-center text-[10px] sm:text-xs font-semibold tracking-wider text-[#00E6FF] px-2 truncate sm:overflow-visible">
        <span className="inline-flex items-center gap-1.5 animate-pulse">
          <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
          <span className="truncate">
            {locale === 'ru' && 'ДРОП 2026 // БЕСПЛАТНАЯ ДОСТАВКА ОТ 5 000 ₽ ПО ВСЕЙ РОССИИ'}
            {locale === 'en' && 'DROP 2026 // FREE WORLDWIDE SHIPPING OVER 5,000 ₽'}
            {locale === 'zh-CN' && '2026全新系列 // 消费满 5,000 ₽ 免费发货'}
          </span>
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Логотип бренда «TEE STREET» */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={() => {
              setActiveCategory('all');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-2 group text-left cursor-pointer"
          >
            <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl overflow-hidden border border-[#00E6FF]/40 shadow-[0_0_16px_rgba(0,230,255,0.4)] group-hover:scale-105 group-hover:border-[#00E6FF] transition-all bg-[#0B0314] shrink-0">
              <img
                src="/logo.png"
                alt="TEE STREET"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="font-display font-black text-base sm:text-lg tracking-wider text-white group-hover:text-[#00E6FF] transition-colors leading-none uppercase">
                {storeName}<span className="text-[#00E6FF]">.</span>
              </div>
              <div className="text-[9px] sm:text-[10px] font-mono tracking-widest text-[#00E6FF]/80 uppercase">
                CYBER // STREETWEAR
              </div>
            </div>
          </button>
        </div>

        {/* Навигационные ссылки десктоп */}
        <nav className="hidden md:flex items-center gap-1 font-semibold text-sm">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeCategory === 'all'
                ? 'bg-[#00E6FF]/15 text-[#00E6FF] font-bold border border-[#00E6FF]/30'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            {t.catalog}
          </button>
          <button
            onClick={() => setActiveCategory('oversize')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeCategory === 'oversize'
                ? 'bg-[#00E6FF]/15 text-[#00E6FF] font-bold border border-[#00E6FF]/30'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            {t.oversize}
          </button>
          <button
            onClick={() => setActiveCategory('cyberpunk')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeCategory === 'cyberpunk'
                ? 'bg-[#00E6FF]/15 text-[#00E6FF] font-bold border border-[#00E6FF]/30'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            {t.cyberpunk}
          </button>
          <button
            onClick={() => setActiveCategory('limited-drops')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeCategory === 'limited-drops'
                ? 'bg-[#00E6FF]/15 text-[#00E6FF] font-bold border border-[#00E6FF]/30'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            {t.drops}
          </button>
          <button
            onClick={() => openStaticPage('about')}
            className="px-3 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          >
            {t.about}
          </button>
          <button
            onClick={() => openStaticPage('delivery-and-payment')}
            className="px-3 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          >
            {t.delivery}
          </button>
        </nav>

        {/* Поиск десктоп */}
        <div className="hidden lg:flex items-center flex-1 max-w-xs mx-2">
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#00E6FF] transition-all"
            />
          </div>
        </div>

        {/* Правый блок: Язык, Тема, Избранное, Корзина, Профиль, Меню */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Языковой селектор (десктоп) */}
          <div className="relative hidden sm:block">
            <button
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-200 transition-colors"
            >
              <Globe className="w-3.5 h-3.5 text-[#00E6FF]" />
              <span className="uppercase">{locale.split('-')[0]}</span>
            </button>
            {langMenuOpen && (
              <div className="absolute right-0 mt-2 w-32 rounded-xl bg-[#1E0C38] border border-[#00E6FF]/30 shadow-2xl py-1 z-50">
                <button
                  onClick={() => {
                    setLocale('ru');
                    setLangMenuOpen(false);
                  }}
                  className={`w-full px-3 py-1.5 text-left text-xs font-semibold flex items-center justify-between hover:bg-[#00E6FF]/20 ${
                    locale === 'ru' ? 'text-[#00E6FF]' : 'text-slate-200'
                  }`}
                >
                  Русский <span>RU</span>
                </button>
                <button
                  onClick={() => {
                    setLocale('en');
                    setLangMenuOpen(false);
                  }}
                  className={`w-full px-3 py-1.5 text-left text-xs font-semibold flex items-center justify-between hover:bg-[#00E6FF]/20 ${
                    locale === 'en' ? 'text-[#00E6FF]' : 'text-slate-200'
                  }`}
                >
                  English <span>EN</span>
                </button>
                <button
                  onClick={() => {
                    setLocale('zh-CN');
                    setLangMenuOpen(false);
                  }}
                  className={`w-full px-3 py-1.5 text-left text-xs font-semibold flex items-center justify-between hover:bg-[#00E6FF]/20 ${
                    locale === 'zh-CN' ? 'text-[#00E6FF]' : 'text-slate-200'
                  }`}
                >
                  中文 <span>ZH</span>
                </button>
              </div>
            )}
          </div>

          {/* Переключатель темы (десктоп) */}
          <button
            onClick={cycleTheme}
            className="hidden sm:flex p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 transition-colors cursor-pointer"
            title={theme === 'light' ? 'Светлая тема (кликните для темной)' : 'Темная тема (кликните для светлой)'}
          >
            {getThemeIcon()}
          </button>

          {/* Избранное */}
          <button
            onClick={openFavorites}
            className="relative p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 hover:text-[#FF286E] transition-colors cursor-pointer"
            title={t.favorites}
          >
            <Heart className={`w-4 h-4 ${favoritesCount > 0 ? 'fill-[#FF286E] text-[#FF286E]' : ''}`} />
            {favoritesCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#FF286E] text-white text-[10px] font-black flex items-center justify-center shadow-lg">
                {favoritesCount}
              </span>
            )}
          </button>

          {/* Корзина */}
          <button
            onClick={openCart}
            className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#00E6FF] to-[#7B2CBF] text-[#0B0314] font-black text-xs shadow-[0_0_16px_rgba(0,230,255,0.35)] hover:brightness-110 active:scale-95 transition-all cursor-pointer"
            title={t.cart}
          >
            <ShoppingBag className="w-4 h-4 text-[#0B0314]" />
            <span className="hidden sm:inline font-bold">
              {cartTotal > 0 ? `${cartTotal.toLocaleString()} ₽` : t.cart}
            </span>
            {cartCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-[#0B0314] text-[#00E6FF] text-[11px] font-black flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>

          {/* Кнопка профиля / заказов */}
          <button
            onClick={openAuth}
            className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 hover:text-[#00E6FF] transition-colors cursor-pointer"
            title={currentUser ? `${currentUser.first_name}: Мои заказы и профиль` : t.signIn}
          >
            <User className="w-4 h-4 text-[#00E6FF]" />
            <span className="hidden md:inline text-xs font-bold text-white">
              {currentUser ? currentUser.first_name : 'Профиль'}
            </span>
          </button>

          {/* Кнопка входа в Админ-панель (ТОЛЬКО ДЛЯ ДЕСКТОПА - на телефонах скрыта) */}
          <button
            onClick={openAdmin}
            className="hidden lg:flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-purple-950/40 hover:bg-purple-900/60 border border-purple-500/30 text-purple-300 hover:text-purple-100 text-xs font-semibold transition-colors cursor-pointer"
            title="Панель администратора (только Desktop)"
          >
            <Shield className="w-3.5 h-3.5 text-purple-400" />
            <span>{t.admin}</span>
          </button>

          {/* Мобильная кнопка меню */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 cursor-pointer"
            aria-label="Меню навигации"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Мобильное выдвижное меню */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#00E6FF]/15 bg-[#120722]/98 px-4 pt-3 pb-5 space-y-3 backdrop-blur-2xl animate-in slide-in-from-top-2 duration-200">
          {/* Поиск в мобильном меню */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#00E6FF]"
            />
          </div>

          {/* Сетка категорий */}
          <div className="grid grid-cols-2 gap-2 text-xs font-bold">
            <button
              onClick={() => {
                setActiveCategory('all');
                setMobileMenuOpen(false);
              }}
              className={`p-2.5 rounded-xl text-left border transition-all ${
                activeCategory === 'all'
                  ? 'bg-[#00E6FF]/15 border-[#00E6FF] text-[#00E6FF]'
                  : 'bg-white/5 border-white/5 text-slate-200'
              }`}
            >
              {t.catalog}
            </button>
            <button
              onClick={() => {
                setActiveCategory('oversize');
                setMobileMenuOpen(false);
              }}
              className={`p-2.5 rounded-xl text-left border transition-all ${
                activeCategory === 'oversize'
                  ? 'bg-[#00E6FF]/15 border-[#00E6FF] text-[#00E6FF]'
                  : 'bg-white/5 border-white/5 text-slate-200'
              }`}
            >
              {t.oversize}
            </button>
            <button
              onClick={() => {
                setActiveCategory('cyberpunk');
                setMobileMenuOpen(false);
              }}
              className={`p-2.5 rounded-xl text-left border transition-all ${
                activeCategory === 'cyberpunk'
                  ? 'bg-[#00E6FF]/15 border-[#00E6FF] text-[#00E6FF]'
                  : 'bg-white/5 border-white/5 text-slate-200'
              }`}
            >
              {t.cyberpunk}
            </button>
            <button
              onClick={() => {
                setActiveCategory('limited-drops');
                setMobileMenuOpen(false);
              }}
              className={`p-2.5 rounded-xl text-left border transition-all ${
                activeCategory === 'limited-drops'
                  ? 'bg-[#00E6FF]/15 border-[#00E6FF] text-[#00E6FF]'
                  : 'bg-white/5 border-white/5 text-slate-200'
              }`}
            >
              {t.drops}
            </button>
          </div>

          {/* Информационные страницы */}
          <div className="grid grid-cols-2 gap-2 text-[11px] font-semibold text-slate-300 pt-1">
            <button
              onClick={() => {
                openStaticPage('about');
                setMobileMenuOpen(false);
              }}
              className="p-2 rounded-lg text-left bg-white/[0.03] hover:bg-white/10"
            >
              {t.about}
            </button>
            <button
              onClick={() => {
                openStaticPage('delivery-and-payment');
                setMobileMenuOpen(false);
              }}
              className="p-2 rounded-lg text-left bg-white/[0.03] hover:bg-white/10"
            >
              {t.delivery}
            </button>
            <button
              onClick={() => {
                openStaticPage('returns-and-warranty');
                setMobileMenuOpen(false);
              }}
              className="p-2 rounded-lg text-left bg-white/[0.03] hover:bg-white/10"
            >
              Возврат и обмен
            </button>
            <button
              onClick={() => {
                openStaticPage('faq');
                setMobileMenuOpen(false);
              }}
              className="p-2 rounded-lg text-left bg-white/[0.03] hover:bg-white/10"
            >
              Частые вопросы (FAQ)
            </button>
          </div>

          {/* Переключатели языка и темы на мобилке */}
          <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs">
            <div className="flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-[#00E6FF]" />
              {(['ru', 'en', 'zh-CN'] as Locale[]).map((l) => (
                <button
                  key={l}
                  onClick={() => setLocale(l)}
                  className={`px-2 py-1 rounded-md text-[10px] font-mono font-bold transition-colors ${
                    locale === l
                      ? 'bg-[#00E6FF] text-[#0B0314]'
                      : 'bg-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  {l.toUpperCase().replace('-CN', '')}
                </button>
              ))}
            </div>

            <button
              onClick={cycleTheme}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[11px] font-mono text-slate-200 cursor-pointer"
            >
              {getThemeIcon()}
              <span>{theme === 'light' ? 'Светлая тема' : 'Темная тема'}</span>
            </button>
          </div>

          {/* Кнопка Профиля / Заказов на мобилке (БЕЗ АДМИНКИ) */}
          <div className="pt-2 border-t border-white/10">
            <button
              onClick={() => {
                openAuth();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-[#00E6FF]/20 via-[#7B2CBF]/30 to-[#00E6FF]/20 border border-[#00E6FF]/40 text-xs font-bold text-white shadow-[0_0_15px_rgba(0,230,255,0.2)] hover:brightness-110 active:scale-95 transition-all cursor-pointer"
            >
              <User className="w-4 h-4 text-[#00E6FF]" />
              <span>
                {currentUser
                  ? `${currentUser.first_name} // Мои заказы и возвраты`
                  : 'Войти / Мои заказы и возвраты'}
              </span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
