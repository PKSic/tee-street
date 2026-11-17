import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, Sparkles, Plus, Minus, Tag, Check } from 'lucide-react';
import type { CartItem, PromoCode, Locale } from '../types';
import { TeeMockup } from './TeeMockup';
import { translations } from '../i18n/translations';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQty: (variantId: string, delta: number) => void;
  onRemoveItem: (variantId: string) => void;
  onClearCart: () => void;
  appliedPromo: PromoCode | null;
  onApplyPromo: (code: string) => boolean;
  onRemovePromo: () => void;
  onProceedToCheckout: () => void;
  locale: Locale;
  freeShippingThreshold?: number;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQty,
  onRemoveItem,
  onClearCart,
  appliedPromo,
  onApplyPromo,
  onRemovePromo,
  onProceedToCheckout,
  locale,
  freeShippingThreshold = 5000,
}) => {
  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState('');
  const t = translations[locale].cart;

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.line_total, 0);

  // Расчет скидки
  let discountAmount = 0;
  if (appliedPromo && subtotal >= appliedPromo.min_order_amount) {
    if (appliedPromo.discount_type === 'percentage') {
      discountAmount = Math.round((subtotal * appliedPromo.value) / 100);
      if (appliedPromo.max_discount && discountAmount > appliedPromo.max_discount) {
        discountAmount = appliedPromo.max_discount;
      }
    } else {
      discountAmount = appliedPromo.value;
    }
  }

  const isFreeShipping = subtotal - discountAmount >= freeShippingThreshold;
  const shippingCost = items.length === 0 ? 0 : isFreeShipping ? 0 : 390;
  const grandTotal = Math.max(0, subtotal - discountAmount + shippingCost);

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError('');
    if (!promoInput.trim()) return;
    const ok = onApplyPromo(promoInput.trim());
    if (!ok) {
      setPromoError('Неверный промокод или сумма заказа меньше минимума');
    } else {
      setPromoInput('');
    }
  };

  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - (subtotal - discountAmount));
  const progressPercent = Math.min(100, Math.round(((subtotal - discountAmount) / freeShippingThreshold) * 100));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Затемненный фон */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-full sm:max-w-md bg-[#160A29] border-l border-[#00E6FF]/20 text-white shadow-2xl flex flex-col justify-between">
          {/* Заголовок корзины */}
          <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#00E6FF]" />
              <h2 className="font-display font-bold text-lg">{t.title}</h2>
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#00E6FF]/20 text-[#00E6FF] font-bold">
                {items.reduce((c, i) => c + i.quantity, 0)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {items.length > 0 && (
                <button
                  onClick={onClearCart}
                  className="text-xs text-slate-400 hover:text-red-400 p-1 transition-colors"
                  title={t.clearCart}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={onClose}
                className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Индикатор бесплатной доставки */}
          {items.length > 0 && (
            <div className="px-5 py-3 bg-[#1E0C38]/80 border-b border-white/5">
              <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <Sparkles className="w-3.5 h-3.5 text-[#00E6FF]" />
                  {isFreeShipping
                    ? t.freeShippingSuccess
                    : t.freeShippingProgress.replace('{amount}', remainingForFreeShipping.toLocaleString())}
                </span>
                <span className="font-mono text-[#00E6FF]">{progressPercent}%</span>
              </div>
              <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#00E6FF] to-[#9BD746] transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}

          {/* Список товаров в корзине */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 no-scrollbar">
            {items.length === 0 ? (
              <div className="py-20 text-center flex flex-col items-center">
                <div className="w-16 h-16 rounded-2xl bg-[#2D0F4B]/50 border border-[#00E6FF]/20 flex items-center justify-center text-[#00E6FF] mb-4">
                  <ShoppingBag className="w-8 h-8 opacity-60" />
                </div>
                <h3 className="font-display font-bold text-base mb-1">{t.empty}</h3>
                <p className="text-xs text-slate-400 max-w-xs mb-6">{t.emptyDesc}</p>
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl bg-[#00E6FF] text-[#0B0314] font-bold text-xs hover:brightness-110 shadow-lg"
                >
                  {t.startShopping}
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl bg-[#1E0C38]/70 border border-white/5 flex gap-3 items-center"
                >
                  {/* Мини-мокап */}
                  <div className="w-16 h-16 rounded-lg bg-[#2D0F4B]/50 border border-white/10 flex items-center justify-center overflow-hidden shrink-0 p-1">
                    {((item.product.images_by_color && item.product.images_by_color[item.color.code]) || item.product.image_url) ? (
                      <img
                        src={(item.product.images_by_color && item.product.images_by_color[item.color.code]) || item.product.image_url}
                        alt={item.product.name}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <TeeMockup
                        colorHex={item.color.hex_color}
                        printStyle={item.product.print_style}
                        printTitle={item.product.print_title}
                        printSubtitle={item.product.print_subtitle}
                        className="w-14 h-14"
                      />
                    )}
                  </div>

                  {/* Описание */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-display font-bold text-xs text-white truncate">
                      {item.product.name}
                    </h4>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                      <span className="px-1.5 py-0.2 rounded bg-white/5 font-mono text-slate-200">
                        {item.size.code}
                      </span>
                      <span className="flex items-center gap-1">
                        <span
                          className="w-2.5 h-2.5 rounded-full inline-block border border-white/20"
                          style={{ backgroundColor: item.color.hex_color }}
                        />
                        {item.color.name}
                      </span>
                    </div>
                    <div className="font-black text-xs text-white mt-1.5">
                      {item.unit_price.toLocaleString()} ₽
                    </div>
                  </div>

                  {/* Контролы количества */}
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <button
                      onClick={() => onRemoveItem(item.variant_id)}
                      className="text-slate-400 hover:text-red-400 transition-colors p-1"
                      title="Удалить из корзины"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    {(() => {
                      const variant = item.product.variants.find(
                        (v) => v.size_id === item.size.id && v.color_id === item.color.id
                      );
                      const maxStock = variant ? variant.available : 99;
                      const isMax = item.quantity >= maxStock;
                      return (
                        <div className="flex items-center rounded-lg bg-black/40 border border-white/10 p-0.5">
                          <button
                            type="button"
                            onClick={() => onUpdateQty(item.variant_id, -1)}
                            className="w-6 h-6 rounded flex items-center justify-center text-slate-300 hover:bg-white/10 cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center text-xs font-bold font-mono">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            disabled={isMax}
                            onClick={() => onUpdateQty(item.variant_id, 1)}
                            className="w-6 h-6 rounded flex items-center justify-center text-slate-300 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                            title={isMax ? 'Достигнут максимум остатка на складе' : 'Добавить еще'}
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Подвал корзины с промокодом и кнопкой чекаута */}
          {items.length > 0 && (
            <div className="p-5 border-t border-white/10 bg-[#120722]/90 space-y-4">
              {/* Форма промокода */}
              {appliedPromo ? (
                <div className="p-2.5 rounded-xl bg-[#00E6FF]/10 border border-[#00E6FF]/30 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#00E6FF]" />
                    <span className="font-bold text-[#00E6FF]">{appliedPromo.code}</span>
                    <span className="text-slate-300">
                      (-
                      {appliedPromo.discount_type === 'percentage'
                        ? `${appliedPromo.value}%`
                        : `${appliedPromo.value} ₽`}
                      )
                    </span>
                  </div>
                  <button
                    onClick={onRemovePromo}
                    className="text-xs text-slate-400 hover:text-red-400"
                  >
                    Удалить
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApply} className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                    <input
                      type="text"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      placeholder={t.promoPlaceholder}
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00E6FF]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition-colors"
                  >
                    {t.apply}
                  </button>
                </form>
              )}
              {promoError && <p className="text-[11px] text-red-400">{promoError}</p>}

              {/* Расчет сумм */}
              <div className="space-y-1.5 text-xs text-slate-300">
                <div className="flex justify-between">
                  <span>{t.subtotal}</span>
                  <span className="font-mono text-white">{subtotal.toLocaleString()} ₽</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-[#00E6FF]">
                    <span>{t.discount}</span>
                    <span className="font-mono">-{discountAmount.toLocaleString()} ₽</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>{t.shipping}</span>
                  <span className="font-mono">
                    {shippingCost === 0 ? (
                      <span className="text-[#9BD746] font-bold">Бесплатно</span>
                    ) : (
                      `${shippingCost} ₽`
                    )}
                  </span>
                </div>
                <div className="pt-2 border-t border-white/10 flex justify-between items-baseline">
                  <span className="font-display font-bold text-sm text-white">{t.total}</span>
                  <span className="font-display font-black text-xl text-[#00E6FF]">
                    {grandTotal.toLocaleString()} ₽
                  </span>
                </div>
              </div>

              {/* Кнопка перехода к чекауту */}
              <button
                onClick={() => {
                  onClose();
                  onProceedToCheckout();
                }}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#00E6FF] via-[#0297DE] to-[#7B2CBF] text-[#0B0314] font-black text-sm shadow-[0_0_25px_rgba(0,230,255,0.4)] hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{t.checkoutBtn}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
