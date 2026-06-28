import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { ShopFilters } from "@/components/shop/ShopFilters";
import {
  getCategoryBySlug,
  getCategories,
  getProducts,
  getUniqueColors,
} from "@/lib/data/products";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return { title: "Category Not Found" };

  return {
    title: category.name,
    description: category.description ?? `Shop ${category.name} at Makkah Arts`,
    alternates: { canonical: `/category/${category.slug}` },
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const { slug } = await params;
  const queryParams = await searchParams;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const [products, categories, colors] = await Promise.all([
    getProducts({ ...queryParams, category: slug, sort: (queryParams.sort as "newest" | "price_asc" | "price_desc") ?? "newest" }),
    getCategories(),
    getUniqueColors(),
  ]);

  return (
    <div className="container-main py-10 md:py-16">
      <div className="mb-10">
        <p className="text-xs tracking-widest text-muted uppercase">Category</p>
        <h1 className="mt-2 font-serif text-4xl md:text-5xl">{category.name}</h1>
        {category.description && (
          <p className="mt-3 max-w-xl text-sm text-muted">{category.description}</p>
        )}
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
