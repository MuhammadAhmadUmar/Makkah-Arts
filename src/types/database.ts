export type AvailabilityStatus = "in_stock" | "pre_order" | "coming_soon";
export type OrderStatus =
  | "pending"
  | "confirmed"
  | "shipped"
  | "delivered"
  | "cancelled";
export type PaymentMethod = "cod" | "easypaisa" | "bank_transfer" | "whatsapp";

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  sort_order: number;
  created_at: string;
}

export interface Product {
  id: string;
  slug: string;
  title: string;
  price: number;
  description: string | null;
  category_id: string | null;
  availability_status: AvailabilityStatus;
  stock_quantity: number;
  featured: boolean;
  fabric: string | null;
  color: string | null;
  delivery_estimate: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProductImage {
  id: string;
  product_id: string;
  url: string;
  alt_text: string | null;
  sort_order: number;
  created_at: string;
}

export interface ProductWithRelations extends Product {
  categories: Pick<Category, "name" | "slug"> | null;
  product_images: ProductImage[];
}

export interface Customer {
  id: string;
  name: string;
  email: string | null;
  phone: string;
  city: string | null;
  created_at: string;
}

export interface Order {
  id: string;
  order_number: string;
  customer_id: string | null;
  customer_name: string;
  customer_email: string | null;
  customer_phone: string;
  customer_address: string;
  customer_city: string;
  notes: string | null;
  payment_method: PaymentMethod;
  status: OrderStatus;
  subtotal: number;
  shipping_fee: number;
  total: number;
  created_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  product_title: string;
  product_slug: string | null;
  unit_price: number;
  quantity: number;
  line_total: number;
}

export interface OrderWithItems extends Order {
  order_items: OrderItem[];
}

export interface ShopFilters {
  q?: string;
  category?: string;
  availability?: AvailabilityStatus;
  color?: string;
  min?: number;
  max?: number;
  sort?: "newest" | "price_asc" | "price_desc";
}
