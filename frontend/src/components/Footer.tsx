import React from 'react';
import { Sparkles, Send, ShieldCheck, Truck, RefreshCw, Layers } from 'lucide-react';
import type { Locale } from '../types';
import { translations } from '../i18n/translations';

interface FooterProps {
  locale: Locale;
  openStaticPage: (slug: string) => void;
  setActiveCategory: (cat: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ locale, openStaticPage, setActiveCategory }) => {
  const t = translations[locale].footer;

  return (
    <footer className="border-t border-[#00E6FF]/15 bg-[#0C0418] text-slate-400 text-sm mt-24">
      {/* 4 ключевых преимущества перед футером */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border-b border-white/5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
            <div className="p-2.5 rounded-xl bg-[#00E6FF]/10 text-[#00E6FF]">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-white text-sm">Хлопок 240 г/м²</div>
              <div className="text-xs text-slate-400 mt-0.5">Премиум пенье, держит форму коробки</div>
            </div>
          </div>
          <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
            <div className="p-2.5 rounded-xl bg-[#7B2CBF]/20 text-purple-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-white text-sm">Шелкография UV</div>
              <div className="text-xs text-slate-400 mt-0.5">50+ стирок без трещин и выцветания</div>
            </div>
          </div>
          <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
            <div className="p-2.5 rounded-xl bg-[#9BD746]/10 text-[#9BD746]">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-white text-sm">Доставка от 1 дня</div>
              <div className="text-xs text-slate-400 mt-0.5">Примерка 15 мин и 5000+ ПВЗ</div>
            </div>
          </div>
          <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
            <div className="p-2.5 rounded-xl bg-[#FF286E]/10 text-[#FF286E]">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-white text-sm">14 дней возврат</div>
              <div className="text-xs text-slate-400 mt-0.5">Легкий возврат и обмен без волокиты</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Бренд */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl overflow-hidden border border-[#00E6FF]/30 shadow-[0_0_12px_rgba(0,230,255,0.3)] shrink-0 bg-[#0B0314]">
                <img
                  src="/logo.png"
                  alt="TEE STREET"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="font-display font-black text-xl text-white tracking-wider">
                TEE STREET<span className="text-[#00E6FF]">.</span>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">{t.tagline}</p>
            <div className="text-[11px] font-mono text-[#00E6FF]/80">{t.designCredit}</div>
          </div>

          {/* Каталог */}
          <div>
            <div className="font-bold text-white text-xs uppercase tracking-wider mb-3">
              {t.categories}
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => setActiveCategory('oversize')}
                  className="hover:text-[#00E6FF] transition-colors"
                >
                  Оверсайз футболки
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveCategory('cyberpunk')}
                  className="hover:text-[#00E6FF] transition-colors"
                >
                  Киберпанк коллекция
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveCategory('limited-drops')}
                  className="hover:text-[#00E6FF] transition-colors"
                >
                  Лимитированные дропы
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveCategory('minimal')}
                  className="hover:text-[#00E6FF] transition-colors"
                >
                  Минималистичная база
                </button>
              </li>
            </ul>
          </div>

          {/* Информация и сервис */}
          <div>
            <div className="font-bold text-white text-xs uppercase tracking-wider mb-3">{t.info}</div>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => openStaticPage('about')}
                  className="hover:text-[#00E6FF] transition-colors"
                >
                  О бренде и производстве
                </button>
              </li>
              <li>
                <button
                  onClick={() => openStaticPage('delivery-and-payment')}
                  className="hover:text-[#00E6FF] transition-colors"
                >
                  Доставка и оплата
                </button>
              </li>
              <li>
                <button
                  onClick={() => openStaticPage('returns-and-warranty')}
                  className="hover:text-[#00E6FF] transition-colors"
                >
                  Возврат и гарантия
                </button>
              </li>
              <li>
                <button
                  onClick={() => openStaticPage('faq')}
                  className="hover:text-[#00E6FF] transition-colors"
                >
                  Часто задаваемые вопросы (FAQ)
                </button>
              </li>
              <li>
                <button
                  onClick={() => openStaticPage('privacy-policy')}
                  className="hover:text-[#00E6FF] transition-colors"
                >
                  Политика конфиденциальности
                </button>
              </li>
            </ul>
          </div>

          {/* Рассылка и контакты */}
          <div>
            <div className="font-bold text-white text-xs uppercase tracking-wider mb-3">
              {t.contacts}
            </div>
            <p className="text-xs text-slate-400 mb-3">
              Подпишитесь на уведомления о закрытых дропах и секретных промокодах:
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="your@email.com"
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00E6FF]"
              />
              <button className="px-3.5 py-2 rounded-xl bg-[#00E6FF] text-[#0B0314] font-bold text-xs hover:brightness-110 shrink-0">
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="mt-4 text-xs text-slate-400">
              Шоурум: Москва, ул. Дизайнеров, 42
              <br />
              Email: support@teestreet.ru
            </div>
          </div>
        </div>

        <div className="pt-8 mt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <div>© 2026 Интернет-магазин «TEE STREET». {t.rights}</div>
        </div>
      </div>
    </footer>
  );
};
