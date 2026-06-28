import { ProductForm } from "@/components/admin/ProductForm";
import { getCategories } from "@/lib/data/products";

export default async function NewProductPage() {
  const categories = await getCategories();

  return (
    <div>
      <h1 className="font-serif text-3xl">Add Product</h1>
      <div className="mt-8">
        <ProductForm categories={categories} />
      </div>
    </div>
  );
}
