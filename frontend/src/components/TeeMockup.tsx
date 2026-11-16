import React from 'react';

interface TeeMockupProps {
  colorHex: string;
  printStyle: string;
  printTitle: string;
  printSubtitle: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const TeeMockup: React.FC<TeeMockupProps> = ({
  colorHex,
  printStyle,
  printTitle,
  printSubtitle,
  className = '',
  size = 'md',
}) => {
  const isLight = colorHex === '#F5F5FA' || colorHex.toLowerCase() === '#ffffff';

  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      {/* Мягкая эллиптическая тень под футболкой по STYLES.md */}
      <div
        className="absolute bottom-2 w-3/4 h-6 rounded-[100%] bg-black/45 pointer-events-none"
        style={{ filter: 'blur(14px)' }}
      />

      <svg
        viewBox="0 0 400 440"
        className="w-full h-full drop-shadow-xl transition-all duration-300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Светотень ткани (реалистичные складки оверсайза) */}
          <linearGradient id={`tee-shading-${printStyle}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity={isLight ? 0.35 : 0.12} />
            <stop offset="50%" stopColor="#000000" stopOpacity="0" />
            <stop offset="100%" stopColor="#000000" stopOpacity={isLight ? 0.2 : 0.4} />
          </linearGradient>

          {/* Тень под воротником */}
          <linearGradient id="collar-shadow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#000000" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </linearGradient>

          {/* Неоновый градиент для принта Palette 4 */}
          <linearGradient id="cyan-purple-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00E6FF" />
            <stop offset="100%" stopColor="#7B2CBF" />
          </linearGradient>

          <linearGradient id="lime-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#BEFF00" />
            <stop offset="100%" stopColor="#9BD746" />
          </linearGradient>

          <linearGradient id="pink-cyan-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF286E" />
            <stop offset="100%" stopColor="#00E6FF" />
          </linearGradient>
        </defs>

        {/* 1. Основное полотно оверсайз-футболки (спущенные плечи, бокси-крой) */}
        <g id="tshirt-body">
          <path
            d="M 125 40 
               Q 200 70 275 40 
               L 360 85 
               L 335 155 
               L 290 140 
               L 285 390 
               Q 200 405 115 390 
               L 110 140 
               L 65 155 
               L 40 85 
               Z"
            fill={colorHex}
            stroke={isLight ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.1)'}
            strokeWidth="1.5"
          />

          {/* Слой реалистичной светотени */}
          <path
            d="M 125 40 Q 200 70 275 40 L 360 85 L 335 155 L 290 140 L 285 390 Q 200 405 115 390 L 110 140 L 65 155 L 40 85 Z"
            fill={`url(#tee-shading-${printStyle})`}
          />

          {/* Швы рукавов со спущенным плечом */}
          <path d="M 110 140 Q 118 95 125 40" stroke="rgba(0,0,0,0.2)" strokeWidth="1.5" strokeDasharray="3 2" />
          <path d="M 290 140 Q 282 95 275 40" stroke="rgba(0,0,0,0.2)" strokeWidth="1.5" strokeDasharray="3 2" />

          {/* Нижний подгиб (hem line) */}
          <path d="M 116 380 Q 200 395 284 380" stroke="rgba(0,0,0,0.25)" strokeWidth="1.5" strokeDasharray="4 2" />
          {/* Подгибы рукавов */}
          <path d="M 45 95 L 70 150" stroke="rgba(0,0,0,0.25)" strokeWidth="1.2" strokeDasharray="3 2" />
          <path d="M 355 95 L 330 150" stroke="rgba(0,0,0,0.25)" strokeWidth="1.2" strokeDasharray="3 2" />

          {/* Плотный воротник 3 см */}
          <path
            d="M 125 40 Q 200 72 275 40 Q 200 52 125 40 Z"
            fill={colorHex}
            stroke="rgba(0,0,0,0.35)"
            strokeWidth="1.5"
          />
          {/* Тень под воротником */}
          <path d="M 130 52 Q 200 75 270 52 Q 200 90 130 52 Z" fill="url(#collar-shadow)" opacity="0.6" />
        </g>

        {/* 2. Область авторского принта на груди */}
        <g id="tshirt-print" transform="translate(130, 130)">
          {/* Принт 1: Cyberpunk Mana (Неоновый глитч) */}
          {printStyle === 'cyber-mana' && (
            <g>
              <rect x="0" y="0" width="140" height="150" rx="10" fill="#0A0416" fillOpacity="0.85" stroke="#00E6FF" strokeWidth="1.5" />
              {/* Неоновая сетка */}
              <line x1="10" y1="35" x2="130" y2="35" stroke="#00E6FF" strokeOpacity="0.5" strokeWidth="1" />
              <line x1="10" y1="120" x2="130" y2="120" stroke="#7B2CBF" strokeOpacity="0.5" strokeWidth="1" />
              
              {/* Кибер-символ в центре */}
              <polygon points="70,45 105,75 88,110 52,110 35,75" fill="none" stroke="url(#cyan-purple-grad)" strokeWidth="2.5" />
              <circle cx="70" cy="75" r="14" fill="#00E6FF" fillOpacity="0.25" stroke="#00E6FF" strokeWidth="1.5" />
              <circle cx="70" cy="75" r="4" fill="#00E6FF" />

              <text x="70" y="24" fill="#00E6FF" fontSize="10" fontWeight="900" textAnchor="middle" fontFamily="Unbounded, sans-serif" letterSpacing="2">
                CYBER // DROP
              </text>
              <text x="70" y="137" fill="#F8FAFC" fontSize="7" fontWeight="700" textAnchor="middle" fontFamily="JetBrains Mono, monospace" letterSpacing="1">
                240 GSM HEAVYWEIGHT
              </text>
            </g>
          )}

          {/* Принт 2: Зелье маны (Mana Potion) */}
          {printStyle === 'potion-cyan' && (
            <g>
              <circle cx="70" cy="75" r="58" fill="#120722" stroke="#00E6FF" strokeWidth="2" strokeDasharray="6 3" />
              {/* Флакон с зельем */}
              <path d="M 62 38 L 78 38 L 78 48 L 88 65 L 88 105 L 52 105 L 52 65 L 62 48 Z" fill="none" stroke="#00E6FF" strokeWidth="2" />
              <path d="M 54 75 Q 70 82 86 75 L 86 103 L 54 103 Z" fill="url(#cyan-purple-grad)" />
              <circle cx="64" cy="88" r="3" fill="#FFFFFF" opacity="0.8" />
              <circle cx="75" cy="94" r="2" fill="#FFFFFF" opacity="0.6" />
              
              <text x="70" y="122" fill="#00E6FF" fontSize="9" fontWeight="900" textAnchor="middle" fontFamily="Unbounded, sans-serif">
                MANA +100
              </text>
            </g>
          )}

          {/* Принт 3: Underground Boss (Тяжелый готический оверсайз) */}
          {printStyle === 'boss-purple' && (
            <g>
              <rect x="5" y="15" width="130" height="120" rx="4" fill="#18181C" stroke="#7B2CBF" strokeWidth="2" />
              <path d="M 20 30 L 120 30" stroke="#7B2CBF" strokeWidth="2" />
              <path d="M 20 120 L 120 120" stroke="#7B2CBF" strokeWidth="2" />
              
              <text x="70" y="55" fill="#F8FAFC" fontSize="13" fontWeight="900" textAnchor="middle" fontFamily="Unbounded, sans-serif">
                BOSS
              </text>
              <text x="70" y="75" fill="#7B2CBF" fontSize="9" fontWeight="800" textAnchor="middle" fontFamily="Unbounded, sans-serif" letterSpacing="3">
                LEVEL 99
              </text>
              <text x="70" y="100" fill="#94A3B8" fontSize="7" textAnchor="middle" fontFamily="JetBrains Mono, monospace">
                DUNGEON ARCHIVE // 26
              </text>
            </g>
          )}

          {/* Принт 4: Tokyo Neon Glitch */}
          {printStyle === 'tokyo-glitch' && (
            <g>
              <rect x="10" y="10" width="120" height="130" fill="#0A0B10" stroke="#FF286E" strokeWidth="1.5" />
              <text x="70" y="42" fill="#00E6FF" fontSize="18" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">
                東京ネオン
              </text>
              <text x="70" y="70" fill="#FF286E" fontSize="11" fontWeight="900" textAnchor="middle" fontFamily="Unbounded, sans-serif">
                SHIBUYA 04
              </text>
              <line x1="25" y1="85" x2="115" y2="85" stroke="#9BD746" strokeWidth="2" />
              <text x="70" y="108" fill="#F8FAFC" fontSize="7" textAnchor="middle" fontFamily="JetBrains Mono, monospace">
                NIGHT CITY PROTOCOL
              </text>
            </g>
          )}

          {/* Принт 5: Laser Lime Techwear */}
          {printStyle === 'acid-wasabi' && (
            <g>
              <rect x="8" y="15" width="124" height="120" fill="#18181C" stroke="#9BD746" strokeWidth="2" />
              <line x1="8" y1="40" x2="132" y2="40" stroke="#9BD746" strokeWidth="1" />
              <text x="20" y="32" fill="#9BD746" fontSize="11" fontWeight="900" fontFamily="Unbounded, sans-serif">
                ACID // 05
              </text>
              <circle cx="70" cy="75" r="22" stroke="#9BD746" strokeWidth="2" strokeDasharray="4 2" />
              <line x1="45" y1="75" x2="95" y2="75" stroke="#9BD746" strokeWidth="1.5" />
              <line x1="70" y1="50" x2="70" y2="100" stroke="#9BD746" strokeWidth="1.5" />
              <text x="70" y="122" fill="#F8FAFC" fontSize="7" textAnchor="middle" fontFamily="JetBrains Mono, monospace">
                SPEC: 55°45&apos;N 37°37&apos;E
              </text>
            </g>
          )}

          {/* Принт 6: Cyber Heart Y2K */}
          {printStyle === 'cyber-heart' && (
            <g>
              <path
                d="M 70 95 C 70 95, 30 70, 30 45 C 30 30, 48 24, 70 42 C 92 24, 110 30, 110 45 C 110 70, 70 95, 70 95 Z"
                fill="url(#pink-cyan-grad)"
                stroke="#FFFFFF"
                strokeWidth="1.5"
              />
              <circle cx="55" cy="42" r="5" fill="#FFFFFF" opacity="0.7" />
              <text x="70" y="122" fill="#FF286E" fontSize="9" fontWeight="900" textAnchor="middle" fontFamily="Unbounded, sans-serif">
                CYBER // Y2K
              </text>
            </g>
          )}

          {/* Принт 7: Minimal Core */}
          {printStyle === 'minimal-micro' && (
            <g>
              <rect x="50" y="55" width="40" height="40" rx="6" fill={isLight ? '#120722' : '#FFFFFF'} />
              <text
                x="70"
                y="80"
                fill={isLight ? '#FFFFFF' : '#120722'}
                fontSize="12"
                fontWeight="900"
                textAnchor="middle"
                fontFamily="Unbounded, sans-serif"
              >
                T
              </text>
            </g>
          )}

          {/* Принт 8: Kanji Matrix */}
          {printStyle === 'kanji-matrix' && (
            <g>
              <rect x="10" y="10" width="120" height="130" rx="8" fill="#0D0618" stroke="#00E6FF" strokeWidth="1.5" />
              <text x="70" y="75" fill="#00E6FF" fontSize="42" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">
                未來
              </text>
              <text x="70" y="102" fill="#7B2CBF" fontSize="10" fontWeight="900" textAnchor="middle" fontFamily="Unbounded, sans-serif">
                MATRIX DROP
              </text>
              <text x="70" y="124" fill="#94A3B8" fontSize="7" textAnchor="middle" fontFamily="JetBrains Mono, monospace">
                SEC_ZONE_08
              </text>
            </g>
          )}
        </g>
      </svg>
    </div>
  );
};
