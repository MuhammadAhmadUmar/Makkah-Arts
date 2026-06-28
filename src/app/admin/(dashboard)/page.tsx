import Link from "next/link";
import { getAdminStats } from "@/lib/data/products";

export default async function AdminDashboardPage() {
  const stats = await getAdminStats();

  return (
    <div>
      <h1 className="font-serif text-3xl">Dashboard</h1>
      <p className="mt-2 text-sm text-muted">Overview of your store</p>

      <div className="mt-8 grid gap-6 sm:grid-cols-3">
        <div className="border border-border bg-white p-6">
          <p className="text-xs tracking-widest text-muted uppercase">Products</p>
          <p className="mt-2 font-serif text-4xl">{stats.productCount}</p>
        </div>
        <div className="border border-border bg-white p-6">
          <p className="text-xs tracking-widest text-muted uppercase">Orders</p>
          <p className="mt-2 font-serif text-4xl">{stats.orderCount}</p>
        </div>
        <div className="border border-border bg-white p-6">
          <p className="text-xs tracking-widest text-muted uppercase">Pending</p>
          <p className="mt-2 font-serif text-4xl">{stats.pendingOrders}</p>
        </div>
      </div>

      <div className="mt-10 flex gap-4">
        <Link
          href="/admin/products/new"
          className="bg-foreground px-6 py-3 text-xs tracking-widest text-background uppercase hover:bg-accent"
        >
          Add Product
        </Link>
        <Link
          href="/admin/orders"
          className="border border-border bg-white px-6 py-3 text-xs tracking-widest uppercase hover:border-accent"
        >
          View Orders
        </Link>
      </div>
    </div>
  );
}
