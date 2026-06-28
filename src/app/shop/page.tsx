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
      <div className="mb-10">
        <h1 className="font-serif text-4xl md:text-5xl">Shop</h1>
        <p className="mt-3 max-w-xl text-sm text-muted">
          Premium lawn suits with honest availability. Every piece is physically
          stocked or clearly marked as pre-order or coming soon.
        </p>
      </div>

      <div className="grid gap-10 lg:grid-cols-[240px_1fr]">
        <Suspense fallback={<div className="h-96 animate-pulse bg-stone-100" />}>
          <ShopFilters categories={categories} colors={colors} />
        </Suspense>
        <ProductGrid products={products} />
      </div>
    </div>
  );
}
