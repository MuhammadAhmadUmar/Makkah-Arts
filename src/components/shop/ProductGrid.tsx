import { ProductCard } from "@/components/shop/ProductCard";
import type { ProductWithRelations } from "@/types/database";

interface ProductGridProps {
  products: ProductWithRelations[];
}

export function ProductGrid({ products }: ProductGridProps) {
  if (!products.length) {
    return (
      <div className="rounded-[2rem] border border-border bg-white/70 px-6 py-20 text-center shadow-[0_18px_50px_rgba(26,26,26,0.04)]">
        <p className="font-serif text-2xl">No products found</p>
        <p className="mt-2 text-sm text-muted">
          Try adjusting your filters or check back soon for new arrivals.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
