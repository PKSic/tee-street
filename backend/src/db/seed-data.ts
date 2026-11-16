export interface LocalStoreData {
  roles: any[];
  users: any[];
  categories: any[];
  sizes: any[];
  colors: any[];
  products: any[];
  product_variants: any[];
  inventory: Record<string, { on_hand: number; reserved: number; updated_at: string }>;
  inventory_movements: any[];
  carts: any[];
  cart_items: any[];
  orders: any[];
  order_items: any[];
  order_status_history: any[];
  payments: any[];
  payment_events: any[];
  shipping_methods: any[];
  pickup_points: any[];
  promo_codes: any[];
  promo_code_usages: any[];
  reviews: any[];
  pages: any[];
  banners: any[];
  site_settings: Record<string, any>;
  audit_logs: any[];
}

export const INITIAL_SEED_DATA: LocalStoreData = {
  roles: [
    { id: 1, code: 'admin', name: 'Администратор', description: 'Полный доступ ко всем модулям и настройкам', is_system: true },
    { id: 2, code: 'manager', name: 'Менеджер заказов', description: 'Обработка заказов и работа со складом', is_system: true },
    { id: 3, code: 'content_manager', name: 'Контент-менеджер', description: 'Редактирование карточек товаров, баннеров и CMS', is_system: true },
    { id: 4, code: 'user', name: 'Покупатель', description: 'Стандартный аккаунт покупателя', is_system: true },
  ],
  users: [
    {
      id: 'usr-admin-0001',
      email: 'admin@test-tee.ru',
      password_hash: 'f3a61c472856d36e8499291b5c907b31:1e5f8fbeea45009fbe795bc7291a27e7f7b3bb6f7885b5463ff2f954ecad13c18ff24bb120b02927236d8d641ec1c0715694a11f56ec568bc502f6ae64d1f566', // AdminPass123!
      first_name: 'Александр',
      last_name: 'Шеф',
      phone: '+7 (999) 000-01-01',
      role: 'admin',
      status: 'active',
      preferred_locale: 'ru',
      theme: 'dark',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'usr-manager-0002',
      email: 'manager@test-tee.ru',
      password_hash: 'f3a61c472856d36e8499291b5c907b31:1e5f8fbeea45009fbe795bc7291a27e7f7b3bb6f7885b5463ff2f954ecad13c18ff24bb120b02927236d8d641ec1c0715694a11f56ec568bc502f6ae64d1f566', // AdminPass123!
      first_name: 'Мария',
      last_name: 'Заказова',
      phone: '+7 (999) 000-02-02',
      role: 'manager',
      status: 'active',
      preferred_locale: 'ru',
      theme: 'dark',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'usr-client-0003',
      email: 'client@test-tee.ru',
      password_hash: 'f3a61c472856d36e8499291b5c907b31:1e5f8fbeea45009fbe795bc7291a27e7f7b3bb6f7885b5463ff2f954ecad13c18ff24bb120b02927236d8d641ec1c0715694a11f56ec568bc502f6ae64d1f566', // AdminPass123!
      first_name: 'Дмитрий',
      last_name: 'Иванов',
      phone: '+7 (999) 111-22-33',
      role: 'user',
      status: 'active',
      preferred_locale: 'ru',
      theme: 'dark',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
  categories: [
    {
      id: 1,
      slug: 'oversize',
      sort_order: 1,
      is_active: true,
      translations: {
        ru: { name: 'Оверсайз', description: 'Свободный крой со спущенным плечом из плотного хлопка 240 г/м²' },
        en: { name: 'Oversize', description: 'Relaxed streetwear fit with dropped shoulders, 240 gsm heavy cotton' },
        'zh-CN': { name: '宽松版型', description: '落肩街头休闲剪裁，240克重磅纯棉' },
      },
    },
    {
      id: 2,
      slug: 'cyberpunk',
      sort_order: 2,
      is_active: true,
      translations: {
        ru: { name: 'Киберпанк', description: 'Неоновая эстетика Palette 4, неоновые принты и глитч-графика' },
        en: { name: 'Cyberpunk', description: 'Palette 4 neon aesthetic, cyan glows, and glitch graphics' },
        'zh-CN': { name: '赛博朋克', description: 'Palette 4 霓虹美学、青色光效与故障图腾' },
      },
    },
    {
      id: 3,
      slug: 'limited-drops',
      sort_order: 3,
      is_active: true,
      translations: {
        ru: { name: 'Лимитированные дропы', description: 'Ограниченные тиражи с номерными бирками и эксклюзивными принтами' },
        en: { name: 'Limited Drops', description: 'Exclusive numbered editions and limited-run drops' },
        'zh-CN': { name: '限量发售', description: '限量编号系列与独家艺术家联名图案' },
      },
    },
    {
      id: 4,
      slug: 'minimal',
      sort_order: 4,
      is_active: true,
      translations: {
        ru: { name: 'Минимализм', description: 'Чистые силуэты, лаконичные вышивки и премиальная база' },
        en: { name: 'Minimal', description: 'Clean boxy cuts, subtle embroidery and essential basics' },
        'zh-CN': { name: '极简主义', description: '简约利落版型与高级基础纯色系列' },
      },
    },
  ],
  sizes: [
    { id: 1, code: 'XS', sort_order: 1, translations: { ru: 'XS (42-44)', en: 'XS (Extra Small)', 'zh-CN': 'XS 特小号' } },
    { id: 2, code: 'S', sort_order: 2, translations: { ru: 'S (44-46)', en: 'S (Small)', 'zh-CN': 'S 小号' } },
    { id: 3, code: 'M', sort_order: 3, translations: { ru: 'M (48-50)', en: 'M (Medium)', 'zh-CN': 'M 中号' } },
    { id: 4, code: 'L', sort_order: 4, translations: { ru: 'L (52-54)', en: 'L (Large)', 'zh-CN': 'L 大号' } },
    { id: 5, code: 'XL', sort_order: 5, translations: { ru: 'XL (56)', en: 'XL (Extra Large)', 'zh-CN': 'XL 特大号' } },
    { id: 6, code: '2XL', sort_order: 6, translations: { ru: '2XL (58+)', en: '2XL (Double Extra)', 'zh-CN': '2XL 超大号' } },
  ],
  colors: [
    { id: 1, code: 'black-sesame', hex_color: '#18181C', sort_order: 1, translations: { ru: 'Чёрный кунжут', en: 'Black Sesame', 'zh-CN': '黑芝麻色' } },
    { id: 2, code: 'cold-ice', hex_color: '#F5F5FA', sort_order: 2, translations: { ru: 'Холодный лёд', en: 'Cold Ice White', 'zh-CN': '冷冰白' } },
    { id: 3, code: 'mana-cyan', hex_color: '#00E6FF', sort_order: 3, translations: { ru: 'Неоновый циан', en: 'Mana Cyan', 'zh-CN': '青色霓虹' } },
    { id: 4, code: 'acid-lime', hex_color: '#9BD746', sort_order: 4, translations: { ru: 'Лазерный лайм', en: 'Laser Lime', 'zh-CN': '激光青柠' } },
    { id: 5, code: 'cyber-pink', hex_color: '#FF286E', sort_order: 5, translations: { ru: 'Киберпанк неон', en: 'Cyberpunk Pink', 'zh-CN': '赛博粉' } },
    { id: 6, code: 'velvet-indigo', hex_color: '#2D0F4B', sort_order: 6, translations: { ru: 'Босс подземелья', en: 'Dungeon Boss', 'zh-CN': '地牢紫' } },
  ],
  products: [
    {
      id: 'prod-001',
      slug: 'cyberpunk-oversize-tee',
      model_sku: 'TSH-CYBER-01',
      category_id: 2,
      base_price: 3490,
      old_price: 4200,
      status: 'published',
      is_featured: true,
      fabric_composition: '100% Плотный гребенной хлопок пенье, 240 г/м²',
      rating_avg: 4.95,
      reviews_count: 38,
      badge: 'New Drop',
      print_style: 'cyber-mana',
      print_title: 'CYBER DROP // 01',
      print_subtitle: 'SYSTEM OVERRIDE',
      translations: {
        ru: {
          name: 'Cyberpunk Oversize Tee',
          short_description: 'Флагманская футболка с неоновым принтом в стиле Palette 4 и шелкографией ультрафиолетом.',
          description: 'Ультимативная футболка свободного кроя со спущенной линией плеча. Плотность 240 г/м² держит идеальную форму коробки (boxy fit). Стойкий неоновый принт на груди и спине нанесён методом вытравной шелкографии.',
        },
        en: {
          name: 'Cyberpunk Oversize Tee',
          short_description: 'Flagship tee featuring Palette 4 neon graphics and UV-reactive screen printing.',
          description: 'The ultimate boxy relaxed fit tee made from 240 gsm combed cotton. Features durable neon screen prints on chest and back that maintain their vivid glow wash after wash.',
        },
        'zh-CN': {
          name: '赛博朋克重磅宽松T恤',
          short_description: '采用 Palette 4 霓虹图腾与抗裂丝网印花工艺的旗舰款T恤。',
          description: '顶级廓形落肩剪裁，240克重磅精梳棉打造立挺质感。前后饰有高耐磨耐水洗的霓虹荧光印花。',
        },
      },
    },
    {
      id: 'prod-002',
      slug: 'mana-potion-vintage-tee',
      model_sku: 'TSH-MANA-02',
      category_id: 3,
      base_price: 3890,
      old_price: null,
      status: 'published',
      is_featured: true,
      fabric_composition: '100% Вареный хлопок acid wash, 250 г/м²',
      rating_avg: 4.88,
      reviews_count: 24,
      badge: 'Drop № 04',
      print_style: 'potion-cyan',
      print_title: 'MANA POTION +100',
      print_subtitle: 'RESTORATION FORMULA',
      translations: {
        ru: {
          name: 'Mana Potion Vintage Drop',
          short_description: 'Винтажная варёная ткань цвета глубокого индиго с флаконным артом зелья маны.',
          description: 'Коллекционная модель из лимитированного дропа. Каждый экземпляр имеет уникальный рисунок выварки Acid Wash и шелковый ярлык с индивидуальным номером серии.',
        },
        en: {
          name: 'Mana Potion Vintage Drop',
          short_description: 'Acid-washed deep indigo heavyweight tee featuring glowing mana flask artwork.',
          description: 'Limited edition collector piece. Individually stone-washed for a vintage feel with glow-in-the-dark mana flask detailing.',
        },
        'zh-CN': {
          name: '法力药水复古水洗T恤',
          short_description: '深靛蓝酸洗做旧工艺，点缀发光法力药剂图腾。',
          description: '限量发售收藏款，每件均经独立水洗石磨工序，胸前带有夜光药剂瓶艺术图案。',
        },
      },
    },
    {
      id: 'prod-003',
      slug: 'underground-boss-heavy-tee',
      model_sku: 'TSH-BOSS-03',
      category_id: 1,
      base_price: 3290,
      old_price: 3900,
      status: 'published',
      is_featured: true,
      fabric_composition: '100% Компакт-пенье с бархатистым peach-эффектом, 260 г/м²',
      rating_avg: 5.0,
      reviews_count: 19,
      badge: 'Heavyweight',
      print_style: 'boss-purple',
      print_title: 'UNDERGROUND BOSS',
      print_subtitle: 'LEVEL 99 DUNGEON',
      translations: {
        ru: {
          name: 'Underground Boss Heavyweight',
          short_description: 'Максимально плотный хлопок 260 г/м² цвета черного кунжута с рельефной надписью.',
          description: 'Тяжелый премиальный хлопок с мягкой бархатистой поверхностью. Усиленный воротник 3 см не растягивается после стирок.',
        },
        en: {
          name: 'Underground Boss Heavyweight',
          short_description: 'Maximum density 260 gsm black sesame cotton with tactile embossed branding.',
          description: 'Heavyweight streetwear essential with reinforced 3cm rib knit collar designed to maintain its crisp neckline.',
        },
        'zh-CN': {
          name: '地下首领重磅廓形T恤',
          short_description: '260克黑芝麻超重磅面料，饰有立体浮雕品牌标。',
          description: '街头重磅必备单品，3厘米加固领口罗纹设计，久洗不易变形。',
        },
      },
    },
    {
      id: 'prod-004',
      slug: 'tokyo-neon-glitch-tee',
      model_sku: 'TSH-TOKYO-04',
      category_id: 2,
      base_price: 3590,
      old_price: null,
      status: 'published',
      is_featured: false,
      fabric_composition: '100% Хлопок пенье, 240 г/м²',
      rating_avg: 4.82,
      reviews_count: 15,
      badge: 'Cyber Y2K',
      print_style: 'tokyo-glitch',
      print_title: 'TOKYO NIGHT GLITCH',
      print_subtitle: 'SHIBUYA SECTOR 04',
      translations: {
        ru: {
          name: 'Tokyo Neon Glitch Tee',
          short_description: 'Глитч-арт ночного неонового Токио с иероглифическими надписями и градиентом.',
          description: 'Атмосферный японский киберпанк с контрастным сочетанием лазерного лайма и неонового циана.',
        },
        en: {
          name: 'Tokyo Neon Glitch Tee',
          short_description: 'Japanese glitch typography fused with laser lime and electric cyan gradients.',
          description: 'Atmospheric Tokyo night cyberpunk graphic on premium heavyweight streetwear cut.',
        },
        'zh-CN': {
          name: '东京霓虹故障艺术T恤',
          short_description: '融合激光青柠与电光青色渐变的日系故障文字艺术。',
          description: '高质重磅街头版型，呈现沉浸式东京暗夜赛博都市氛围。',
        },
      },
    },
    {
      id: 'prod-005',
      slug: 'laser-lime-techwear-tee',
      model_sku: 'TSH-LIME-05',
      category_id: 1,
      base_price: 2990,
      old_price: 3600,
      status: 'published',
      is_featured: false,
      fabric_composition: '100% Плотный хлопок, 240 г/м²',
      rating_avg: 4.91,
      reviews_count: 12,
      badge: 'Hot Sale',
      print_style: 'acid-wasabi',
      print_title: 'TECHWEAR PROTOCOL',
      print_subtitle: 'SYSTEM SPEC // 2026',
      translations: {
        ru: {
          name: 'Laser Lime Techwear Tee',
          short_description: 'Индустриальная графика Palette 1 «Острый васаби» с техническими координатами.',
          description: 'Уличный оверсайз в духе Off-White и Nike ACG. Техническая типографика с координатами и серийными номерами партии.',
        },
        en: {
          name: 'Laser Lime Techwear Tee',
          short_description: 'Industrial typography and coordinate grid in Palette 1 sharp wasabi style.',
          description: 'Off-White inspired techwear silhouette featuring high contrast technical coordinates and production badges.',
        },
        'zh-CN': {
          name: '激光青柠机能风T恤',
          short_description: 'Palette 1 风格尖锐芥末绿工业排版与地理坐标网格。',
          description: '机能工装廓形，胸前点缀高对比度科技坐标与批次生产铭牌印花。',
        },
      },
    },
    {
      id: 'prod-006',
      slug: 'barbie-cyber-pink-tee',
      model_sku: 'TSH-PINK-06',
      category_id: 3,
      base_price: 3390,
      old_price: null,
      status: 'published',
      is_featured: false,
      fabric_composition: '100% Мягкий гребенной хлопок, 220 г/м²',
      rating_avg: 4.79,
      reviews_count: 18,
      badge: 'Y2K Drop',
      print_style: 'cyber-heart',
      print_title: 'CYBER HEART Y2K',
      print_subtitle: 'NEON VELVET EDITION',
      translations: {
        ru: {
          name: 'Cyber Heart Y2K Tee',
          short_description: 'Неоново-розовый хромированный арт в стиле Palette 3 «Барби неон & Холодный лёд».',
          description: 'Воздушный и дерзкий стиль 2000-х с хромированным объемным сердцем и футуристичными шрифтами.',
        },
        en: {
          name: 'Cyber Heart Y2K Tee',
          short_description: 'Chrome 3D heart artwork inspired by Palette 3 neon pink and cold ice contrast.',
          description: 'Bold early 2000s cyber club aesthetics with liquid metal chrome graphics on ultra-soft cotton.',
        },
        'zh-CN': {
          name: '千禧赛博之心T恤',
          short_description: 'Palette 3 芭比粉与冷冰白高光对比的液态金属3D爱心。',
          description: '千禧俱乐部美学，柔软亲肤优质棉面料，胸前印有流光金属赛博爱心。',
        },
      },
    },
    {
      id: 'prod-007',
      slug: 'minimal-boxy-core-tee',
      model_sku: 'TSH-MIN-07',
      category_id: 4,
      base_price: 2790,
      old_price: null,
      status: 'published',
      is_featured: false,
      fabric_composition: '100% Органический хлопок высокой плотности, 240 г/м²',
      rating_avg: 4.96,
      reviews_count: 31,
      badge: 'Core Basic',
      print_style: 'minimal-micro',
      print_title: 'TEST // CORE',
      print_subtitle: 'MINIMAL AESTHETIC',
      translations: {
        ru: {
          name: 'Minimal Boxy Core Tee',
          short_description: 'Чистый силуэт без кричащих принтов с аккуратным микро-логотипом «Тест» на груди.',
          description: 'Идеальная база на каждый день. Ровный квадратный крой, плотная ткань, не просвечивающая на свету.',
        },
        en: {
          name: 'Minimal Boxy Core Tee',
          short_description: 'Clean silhouette with subtle micro embroidery of the "Test" insignia.',
          description: 'The ultimate everyday basic. Boxy proportion, non-see-through heavyweight weave, and relaxed collar.',
        },
        'zh-CN': {
          name: '极简方正基础款T恤',
          short_description: '利落纯净版型，胸前饰有精致低调的微标刺绣。',
          description: '每日穿搭必选基础款。正方形挺阔剪裁，面料厚实不透光，领口服帖舒适。',
        },
      },
    },
    {
      id: 'prod-008',
      slug: 'kanji-matrix-oversize-tee',
      model_sku: 'TSH-KANJI-08',
      category_id: 2,
      base_price: 3690,
      old_price: 4500,
      status: 'published',
      is_featured: true,
      fabric_composition: '100% Гребенной хлопок пенье, 250 г/м²',
      rating_avg: 4.94,
      reviews_count: 27,
      badge: 'Exclusive',
      print_style: 'kanji-matrix',
      print_title: '未來 // MATRIX',
      print_subtitle: 'FUTURE CYBER DIVISION',
      translations: {
        ru: {
          name: 'Kanji Matrix Oversize Tee',
          short_description: 'Иероглиф «Будущее» (未來) в окружении матричного цифрового дождя бирюзового цвета.',
          description: 'Глубокий чёрный цвет полотна с многослойным нанесением неонового принта. В темноте светится под UV-лампами.',
        },
        en: {
          name: 'Kanji Matrix Oversize Tee',
          short_description: 'Futuristic Kanji "Future" (未來) surrounded by cyber digital rain and neon glows.',
          description: 'Deep black fabric featuring high density multi-layer UV reactive matrix characters.',
        },
        'zh-CN': {
          name: '未来矩阵黑武士宽松T恤',
          short_description: '青色数字雨环绕的“未來”汉字主题赛博单品。',
          description: '深邃纯黑底色，采用多层重叠UV夜光反应印花工艺，在紫外光线下呈现璀璨光泽。',
        },
      },
    },
  ],
  product_variants: [],
  inventory: {},
  inventory_movements: [],
  carts: [],
  cart_items: [],
  orders: [],
  order_items: [],
  order_status_history: [],
  payments: [],
  payment_events: [],
  shipping_methods: [
    {
      id: 1,
      code: 'courier-express',
      type: 'courier',
      base_price: 490,
      free_from_amount: 5000,
      estimated_days_min: 1,
      estimated_days_max: 2,
      is_active: true,
      sort_order: 1,
      translations: {
        ru: { name: 'Курьерская доставка до двери (Москва & СПб)', description: 'Быстрая доставка курьером с примеркой 15 минут' },
        en: { name: 'Door-to-door Express Courier', description: 'Fast delivery with 15 minutes try-on period' },
        'zh-CN': { name: '特快专递送货上门', description: '快速门到门配送，提供15分钟试穿时间' },
      },
    },
    {
      id: 2,
      code: 'cdek-door',
      type: 'courier',
      base_price: 390,
      free_from_amount: 5000,
      estimated_days_min: 2,
      estimated_days_max: 4,
      is_active: true,
      sort_order: 2,
      translations: {
        ru: { name: 'СДЭК Доставка по России', description: 'Надёжная курьерская доставка в любой регион' },
        en: { name: 'CDEK Courier Delivery', description: 'Reliable delivery across all Russian regions' },
        'zh-CN': { name: 'CDEK 快递全境配送', description: '通过 CDEK 快递送货至各个省市' },
      },
    },
    {
      id: 3,
      code: 'pickup-store',
      type: 'pickup',
      base_price: 0,
      free_from_amount: 0,
      estimated_days_min: 0,
      estimated_days_max: 1,
      is_active: true,
      sort_order: 3,
      translations: {
        ru: { name: 'Самовывоз из флагманского магазина (Бесплатно)', description: 'Москва, ул. Дизайнеров, 42, ежедневно 11:00-21:00' },
        en: { name: 'Flagship Showroom Pickup (Free)', description: 'Moscow, Designers st. 42, open daily 11:00-21:00' },
        'zh-CN': { name: '旗舰店自提（免费）', description: '莫斯科设计师大街42号，每天11:00-21:00' },
      },
    },
    {
      id: 4,
      code: 'cdek-pvz',
      type: 'pickup',
      base_price: 250,
      free_from_amount: 4000,
      estimated_days_min: 2,
      estimated_days_max: 4,
      is_active: true,
      sort_order: 4,
      translations: {
        ru: { name: 'Пункт выдачи СДЭК / Boxberry', description: 'Более 5000 постаматов и пунктов самовывоза' },
        en: { name: 'Pickup Point / Locker', description: 'Over 5,000 automated parcel lockers nationwide' },
        'zh-CN': { name: '自提点自取 (CDEK / Boxberry)', description: '全国超5000个自提柜与服务网点' },
      },
    },
  ],
  pickup_points: [
    {
      id: 1,
      code: 'MSK-FLAGSHIP',
      address: { city: 'Москва', street: 'ул. Дизайнеров', building: '42', metro: 'м. Курская' },
      phone: '+7 (495) 000-42-42',
      opening_hours: { daily: '11:00 - 21:00' },
      is_active: true,
      translations: {
        ru: { name: 'Флагманский магазин «Тест» (Москва)', instructions: 'Вход под вывеской «ТЕСТ CYBERSTORE», 1 этаж, примерочные 1-4' },
        en: { name: 'Flagship Store "Test" (Moscow)', instructions: 'Enter under "TEST CYBERSTORE" neon sign, 1st floor' },
        'zh-CN': { name: '“测试”莫斯科旗舰店', instructions: '霓虹标志下进入，一楼1-4号更衣室' },
      },
    },
    {
      id: 2,
      code: 'SPB-CENTRAL',
      address: { city: 'Санкт-Петербург', street: 'Невский пр.', building: '88', metro: 'м. Маяковская' },
      phone: '+7 (812) 000-88-88',
      opening_hours: { daily: '10:00 - 22:00' },
      is_active: true,
      translations: {
        ru: { name: 'Шоурум «Тест» (Санкт-Петербург)', instructions: 'Арка во внутренний двор, отдельный вход со стеклянной дверью' },
        en: { name: 'Showroom "Test" (St. Petersburg)', instructions: 'Courtyard entrance with glass door and cyan illuminated sign' },
        'zh-CN': { name: '“测试”圣彼得堡体验店', instructions: '内院拱门进入，青色霓虹玻璃门' },
      },
    },
  ],
  promo_codes: [
    {
      id: 1,
      code: 'CYBER10',
      discount_type: 'percentage',
      value: 10,
      max_discount: 2000,
      min_order_amount: 2000,
      usage_limit: 1000,
      usage_limit_per_user: 1,
      usage_count: 14,
      starts_at: '2026-01-01T00:00:00Z',
      ends_at: '2027-12-31T23:59:59Z',
      is_active: true,
    },
    {
      id: 2,
      code: 'WELCOME500',
      discount_type: 'fixed',
      value: 500,
      max_discount: 500,
      min_order_amount: 3000,
      usage_limit: 500,
      usage_limit_per_user: 1,
      usage_count: 28,
      starts_at: '2026-01-01T00:00:00Z',
      ends_at: '2027-12-31T23:59:59Z',
      is_active: true,
    },
  ],
  promo_code_usages: [],
  reviews: [
    {
      id: 1,
      product_id: 'prod-001',
      author_name: 'Кирилл В.',
      rating: 5,
      title: 'Бомбический оверсайз и неоновый принт!',
      body: 'Футболка превзошла все ожидания. Ткань реально плотная (240 грамм), держит форму плеч. На рост 182 взял L — села как влитая!',
      status: 'published',
      created_at: '2026-11-10T14:20:00Z',
    },
    {
      id: 2,
      product_id: 'prod-001',
      author_name: 'Елена К.',
      rating: 5,
      title: 'Качество шелкографии на высоте',
      body: 'Стирала уже трижды при 30 градусах — принт даже не подумал трескаться, цвета яркие, как на фото.',
      status: 'published',
      created_at: '2026-11-12T18:45:00Z',
    },
    {
      id: 3,
      product_id: 'prod-002',
      author_name: 'Артем Д.',
      rating: 5,
      title: 'Зелье маны — топ для стримов',
      body: 'Фон винтажный, на стриме под светом светится сочно. Рекомендую!',
      status: 'published',
      created_at: '2026-11-14T09:15:00Z',
    },
  ],
  pages: [
    {
      id: 1,
      slug: 'about',
      status: 'published',
      translations: {
        ru: {
          title: 'О бренде «Тест»',
          content: '«Тест» — концептуальный интернет-магазин оверсайз-футболок и стритвир-мерча нового поколения. Мы объединяем плотный гребенной хлопок высшего качества (пенье 240–260 г/м²), авторские принты в киберпанк-эстетике Palette 4 и бескомпромиссное внимание к каждой детали.',
        },
        en: {
          title: 'About Brand "Test"',
          content: '"Test" is a next-generation streetwear and graphic tee brand fusing 240–260 gsm heavyweight combed cotton with Palette 4 cyber aesthetics and uncompromising craftsmanship.',
        },
        'zh-CN': {
          title: '关于“测试”品牌',
          content: '“测试”是新一代街头重磅T恤概念品牌，将240-260克高品质精梳棉与Palette 4赛博朋克美学及精湛工艺完美融为一体。',
        },
      },
    },
    {
      id: 2,
      slug: 'delivery-and-payment',
      status: 'published',
      translations: {
        ru: {
          title: 'Доставка и оплата',
          content: 'Мы осуществляем быструю доставку курьером до двери, в пункты выдачи СДЭК и Boxberry, а также бесплатный самовывоз из наших фирменных шоурумов в Москве и Санкт-Петербурге. Оплата доступна онлайн банковскими картами (МИР, Visa, Mastercard), через Систему быстрых платежей (СБП) или при получении заказа.',
        },
        en: {
          title: 'Delivery & Payment',
          content: 'Fast courier door delivery, pickup lockers via CDEK & Boxberry, and free flagship store pickup in Moscow and St. Petersburg. Pay online with cards, instant SBP QR codes, or pay upon delivery.',
        },
        'zh-CN': {
          title: '配送与付款方式',
          content: '提供特快专递送货上门、CDEK及Boxberry自提柜服务，莫斯科与圣彼得堡旗舰店免费自提。支持信用卡、银联、快速二维码支付及到货付款。',
        },
      },
    },
    {
      id: 3,
      slug: 'returns-and-warranty',
      status: 'published',
      translations: {
        ru: {
          title: 'Возврат и обмен',
          content: 'Вы можете вернуть или обменять вещь в течение 14 дней с момента получения, если сохранены товарный вид, бирки и упаковка. Заявку на возврат можно оформить в личном кабинете или обратившись в службу заботы.',
        },
        en: {
          title: 'Returns & Exchanges',
          content: 'Hassle-free 14-day returns and exchanges for items in unworn condition with original tags intact.',
        },
        'zh-CN': {
          title: '退换货政策与售后保障',
          content: '自收到商品之日起14天内，只要保持商品完好无损、吊牌齐全，即可申请退换货。',
        },
      },
    },
    {
      id: 4,
      slug: 'faq',
      status: 'published',
      translations: {
        ru: {
          title: 'Часто задаваемые вопросы (FAQ)',
          content: '1. Какой крой у футболок? Все модели имеют просторный оверсайз-крой со спущенным плечом.\n2. Как стирать? Рекомендуется бережная стирка при 30°C вывернутыми наизнанку.\n3. Садятся ли футболки? Нет, полотно проходит предварительную декатировку и усадку.',
        },
        en: {
          title: 'Frequently Asked Questions (FAQ)',
          content: '1. What is the fit? All shirts have a relaxed, boxy oversize cut with dropped shoulders.\n2. Care instructions? Machine wash inside out at 30°C on delicate cycle.\n3. Will it shrink? No, the fabric is pre-shrunk before stitching.',
        },
        'zh-CN': {
          title: '常见问题解答 (FAQ)',
          content: '1. T恤版型如何？所有款式均采用宽松落肩阔版设计。\n2. 如何清洗保养？建议将衣服翻面并于30°C冷水温和机洗。\n3. 会缩水吗？面料在裁剪前已经过预缩水处理，不易变形缩水。',
        },
      },
    },
    {
      id: 5,
      slug: 'privacy-policy',
      status: 'published',
      translations: {
        ru: {
          title: 'Политика конфиденциальности',
          content: 'Интернет-магазин «Тест» со всей ответственностью относится к защите персональных данных покупателей в соответствии с Федеральным законом № 152-ФЗ. Все данные передаются по защищенному протоколу HTTPS и никогда не передаются третьим лицам.',
        },
        en: {
          title: 'Privacy Policy',
          content: 'Test Store protects customer personal data under strict data privacy regulations. Data is transmitted securely via HTTPS and never sold to third parties.',
        },
        'zh-CN': {
          title: '隐私政策',
          content: '“测试”在线商店遵循严格的数据隐私保护准则。所有交易与个人信息均通过安全加密通道传输。',
        },
      },
    },
  ],
  banners: [
    {
      id: 1,
      image_url: '/banners/cyber-banner.jpg',
      link_url: '/catalog',
      sort_order: 1,
      is_active: true,
      translations: {
        ru: {
          title: 'CYBER DROP 2026 // PALETTE 4',
          subtitle: 'Новая коллекция оверсайз-футболок из хлопка 240 г/м² в неоновом бархате индиго',
          button_text: 'Смотреть дроп',
        },
        en: {
          title: 'CYBER DROP 2026 // PALETTE 4',
          subtitle: 'New collection of 240 gsm heavyweight oversize tees in velvet indigo & cyan',
          button_text: 'Explore Drop',
        },
        'zh-CN': {
          title: '2026 赛博限定发售 // PALETTE 4',
          subtitle: '240克超重磅宽松T恤全新登场，天鹅绒深靛蓝与青色流光交相辉映',
          button_text: '即刻探索',
        },
      },
    },
  ],
  site_settings: {
    store_name: 'Тест',
    currency: 'RUB',
    currency_symbol: '₽',
    reserve_timeout_minutes: 30,
    free_shipping_threshold: 5000,
    support_email: 'support@test-tee.ru',
    support_phone: '+7 (800) 555-35-35',
    socials: {
      telegram: 'https://t.me/test_tshirt',
      vk: 'https://vk.com/test_tshirt',
    },
    maintenance_mode: false,
  },
  audit_logs: [],
};

// Автоматически генерируем варианты (SKU) и остатки для каждого товара
(() => {
  let skuCounter = 1000;
  for (const product of INITIAL_SEED_DATA.products) {
    for (const size of INITIAL_SEED_DATA.sizes) {
      for (const color of INITIAL_SEED_DATA.colors) {
        skuCounter++;
        const sku = `${product.model_sku}-${size.code}-${color.code.substring(0, 3).toUpperCase()}`;
        const variantId = `var-${sku.toLowerCase()}`;

        INITIAL_SEED_DATA.product_variants.push({
          id: variantId,
          product_id: product.id,
          size_id: size.id,
          color_id: color.id,
          sku,
          price_override: null,
          barcode: `46000000${skuCounter}`,
          weight_grams: size.id > 3 ? 340 : 310,
          is_active: true,
        });

        // Начальный остаток на складе: от 10 до 35 единиц
        const stockQty = 15 + ((skuCounter * 7) % 25);
        INITIAL_SEED_DATA.inventory[variantId] = {
          on_hand: stockQty,
          reserved: 0,
          updated_at: new Date().toISOString(),
        };
      }
    }
  }
})();
