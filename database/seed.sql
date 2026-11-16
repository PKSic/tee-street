-- ============================================================================
-- Начальные демонстрационные данные (Seed Data) для магазина футболок «Тест»
-- ============================================================================

-- Роли
INSERT INTO roles (code, name, description, is_system) VALUES
('admin', 'Администратор', 'Полный доступ ко всем модулям, финансам и системным настройкам', TRUE),
('manager', 'Менеджер заказов', 'Обработка заказов, просмотр клиентов, управление статусами доставки', TRUE),
('content_manager', 'Контент-менеджер', 'Управление карточками товаров, категориями, баннерами и статьями', TRUE),
('user', 'Покупатель', 'Стандартные права зарегистрированного клиента', TRUE)
ON CONFLICT (code) DO NOTHING;

-- Размеры
INSERT INTO sizes (id, code, sort_order) VALUES
(1, 'XS', 1),
(2, 'S', 2),
(3, 'M', 3),
(4, 'L', 4),
(5, 'XL', 5),
(6, '2XL', 6)
ON CONFLICT (code) DO NOTHING;

INSERT INTO size_translations (size_id, locale, name) VALUES
(1, 'ru', 'XS (42-44)'), (1, 'en', 'XS (Extra Small)'), (1, 'zh-CN', 'XS 特小号'),
(2, 'ru', 'S (44-46)'),  (2, 'en', 'S (Small)'),        (2, 'zh-CN', 'S 小号'),
(3, 'ru', 'M (48-50)'),  (3, 'en', 'M (Medium)'),       (3, 'zh-CN', 'M 中号'),
(4, 'ru', 'L (52-54)'),  (4, 'en', 'L (Large)'),        (4, 'zh-CN', 'L 大号'),
(5, 'ru', 'XL (56)'),    (5, 'en', 'XL (Extra Large)'), (5, 'zh-CN', 'XL 特大号'),
(6, 'ru', '2XL (58+)'),  (6, 'en', '2XL (Double Extra)'), (6, 'zh-CN', '2XL 超大号')
ON CONFLICT DO NOTHING;

-- Цвета
INSERT INTO colors (id, code, hex_color, sort_order) VALUES
(1, 'black-sesame', '#18181C', 1),
(2, 'cold-ice', '#F5F5FA', 2),
(3, 'mana-cyan', '#00E6FF', 3),
(4, 'acid-lime', '#9BD746', 4),
(5, 'cyber-pink', '#FF286E', 5),
(6, 'velvet-indigo', '#2D0F4B', 6)
ON CONFLICT (code) DO NOTHING;

INSERT INTO color_translations (color_id, locale, name) VALUES
(1, 'ru', 'Чёрный кунжут'), (1, 'en', 'Black Sesame'), (1, 'zh-CN', '黑芝麻色'),
(2, 'ru', 'Холодный лёд'),  (2, 'en', 'Cold Ice White'),(2, 'zh-CN', '冷冰白'),
(3, 'ru', 'Неоновый циан'), (3, 'en', 'Mana Cyan'),     (3, 'zh-CN', '青色霓虹'),
(4, 'ru', 'Лазерный лайм'), (4, 'en', 'Laser Lime'),    (4, 'zh-CN', '激光青柠'),
(5, 'ru', 'Киберпанк неон'),(5, 'en', 'Cyberpunk Pink'),(5, 'zh-CN', '赛博粉'),
(6, 'ru', 'Босс подземелья'),(6, 'en', 'Dungeon Boss'), (6, 'zh-CN', '地牢紫')
ON CONFLICT DO NOTHING;

-- Категории
INSERT INTO categories (id, slug, sort_order) VALUES
(1, 'oversize', 1),
(2, 'cyberpunk', 2),
(3, 'limited-drops', 3),
(4, 'minimal', 4)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO category_translations (category_id, locale, name, description) VALUES
(1, 'ru', 'Оверсайз', 'Свободный крой со спущенным плечом из плотного премиум-хлопка 240 г/м²'),
(1, 'en', 'Oversize', 'Relaxed fit with dropped shoulders made of heavyweight 240 gsm cotton'),
(1, 'zh-CN', '宽松版型', '落肩宽松剪裁，采用 240 克重磅优质棉制作'),

(2, 'ru', 'Киберпанк', 'Неоновые принты, глитч-эффекты и техно-эстетика в стиле Palette 4'),
(2, 'en', 'Cyberpunk', 'Neon graphics, glitch visuals, and techno aesthetics inspired by Palette 4'),
(2, 'zh-CN', '赛博朋克', '霓虹印花、故障艺术以及 Palette 4 风格的科技美学'),

(3, 'ru', 'Лимитированные дропы', 'Ограниченные тиражи с номерными бирками и эксклюзивными принтами'),
(3, 'en', 'Limited Drops', 'Numbered limited edition items and exclusive collector graphic tees'),
(3, 'zh-CN', '限量发售', '限量编号系列与独家艺术家联名图案'),

(4, 'ru', 'Минимализм', 'Чистые силуэты, лаконичные микро-принты и премиальная базовая палитра'),
(4, 'en', 'Minimal', 'Clean silhouettes, subtle micro-prints and premium everyday basics'),
(4, 'zh-CN', '极简主义', '纯粹轮廓，简约微标与高质基础款')
ON CONFLICT DO NOTHING;

