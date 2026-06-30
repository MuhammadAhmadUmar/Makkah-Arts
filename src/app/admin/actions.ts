"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils/slug";

const productSchema = z.object({
  title: z.string().min(2),
  slug: z.string().optional(),
  price: z.coerce.number().int().min(0),
  description: z.string().optional(),
  category_id: z.string().optional(),
  availability_status: z.enum(["in_stock", "pre_order", "coming_soon"]),
  stock_quantity: z.coerce.number().int().min(0),
  featured: z.coerce.boolean().optional(),
  fabric: z.string().optional(),
  color: z.string().optional(),
  delivery_estimate: z.string().optional(),
});

export async function loginAdmin(formData: FormData): Promise<void> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    redirect(`/admin/login?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/admin");
}

export async function logoutAdmin() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export async function createProduct(formData: FormData): Promise<{ id?: string; error?: string }> {
  const supabase = await createClient();
  const parsed = productSchema.parse({
    title: formData.get("title"),
    slug: formData.get("slug") || undefined,
    price: formData.get("price"),
    description: formData.get("description") || undefined,
    category_id: formData.get("category_id") || undefined,
    availability_status: formData.get("availability_status"),
    stock_quantity: formData.get("stock_quantity"),
    featured: formData.get("featured") === "on",
    fabric: formData.get("fabric") || undefined,
    color: formData.get("color") || undefined,
    delivery_estimate: formData.get("delivery_estimate") || undefined,
  });

  const slug = parsed.slug || slugify(parsed.title);

  const { data, error } = await supabase
    .from("products")
    .insert({
      ...parsed,
      slug,
      category_id: parsed.category_id || null,
      featured: parsed.featured ?? false,
    })
    .select("id")
    .single();

  if (error) {
    return { error: error.message };
  }

  const images = formData.getAll("images").filter(
    (value): value is File => value instanceof File && value.size > 0,
  );

  if (images.length > 0 && data?.id) {
    try {
      await uploadProductImages(data.id, images);
    } catch (uploadError) {
      return {
        id: data.id,
        error: uploadError instanceof Error ? uploadError.message : "Unable to upload images.",
      };
    }
  }

  revalidatePath("/shop");
  revalidatePath("/admin/products");
  return { id: data.id };
}

async function uploadProductImages(productId: string, files: File[]) {
  const supabase = await createClient();
  const bucket = supabase.storage.from("product-images");

  for (const [index, file] of files.entries()) {
    const ext = file.name.split(".").pop() ?? "jpg";
    const path = `${productId}/${Date.now()}-${index}.${ext}`;

    const { error: uploadError } = await bucket.upload(path, file, {
      cacheControl: "3600",
      upsert: false,
    });

    if (uploadError) {
      throw new Error(uploadError.message);
    }

    const {
      data: { publicUrl },
    } = bucket.getPublicUrl(path);

    const { error: insertError } = await supabase.from("product_images").insert({
      product_id: productId,
      url: publicUrl,
      alt_text: file.name,
      sort_order: index,
    });

    if (insertError) {
      throw new Error(insertError.message);
    }
  }
}

export async function updateProduct(id: string, formData: FormData): Promise<void> {
  const supabase = await createClient();
  const parsed = productSchema.parse({
    title: formData.get("title"),
    slug: formData.get("slug") || undefined,
    price: formData.get("price"),
    description: formData.get("description") || undefined,
    category_id: formData.get("category_id") || undefined,
    availability_status: formData.get("availability_status"),
    stock_quantity: formData.get("stock_quantity"),
    featured: formData.get("featured") === "on",
    fabric: formData.get("fabric") || undefined,
    color: formData.get("color") || undefined,
    delivery_estimate: formData.get("delivery_estimate") || undefined,
  });

  const slug = parsed.slug || slugify(parsed.title);

  const { error } = await supabase
    .from("products")
    .update({
      ...parsed,
      slug,
      category_id: parsed.category_id || null,
      featured: parsed.featured ?? false,
    })
    .eq("id", id);

  if (error) {
    redirect(
      `/admin/products/${id}/edit?error=${encodeURIComponent(error.message)}`,
    );
  }

  const images = formData.getAll("images").filter(
    (value): value is File => value instanceof File && value.size > 0,
  );

  if (images.length > 0) {
    try {
      await uploadProductImages(id, images);
    } catch (uploadError) {
      redirect(
        `/admin/products/${id}/edit?error=${encodeURIComponent(
          uploadError instanceof Error ? uploadError.message : "Unable to upload images.",
        )}`,
      );
    }
  }

  revalidatePath("/shop");
  revalidatePath(`/product/${slug}`);
  revalidatePath("/admin/products");
  redirect("/admin/products");
}

export async function deleteProduct(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/shop");
  revalidatePath("/admin/products");
}

export async function updateOrderStatus(id: string, status: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/orders");
}

export async function deleteProductImage(id: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("product_images")
    .delete()
    .eq("id", id);

  if (error) return { error: error.message };
  revalidatePath("/admin/products");
}

export async function deleteProductAction(formData: FormData) {
  const id = formData.get("id") as string;
  await deleteProduct(id);
}

export async function deleteProductImageAction(formData: FormData) {
  const id = formData.get("id") as string;
  await deleteProductImage(id);
}

export async function addProductImage(
  productId: string,
  url: string,
  altText?: string,
  sortOrder = 0,
) {
  const supabase = await createClient();
  const { error } = await supabase.from("product_images").insert({
    product_id: productId,
    url,
    alt_text: altText ?? null,
    sort_order: sortOrder,
  });

  if (error) return { error: error.message };
  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${productId}/edit`);
}
