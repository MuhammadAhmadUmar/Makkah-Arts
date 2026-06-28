import { ProductCard } from "@/components/shop/ProductCard";
import type { ProductWithRelations } from "@/types/database";

interface RelatedProductsProps {
  products: ProductWithRelations[];
}

export function RelatedProducts({ products }: RelatedProductsProps) {
  if (!products.length) return null;

  return (
    <section className="mt-16 border-t border-border pt-16">
      <h2 className="font-serif text-2xl md:text-3xl">You May Also Like</h2>
      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
