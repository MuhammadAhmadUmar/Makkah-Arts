import { ProductCard } from "@/components/shop/ProductCard";
import type { ProductWithRelations } from "@/types/database";

interface RelatedProductsProps {
  products: ProductWithRelations[];
}

export function RelatedProducts({ products }: RelatedProductsProps) {
  if (!products.length) return null;

  return (
    <section className="mt-16 border-t border-border pt-16">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.35em] text-muted">
            Discover more
          </p>
          <h2 className="mt-2 font-serif text-2xl md:text-3xl">
            You May Also Like
          </h2>
        </div>
        <p className="text-sm text-muted">
          Curated pieces that pair beautifully with this look.
        </p>
      </div>
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
