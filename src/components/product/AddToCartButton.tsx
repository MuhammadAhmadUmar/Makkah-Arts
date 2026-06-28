"use client";

import type { ProductWithRelations } from "@/types/database";
import { useCartStore } from "@/lib/cart/store";
import { canAddToCart, getPrimaryImageUrl } from "@/lib/utils/product";
import { trackEvent } from "@/components/analytics/GoogleAnalytics";

interface AddToCartButtonProps {
  product: ProductWithRelations;
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const addItem = useCartStore((s) => s.addItem);
  const canAdd = canAddToCart(
    product.availability_status,
    product.stock_quantity,
  );

  if (!canAdd) return null;

  function handleAdd() {
    addItem({
      productId: product.id,
      slug: product.slug,
      title: product.title,
      price: product.price,
      imageUrl: getPrimaryImageUrl(product.product_images),
      availabilityStatus: product.availability_status,
    });
    trackEvent("add_to_cart", {
      currency: "PKR",
      value: product.price,
      items: product.title,
    });
  }

  return (
    <button
      type="button"
      onClick={handleAdd}
      className="w-full bg-foreground py-4 text-sm tracking-widest text-background uppercase transition hover:bg-accent"
    >
      {product.availability_status === "pre_order"
        ? "Pre-order — Add to Bag"
        : "Add to Bag"}
    </button>
  );
}
