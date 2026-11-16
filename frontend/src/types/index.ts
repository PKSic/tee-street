export type Locale = 'ru' | 'en' | 'zh-CN';
export type ThemeMode = 'dark' | 'light' | 'system';

export interface Size {
  id: number;
  code: string;
  name: string;
}

export interface Color {
  id: number;
  code: string;
  hex_color: string;
  name: string;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  size_id: number;
  color_id: number;
  sku: string;
  price_override: number | null;
  barcode: string;
  on_hand: number;
  reserved: number;
  available: number;
}

export interface Product {
  id: string;
  slug: string;
  model_sku: string;
  category_id: number;
  base_price: number;
  old_price: number | null;
  status: 'published' | 'draft' | 'archived';
  is_featured: boolean;
  fabric_composition: string;
  rating_avg: number;
  reviews_count: number;
  badge?: string;
  image_url?: string;
  images_by_color?: Record<string, string>;
  print_style: string;
  print_title: string;
  print_subtitle: string;
  name: string;
  short_description: string;
  description: string;
  variants: ProductVariant[];
}

export interface CartItem {
  id: string;
  variant_id: string;
  product: Product;
  size: Size;
  color: Color;
  quantity: number;
  unit_price: number;
  line_total: number;
}

export interface PromoCode {
  code: string;
  discount_type: 'percentage' | 'fixed';
  value: number;
  max_discount?: number;
  min_order_amount: number;
}

export interface ShippingMethod {
  id: number;
  code: string;
  type: 'courier' | 'pickup' | 'post';
  name: string;
  description: string;
  base_price: number;
  free_from_amount: number;
  estimated_days_min: number;
  estimated_days_max: number;
}

export interface PickupPoint {
  id: number;
  code: string;
  name: string;
  instructions: string;
  address: {
    city: string;
    street: string;
    building: string;
    metro?: string;
  };
  phone: string;
  opening_hours: {
    daily: string;
  };
}

export interface Order {
  id: string;
  order_number: string;
  guest_access_token: string;
  status:
    | 'pending_payment'
    | 'paid'
    | 'confirmed'
    | 'processing'
    | 'ready_for_pickup'
    | 'shipped'
    | 'delivered'
    | 'completed'
    | 'return_requested'
    | 'returned'
    | 'cancelled';
  subtotal: number;
  discount_total: number;
  shipping_total: number;
  grand_total: number;
  created_at: string;
  recipient_name: string;
  recipient_birth_date?: string;
  guest_email: string;
  guest_phone: string;
  payment_method: 'online_card' | 'sbp' | 'cash_on_delivery';
  shipping_method_name: string;
  delivery_type?: 'delivery' | 'pickup';
  delivery_address?: string;
  pickup_point_info?: string;
  pickup_point_id?: number;
  tracking_number?: string;
  current_location?: string;
  estimated_delivery?: string;
  return_status?: 'none' | 'requested' | 'approved' | 'rejected' | 'refunded';
  return_reason?: string;
  return_comment?: string;
  return_requested_at?: string;
  refund_amount?: number;
  items: Array<{
    product_name_snapshot: string;
    sku_snapshot: string;
    size_snapshot: string;
    color_snapshot: string;
    unit_price: number;
    quantity: number;
    line_total: number;
    image_url?: string;
  }>;
}

export interface Review {
  id: number;
  product_id: string;
  author_name: string;
  rating: number;
  title: string;
  body: string;
  status: 'published' | 'pending' | 'rejected';
  created_at: string;
}

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: 'admin' | 'manager' | 'content_manager' | 'user';
  phone?: string;
  birth_date?: string;
  address?: string;
}
