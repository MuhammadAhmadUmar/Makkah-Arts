import Link from "next/link";
import { ProductCard } from "@/components/shop/ProductCard";
import type { ProductWithRelations } from "@/types/database";

interface FeaturedCollectionProps {
  products: ProductWithRelations[];
}

export function FeaturedCollection({ products }: FeaturedCollectionProps) {
  if (!products.length) return null;

  return (
    <section className="container-main py-16 md:py-24">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs tracking-[0.25em] text-muted uppercase">
            Curated Selection
          </p>
          <h2 className="mt-2 font-serif text-3xl md:text-4xl">
            Featured Collection
          </h2>
        </div>
        <Link
          href="/shop"
          className="hidden text-sm tracking-wide text-accent hover:underline sm:block"
        >
          View All →
        </Link>
      </div>

      <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
