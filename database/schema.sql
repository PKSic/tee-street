-- ============================================================================
-- Схема базы данных PostgreSQL для интернет-магазина футболок «Тест»
-- Полнофункциональная реляционная модель по спецификации ТЗ
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Пользователи и роли
CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    is_system BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS permissions (
    id SERIAL PRIMARY KEY,
    code VARCHAR(100) NOT NULL UNIQUE,
    description TEXT
);

CREATE TABLE IF NOT EXISTS role_permissions (
    role_id INTEGER NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    permission_id INTEGER NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL DEFAULT '',
    phone VARCHAR(50),
    email_verified_at TIMESTAMPTZ,
    status VARCHAR(30) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'pending')),
    preferred_locale VARCHAR(10) NOT NULL DEFAULT 'ru' CHECK (preferred_locale IN ('ru', 'en', 'zh-CN')),
    theme VARCHAR(20) NOT NULL DEFAULT 'dark' CHECK (theme IN ('light', 'dark', 'system')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS user_roles (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id INTEGER NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, role_id)
);

CREATE TABLE IF NOT EXISTS addresses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    label VARCHAR(50) DEFAULT 'Дом',
    recipient_name VARCHAR(150) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    country VARCHAR(100) NOT NULL DEFAULT 'Россия',
    region VARCHAR(100),
    city VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20),
    street VARCHAR(150) NOT NULL,
    building VARCHAR(30) NOT NULL,
    apartment VARCHAR(30),
    comment TEXT,
    is_default BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2. Каталог: Категории, Размеры, Цвета
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    parent_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    image_url TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS category_translations (
    id SERIAL PRIMARY KEY,
    category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    locale VARCHAR(10) NOT NULL CHECK (locale IN ('ru', 'en', 'zh-CN')),
    name VARCHAR(150) NOT NULL,
    description TEXT,
    seo_title VARCHAR(255),
    seo_description TEXT,
    UNIQUE (category_id, locale)
);

