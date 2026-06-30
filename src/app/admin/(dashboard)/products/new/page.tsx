import { ProductForm } from "@/components/admin/ProductForm";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { getCategories } from "@/lib/data/products";

interface NewProductPageProps {
  searchParams: { productId?: string; error?: string };
}

export default async function NewProductPage({ searchParams }: NewProductPageProps) {
  const categories = await getCategories();
  const productId = searchParams.productId;
  const error = searchParams.error;

  return (
    <div>
      <h1 className="font-serif text-3xl">Add Product</h1>
      <div className="mt-8">
        <ProductForm categories={categories} />
      </div>

      {error && (
        <p className="mt-4 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {productId && (
        <div className="mt-12 border-t border-border pt-8">
          <h2 className="font-serif text-xl">Add Product Images</h2>
          <p className="mt-2 text-sm text-muted">
            Product created successfully. Upload images for this product below.
          </p>
          <div className="mt-4">
            <ImageUploader productId={productId} />
          </div>
        </div>
      )}
    </div>
  );
}
