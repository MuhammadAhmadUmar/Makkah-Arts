import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductGallery } from "@/components/product/ProductGallery";
import { AvailabilityBadge } from "@/components/product/AvailabilityBadge";
import { AddToCartButton } from "@/components/product/AddToCartButton";
import { WhatsAppOrderButton } from "@/components/product/WhatsAppOrderButton";
import { RelatedProducts } from "@/components/product/RelatedProducts";
import { ProductJsonLd } from "@/components/seo/ProductJsonLd";
import {
  getProductBySlug,
  getRelatedProducts,
} from "@/lib/data/products";
import { formatPKR } from "@/lib/utils/format";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product Not Found" };

  const image = product.product_images.sort(
    (a, b) => a.sort_order - b.sort_order,
  )[0]?.url;

  return {
    title: product.title,
    description: product.description?.slice(0, 160),
    alternates: { canonical: `/product/${product.slug}` },
    openGraph: {
      title: product.title,
      description: product.description ?? undefined,
      images: image ? [{ url: image }] : [],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const related = await getRelatedProducts(product.category_id, product.id);

  return (
    <>
      <ProductJsonLd product={product} />
      <div className="container-main py-10 md:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <ProductGallery
            images={product.product_images}
            title={product.title}
          />

          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-[2rem] border border-border bg-white/90 p-6 shadow-[0_24px_80px_rgba(26,26,26,0.06)] sm:p-8">
              {product.categories && (
                <p className="text-[11px] uppercase tracking-[0.35em] text-muted">
                  {product.categories.name}
                </p>
              )}
              <h1 className="mt-3 font-serif text-3xl md:text-4xl lg:text-5xl">
                {product.title}
              </h1>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <p className="text-2xl font-semibold text-foreground">
                  {formatPKR(product.price)}
                </p>
                <AvailabilityBadge
                  status={product.availability_status}
                  stockQuantity={product.stock_quantity}
                />
              </div>

              {product.description && (
                <p className="mt-6 text-sm leading-relaxed text-muted">
                  {product.description}
                </p>
              )}

              <div className="mt-8 rounded-[1.5rem] border border-border bg-stone-50 p-5">
                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.3em] text-muted">
                      Craftsmanship
                    </p>
                    <p className="mt-2 text-sm text-foreground">
                      Premium finishing with couture-level detailing.
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.3em] text-muted">
                      Shipping
                    </p>
                    <p className="mt-2 text-sm text-foreground">
                      Fast nationwide delivery with secure packaging.
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.3em] text-muted">
                      Support
                    </p>
                    <p className="mt-2 text-sm text-foreground">
                      WhatsApp styling support for every order.
                    </p>
                  </div>
                </div>
              </div>

              <dl className="mt-8 space-y-3 border-t border-border pt-8 text-sm">
                {product.fabric && (
                  <div className="flex gap-4">
                    <dt className="w-28 text-muted">Fabric</dt>
                    <dd>{product.fabric}</dd>
                  </div>
                )}
                {product.color && (
                  <div className="flex gap-4">
                    <dt className="w-28 text-muted">Color</dt>
                    <dd>{product.color}</dd>
                  </div>
                )}
                <div className="flex gap-4">
                  <dt className="w-28 text-muted">Delivery</dt>
                  <dd>{product.delivery_estimate ?? "3-5 business days"}</dd>
                </div>
              </dl>

              <div className="mt-8 space-y-3">
                <AddToCartButton product={product} />
                <WhatsAppOrderButton product={product} />
              </div>

              {product.availability_status === "pre_order" && (
                <p className="mt-4 text-xs leading-relaxed text-muted">
                  This item is available for pre-order. Expected dispatch within
                  the stated delivery estimate.
                </p>
              )}
            </div>
          </div>
        </div>

        <RelatedProducts products={related} />
      </div>
    </>
  );
}
