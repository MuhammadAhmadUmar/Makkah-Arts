import type { Metadata } from "next";
import { Suspense } from "react";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { ShopFilters } from "@/components/shop/ShopFilters";
import {
  getCategories,
  getProducts,
  getUniqueColors,
} from "@/lib/data/products";
import type { AvailabilityStatus, ShopFilters as Filters } from "@/types/database";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Browse premium 3-piece lawn suits at Makkah Arts. Filter by price, category, color, and availability.",
  alternates: { canonical: "/shop" },
};

interface ShopPageProps {
  searchParams: Promise<Record<string, string | undefined>>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;

  const filters: Filters = {
    q: params.q,
    category: params.category,
    availability: params.availability as AvailabilityStatus | undefined,
    color: params.color,
    min: params.min ? Number(params.min) : undefined,
    max: params.max ? Number(params.max) : undefined,
    sort: (params.sort as Filters["sort"]) ?? "newest",
  };

  const [products, categories, colors] = await Promise.all([
    getProducts(filters),
    getCategories(),
    getUniqueColors(),
  ]);

  return (
    <div className="container-main py-10 md:py-16">
      <div className="mb-8 rounded-[2rem] border border-border bg-white/80 p-6 shadow-[0_22px_60px_rgba(26,26,26,0.04)] sm:p-8">
        <p className="text-[11px] uppercase tracking-[0.35em] text-muted">
          Curated collection
        </p>
        <h1 className="mt-3 font-serif text-4xl md:text-5xl">Shop</h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
          Premium lawn suits with honest availability. Every piece is physically
          stocked or clearly marked as pre-order or coming soon.
        </p>
      </div>

      <div className="grid gap-10 lg:grid-cols-[240px_1fr]">
        <Suspense fallback={<div className="h-96 animate-pulse rounded-[2rem] bg-stone-100" />}>
          <ShopFilters categories={categories} colors={colors} />
        </Suspense>
        <ProductGrid products={products} />
      </div>
    </div>
  );
}
