"use client";

import { useRouter } from "next/navigation";
import type { Category, ProductWithRelations } from "@/types/database";
import { createProduct, updateProduct } from "@/app/admin/actions";

interface ProductFormProps {
  categories: Category[];
  product?: ProductWithRelations;
}

export function ProductForm({ categories, product }: ProductFormProps) {
  const router = useRouter();
  const isEdit = Boolean(product);

  async function handleSubmit(formData: FormData) {
    if (isEdit && product) {
      await updateProduct(product.id, formData);
      router.push("/admin/products");
      return;
    }

    const result = await createProduct(formData);
    if (result.id) {
      router.push(`/admin/products/${result.id}/edit`);
    } else {
      router.push("/admin/products/new?error=" + encodeURIComponent(result.error ?? "Unable to create product"));
    }
  }

  return (
    <form action={handleSubmit} className="max-w-2xl space-y-6">
      <div>
        <label htmlFor="title" className="text-xs tracking-widest text-muted uppercase">
          Title
        </label>
        <input
          id="title"
          name="title"
          required
          defaultValue={product?.title}
          className="mt-2 w-full border border-border bg-white px-4 py-3 text-sm outline-none focus:border-accent"
        />
      </div>

      <div>
        <label htmlFor="slug" className="text-xs tracking-widest text-muted uppercase">
          Slug (optional)
        </label>
        <input
          id="slug"
          name="slug"
          defaultValue={product?.slug}
          className="mt-2 w-full border border-border bg-white px-4 py-3 text-sm outline-none focus:border-accent"
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="price" className="text-xs tracking-widest text-muted uppercase">
            Price (PKR)
          </label>
          <input
            id="price"
            name="price"
            type="number"
            required
            defaultValue={product?.price}
            className="mt-2 w-full border border-border bg-white px-4 py-3 text-sm outline-none focus:border-accent"
          />
        </div>
        <div>
          <label htmlFor="stock_quantity" className="text-xs tracking-widest text-muted uppercase">
            Stock Quantity
          </label>
          <input
            id="stock_quantity"
            name="stock_quantity"
            type="number"
            required
            defaultValue={product?.stock_quantity ?? 0}
            className="mt-2 w-full border border-border bg-white px-4 py-3 text-sm outline-none focus:border-accent"
          />
        </div>
      </div>

      <div>
        <label htmlFor="description" className="text-xs tracking-widest text-muted uppercase">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          defaultValue={product?.description ?? ""}
          className="mt-2 w-full border border-border bg-white px-4 py-3 text-sm outline-none focus:border-accent"
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="category_id" className="text-xs tracking-widest text-muted uppercase">
            Category
          </label>
          <select
            id="category_id"
            name="category_id"
            defaultValue={product?.category_id ?? ""}
            className="mt-2 w-full border border-border bg-white px-4 py-3 text-sm outline-none"
          >
            <option value="">None</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="availability_status" className="text-xs tracking-widest text-muted uppercase">
            Availability
          </label>
          <select
            id="availability_status"
            name="availability_status"
            defaultValue={product?.availability_status ?? "coming_soon"}
            className="mt-2 w-full border border-border bg-white px-4 py-3 text-sm outline-none"
          >
            <option value="in_stock">In Stock</option>
            <option value="pre_order">Pre-order</option>
            <option value="coming_soon">Coming Soon</option>
          </select>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="fabric" className="text-xs tracking-widest text-muted uppercase">
            Fabric
          </label>
          <input
            id="fabric"
            name="fabric"
            defaultValue={product?.fabric ?? ""}
            className="mt-2 w-full border border-border bg-white px-4 py-3 text-sm outline-none focus:border-accent"
          />
        </div>
        <div>
          <label htmlFor="color" className="text-xs tracking-widest text-muted uppercase">
            Color
          </label>
          <input
            id="color"
            name="color"
            defaultValue={product?.color ?? ""}
            className="mt-2 w-full border border-border bg-white px-4 py-3 text-sm outline-none focus:border-accent"
          />
        </div>
      </div>

      <div>
        <label htmlFor="delivery_estimate" className="text-xs tracking-widest text-muted uppercase">
          Delivery Estimate
        </label>
        <input
          id="delivery_estimate"
          name="delivery_estimate"
          defaultValue={product?.delivery_estimate ?? "3-5 business days"}
          className="mt-2 w-full border border-border bg-white px-4 py-3 text-sm outline-none focus:border-accent"
        />
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="featured"
          defaultChecked={product?.featured}
        />
        Featured on homepage
      </label>

      <button
        type="submit"
        className="bg-foreground px-8 py-3 text-xs tracking-widest text-background uppercase hover:bg-accent"
      >
        {isEdit ? "Update Product" : "Create Product"}
      </button>
    </form>
  );
}
