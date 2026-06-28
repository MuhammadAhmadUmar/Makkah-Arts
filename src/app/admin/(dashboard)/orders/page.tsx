import { OrdersTable } from "@/components/admin/OrdersTable";
import { getAdminOrders } from "@/lib/data/products";

export default async function AdminOrdersPage() {
  const orders = await getAdminOrders();

  return (
    <div>
      <h1 className="font-serif text-3xl">Orders</h1>
      <p className="mt-2 text-sm text-muted">
        Manage customer orders and update statuses.
      </p>
      <div className="mt-8">
        <OrdersTable orders={orders} />
      </div>
    </div>
  );
}
