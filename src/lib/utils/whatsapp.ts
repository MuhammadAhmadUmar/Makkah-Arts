import { SITE_URL, WHATSAPP_NUMBER } from "@/lib/constants";

export function buildWhatsAppUrl(message: string): string {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`;
}

export function buildProductWhatsAppMessage(
  title: string,
  slug: string,
  price: number,
): string {
  return `Hi Makkah Arts! I'd like to order:\n\n*${title}*\nPrice: Rs. ${price.toLocaleString("en-PK")}\n${SITE_URL}/product/${slug}`;
}

export function buildOrderWhatsAppMessage(order: {
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  customerCity: string;
  paymentMethod: string;
  total: number;
  items: { title: string; quantity: number; lineTotal: number }[];
}): string {
  const itemsList = order.items
    .map(
      (item) =>
        `• ${item.title} x${item.quantity} — Rs. ${item.lineTotal.toLocaleString("en-PK")}`,
    )
    .join("\n");

  return [
    `New order from Makkah Arts website`,
    ``,
    `Order: ${order.orderNumber}`,
    `Name: ${order.customerName}`,
    `Phone: ${order.customerPhone}`,
    `Address: ${order.customerAddress}, ${order.customerCity}`,
    `Payment: ${order.paymentMethod}`,
    ``,
    `Items:`,
    itemsList,
    ``,
    `Total: Rs. ${order.total.toLocaleString("en-PK")}`,
  ].join("\n");
}
