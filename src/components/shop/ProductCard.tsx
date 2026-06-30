import Link from "next/link";
import Image from "next/image";
import type { ProductWithRelations } from "@/types/database";
import { formatPKR } from "@/lib/utils/format";
import {
  getAvailabilityBadgeClass,
  getAvailabilityLabel,
  getPrimaryImageUrl,
} from "@/lib/utils/product";

interface ProductCardProps {
  product: ProductWithRelations;
}

export function ProductCard({ product }: ProductCardProps) {
  const imageUrl = getPrimaryImageUrl(product.product_images);
  const label = getAvailabilityLabel(
    product.availability_status,
    product.stock_quantity,
  );
  const badgeClass = getAvailabilityBadgeClass(
    product.availability_status,
    product.stock_quantity,
  );

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group block rounded-[1.5rem] border border-border bg-white p-2 transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(26,26,26,0.08)]"
    >
      <div className="relative aspect-[3/4] overflow-hidden rounded-[1.125rem] bg-stone-100">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={product.title}
            fill
            className="object-contain object-center transition duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted">
            No image
          </div>
        )}
        <span
          className={`absolute top-3 left-3 border px-2 py-1 text-[10px] tracking-[0.24em] uppercase ${badgeClass}`}
        >
          {label}
        </span>
      </div>
      <div className="mt-4 px-2 pb-2">
        <h3 className="font-serif text-lg leading-snug text-foreground transition group-hover:text-accent md:text-xl">
          {product.title}
        </h3>
        {product.color && (
          <p className="mt-1 text-xs uppercase tracking-[0.24em] text-muted">
            {product.color}
          </p>
        )}
        <div className="mt-3 flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-foreground">
            {formatPKR(product.price)}
          </p>
          <span className="text-[11px] uppercase tracking-[0.3em] text-accent">
            View details
          </span>
        </div>
      </div>
    </Link>
  );
}
