import React, { useState, useEffect } from 'react';
import {
  Palette,
  Star,
  Check,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Sliders,
  RotateCcw,
  Zap
} from 'lucide-react';

export type ThemeId = 'stealth' | 'crimson' | 'emerald' | 'amber' | 'cyberpunk';

export interface ThemeOption {
  id: ThemeId;
  name: string;
  tagline: string;
  badge: string;
  bgHex: string;
  accentHex: string;
  secondaryHex: string;
  description: string;
}

export const THEMES: ThemeOption[] = [
  {
    id: 'stealth',
    name: 'Stealth Onyx & Chrome',
    tagline: 'High-Fashion Стритвир (Balenciaga / Off-White)',
    badge: 'Стиль 1 // Рекомендованный',
    bgHex: '#08080A',
    accentHex: '#FFFFFF',
    secondaryHex: '#94A3B8',
    description: 'Матовый графит, титановый серый, полированный стальной хром и чистый контрастный белый.'
  },
  {
    id: 'crimson',
    name: 'Cyber Crimson & Blood Red',
    tagline: 'Aggressive Techwear & Cyberpunk 2077',
    badge: 'Стиль 2',
    bgHex: '#090406',
    accentHex: '#FF1E44',
    secondaryHex: '#FF6B85',
    description: 'Глубокий угольно-черный фон, агрессивный алый неон #FF1E44, рубиновое свечение и титан.'
  },
  {
    id: 'emerald',
    name: 'Acid Matrix & Toxic Emerald',
    tagline: 'Rave & Cyber-Bio Matrix',
    badge: 'Стиль 3',
    bgHex: '#020904',
    accentHex: '#00FF88',
    secondaryHex: '#34D399',
    description: 'Глубокий черный фон, ядовитый неоновый изумруд #00FF88 и токсичный кислотный лайм.'
  },
  {
    id: 'amber',
    name: 'Sunset Amber & Solar Orange',
    tagline: 'Street Energy & Dark Fire',
    badge: 'Стиль 4',
    bgHex: '#0A0602',
    accentHex: '#FF6A00',
    secondaryHex: '#FBBF24',
    description: 'Темный антрацит, яркий неоновый оранжевый #FF6A00 и теплое солнечное свечение.'
  },
  {
    id: 'cyberpunk',
    name: 'Cyber Mana & Electric Cyan',
    tagline: 'Original Neon Synthwave',
    badge: 'Стиль 5 // Исходный',
    bgHex: '#120722',
    accentHex: '#00E6FF',
    secondaryHex: '#7B2CBF',
    description: 'Оригинальная палитра Palette 4: индиго, неоновый циан #00E6FF и кибер-фуксия.'
  }
];

interface ThemeStudioProps {
  currentTheme: ThemeId;
  onSelectTheme: (theme: ThemeId) => void;
}

