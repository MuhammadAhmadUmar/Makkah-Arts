"use client";

import Image from "next/image";
import Link from "next/link";
import {
  FREE_SHIPPING_THRESHOLD,
  SHIPPING_FEE,
} from "@/lib/constants";
import { useCartStore } from "@/lib/cart/store";
import { formatPKR } from "@/lib/utils/format";

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, getSubtotal } =
    useCartStore();

  const subtotal = getSubtotal();
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const total = subtotal + shipping;

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-black/40"
        onClick={closeCart}
        aria-hidden
      />
      <aside className="fixed top-0 right-0 z-50 flex h-full w-full max-w-md flex-col bg-background shadow-2xl">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="font-serif text-xl">Your Bag</h2>
          <button
            type="button"
            onClick={closeCart}
            className="text-muted hover:text-foreground"
            aria-label="Close cart"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <p className="py-12 text-center text-muted">Your bag is empty.</p>
          ) : (
            <ul className="space-y-6">
              {items.map((item) => (
                <li key={item.productId} className="flex gap-4">
                  <div className="relative h-24 w-20 shrink-0 overflow-hidden bg-stone-100">
                    {item.imageUrl ? (
                      <Image
                        src={item.imageUrl}
                        alt={item.title}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-muted">
                        No image
                      </div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col">
                    <Link
                      href={`/product/${item.slug}`}
                      onClick={closeCart}
                      className="font-serif text-sm hover:text-accent"
                    >
                      {item.title}
                    </Link>
                    <p className="mt-1 text-sm">{formatPKR(item.price)}</p>
                    <div className="mt-auto flex items-center gap-3">
                      <div className="flex items-center border border-border">
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity - 1)
                          }
                          className="px-2 py-1 text-sm hover:bg-stone-100"
                        >
                          −
                        </button>
                        <span className="px-3 text-sm">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity + 1)
                          }
                          className="px-2 py-1 text-sm hover:bg-stone-100"
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.productId)}
                        className="text-xs text-muted underline hover:text-foreground"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-border px-6 py-6">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted">Subtotal</span>
                <span>{formatPKR(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Shipping</span>
                <span>
                  {shipping === 0 ? "Free" : formatPKR(shipping)}
                </span>
              </div>
              <div className="flex justify-between border-t border-border pt-2 font-medium">
                <span>Total</span>
                <span>{formatPKR(total)}</span>
              </div>
            </div>
            <Link
              href="/checkout"
              onClick={closeCart}
              className="mt-6 block w-full bg-foreground py-3 text-center text-sm tracking-widest text-background uppercase transition hover:bg-accent"
            >
              Checkout
            </Link>
          </div>
        )}
      </aside>
    </>
  );
}
