import { notFound } from "next/navigation";
import Image from "next/image";
import { ProductForm } from "@/components/admin/ProductForm";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { getAdminProduct, getCategories } from "@/lib/data/products";
import { deleteProductImageAction } from "@/app/admin/actions";

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    getAdminProduct(id),
    getCategories(),
  ]);

  if (!product) notFound();

  return (
    <div>
      <h1 className="font-serif text-3xl">Edit Product</h1>

      <div className="mt-8">
        <ProductForm categories={categories} product={product} />
      </div>

      <div className="mt-12 border-t border-border pt-8">
        <h2 className="font-serif text-xl">Product Images</h2>
        <div className="mt-4">
          <ImageUploader productId={product.id} />
        </div>

        {product.product_images.length > 0 && (
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {product.product_images
              .sort((a, b) => a.sort_order - b.sort_order)
              .map((img) => (
                <div key={img.id} className="relative">
                  <div className="relative aspect-square overflow-hidden bg-stone-100">
                    <Image
                      src={img.url}
                      alt={img.alt_text ?? product.title}
                      fill
                      className="object-contain object-center"
                      sizes="200px"
                    />
                  </div>
                  <form action={deleteProductImageAction} className="mt-2">
                    <input type="hidden" name="id" value={img.id} />
                    <button
                      type="submit"
                      className="text-xs text-red-600 underline"
                    >
                      Remove
                    </button>
                  </form>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
