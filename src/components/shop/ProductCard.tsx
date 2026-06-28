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
    <Link href={`/product/${product.slug}`} className="group block">
      <div className="relative aspect-[3/4] overflow-hidden bg-stone-100">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={product.title}
            fill
            className="object-cover transition duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted">
            No image
          </div>
        )}
        <span
          className={`absolute top-3 left-3 border px-2 py-1 text-[10px] tracking-wide uppercase ${badgeClass}`}
        >
          {label}
        </span>
      </div>
      <div className="mt-3">
        <h3 className="font-serif text-base leading-snug group-hover:text-accent md:text-lg">
          {product.title}
        </h3>
        {product.color && (
          <p className="mt-1 text-xs text-muted">{product.color}</p>
        )}
        <p className="mt-2 text-sm font-medium">{formatPKR(product.price)}</p>
      </div>
    </Link>
  );
}
