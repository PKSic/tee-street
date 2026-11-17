import React, { useState } from 'react';
import { Star, Heart, ShoppingBag, Eye, Check } from 'lucide-react';
import type { Product, Size, Color } from '../types';
import { TeeMockup } from './TeeMockup';

interface ProductCardProps {
  product: Product;
  sizes: Size[];
  colors: Color[];
  isFavorite: boolean;
  onToggleFavorite: (p: Product) => void;
  onAddToCart: (p: Product, size: Size, color: Color) => void;
  onOpenDetails: (p: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  sizes,
  colors,
  isFavorite,
  onToggleFavorite,
  onAddToCart,
  onOpenDetails,
}) => {
  // Выбираем первый доступный цвет и размер в наличии
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
  const [addedAnimation, setAddedAnimation] = useState(false);

  const activeImageUrl = (product.images_by_color && product.images_by_color[selectedColor.code]) || product.image_url;

  const currentVariant = product.variants.find(
    (v) => v.size_id === selectedSize.id && v.color_id === selectedColor.id
  );
  const inStock = Boolean(currentVariant && currentVariant.available > 0);

  const handleSelectColor = (c: Color, e: React.MouseEvent) => {
    e.stopPropagation();
    const isColorAvailable = product.variants.some((v) => v.color_id === c.id && v.available > 0);
    if (!isColorAvailable) return;
    setSelectedColor(c);

    // Если текущий размер недоступен в выбранном цвете, переключаем на первый доступный
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
  };

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!inStock || !currentVariant || currentVariant.available <= 0) return;
    onAddToCart(product, selectedSize, selectedColor);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1200);
  };

  return (
    <div
      onClick={() => onOpenDetails(product)}
      className="group relative rounded-2xl bg-[#1E0C38]/60 border border-[#00E6FF]/15 p-4 backdrop-blur-md transition-all duration-300 hover:border-[#00E6FF]/55 hover:shadow-[0_0_30px_rgba(0,230,255,0.22)] flex flex-col justify-between cursor-pointer"
    >
      <div>
        {/* Бейдж дропа / скидки */}
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5 pointer-events-none">
          {product.badge && (
            <span className="px-2.5 py-1 text-[11px] font-black uppercase tracking-wider rounded-md bg-[#00E6FF] text-[#0B0314] shadow-[0_0_12px_rgba(0,230,255,0.6)]">
              {product.badge}
            </span>
          )}
          {product.old_price && (
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-[#FF286E] text-white">
              SALE -{Math.round(((product.old_price - product.base_price) / product.old_price) * 100)}%
            </span>
          )}
        </div>

        {/* Кнопка «В избранное» */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(product);
          }}
          className="absolute top-4 right-4 z-10 p-2 rounded-xl bg-black/40 hover:bg-black/70 border border-white/10 text-white transition-all hover:scale-110"
          title="В избранное"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isFavorite ? 'fill-[#FF286E] text-[#FF286E]' : 'text-slate-300 hover:text-[#FF286E]'
            }`}
          />
        </button>

        {/* Контейнер мокапа футболки */}
        <div className="relative aspect-square w-full rounded-xl bg-[#2D0F4B]/35 flex items-center justify-center overflow-hidden mb-4 p-3 group-hover:bg-[#2D0F4B]/50 transition-colors">
          {activeImageUrl ? (
            <div className="relative w-full h-full flex items-center justify-center">
              <div
                className="absolute bottom-1 w-3/4 h-5 rounded-[100%] bg-black/50 pointer-events-none"
                style={{ filter: 'blur(12px)' }}
              />
              <img
                key={activeImageUrl}
                src={activeImageUrl}
                alt={product.name}
                className="w-full h-full object-contain drop-shadow-2xl transform transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          ) : (
            <TeeMockup
              colorHex={selectedColor.hex_color}
              printStyle={product.print_style}
              printTitle={product.print_title}
              printSubtitle={product.print_subtitle}
              className="w-full h-full transform transition-transform duration-300 group-hover:scale-105"
            />
          )}

          {/* Быстрый просмотр оверлей */}
          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity pointer-events-none">
            <span className="px-3 py-1.5 rounded-xl bg-black/70 text-xs font-bold text-[#00E6FF] border border-[#00E6FF]/40 backdrop-blur-sm flex items-center gap-1.5 shadow-lg">
              <Eye className="w-3.5 h-3.5" />
              Подробнее
            </span>
          </div>

          {!inStock && (
            <div className="absolute top-2 right-2 z-10 px-2 py-0.5 rounded-md bg-black/85 border border-red-500/40 text-[10px] font-bold text-red-300">
              Нет в наличии
            </div>
          )}
        </div>

        {/* Селектор цвета ткани на карточке (строгий запрет на выбор отсутствующих цветов) */}
        <div className="flex items-center gap-1.5 mb-2.5">
          {colors.map((c) => {
            const isColorAvailable = product.variants.some((v) => v.color_id === c.id && v.available > 0);
            return (
              <button
                key={c.id}
                type="button"
                disabled={!isColorAvailable}
                onClick={(e) => handleSelectColor(c, e)}
                className={`w-4 h-4 rounded-full border transition-all relative ${
                  selectedColor.id === c.id
                    ? 'scale-125 border-[#00E6FF] ring-2 ring-[#00E6FF]/40'
                    : isColorAvailable
                    ? 'border-white/20 hover:scale-110 cursor-pointer'
                    : 'border-white/10 opacity-25 cursor-not-allowed'
                }`}
                style={{ backgroundColor: c.hex_color }}
                title={isColorAvailable ? c.name : `${c.name} (нет в наличии)`}
              >
                {!isColorAvailable && (
                  <span className="absolute inset-0 flex items-center justify-center text-red-400 font-bold text-[8px] select-none leading-none">
                    /
                  </span>
                )}
              </button>
            );
          })}
          <span className="text-[10px] text-slate-400 font-mono ml-1">{selectedColor.name}</span>
        </div>

        {/* Название и рейтинг */}
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-display font-bold text-base text-white group-hover:text-[#00E6FF] transition-colors line-clamp-1">
            {product.name}
          </h3>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-2.5">
          <div className="flex items-center text-amber-400">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span className="font-bold ml-1 text-white">{product.rating_avg}</span>
          </div>
          <span>•</span>
          <span>{product.reviews_count} отзывов</span>
        </div>

        <p className="text-xs text-slate-400 mb-3.5 line-clamp-1">{product.fabric_composition}</p>

        {/* Выбор размера (строгий запрет на выбор отсутствующих размеров) */}
        <div className="flex flex-wrap gap-1 mb-4" onClick={(e) => e.stopPropagation()}>
          {sizes.map((s) => {
            const isSizeAvailable = product.variants.some(
              (v) => v.color_id === selectedColor.id && v.size_id === s.id && v.available > 0
            );
            return (
              <button
                key={s.id}
                type="button"
                disabled={!isSizeAvailable}
                onClick={(e) => {
                  e.stopPropagation();
                  if (!isSizeAvailable) return;
                  setSelectedSize(s);
                }}
                className={`px-2 py-0.5 text-xs font-bold rounded-md border transition-all ${
                  selectedSize.id === s.id && isSizeAvailable
                    ? 'border-[#00E6FF] text-[#00E6FF] bg-[#00E6FF]/15 shadow-[0_0_8px_rgba(0,230,255,0.3)] cursor-pointer'
                    : isSizeAvailable
                    ? 'border-white/10 text-slate-400 hover:border-[#00E6FF]/50 hover:text-slate-200 cursor-pointer'
                    : 'border-white/5 text-slate-600 bg-white/[0.02] line-through cursor-not-allowed opacity-35'
                }`}
                title={isSizeAvailable ? s.name : `${s.name} (нет в наличии)`}
              >
                {s.code}
              </button>
            );
          })}
        </div>
      </div>

      {/* Цена и кнопка купить */}
      <div className="flex items-center justify-between pt-2 border-t border-white/5">
        <div>
          <div className="text-lg font-black font-display text-white">
            {product.base_price.toLocaleString()} ₽
          </div>
          {product.old_price && (
            <div className="text-xs line-through text-slate-500 font-mono">
              {product.old_price.toLocaleString()} ₽
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={handleAdd}
          disabled={!inStock}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold text-xs transition-all shadow-[0_0_16px_rgba(0,230,255,0.35)] ${
            addedAnimation
              ? 'bg-[#9BD746] text-[#0B0314] cursor-pointer'
              : inStock
              ? 'bg-gradient-to-r from-[#00E6FF] to-[#7B2CBF] text-[#0B0314] hover:brightness-110 active:scale-95 cursor-pointer'
              : 'bg-white/10 text-slate-500 cursor-not-allowed shadow-none'
          }`}
        >
          {addedAnimation ? (
            <>
              <Check className="w-3.5 h-3.5" />
              Добавлено!
            </>
          ) : (
            <>
              <ShoppingBag className="w-3.5 h-3.5" />
              {inStock ? 'В корзину' : 'Нет в наличии'}
            </>
          )}
        </button>
      </div>
    </div>
  );
};
