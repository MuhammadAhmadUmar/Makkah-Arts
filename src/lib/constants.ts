export const BRAND_NAME = process.env.NEXT_PUBLIC_BRAND_NAME ?? "Makkah Arts";
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
export const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "923001234567";
export const EASYPAISA_NUMBER =
  process.env.NEXT_PUBLIC_EASYPAISA_NUMBER ?? "";
export const BANK_DETAILS = process.env.NEXT_PUBLIC_BANK_DETAILS ?? "";

export const FREE_SHIPPING_THRESHOLD = 5000;
export const SHIPPING_FEE = 250;

export const AVAILABILITY_LABELS = {
  in_stock: "In Stock",
  pre_order: "Pre-order",
  coming_soon: "Coming Soon",
} as const;

export const PAYMENT_METHOD_LABELS = {
  cod: "Cash on Delivery",
  easypaisa: "EasyPaisa",
  bank_transfer: "Bank Transfer",
  whatsapp: "WhatsApp Confirmation",
} as const;

export const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
] as const;