export const ThemeStudio: React.FC<ThemeStudioProps> = ({ currentTheme, onSelectTheme }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [ratings, setRatings] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem('tee_street_theme_ratings');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  const [lastRatedTheme, setLastRatedTheme] = useState<string | null>(null);

  const activeThemeObj = THEMES.find((t) => t.id === currentTheme) || THEMES[0];
  const activeRating = ratings[currentTheme] || 0;

  const handleRate = (score: number) => {
    const updated = { ...ratings, [currentTheme]: score };
    setRatings(updated);
    setLastRatedTheme(currentTheme);
    try {
      localStorage.setItem('tee_street_theme_ratings', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const handleResetRatings = () => {
    setRatings({});
    try {
      localStorage.removeItem('tee_street_theme_ratings');
    } catch {
      // ignore
    }
  };

  return (
    <aside
      aria-label="Студия стилей и оценка тем"
      className="fixed bottom-4 right-4 z-50 max-w-[calc(100vw-2rem)] w-[440px] transition-all duration-300"
    >
      <div className="relative rounded-2xl bg-black/90 backdrop-blur-xl border border-white/20 shadow-[0_10px_40px_rgba(0,0,0,0.8)] overflow-hidden text-white">
        {/* Заголовок панели */}
        <header className="px-4 py-3 bg-white/5 border-b border-white/10 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-white/20 to-white/5 border border-white/20 flex items-center justify-center">
              <Palette className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-black text-xs uppercase tracking-wider text-white">
                  Студия стилей
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-white/15 text-white">
                  Оценка 1-10
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Активен: <strong className="text-white">{activeThemeObj.name}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title={isOpen ? 'Свернуть панель' : 'Развернуть панель'}
            >
              {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </button>
          </div>
        </header>

        {/* Тело панели */}
        {isOpen && (
          <div className="p-4 space-y-4 max-h-[75vh] overflow-y-auto no-scrollbar">
            {/* Описание текущего выбранного стиля */}
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                  {activeThemeObj.badge}
                </span>
                <div className="flex items-center gap-1.5">
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-white/40 shadow-sm"
                    style={{ backgroundColor: activeThemeObj.bgHex }}
                    title={`Фон: ${activeThemeObj.bgHex}`}
                  />
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-white/40 shadow-sm"
                    style={{ backgroundColor: activeThemeObj.accentHex }}
                    title={`Акцент: ${activeThemeObj.accentHex}`}
                  />
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-white/40 shadow-sm"
                    style={{ backgroundColor: activeThemeObj.secondaryHex }}
                    title={`Второй цвет: ${activeThemeObj.secondaryHex}`}
                  />
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-light">
                {activeThemeObj.description}
              </p>
            </div>

            {/* Блок переключения стилей */}
            <div className="space-y-1.5">
              <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider flex items-center justify-between">
                <span>Выберите стиль для примерки:</span>
                <span className="text-[10px] text-slate-500">5 вариантов</span>
              </div>
              <div className="grid grid-cols-1 gap-1.5">
                {THEMES.map((item) => {
                  const isSelected = item.id === currentTheme;
                  const itemRating = ratings[item.id];
                  return (
                    <button
                      key={item.id}
                      onClick={() => onSelectTheme(item.id)}
                      className={`w-full px-3 py-2 rounded-xl border text-left flex items-center justify-between gap-2 transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-white/15 border-white shadow-[0_0_15px_rgba(255,255,255,0.2)]'
                          : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="flex -space-x-1 shrink-0">
                          <span
                            className="w-4 h-4 rounded-full border border-black/40"
                            style={{ backgroundColor: item.bgHex }}
                          />
                          <span
                            className="w-4 h-4 rounded-full border border-black/40"
                            style={{ backgroundColor: item.accentHex }}
                          />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-white truncate flex items-center gap-1.5">
                            <span>{item.name}</span>
                            {isSelected && <Check className="w-3.5 h-3.5 text-white shrink-0" />}
                          </div>
                          <div className="text-[10px] text-slate-400 truncate">{item.tagline}</div>
                        </div>
                      </div>

                      <div className="shrink-0 flex items-center gap-1.5">
                        {itemRating ? (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-400/20 text-amber-300 border border-amber-400/40">
                            {itemRating}/10
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono text-slate-500">Без оценки</span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Блок интерактивной оценки стиля от 1 до 10 */}
            <div className="p-3.5 rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span>Ваша оценка текущего стиля:</span>
                </div>
                {activeRating > 0 && (
                  <span className="text-xs font-black font-mono px-2 py-0.5 rounded-full bg-amber-400 text-black">
                    {activeRating} из 10
                  </span>
                )}
              </div>

              {/* Шкала 1 - 10 */}
              <div className="grid grid-cols-10 gap-1">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
                  const isCurrentScore = activeRating === num;
                  const isLowerOrEqual = activeRating >= num;
                  return (
                    <button
                      key={num}
                      onClick={() => handleRate(num)}
                      className={`h-9 rounded-lg font-mono text-xs font-bold transition-all cursor-pointer flex flex-col items-center justify-center ${
                        isCurrentScore
                          ? 'bg-amber-400 text-black shadow-[0_0_15px_rgba(251,191,36,0.5)] scale-105'
                          : isLowerOrEqual
                          ? 'bg-amber-400/30 text-amber-200 border border-amber-400/50'
                          : 'bg-white/5 text-slate-400 border border-white/10 hover:bg-white/15 hover:text-white'
                      }`}
                      title={`Оценить на ${num} из 10`}
                    >
                      <span>{num}</span>
                    </button>
                  );
                })}
              </div>

              {/* Обратная связь */}
              {activeRating > 0 ? (
                <div className="text-[11px] text-slate-300 font-light text-center pt-1">
                  {activeRating >= 8
                    ? 'Отличный выбор! Стиль выглядит гармонично и мощно.'
                    : activeRating >= 5
                    ? 'Неплохо. Протестируйте другие стили выше для сравнения.'
                    : 'Стиль не подошел. Переключитесь на другой вариант выше.'}
                </div>
              ) : (
                <div className="text-[11px] text-slate-400 font-light text-center pt-1">
                  Нажмите на цифру от 1 до 10, чтобы выставить оценку
                </div>
              )}
            </div>

            {/* Итоговая сводка оценок */}
            {Object.keys(ratings).length > 0 && (
              <div className="pt-1 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
                <div>
                  Оценено тем: <strong className="text-white">{Object.keys(ratings).length}</strong> из 5
                </div>
                <button
                  onClick={handleResetRatings}
                  className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer text-[10px]"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Сбросить оценки</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
};