-- Методы доставки
INSERT INTO shipping_methods (id, code, type, base_price, free_from_amount, estimated_days_min, estimated_days_max, sort_order) VALUES
(1, 'courier-express', 'courier', 490, 5000, 1, 2, 1),
(2, 'cdek-door', 'courier', 390, 5000, 2, 4, 2),
(3, 'pickup-store', 'pickup', 0, 0, 0, 1, 3),
(4, 'cdek-pvz', 'pickup', 250, 4000, 2, 4, 4)
ON CONFLICT (code) DO NOTHING;

INSERT INTO shipping_method_translations (shipping_method_id, locale, name, description) VALUES
(1, 'ru', 'Курьерская доставка до двери (Москва & СПБ)', 'Быстрая доставка курьером с примеркой 15 минут'),
(1, 'en', 'Express Courier Delivery', 'Fast door-to-door courier delivery with 15-min try-on option'),
(1, 'zh-CN', '特快专递送货上门', '快速门到门配送，提供15分钟试穿时间'),

(2, 'ru', 'СДЭК Доставка по России', 'Надёжная доставка курьером СДЭК до двери в любой регион'),
(2, 'en', 'CDEK Courier across Russia', 'Reliable door delivery to any Russian region via CDEK'),
(2, 'zh-CN', 'CDEK 快递全境配送', '通过 CDEK 安全快捷配送至各个城市门市'),

(3, 'ru', 'Самовывоз из флагманского шоурума (Бесплатно)', 'Москва, ул. Дизайнеров, д. 42 (м. Курская), ежедневно 11:00–21:00'),
(3, 'en', 'Free Flagship Store Pickup', 'Moscow, Designers st. 42 (Kurskaya metro), open daily 11:00–21:00'),
(3, 'zh-CN', '旗舰店自提（免费）', '莫斯科设计师大街42号，每天 11:00–21:00 营业'),

(4, 'ru', 'Самовывоз из ПВЗ СДЭК / Boxberry', 'Более 5000 пунктов выдачи по всей стране с удобным графиком'),
(4, 'en', 'Pickup Point (CDEK / Boxberry)', 'Over 5,000 pickup lockers and offices across the country'),
(4, 'zh-CN', '自提点自取 (CDEK / Boxberry)', '全国超过 5000 个自提服务网点')
ON CONFLICT DO NOTHING;

-- Пункты самовывоза
INSERT INTO pickup_points (id, code, address, phone, opening_hours) VALUES
(1, 'MSK-FLAGSHIP', '{"city": "Москва", "street": "ул. Дизайнеров", "building": "42", "metro": "Курская"}'::jsonb, '+7 (495) 000-42-42', '{"daily": "11:00 - 21:00"}'::jsonb),
(2, 'SPB-CENTRAL', '{"city": "Санкт-Петербург", "street": "Невский пр.", "building": "88", "metro": "Маяковская"}'::jsonb, '+7 (812) 000-88-88', '{"daily": "10:00 - 22:00"}'::jsonb)
ON CONFLICT (code) DO NOTHING;

INSERT INTO pickup_point_translations (pickup_point_id, locale, name, instructions) VALUES
(1, 'ru', 'Флагманский магазин «Тест» (Москва)', 'Вход под неоновую вывеску «ТЕСТ CYBERSTORE», 1 этаж, примерочные зоны 1-4'),
(1, 'en', 'Flagship Store "Test" (Moscow)', 'Enter under the neon sign "TEST CYBERSTORE", 1st floor, fitting rooms 1-4'),
(1, 'zh-CN', '“测试”莫斯科旗舰店', '霓虹标志下进入，一楼1-4号更衣室'),

(2, 'ru', 'Шоурум «Тест» (Санкт-Петербург)', 'Арка во внутренний двор, отдельный вход со стеклянной дверью'),
(2, 'en', 'Showroom "Test" (St. Petersburg)', 'Courtyard entrance with glass door and cyan illuminated sign'),
(2, 'zh-CN', '“测试”圣彼得堡体验店', '内院拱门进入，青色霓虹玻璃门')
ON CONFLICT DO NOTHING;

-- Промокоды
INSERT INTO promo_codes (code, discount_type, value, max_discount, min_order_amount, usage_limit, usage_limit_per_user, starts_at, ends_at, is_active) VALUES
('CYBER10', 'percentage', 10.00, 2000.00, 2000.00, 1000, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '180 days', TRUE),
('WELCOME500', 'fixed', 500.00, 500.00, 3000.00, 500, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '90 days', TRUE)
ON CONFLICT (code) DO NOTHING;

-- Настройки сайта
INSERT INTO site_settings (key, value) VALUES
('store_name', '"Тест"'::jsonb),
('currency', '"RUB"'::jsonb),
('currency_symbol', '"₽"'::jsonb),
('reserve_timeout_minutes', '30'::jsonb),
('free_shipping_threshold', '5000'::jsonb),
('support_email', '"support@test-tee.ru"'::jsonb),
('support_phone', '"+7 (800) 555-35-35"'::jsonb),
('socials', '{"telegram": "https://t.me/test_tshirt", "vk": "https://vk.com/test_tshirt"}'::jsonb),
('maintenance_mode', 'false'::jsonb)
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
