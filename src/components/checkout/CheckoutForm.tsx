"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BANK_DETAILS,
  EASYPAISA_NUMBER,
  FREE_SHIPPING_THRESHOLD,
  PAYMENT_METHOD_LABELS,
  SHIPPING_FEE,
} from "@/lib/constants";
import { useCartStore } from "@/lib/cart/store";
import { formatPKR } from "@/lib/utils/format";
import { placeOrder } from "@/app/checkout/actions";
import { trackEvent } from "@/components/analytics/GoogleAnalytics";

export function CheckoutForm() {
  const { items, getSubtotal, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<{
    orderNumber: string;
    whatsappUrl: string;
    total: number;
    paymentMethod: string;
    emailSent: boolean;
    emailError?: string;
  } | null>(null);

  const subtotal = getSubtotal();
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const total = subtotal + shipping;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    trackEvent("begin_checkout", { value: total, currency: "PKR" });

    const result = await placeOrder(formData, items);

    if (result.success) {
      const paymentMethod = formData.get("paymentMethod") as string;
      setConfirmation({
        orderNumber: result.orderNumber,
        whatsappUrl: result.whatsappUrl,
        total: result.total,
        paymentMethod:
          PAYMENT_METHOD_LABELS[
            paymentMethod as keyof typeof PAYMENT_METHOD_LABELS
          ],
        emailSent: result.emailSent,
        emailError: result.emailError,
      });
      trackEvent("purchase", {
        transaction_id: result.orderNumber,
        value: result.total,
        currency: "PKR",
      });
      clearCart();
    } else {
      setError(result.error);
    }

    setLoading(false);
  }

  if (!items.length && !confirmation) {
    return (
      <div className="py-20 text-center">
        <p className="font-serif text-2xl">Your bag is empty</p>
        <Link
          href="/shop"
          className="mt-6 inline-block bg-foreground px-8 py-3 text-xs tracking-widest text-background uppercase"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  if (confirmation) {
    return (
      <div className="mx-auto max-w-lg py-12 text-center">
        <p className="text-xs tracking-widest text-accent uppercase">
          Order Placed
        </p>
        <h1 className="mt-2 font-serif text-3xl">Thank You!</h1>
        <p className="mt-4 text-sm text-muted">
          Your order <strong>{confirmation.orderNumber}</strong> has been
          received. Total: {formatPKR(confirmation.total)}
        </p>
        <p className="mt-2 text-sm text-muted">
          Payment method: {confirmation.paymentMethod}
        </p>

        {(confirmation.paymentMethod.includes("EasyPaisa") ||
          confirmation.paymentMethod.includes("Bank")) && (
          <div className="mt-6 border border-border bg-white p-4 text-left text-sm">
            {EASYPAISA_NUMBER && (
              <p className="mb-2">
                <span className="text-muted">EasyPaisa: </span>
                {EASYPAISA_NUMBER}
              </p>
            )}
            {BANK_DETAILS && (
              <p>
                <span className="text-muted">Bank: </span>
                {BANK_DETAILS}
              </p>
            )}
          </div>
        )}

        <a
          href={confirmation.whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-block bg-[#25D366] px-8 py-3 text-xs tracking-widest text-white uppercase"
        >
          Confirm on WhatsApp
        </a>
        {!confirmation.emailSent && (
          <div className="mt-4 rounded border border-orange-200 bg-orange-50 p-4 text-left text-sm text-orange-800">
            <p className="font-medium">Email not delivered</p>
            <p>
              We could not send a confirmation email to the address you
              provided.
            </p>
            {confirmation.emailError && (
              <p className="mt-2 text-xs text-orange-700">
                {confirmation.emailError}
              </p>
            )}
          </div>
        )}

        <Link
          href="/shop"
          className="mt-4 block text-sm text-accent hover:underline"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-12 lg:grid-cols-2">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="text-xs tracking-widest text-muted uppercase">
            Full Name
          </label>
          <input
            id="name"
            name="name"
            required
            className="mt-2 w-full border border-border bg-white px-4 py-3 text-sm outline-none focus:border-accent"
          />
        </div>

        <div>
          <label htmlFor="email" className="text-xs tracking-widest text-muted uppercase">
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="you@example.com"
            className="mt-2 w-full border border-border bg-white px-4 py-3 text-sm outline-none focus:border-accent"
          />
        </div>

        <div>
          <label htmlFor="phone" className="text-xs tracking-widest text-muted uppercase">
            Phone (WhatsApp)
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            placeholder="03XX XXXXXXX"
            className="mt-2 w-full border border-border bg-white px-4 py-3 text-sm outline-none focus:border-accent"
          />
        </div>

        <div>
          <label htmlFor="address" className="text-xs tracking-widest text-muted uppercase">
            Address
          </label>
          <textarea
            id="address"
            name="address"
            required
            rows={3}
            className="mt-2 w-full border border-border bg-white px-4 py-3 text-sm outline-none focus:border-accent"
          />
        </div>

        <div>
          <label htmlFor="city" className="text-xs tracking-widest text-muted uppercase">
            City
          </label>
          <input
            id="city"
            name="city"
            required
            className="mt-2 w-full border border-border bg-white px-4 py-3 text-sm outline-none focus:border-accent"
          />
        </div>

        <div>
          <label htmlFor="notes" className="text-xs tracking-widest text-muted uppercase">
            Order Notes (optional)
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={2}
            className="mt-2 w-full border border-border bg-white px-4 py-3 text-sm outline-none focus:border-accent"
          />
        </div>

        <fieldset>
          <legend className="text-xs tracking-widest text-muted uppercase">
            Payment Method
          </legend>
          <div className="mt-3 space-y-2">
            {Object.entries(PAYMENT_METHOD_LABELS).map(([value, label]) => (
              <label
                key={value}
                className="flex cursor-pointer items-center gap-3 border border-border bg-white px-4 py-3 text-sm"
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value={value}
                  defaultChecked={value === "cod"}
                  required
                />
                {label}
              </label>
            ))}
          </div>
        </fieldset>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-foreground py-4 text-sm tracking-widest text-background uppercase transition hover:bg-accent disabled:opacity-50"
        >
          {loading ? "Placing Order..." : "Place Order"}
        </button>
      </form>

      <div className="border border-border bg-white p-6">
        <h2 className="font-serif text-xl">Order Summary</h2>
        <ul className="mt-6 space-y-4">
          {items.map((item) => (
            <li key={item.productId} className="flex justify-between text-sm">
              <span>
                {item.title} × {item.quantity}
              </span>
              <span>{formatPKR(item.price * item.quantity)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-6 space-y-2 border-t border-border pt-4 text-sm">
          <div className="flex justify-between">
            <span className="text-muted">Subtotal</span>
            <span>{formatPKR(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted">Shipping</span>
            <span>{shipping === 0 ? "Free" : formatPKR(shipping)}</span>
          </div>
          <div className="flex justify-between border-t border-border pt-2 font-medium">
            <span>Total</span>
            <span>{formatPKR(total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
