import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  ShoppingBag,
  Eye,
  Layers,
  Move,
} from 'lucide-react';
import type { Color, Product, Size } from '../types';

interface Video3DModalProps {
  isOpen: boolean;
  onClose: () => void;
  colors: Color[];
  onOpenProductDetails?: () => void;
}

export const Video3DModal: React.FC<Video3DModalProps> = ({
  isOpen,
  onClose,
  colors,
  onOpenProductDetails,
}) => {
  const [activeTab, setActiveTab] = useState<'3d' | 'video'>('3d');
  const [selectedColor, setSelectedColor] = useState<Color>(colors[0] || {
    id: 1,
    name: 'Чёрный кунжут',
    code: 'black-sesame',
    hex_color: '#131118',
  });

  // 3D трансформация и интерактивное вращение
  const [rotY, setRotY] = useState(0);
  const [rotX, setRotX] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isAutoSpin, setIsAutoSpin] = useState(false);

  // Видео состояние
  const [isPlaying, setIsPlaying] = useState(true);
  const [isSlowMo, setIsSlowMo] = useState(false);
  const [videoZoom, setVideoZoom] = useState(1);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Dragging state
  const isDraggingRef = useRef(false);
  const lastPosRef = useRef({ x: 0, y: 0 });

  // Авто-вращение
  useEffect(() => {
    if (!isAutoSpin || activeTab !== '3d') return;
    const interval = setInterval(() => {
      setRotY((prev) => (prev + 0.8) % 360);
    }, 16);
    return () => clearInterval(interval);
  }, [isAutoSpin, activeTab]);

  // Обработка клавиши Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Колесико мыши для зума
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (activeTab === '3d') {
      const delta = e.deltaY * -0.0015;
      setZoom((prev) => Math.min(3.5, Math.max(0.8, prev + delta)));
    } else {
      const delta = e.deltaY * -0.0015;
      setVideoZoom((prev) => Math.min(2.5, Math.max(1, prev + delta)));
    }
  };

  // Pointer Events для мыши и сенсорных экранов
  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    lastPosRef.current = { x: e.clientX, y: e.clientY };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - lastPosRef.current.x;
    const dy = e.clientY - lastPosRef.current.y;
    lastPosRef.current = { x: e.clientX, y: e.clientY };

    if (activeTab === '3d') {
      // Если сильно приближено (zoom > 1.4) — позволяем перемещать (pan)
      if (e.shiftKey || (zoom > 1.5 && e.buttons === 2)) {
        setPan((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
      } else {
        // Вращение в 3D
        setRotY((prev) => (prev + dx * 0.7) % 360);
        setRotX((prev) => Math.min(30, Math.max(-30, prev - dy * 0.4)));
      }
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    isDraggingRef.current = false;
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}
  };

  const handleReset = () => {
    setRotY(0);
    setRotX(0);
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setIsAutoSpin(false);
    setVideoZoom(1);
  };

  const toggleSlowMo = () => {
    if (videoRef.current) {
      const next = !isSlowMo;
      setIsSlowMo(next);
      videoRef.current.playbackRate = next ? 0.5 : 1.0;
    }
  };

  const toggleVideoPlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  if (!isOpen) return null;

  // Маппинг реальных прозрачных изображений для флагманской футболки
  const colorImageMap: Record<string, string> = {
    'black-sesame': '/products/bear-smile.png',
    'cold-ice': '/products/bear-smile-cold-ice.png',
    'mana-cyan': '/products/bear-smile-mana-cyan.png',
    'acid-lime': '/products/bear-smile-acid-lime.png',
    'cyber-pink': '/products/bear-smile-cyber-pink.png',
    'velvet-indigo': '/products/bear-smile-velvet-indigo.png',
  };

  const currentImageUrl = colorImageMap[selectedColor.code] || '/products/bear-smile.png';

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-xl animate-in fade-in duration-200">
      <div onClick={onClose} className="fixed inset-0" />

      <div className="relative w-full max-w-5xl h-[92vh] max-h-[850px] rounded-3xl bg-[#120722] border border-[#00E6FF]/40 text-white shadow-[0_0_80px_rgba(0,230,255,0.3),0_0_120px_rgba(123,44,191,0.25)] flex flex-col overflow-hidden z-10">
        {/* Шапка 3D инспектора */}
        <div className="px-4 sm:px-6 py-3.5 border-b border-white/10 flex items-center justify-between gap-3 shrink-0 bg-[#160A29]/90 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#00E6FF] to-[#7B2CBF] flex items-center justify-center text-[#0B0314] font-black shadow-[0_0_15px_rgba(0,230,255,0.4)]">
              <Sparkles className="w-5 h-5 text-[#0B0314]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-black text-sm sm:text-base text-white tracking-wide">
                  Интерактивный 3D / 360° Инспектор
                </h3>
                <span className="hidden sm:inline px-2 py-0.5 rounded-full bg-[#00E6FF]/20 border border-[#00E6FF]/40 text-[10px] font-mono text-[#00E6FF] font-bold">
                  SMILE HOLOGRAPHIC BEAR
                </span>
              </div>
              <div className="text-[11px] text-slate-400 font-mono flex items-center gap-2">
                <span>Heavyweight 240g Boxy Fit</span>
                <span>•</span>
                <span className="text-[#00E6FF]">Вращайте и приближайте</span>
              </div>
            </div>
          </div>

          {/* Переключатель режимов: 3D Осмотр / Видео HD */}
          <div className="flex items-center gap-2">
            <div className="flex items-center rounded-xl bg-white/5 border border-white/10 p-1">
              <button
                onClick={() => setActiveTab('3d')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === '3d'
                    ? 'bg-[#00E6FF] text-[#0B0314] shadow-[0_0_12px_rgba(0,230,255,0.4)]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>3D Осмотр</span>
              </button>
              <button
                onClick={() => setActiveTab('video')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'video'
                    ? 'bg-[#00E6FF] text-[#0B0314] shadow-[0_0_12px_rgba(0,230,255,0.4)]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Play className="w-3.5 h-3.5" />
                <span>Видео HD</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Закрыть (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Главная рабочая область 3D / Видео */}
        <div
          className="flex-1 relative overflow-hidden flex items-center justify-center select-none touch-none bg-[radial-gradient(circle_at_50%_50%,rgba(123,44,191,0.18),rgba(18,7,34,0.95))]"
          onWheel={handleWheel}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          style={{ cursor: isDraggingRef.current ? 'grabbing' : 'grab' }}
        >
          {/* Сетка разметки в стиле киберпанк на фоне */}
          <div
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              backgroundImage:
                'linear-gradient(rgba(0, 230, 255, 0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 230, 255, 0.15) 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />

          {/* ================= РЕЖИМ 1: 3D 360° ВРАЩЕНИЕ И ЗУМ ================= */}
          {activeTab === '3d' && (
            <div className="relative w-full h-full flex items-center justify-center pointer-events-none">
              {/* Мягкая динамическая тень под футболкой */}
              <div
                className="absolute w-72 h-10 rounded-[100%] bg-black/70 blur-xl pointer-events-none transition-transform duration-300"
                style={{
                  bottom: '12%',
                  transform: `scale(${zoom * 0.9}) translateX(${pan.x}px)`,
                }}
              />

              {/* 3D Контейнер футболки с перспективой */}
              <div
                className="relative transition-transform duration-75 ease-out flex items-center justify-center"
                style={{
                  perspective: 1000,
                  transform: `translateX(${pan.x}px) translateY(${pan.y}px)`,
                }}
              >
                <div
                  style={{
                    transform: `rotateY(${rotY}deg) rotateX(${rotX}deg) scale(${zoom})`,
                    transformStyle: 'preserve-3d',
                    transition: isDraggingRef.current ? 'none' : 'transform 0.15s ease-out',
                  }}
                  className="relative flex items-center justify-center max-w-[420px] sm:max-w-[520px] max-h-[70vh]"
                >
                  {/* Изображение футболки высокого разрешения */}
                  <img
                    key={currentImageUrl}
                    src={currentImageUrl}
                    alt="SMILE Oversize Tee 3D"
                    className="w-full h-full object-contain filter drop-shadow-[0_20px_45px_rgba(0,0,0,0.85)] pointer-events-none select-none transition-all duration-300"
                    draggable={false}
                  />

                  {/* Световой блик, зависящий от угла поворота */}
                  <div
                    className="absolute inset-0 pointer-events-none rounded-3xl mix-blend-overlay transition-opacity"
                    style={{
                      background: `linear-gradient(${rotY + 45}deg, rgba(0,230,255,0.25), transparent 70%)`,
                      opacity: Math.abs(Math.sin((rotY * Math.PI) / 180)) * 0.6 + 0.1,
                    }}
                  />
                </div>
              </div>

              {/* Уведомление-подсказка внизу холста */}
              <div className="absolute top-4 left-4 z-20 pointer-events-none flex flex-col gap-1.5">
                <div className="px-3 py-1.5 rounded-xl bg-black/60 border border-[#00E6FF]/30 backdrop-blur-md text-[11px] font-mono text-[#00E6FF] flex items-center gap-2 shadow-lg">
                  <Move className="w-3.5 h-3.5" />
                  <span>Зажмите и тяните для вращения</span>
                </div>
                <div className="px-3 py-1 rounded-xl bg-black/60 border border-white/10 backdrop-blur-md text-[10px] font-mono text-slate-300 flex items-center gap-1.5">
                  <ZoomIn className="w-3 h-3 text-[#FF286E]" />
                  <span>Колесико / кнопки: Зум {Math.round(zoom * 100)}%</span>
                </div>
              </div>

              {/* Быстрые пресеты углов (Спереди, Сбоку, Сзади) */}
              <div className="absolute top-4 right-4 z-20 pointer-events-auto flex items-center gap-1.5 bg-black/60 p-1.5 rounded-2xl border border-white/10 backdrop-blur-md">
                <button
                  onClick={() => {
                    setRotY(0);
                    setRotX(0);
                  }}
                  className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold bg-white/5 hover:bg-[#00E6FF]/20 text-slate-300 hover:text-[#00E6FF] transition-all cursor-pointer"
                >
                  Спереди
                </button>
                <button
                  onClick={() => {
                    setRotY(90);
                    setRotX(0);
                  }}
                  className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold bg-white/5 hover:bg-[#00E6FF]/20 text-slate-300 hover:text-[#00E6FF] transition-all cursor-pointer"
                >
                  Сбоку
                </button>
                <button
                  onClick={() => {
                    setRotY(180);
                    setRotX(0);
                  }}
                  className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold bg-white/5 hover:bg-[#00E6FF]/20 text-slate-300 hover:text-[#00E6FF] transition-all cursor-pointer"
                >
                  Сзади
                </button>
                <button
                  onClick={() => {
                    setZoom(2.2);
                    setRotY(10);
                    setRotX(5);
                  }}
                  className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold bg-[#00E6FF]/20 border border-[#00E6FF]/40 text-[#00E6FF] transition-all cursor-pointer"
                >
                  Принт 2.2x
                </button>
              </div>
            </div>
          )}

          {/* ================= РЕЖИМ 2: ВИДЕО-ШОУКЕЙС HD ================= */}
          {activeTab === 'video' && (
            <div className="relative w-full h-full flex items-center justify-center">
              <div
                className="relative max-w-4xl max-h-[75vh] aspect-video rounded-2xl overflow-hidden border border-[#00E6FF]/40 shadow-[0_0_50px_rgba(0,230,255,0.3)] transition-transform duration-200"
                style={{ transform: `scale(${videoZoom})` }}
              >
                <video
                  ref={videoRef}
                  src="/hero-video.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />

                {/* Оверлей контроллеров видео */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between p-2.5 rounded-xl bg-black/75 border border-white/10 backdrop-blur-md">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={toggleVideoPlay}
                      className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white cursor-pointer"
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={toggleSlowMo}
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                        isSlowMo
                          ? 'bg-[#00E6FF] text-[#0B0314]'
                          : 'bg-white/10 text-slate-300 hover:text-white'
                      }`}
                    >
                      {isSlowMo ? '0.5x Slow-Mo' : '1.0x Норм'}
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono text-slate-400">
                      Зум видео: {Math.round(videoZoom * 100)}%
                    </span>
                    <button
                      onClick={() => setVideoZoom((v) => Math.min(2.2, v + 0.2))}
                      className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white cursor-pointer"
                      title="Приблизить видео"
                    >
                      <ZoomIn className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setVideoZoom((v) => Math.max(1, v - 0.2))}
                      className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white cursor-pointer"
                      title="Отдалить видео"
                    >
                      <ZoomOut className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Нижняя панель управления: цвета, вращение, зум, заказ */}
        <div className="px-4 sm:px-6 py-3.5 border-t border-white/10 bg-[#160A29]/95 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          {/* Селектор цвета */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
            <span className="text-xs font-semibold text-slate-300 shrink-0">Цвет ткани:</span>
            <div className="flex items-center gap-1.5">
              {colors.map((c) => {
                const isSelected = selectedColor.id === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => setSelectedColor(c)}
                    className={`w-6 h-6 rounded-full border transition-all cursor-pointer relative ${
                      isSelected
                        ? 'scale-125 border-[#00E6FF] ring-2 ring-[#00E6FF]/50 shadow-[0_0_12px_rgba(0,230,255,0.5)]'
                        : 'border-white/20 hover:scale-110 opacity-70 hover:opacity-100'
                    }`}
                    style={{ backgroundColor: c.hex_color }}
                    title={c.name}
                  />
                );
              })}
            </div>
            <span className="text-xs font-mono text-[#00E6FF] font-bold sm:ml-2">
              {selectedColor.name}
            </span>
          </div>

          {/* Кнопки управления 3D зумом и авто-вращением */}
          {activeTab === '3d' && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsAutoSpin(!isAutoSpin)}
                className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  isAutoSpin
                    ? 'bg-[#00E6FF] text-[#0B0314] border-[#00E6FF] shadow-[0_0_15px_rgba(0,230,255,0.4)] animate-pulse'
                    : 'bg-white/5 border-white/10 text-slate-300 hover:text-white'
                }`}
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>{isAutoSpin ? 'Вращается...' : '360° Вращение'}</span>
              </button>

              <div className="flex items-center rounded-xl bg-white/5 border border-white/10 p-0.5">
                <button
                  onClick={() => setZoom((z) => Math.max(0.8, z - 0.25))}
                  className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 cursor-pointer"
                  title="Отдалить"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="px-2 text-xs font-mono font-bold text-[#00E6FF] min-w-[50px] text-center">
                  {Math.round(zoom * 100)}%
                </span>
                <button
                  onClick={() => setZoom((z) => Math.min(3.5, z + 0.25))}
                  className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 cursor-pointer"
                  title="Приблизить"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={handleReset}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
                title="Сбросить ракурс и масштаб"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Кнопка перехода к товару / в корзину */}
          <div className="w-full sm:w-auto">
            <button
              onClick={() => {
                onClose();
                if (onOpenProductDetails) onOpenProductDetails();
              }}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00E6FF] to-[#7B2CBF] text-[#0B0314] font-black text-xs shadow-[0_0_20px_rgba(0,230,255,0.4)] hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Заказать эту футболку • 3 490 ₽</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
