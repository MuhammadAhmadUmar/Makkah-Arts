"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { generateOrderNumber } from "@/lib/utils/slug";
import {
  buildOrderWhatsAppMessage,
  buildWhatsAppUrl,
} from "@/lib/utils/whatsapp";
import {
  FREE_SHIPPING_THRESHOLD,
  PAYMENT_METHOD_LABELS,
  SHIPPING_FEE,
} from "@/lib/constants";
import type { CartItem } from "@/lib/cart/store";

const checkoutSchema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  notes: z.string().optional(),
  paymentMethod: z.enum(["cod", "easypaisa", "bank_transfer", "whatsapp"]),
});

export type CheckoutResult =
  | {
      success: true;
      orderNumber: string;
      whatsappUrl: string;
      total: number;
    }
  | { success: false; error: string };

export async function placeOrder(
  formData: FormData,
  cartItems: CartItem[],
): Promise<CheckoutResult> {
  if (!cartItems.length) {
    return { success: false, error: "Your cart is empty." };
  }

  const parsed = checkoutSchema.safeParse({
    name: formData.get("name"),
    phone: formData.get("phone"),
    address: formData.get("address"),
    city: formData.get("city"),
    notes: formData.get("notes") || undefined,
    paymentMethod: formData.get("paymentMethod"),
  });

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid form data",
    };
  }

  const { name, phone, address, city, notes, paymentMethod } = parsed.data;
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const total = subtotal + shippingFee;
  const orderNumber = generateOrderNumber();

  try {
    const supabase = createAdminClient();

    const { data: customer, error: customerError } = await supabase
      .from("customers")
      .upsert({ name, phone, city }, { onConflict: "phone" })
      .select()
      .single();

    if (customerError) {
      return { success: false, error: "Failed to save customer details." };
    }

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        order_number: orderNumber,
        customer_id: customer.id,
        customer_name: name,
        customer_phone: phone,
        customer_address: address,
        customer_city: city,
        notes: notes ?? null,
        payment_method: paymentMethod,
        subtotal,
        shipping_fee: shippingFee,
        total,
      })
      .select()
      .single();

    if (orderError || !order) {
      return { success: false, error: "Failed to create order." };
    }

    const orderItems = cartItems.map((item) => ({
      order_id: order.id,
      product_id: item.productId,
      product_title: item.title,
      product_slug: item.slug,
      unit_price: item.price,
      quantity: item.quantity,
      line_total: item.price * item.quantity,
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (itemsError) {
      return { success: false, error: "Failed to save order items." };
    }

    revalidatePath("/admin/orders");

    const whatsappUrl = buildWhatsAppUrl(
      buildOrderWhatsAppMessage({
        orderNumber,
        customerName: name,
        customerPhone: phone,
        customerAddress: address,
        customerCity: city,
        paymentMethod: PAYMENT_METHOD_LABELS[paymentMethod],
        total,
        items: cartItems.map((item) => ({
          title: item.title,
          quantity: item.quantity,
          lineTotal: item.price * item.quantity,
        })),
      }),
    );

    return { success: true, orderNumber, whatsappUrl, total };
  } catch {
    return {
      success: false,
      error: "Order service is not configured. Please contact us on WhatsApp.",
    };
  }
}
