import React, { useState, useEffect } from 'react';
import {
  X,
  Star,
  ShoppingBag,
  Heart,
  Check,
  Plus,
  Minus,
  Sparkles,
} from 'lucide-react';
import type { Product, Size, Color, Review, Locale } from '../types';
import { TeeMockup } from './TeeMockup';
import { translations } from '../i18n/translations';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  sizes: Size[];
  colors: Color[];
  reviews: Review[];
  onAddReview: (productId: string, rating: number, title: string, body: string, author: string) => void;
  onAddToCart: (p: Product, size: Size, color: Color, quantity: number) => void;
  isFavorite: boolean;
  onToggleFavorite: (p: Product) => void;
  locale: Locale;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  sizes,
  colors,
  reviews,
  onAddReview,
  onAddToCart,
  isFavorite,
  onToggleFavorite,
  locale,
}) => {
  if (!product) return null;

  const t = translations[locale].productModal;

  // Находим первый цвет, который реально в наличии у этого товара
  const availableColors = colors.filter((c) =>
    product.variants.some((v) => v.color_id === c.id && v.available > 0)
  );
  const initialColor = availableColors[0] || colors[0];

  const availableSizes = sizes.filter((s) =>
    product.variants.some((v) => v.color_id === initialColor.id && v.size_id === s.id && v.available > 0)
  );
  const initialSize = availableSizes.find((s) => s.code === 'M') || availableSizes[0] || sizes[0];

  const [selectedColor, setSelectedColor] = useState<Color>(initialColor);
  const [selectedSize, setSelectedSize] = useState<Size>(initialSize);
  const [qty, setQty] = useState(1);
  const [showSizeTable, setShowSizeTable] = useState(false);
  const [added, setAdded] = useState(false);

  // При открытии нового товара сбрасываем выбор на доступные цвет и размер
  useEffect(() => {
    if (!product) return;
    const firstColor = colors.find((c) =>
      product.variants.some((v) => v.color_id === c.id && v.available > 0)
    ) || colors[0];
    setSelectedColor(firstColor);

    const firstSize = sizes.find((s) =>
      product.variants.some((v) => v.color_id === firstColor.id && v.size_id === s.id && v.available > 0 && s.code === 'M')
    ) || sizes.find((s) =>
      product.variants.some((v) => v.color_id === firstColor.id && v.size_id === s.id && v.available > 0)
    ) || sizes[0];
    setSelectedSize(firstSize);

    setQty(1);
    setAdded(false);
  }, [product?.id]);

  const activeImageUrl = (product.images_by_color && product.images_by_color[selectedColor.code]) || product.image_url;

  // Форма отзыва
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewAuthor, setReviewAuthor] = useState('');
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewBody, setReviewBody] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);

  const productReviews = reviews.filter((r) => r.product_id === product.id);

  const currentVariant = product.variants.find(
    (v) => v.size_id === selectedSize.id && v.color_id === selectedColor.id
  );
  const stock = currentVariant ? Math.max(0, currentVariant.available) : 0;
  const inStock = stock > 0;

  const handleSelectColor = (c: Color) => {
    const isColorAvailable = product.variants.some((v) => v.color_id === c.id && v.available > 0);
    if (!isColorAvailable) return;
    setSelectedColor(c);

    // Если текущий размер недоступен в новом цвете, переключаем на первый доступный
    const isCurrentSizeAvailable = product.variants.some(
      (v) => v.color_id === c.id && v.size_id === selectedSize.id && v.available > 0
    );
    if (!isCurrentSizeAvailable) {
      const firstAvailable = sizes.find((s) =>
        product.variants.some((v) => v.color_id === c.id && v.size_id === s.id && v.available > 0)
      );
      if (firstAvailable) {
        setSelectedSize(firstAvailable);
      }
    }
    setQty(1);
  };

  const handleSelectSize = (s: Size) => {
    const isSizeAvailable = product.variants.some(
      (v) => v.color_id === selectedColor.id && v.size_id === s.id && v.available > 0
    );
    if (!isSizeAvailable) return;
    setSelectedSize(s);
    setQty(1);
  };

  const handleAddToCart = () => {
    if (!inStock || stock <= 0 || !currentVariant || currentVariant.available <= 0) return;
    onAddToCart(product, selectedSize, selectedColor, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewAuthor || !reviewBody) return;
    onAddReview(product.id, reviewRating, reviewTitle || 'Отличная футболка', reviewBody, reviewAuthor);
    setReviewSuccess(true);
    setReviewAuthor('');
    setReviewTitle('');
    setReviewBody('');
    setTimeout(() => setReviewSuccess(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-2.5 sm:p-4">
      <div onClick={onClose} className="fixed inset-0 bg-black/80 backdrop-blur-md" />

      <div className="relative w-full max-w-4xl rounded-2xl sm:rounded-3xl bg-[#160A29] border border-[#00E6FF]/30 text-white shadow-2xl overflow-y-auto md:overflow-hidden z-10 flex flex-col md:flex-row max-h-[94vh]">
        {/* Кнопки управления в правом верхнем углу (Избранное и Закрыть рядом без наложения) */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-30 flex items-center gap-2">
          <button
            type="button"
            onClick={() => onToggleFavorite(product)}
            className="p-1.5 sm:p-2 rounded-xl bg-black/60 hover:bg-black/80 border border-white/15 text-white transition-colors cursor-pointer shadow-lg backdrop-blur-sm"
            title={isFavorite ? 'Удалить из избранного' : 'Добавить в избранное'}
          >
            <Heart
              className={`w-4 h-4 sm:w-5 sm:h-5 transition-colors ${
                isFavorite ? 'fill-[#FF286E] text-[#FF286E]' : 'text-slate-300 hover:text-[#FF286E]'
              }`}
            />
          </button>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 sm:p-2 rounded-xl bg-black/60 hover:bg-black/80 border border-white/15 text-slate-300 hover:text-white transition-colors cursor-pointer shadow-lg backdrop-blur-sm"
            title="Закрыть"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Левая колонка: Большой мокап футболки */}
        <div className="md:w-1/2 p-4 sm:p-6 md:p-8 bg-gradient-to-b from-[#2D0F4B]/40 to-[#120722] flex flex-col items-center justify-center relative border-b md:border-b-0 md:border-r border-white/10 shrink-0">
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 flex gap-2">
            {product.badge && (
              <span className="px-2.5 sm:px-3 py-1 text-[11px] sm:text-xs font-black uppercase rounded-lg bg-[#00E6FF] text-[#0B0314] shadow-[0_0_15px_rgba(0,230,255,0.5)]">
                {product.badge}
              </span>
            )}
          </div>

          <div className="w-full aspect-square max-w-[280px] sm:max-w-sm flex items-center justify-center p-2 sm:p-4">
            {activeImageUrl ? (
              <div className="relative w-full h-full flex items-center justify-center">
                <div
                  className="absolute bottom-2 w-3/4 h-6 rounded-[100%] bg-black/55 pointer-events-none"
                  style={{ filter: 'blur(16px)' }}
                />
                <img
                  key={activeImageUrl}
                  src={activeImageUrl}
                  alt={`${product.name} - ${selectedColor.name}`}
                  className="w-full h-full object-contain drop-shadow-2xl transition-all duration-300"
                />
              </div>
            ) : (
              <TeeMockup
                colorHex={selectedColor.hex_color}
                printStyle={product.print_style}
                printTitle={product.print_title}
                printSubtitle={product.print_subtitle}
                className="w-full h-full"
              />
            )}
          </div>

          {/* Быстрые фичи под мокапом */}
          <div className="flex items-center gap-3 sm:gap-4 text-[11px] sm:text-xs text-slate-400 mt-2 font-mono">
            <span className="flex items-center gap-1 text-[#00E6FF]">
              <Sparkles className="w-3.5 h-3.5" />
              Boxy Fit 240g
            </span>
            <span>•</span>
            <span>Арт: {product.model_sku}</span>
          </div>
        </div>

        {/* Правая колонка: Детали, селекторы, отзывы */}
        <div className="md:w-1/2 p-4 sm:p-6 md:p-8 overflow-y-auto space-y-5 sm:space-y-6 no-scrollbar">
          {/* Заголовок и цена */}
          <div>
            <div className="flex items-center justify-between mb-2 pr-20">
              <span className="text-xs font-mono uppercase text-[#00E6FF] tracking-wider">
                Streetwear drop // 2026
              </span>
            </div>
            <h2 className="font-display font-black text-2xl text-white mb-2 leading-tight">
              {product.name}
            </h2>

            {/* Рейтинг */}
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-3">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <span className="font-bold text-white">{product.rating_avg}</span>
              <span>•</span>
              <a href="#reviews" className="underline hover:text-[#00E6FF]">
                {productReviews.length} отзывов
              </a>
            </div>

            {/* Цена */}
            <div className="flex items-baseline gap-3">
              <span className="font-display font-black text-3xl text-white">
                {product.base_price.toLocaleString()} ₽
              </span>
              {product.old_price && (
                <span className="text-sm line-through text-slate-500 font-mono">
                  {product.old_price.toLocaleString()} ₽
                </span>
              )}
            </div>
          </div>

          {/* Выбор цвета (строгий запрет на выбор отсутствующих цветов) */}
          <div>
            <div className="flex justify-between items-center text-xs font-semibold text-slate-300 mb-2">
              <span>{t.selectColor}:</span>
              <span className="text-[#00E6FF]">{selectedColor.name}</span>
            </div>
            <div className="flex items-center gap-2">
              {colors.map((c) => {
                const isColorAvailable = product.variants.some((v) => v.color_id === c.id && v.available > 0);
                return (
                  <button
                    key={c.id}
                    type="button"
                    disabled={!isColorAvailable}
                    onClick={() => handleSelectColor(c)}
                    className={`w-7 h-7 rounded-full border transition-all relative ${
                      selectedColor.id === c.id
                        ? 'scale-110 border-[#00E6FF] ring-2 ring-[#00E6FF]/50 shadow-[0_0_10px_rgba(0,230,255,0.4)] cursor-pointer'
                        : isColorAvailable
                        ? 'border-white/20 hover:scale-105 cursor-pointer'
                        : 'border-white/10 opacity-25 cursor-not-allowed'
                    }`}
                    style={{ backgroundColor: c.hex_color }}
                    title={isColorAvailable ? c.name : `${c.name} (нет в наличии)`}
                  >
                    {!isColorAvailable && (
                      <span className="absolute inset-0 flex items-center justify-center text-red-400 font-bold text-sm select-none">
                        /
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Выбор размера + Таблица размеров (строгий запрет на выбор отсутствующих размеров) */}
          <div>
            <div className="flex justify-between items-center text-xs font-semibold text-slate-300 mb-2">
              <span>{t.selectSize}:</span>
              <button
                type="button"
                onClick={() => setShowSizeTable(!showSizeTable)}
                className="text-xs text-[#00E6FF] hover:underline cursor-pointer"
              >
                {showSizeTable ? 'Скрыть таблицу' : 'Таблица размеров'}
              </button>
            </div>
            <div className="grid grid-cols-6 gap-1.5">
              {sizes.map((s) => {
                const isSizeAvailable = product.variants.some(
                  (v) => v.color_id === selectedColor.id && v.size_id === s.id && v.available > 0
                );
                return (
                  <button
                    key={s.id}
                    type="button"
                    disabled={!isSizeAvailable}
                    onClick={() => handleSelectSize(s)}
                    className={`py-2 rounded-xl text-xs font-black border transition-all ${
                      selectedSize.id === s.id && isSizeAvailable
                        ? 'bg-[#00E6FF] text-[#0B0314] border-[#00E6FF] shadow-[0_0_15px_rgba(0,230,255,0.4)] cursor-pointer'
                        : isSizeAvailable
                        ? 'bg-white/5 border-white/10 text-slate-300 hover:border-[#00E6FF]/40 cursor-pointer'
                        : 'bg-white/[0.02] border-white/5 text-slate-600 line-through cursor-not-allowed opacity-35'
                    }`}
                    title={isSizeAvailable ? s.name : `${s.name} (нет в наличии)`}
                  >
                    {s.code}
                  </button>
                );
              })}
            </div>

            {/* Таблица параметров размеров */}
            {showSizeTable && (
              <div className="p-3 mt-3 rounded-xl bg-black/40 border border-white/10 text-[11px] text-slate-300 overflow-x-auto">
                <table className="w-full text-center">
                  <thead>
                    <tr className="border-b border-white/10 text-slate-400 font-mono">
                      <th className="py-1">Размер</th>
                      <th>Ширина (A)</th>
                      <th>Длина (B)</th>
                      <th>Плечо (C)</th>
                    </tr>
                  </thead>
                  <tbody className="font-mono">
                    <tr><td className="py-1 text-[#00E6FF] font-bold">XS</td><td>54 см</td><td>70 см</td><td>18 см</td></tr>
                    <tr><td className="py-1 text-[#00E6FF] font-bold">S</td><td>57 см</td><td>72 см</td><td>19 см</td></tr>
                    <tr><td className="py-1 text-[#00E6FF] font-bold">M</td><td>60 см</td><td>74 см</td><td>20 см</td></tr>
                    <tr><td className="py-1 text-[#00E6FF] font-bold">L</td><td>63 см</td><td>76 см</td><td>21 см</td></tr>
                    <tr><td className="py-1 text-[#00E6FF] font-bold">XL</td><td>66 см</td><td>78 см</td><td>22 см</td></tr>
                    <tr><td className="py-1 text-[#00E6FF] font-bold">2XL</td><td>69 см</td><td>80 см</td><td>23 см</td></tr>
                  </tbody>
                </table>
              </div>
            )}

            {inStock ? (
              <div className="flex items-center gap-2 mt-2 text-xs">
                <span className="w-2 h-2 rounded-full bg-[#9BD746] animate-ping" />
                <span className="text-[#9BD746] font-semibold">В наличии на складе ({stock} шт.)</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 mt-2 text-xs">
                <span className="w-2 h-2 rounded-full bg-red-400" />
                <span className="text-red-400 font-semibold">Этого размера или цвета нет в наличии</span>
              </div>
            )}
          </div>

          {/* Количество и кнопка в корзину */}
          <div className="flex items-center gap-3 pt-2">
            <div className="flex items-center rounded-xl bg-black/40 border border-white/10 p-1">
              <button
                type="button"
                disabled={!inStock || qty <= 1}
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-300 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-8 text-center text-sm font-bold font-mono">{inStock ? qty : 0}</span>
              <button
                type="button"
                disabled={!inStock || qty >= stock}
                onClick={() => setQty(Math.min(stock, qty + 1))}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-300 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <button
              type="button"
              onClick={handleAddToCart}
              disabled={!inStock || stock <= 0}
              className={`flex-1 py-3.5 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(0,230,255,0.4)] ${
                !inStock || stock <= 0
                  ? 'bg-white/10 text-slate-500 border border-white/10 cursor-not-allowed shadow-none'
                  : added
                  ? 'bg-[#9BD746] text-[#0B0314] cursor-pointer'
                  : 'bg-gradient-to-r from-[#00E6FF] to-[#7B2CBF] text-[#0B0314] hover:brightness-110 active:scale-95 cursor-pointer'
              }`}
            >
              {!inStock || stock <= 0 ? (
                'Нет в наличии'
              ) : added ? (
                <>
                  <Check className="w-4 h-4" />
                  Успешно добавлено!
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  Добавить в корзину • {(product.base_price * qty).toLocaleString()} ₽
                </>
              )}
            </button>
          </div>

          {/* Описание и состав */}
          <div className="pt-4 border-t border-white/10 space-y-3 text-xs text-slate-300">
            <div>
              <span className="font-bold text-white block mb-1">Описание:</span>
              <p className="leading-relaxed">{product.description}</p>
            </div>
            <div>
              <span className="font-bold text-white block mb-1">{t.composition}:</span>
              <p>{product.fabric_composition}</p>
            </div>
            <div>
              <span className="font-bold text-white block mb-1">{t.care}:</span>
              <p className="text-slate-400">{t.careText}</p>
            </div>
          </div>

          {/* Секция отзывов */}
          <div id="reviews" className="pt-6 border-t border-white/10 space-y-4">
            <h3 className="font-display font-bold text-base text-white">
              {t.reviews.replace('{count}', String(productReviews.length))}
            </h3>

            {/* Форма добавления отзыва */}
            <form onSubmit={handleReviewSubmit} className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <div className="font-bold text-xs text-white flex items-center justify-between">
                <span>{t.writeReview}</span>
                {/* Звезды */}
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setReviewRating(star)}
                      className="p-0.5 text-amber-400 hover:scale-110 transition-transform cursor-pointer"
                    >
                      <Star
                        className={`w-4 h-4 ${
                          star <= reviewRating ? 'fill-current' : 'text-slate-600'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <input
                type="text"
                required
                value={reviewAuthor}
                onChange={(e) => setReviewAuthor(e.target.value)}
                placeholder="Ваше имя"
                className="w-full px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-xs text-white"
              />
              <input
                type="text"
                value={reviewTitle}
                onChange={(e) => setReviewTitle(e.target.value)}
                placeholder={t.reviewTitle}
                className="w-full px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-xs text-white"
              />
              <textarea
                required
                rows={2}
                value={reviewBody}
                onChange={(e) => setReviewBody(e.target.value)}
                placeholder={t.reviewBody}
                className="w-full px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-xs text-white"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-[#00E6FF] text-[#0B0314] font-bold text-xs hover:brightness-110 cursor-pointer"
              >
                {t.submitReview}
              </button>
              {reviewSuccess && (
                <span className="text-xs text-[#9BD746] ml-2 font-semibold">Спасибо! Отзыв опубликован.</span>
              )}
            </form>

            {/* Список отзывов */}
            <div className="space-y-3">
              {productReviews.map((r) => (
                <div key={r.id} className="p-3.5 rounded-xl bg-black/30 border border-white/5 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-white">{r.author_name}</span>
                    <div className="flex text-amber-400">
                      {[...Array(r.rating)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-current" />
                      ))}
                    </div>
                  </div>
                  <div className="font-semibold text-xs text-slate-200">{r.title}</div>
                  <p className="text-xs text-slate-400">{r.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
