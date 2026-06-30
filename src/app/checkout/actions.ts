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
import { sendOrderConfirmationEmail } from "@/lib/email";
import type { CartItem } from "@/lib/cart/store";

const checkoutSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email address is required"),
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
      emailSent: boolean;
      emailError?: string;
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
    email: formData.get("email"),
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

  const { name, email, phone, address, city, notes, paymentMethod } = parsed.data;
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const total = subtotal + shippingFee;
  const orderNumber = generateOrderNumber();

  try {
    const supabase = createAdminClient();

    const customerPayload = { name, phone, city, ...(email ? { email } : {}) };
    let customerId: string | null = null;

    const { data: customerData, error: customerError } = await supabase
      .from("customers")
      .upsert(customerPayload, { onConflict: "phone" })
      .select("id")
      .single();

    if (!customerError && customerData) {
      customerId = customerData.id;
    } else {
      console.error("Customer save error:", customerError?.message ?? "Unknown error");

      const {
        data: fallbackCustomer,
        error: fallbackError,
      } = await supabase
        .from("customers")
        .upsert({ name, phone, city }, { onConflict: "phone" })
        .select("id")
        .single();

      if (!fallbackError && fallbackCustomer) {
        customerId = fallbackCustomer.id;
      }

      if (!customerId) {
        const {
          data: existingCustomer,
          error: existingCustomerError,
        } = await supabase
          .from("customers")
          .select("id")
          .eq("phone", phone)
          .single();

        if (!existingCustomerError && existingCustomer) {
          customerId = existingCustomer.id;
        }
      }
    }

    const orderPayload = {
      order_number: orderNumber,
      customer_id: customerId,
      customer_name: name,
      customer_phone: phone,
      customer_address: address,
      customer_city: city,
      notes: notes ?? null,
      payment_method: paymentMethod,
      subtotal,
      shipping_fee: shippingFee,
      total,
      ...(email ? { customer_email: email } : {}),
    };

    let orderError = null;
    let order = null;

    ({ data: order, error: orderError } = await supabase
      .from("orders")
      .insert(orderPayload)
      .select()
      .single());

    if (orderError && email && orderError.message?.includes("customer_email")) {
      ({ data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          order_number: orderNumber,
          customer_id: customerId,
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
        .single());
    }

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

    let emailSent = true;
    let emailError: string | undefined;

    try {
      await sendOrderConfirmationEmail(email, orderNumber, total, PAYMENT_METHOD_LABELS[paymentMethod], cartItems.map((item) => ({
        title: item.title,
        quantity: item.quantity,
        lineTotal: item.price * item.quantity,
      })));
    } catch (sendError) {
      emailSent = false;
      emailError = sendError instanceof Error ? sendError.message : "Unable to send confirmation email.";
      console.error("Order confirmation email failed:", sendError);
    }

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

    return { success: true, orderNumber, whatsappUrl, total, emailSent, emailError };
  } catch {
    return {
      success: false,
      error: "Order service is not configured. Please contact us on WhatsApp.",
    };
  }
}
