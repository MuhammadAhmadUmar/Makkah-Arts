import Link from "next/link";
import Image from "next/image";
import { getAdminProducts } from "@/lib/data/products";
import { formatPKR } from "@/lib/utils/format";
import { getAvailabilityLabel, getPrimaryImageUrl } from "@/lib/utils/product";
import { deleteProductAction } from "@/app/admin/actions";

export default async function AdminProductsPage() {
  const products = await getAdminProducts();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl">Products</h1>
        <Link
          href="/admin/products/new"
          className="bg-foreground px-6 py-3 text-xs tracking-widest text-background uppercase hover:bg-accent"
        >
          Add Product
        </Link>
      </div>

      <div className="mt-8 space-y-4">
        {products.length === 0 ? (
          <p className="text-sm text-muted">No products yet. Add your first suit.</p>
        ) : (
          products.map((product) => {
            const imageUrl = getPrimaryImageUrl(product.product_images);
            return (
              <div
                key={product.id}
                className="flex flex-wrap items-center gap-4 border border-border bg-white p-4"
              >
                <div className="relative h-16 w-14 shrink-0 overflow-hidden bg-stone-100">
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={product.title}
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  ) : null}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{product.title}</p>
                  <p className="text-sm text-muted">
                    {formatPKR(product.price)} ·{" "}
                    {getAvailabilityLabel(
                      product.availability_status,
                      product.stock_quantity,
                    )}{" "}
                    · Stock: {product.stock_quantity}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/admin/products/${product.id}/edit`}
                    className="border border-border px-4 py-2 text-xs uppercase hover:border-accent"
                  >
                    Edit
                  </Link>
                  <form action={deleteProductAction}>
                    <input type="hidden" name="id" value={product.id} />
                    <button
                      type="submit"
                      className="border border-red-200 px-4 py-2 text-xs text-red-600 uppercase hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </form>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
