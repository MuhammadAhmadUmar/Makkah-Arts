import { isSupabaseConfigured } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils/slug";
import type {
  Category,
  OrderWithItems,
  ProductWithRelations,
  ShopFilters,
} from "@/types/database";

const PRODUCT_SELECT = `
  *,
  categories ( name, slug ),
  product_images ( id, url, alt_text, sort_order, created_at, product_id )
`;

export async function getCategories(): Promise<Category[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true });
  return data ?? [];
}

export async function getCategoryBySlug(
  slug: string,
): Promise<Category | null> {
  if (!isSupabaseConfigured()) return null;
  const supabase = await createClient();
  const { data } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .single();
  return data;
}

export async function getFeaturedProducts(): Promise<ProductWithRelations[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("featured", true)
    .order("created_at", { ascending: false })
    .limit(8);
  return (data as ProductWithRelations[]) ?? [];
}

export async function getProducts(
  filters: ShopFilters = {},
): Promise<ProductWithRelations[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = await createClient();

  let query = supabase.from("products").select(PRODUCT_SELECT);

  if (filters.q) {
    query = query.ilike("title", `%${filters.q}%`);
  }
  if (filters.availability) {
    query = query.eq("availability_status", filters.availability);
  }
  if (filters.color) {
    query = query.ilike("color", `%${filters.color}%`);
  }
  if (filters.min != null) {
    query = query.gte("price", filters.min);
  }
  if (filters.max != null) {
    query = query.lte("price", filters.max);
  }

  switch (filters.sort) {
    case "price_asc":
      query = query.order("price", { ascending: true });
      break;
    case "price_desc":
      query = query.order("price", { ascending: false });
      break;
    default:
      query = query.order("created_at", { ascending: false });
  }

  const { data } = await query;
  let products = (data as ProductWithRelations[]) ?? [];

  if (filters.category) {
    products = products.filter(
      (p) => p.categories?.slug === filters.category,
    );
  }

  return products;
}

export async function getProductBySlug(
  slug: string,
): Promise<ProductWithRelations | null> {
  if (!isSupabaseConfigured()) return null;

  const normalizedSlug = slug.trim().toLowerCase();
  const supabase = await createClient();

  const { data } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("slug", normalizedSlug)
    .maybeSingle();

  if (data) {
    return data as ProductWithRelations | null;
  }

  const fallbackSlug = slugify(normalizedSlug);
  if (fallbackSlug && fallbackSlug !== normalizedSlug) {
    const { data: fallbackData } = await supabase
      .from("products")
      .select(PRODUCT_SELECT)
      .eq("slug", fallbackSlug)
      .maybeSingle();

    if (fallbackData) {
      return fallbackData as ProductWithRelations | null;
    }
  }

  return null;
}

export async function getRelatedProducts(
  categoryId: string | null,
  excludeId: string,
): Promise<ProductWithRelations[]> {
  if (!isSupabaseConfigured() || !categoryId) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("category_id", categoryId)
    .neq("id", excludeId)
    .limit(4);
  return (data as ProductWithRelations[]) ?? [];
}

export async function getAllProductSlugs(): Promise<
  { slug: string; updated_at: string }[]
> {
  if (!isSupabaseConfigured()) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select("slug, updated_at");
  return data ?? [];
}

export async function getAllCategorySlugs(): Promise<{ slug: string }[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = await createClient();
  const { data } = await supabase.from("categories").select("slug");
  return data ?? [];
}

export async function getAdminProducts(): Promise<ProductWithRelations[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .order("created_at", { ascending: false });
  return (data as ProductWithRelations[]) ?? [];
}

export async function getAdminProduct(
  id: string,
): Promise<ProductWithRelations | null> {
  if (!isSupabaseConfigured()) return null;
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("id", id)
    .single();
  return data as ProductWithRelations | null;
}

export async function getAdminOrders(): Promise<OrderWithItems[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("orders")
    .select("*, order_items (*)")
    .order("created_at", { ascending: false });
  return (data as OrderWithItems[]) ?? [];
}

export async function getAdminStats(): Promise<{
  productCount: number;
  orderCount: number;
  pendingOrders: number;
}> {
  if (!isSupabaseConfigured()) {
    return { productCount: 0, orderCount: 0, pendingOrders: 0 };
  }
  const supabase = await createClient();
  const [products, orders, pending] = await Promise.all([
    supabase.from("products").select("id", { count: "exact", head: true }),
    supabase.from("orders").select("id", { count: "exact", head: true }),
    supabase
      .from("orders")
      .select("id", { count: "exact", head: true })
      .eq("status", "pending"),
  ]);
  return {
    productCount: products.count ?? 0,
    orderCount: orders.count ?? 0,
    pendingOrders: pending.count ?? 0,
  };
}

export async function getUniqueColors(): Promise<string[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select("color")
    .not("color", "is", null);
  const colors = new Set(
    (data ?? [])
      .map((row) => row.color?.trim())
      .filter((c): c is string => Boolean(c)),
  );
  return Array.from(colors).sort();
}
