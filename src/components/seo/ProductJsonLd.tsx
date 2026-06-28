import type { ProductWithRelations } from "@/types/database";
import { SITE_URL } from "@/lib/constants";
import { getPrimaryImageUrl } from "@/lib/utils/product";

interface ProductJsonLdProps {
  product: ProductWithRelations;
}

export function ProductJsonLd({ product }: ProductJsonLdProps) {
  const imageUrl = getPrimaryImageUrl(product.product_images);
  const availability =
    product.availability_status === "in_stock" && product.stock_quantity > 0
      ? "https://schema.org/InStock"
      : product.availability_status === "pre_order"
        ? "https://schema.org/PreOrder"
        : "https://schema.org/OutOfStock";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: imageUrl,
    sku: product.slug,
    brand: {
      "@type": "Brand",
      name: "Makkah Arts",
    },
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/product/${product.slug}`,
      priceCurrency: "PKR",
      price: product.price,
      availability,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