CREATE TABLE IF NOT EXISTS sizes (
    id SERIAL PRIMARY KEY,
    code VARCHAR(20) NOT NULL UNIQUE,
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS size_translations (
    id SERIAL PRIMARY KEY,
    size_id INTEGER NOT NULL REFERENCES sizes(id) ON DELETE CASCADE,
    locale VARCHAR(10) NOT NULL CHECK (locale IN ('ru', 'en', 'zh-CN')),
    name VARCHAR(50) NOT NULL,
    UNIQUE (size_id, locale)
);

CREATE TABLE IF NOT EXISTS colors (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    hex_color VARCHAR(20) NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS color_translations (
    id SERIAL PRIMARY KEY,
    color_id INTEGER NOT NULL REFERENCES colors(id) ON DELETE CASCADE,
    locale VARCHAR(10) NOT NULL CHECK (locale IN ('ru', 'en', 'zh-CN')),
    name VARCHAR(100) NOT NULL,
    UNIQUE (color_id, locale)
);

-- 3. Каталог: Товары и Варианты (SKU)
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id INTEGER REFERENCES categories(id) ON DELETE RESTRICT,
    slug VARCHAR(150) NOT NULL UNIQUE,
    model_sku VARCHAR(50) NOT NULL UNIQUE,
    base_price NUMERIC(12,2) NOT NULL CHECK (base_price >= 0),
    status VARCHAR(30) NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    fabric_composition VARCHAR(255) DEFAULT '100% Плотный гребенной хлопок пенье, 240 г/м²',
    rating_avg NUMERIC(3,2) NOT NULL DEFAULT 5.00,
    reviews_count INTEGER NOT NULL DEFAULT 0,
    published_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS product_translations (
    id SERIAL PRIMARY KEY,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    locale VARCHAR(10) NOT NULL CHECK (locale IN ('ru', 'en', 'zh-CN')),
    name VARCHAR(255) NOT NULL,
    short_description TEXT,
    description TEXT,
    seo_title VARCHAR(255),
    seo_description TEXT,
    UNIQUE (product_id, locale)
);

CREATE TABLE IF NOT EXISTS product_images (
    id SERIAL PRIMARY KEY,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    alt_text VARCHAR(255),
    color_id INTEGER REFERENCES colors(id) ON DELETE SET NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_primary BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS product_variants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    size_id INTEGER NOT NULL REFERENCES sizes(id) ON DELETE RESTRICT,
    color_id INTEGER NOT NULL REFERENCES colors(id) ON DELETE RESTRICT,
    sku VARCHAR(80) NOT NULL UNIQUE,
    price_override NUMERIC(12,2) CHECK (price_override IS NULL OR price_override >= 0),
    barcode VARCHAR(60),
    weight_grams INTEGER DEFAULT 320,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    UNIQUE (product_id, size_id, color_id)
);

-- 4. Складской учет (Inventory)
CREATE TABLE IF NOT EXISTS inventory (
    variant_id UUID PRIMARY KEY REFERENCES product_variants(id) ON DELETE CASCADE,
    on_hand INTEGER NOT NULL DEFAULT 0 CHECK (on_hand >= 0),
    reserved INTEGER NOT NULL DEFAULT 0 CHECK (reserved >= 0),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_reserved_lte_on_hand CHECK (reserved <= on_hand)
);

CREATE TABLE IF NOT EXISTS inventory_movements (
    id SERIAL PRIMARY KEY,
    variant_id UUID NOT NULL REFERENCES product_variants(id) ON DELETE CASCADE,
    movement_type VARCHAR(30) NOT NULL CHECK (movement_type IN ('inflow', 'reserve', 'unreserve', 'sale', 'return', 'adjustment')),
    quantity INTEGER NOT NULL,
    reference_type VARCHAR(50),
    reference_id VARCHAR(100),
    reason TEXT,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 5. Корзина (Пользовательская + Гостевая)
CREATE TABLE IF NOT EXISTS carts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    guest_token_hash VARCHAR(128) UNIQUE,
    currency VARCHAR(10) NOT NULL DEFAULT 'RUB',
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT cart_owner_check CHECK (user_id IS NOT NULL OR guest_token_hash IS NOT NULL)
);

CREATE TABLE IF NOT EXISTS cart_items (
    id SERIAL PRIMARY KEY,
    cart_id UUID NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
    variant_id UUID NOT NULL REFERENCES product_variants(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (cart_id, variant_id)
);

-- 6. Избранное
CREATE TABLE IF NOT EXISTS favorites (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, product_id)
);

-- 7. Доставка и Пункты выдачи
CREATE TABLE IF NOT EXISTS shipping_methods (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    type VARCHAR(30) NOT NULL CHECK (type IN ('courier', 'pickup', 'post')),
    base_price NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (base_price >= 0),
    free_from_amount NUMERIC(12,2) DEFAULT 5000,
    estimated_days_min INTEGER NOT NULL DEFAULT 1,
    estimated_days_max INTEGER NOT NULL DEFAULT 3,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS shipping_method_translations (
    id SERIAL PRIMARY KEY,
    shipping_method_id INTEGER NOT NULL REFERENCES shipping_methods(id) ON DELETE CASCADE,
    locale VARCHAR(10) NOT NULL CHECK (locale IN ('ru', 'en', 'zh-CN')),
    name VARCHAR(150) NOT NULL,
    description TEXT,
    UNIQUE (shipping_method_id, locale)
);

CREATE TABLE IF NOT EXISTS pickup_points (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    address JSONB NOT NULL,
    phone VARCHAR(50) NOT NULL,
    opening_hours JSONB NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS pickup_point_translations (
    id SERIAL PRIMARY KEY,
    pickup_point_id INTEGER NOT NULL REFERENCES pickup_points(id) ON DELETE CASCADE,
    locale VARCHAR(10) NOT NULL CHECK (locale IN ('ru', 'en', 'zh-CN')),
    name VARCHAR(150) NOT NULL,
    instructions TEXT,
    UNIQUE (pickup_point_id, locale)
);

-- 8. Скидки и Промокоды
CREATE TABLE IF NOT EXISTS promo_codes (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    discount_type VARCHAR(20) NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
    value NUMERIC(12,2) NOT NULL CHECK (value > 0),
    max_discount NUMERIC(12,2),
    min_order_amount NUMERIC(12,2) DEFAULT 0,
    usage_limit INTEGER,
    usage_limit_per_user INTEGER DEFAULT 1,
    usage_count INTEGER NOT NULL DEFAULT 0,
    starts_at TIMESTAMPTZ,
    ends_at TIMESTAMPTZ,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 9. Заказы и элементы заказов (иммутабельные снимки)
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number VARCHAR(50) NOT NULL UNIQUE,
    guest_access_token VARCHAR(128) NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    guest_email VARCHAR(255),
    guest_phone VARCHAR(50),
    recipient_name VARCHAR(150) NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'RUB',
    status VARCHAR(40) NOT NULL DEFAULT 'pending_payment' CHECK (
        status IN (
            'pending_payment', 'paid', 'confirmed', 'processing',
            'ready_for_pickup', 'shipped', 'delivered', 'completed',
            'cancelled', 'refunded', 'partially_refunded'
        )
    ),
    payment_method VARCHAR(40) NOT NULL CHECK (payment_method IN ('online_card', 'sbp', 'cash_on_delivery')),
    payment_status VARCHAR(30) NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
    subtotal NUMERIC(12,2) NOT NULL,
    discount_total NUMERIC(12,2) NOT NULL DEFAULT 0,
    shipping_total NUMERIC(12,2) NOT NULL DEFAULT 0,
    grand_total NUMERIC(12,2) NOT NULL,
    promo_code_snapshot JSONB,
    shipping_method_name VARCHAR(150) NOT NULL,
    shipping_address_snapshot JSONB,
    pickup_point_snapshot JSONB,
    customer_comment TEXT,
    idempotency_key VARCHAR(100) UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    cancelled_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    variant_id UUID REFERENCES product_variants(id) ON DELETE SET NULL,
    product_name_snapshot VARCHAR(255) NOT NULL,
    sku_snapshot VARCHAR(80) NOT NULL,
    size_snapshot VARCHAR(50) NOT NULL,
    color_snapshot VARCHAR(50) NOT NULL,
    unit_price NUMERIC(12,2) NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    discount_total NUMERIC(12,2) NOT NULL DEFAULT 0,
    line_total NUMERIC(12,2) NOT NULL
);

CREATE TABLE IF NOT EXISTS order_status_history (
    id SERIAL PRIMARY KEY,
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    old_status VARCHAR(40),
    new_status VARCHAR(40) NOT NULL,
    comment TEXT,
    changed_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 10. Платежи и вебхуки
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    provider VARCHAR(50) NOT NULL DEFAULT 'mock_gateway',
    provider_payment_id VARCHAR(100),
    payment_method VARCHAR(50) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'succeeded', 'failed', 'cancelled')),
    amount NUMERIC(12,2) NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'RUB',
    idempotency_key VARCHAR(100) UNIQUE,
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS payment_events (
    id SERIAL PRIMARY KEY,
    payment_id UUID NOT NULL REFERENCES payments(id) ON DELETE CASCADE,
    provider_event_id VARCHAR(100) UNIQUE,
    event_type VARCHAR(50) NOT NULL,
    payload JSONB NOT NULL,
    processed_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 11. Отзывы
CREATE TABLE IF NOT EXISTS reviews (
    id SERIAL PRIMARY KEY,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    author_name VARCHAR(100) NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(200) NOT NULL,
    body TEXT NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'published' CHECK (status IN ('pending', 'published', 'rejected', 'hidden')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 12. CMS: Страницы, Баннеры, Настройки магазина
CREATE TABLE IF NOT EXISTS pages (
    id SERIAL PRIMARY KEY,
    slug VARCHAR(100) NOT NULL UNIQUE,
    status VARCHAR(20) NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published')),
    published_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS page_translations (
    id SERIAL PRIMARY KEY,
    page_id INTEGER NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
    locale VARCHAR(10) NOT NULL CHECK (locale IN ('ru', 'en', 'zh-CN')),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    seo_title VARCHAR(255),
    seo_description TEXT,
    UNIQUE (page_id, locale)
);

CREATE TABLE IF NOT EXISTS banners (
    id SERIAL PRIMARY KEY,
    image_url TEXT NOT NULL,
    link_url TEXT NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS banner_translations (
    id SERIAL PRIMARY KEY,
    banner_id INTEGER NOT NULL REFERENCES banners(id) ON DELETE CASCADE,
    locale VARCHAR(10) NOT NULL CHECK (locale IN ('ru', 'en', 'zh-CN')),
    title VARCHAR(200) NOT NULL,
    subtitle TEXT,
    button_text VARCHAR(50) DEFAULT 'Купить дроп',
    UNIQUE (banner_id, locale)
);

CREATE TABLE IF NOT EXISTS site_settings (
    key VARCHAR(100) PRIMARY KEY,
    value JSONB NOT NULL,
    is_secret BOOLEAN NOT NULL DEFAULT FALSE,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 13. Аудит действий сотрудников
CREATE TABLE IF NOT EXISTS audit_logs (
    id BIGSERIAL PRIMARY KEY,
    actor_id UUID REFERENCES users(id) ON DELETE SET NULL,
    actor_email VARCHAR(255),
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id VARCHAR(100),
    before_data JSONB,
    after_data JSONB,
    ip_address VARCHAR(50),
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Индексы для сверхбыстрой выборки
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_variants_product ON product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_variants_sku ON product_variants(sku);
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_reviews_product ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_logs(created_at);
