import { ProductCard } from "@/components/shop/ProductCard";
import type { ProductWithRelations } from "@/types/database";

interface ProductGridProps {
  products: ProductWithRelations[];
}

export function ProductGrid({ products }: ProductGridProps) {
  if (!products.length) {
    return (
      <div className="py-20 text-center">
        <p className="font-serif text-2xl">No products found</p>
        <p className="mt-2 text-sm text-muted">
          Try adjusting your filters or check back soon for new arrivals.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 md:gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
