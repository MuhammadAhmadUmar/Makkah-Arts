"use client";

import type { OrderWithItems } from "@/types/database";
import { formatPKR } from "@/lib/utils/format";
import { PAYMENT_METHOD_LABELS } from "@/lib/constants";
import { updateOrderStatus } from "@/app/admin/actions";

interface OrdersTableProps {
  orders: OrderWithItems[];
}

const statuses = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

export function OrdersTable({ orders }: OrdersTableProps) {
  if (!orders.length) {
    return <p className="text-sm text-muted">No orders yet.</p>;
  }

  return (
    <div className="space-y-6">
      {orders.map((order) => (
        <div key={order.id} className="border border-border bg-white p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="font-medium">{order.order_number}</p>
              <p className="mt-1 text-sm text-muted">
                {new Date(order.created_at).toLocaleString("en-PK")}
              </p>
            </div>
            <select
              defaultValue={order.status}
              onChange={(e) => updateOrderStatus(order.id, e.target.value)}
              className="border border-border px-3 py-1 text-sm capitalize"
            >
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
            <p>
              <span className="text-muted">Customer: </span>
              {order.customer_name}
            </p>
            <p>
              <span className="text-muted">Phone: </span>
              {order.customer_phone}
            </p>
            <p className="sm:col-span-2">
              <span className="text-muted">Address: </span>
              {order.customer_address}, {order.customer_city}
            </p>
            <p>
              <span className="text-muted">Payment: </span>
              {PAYMENT_METHOD_LABELS[order.payment_method]}
            </p>
            <p>
              <span className="text-muted">Total: </span>
              {formatPKR(order.total)}
            </p>
          </div>

          {order.notes && (
            <p className="mt-2 text-sm">
              <span className="text-muted">Notes: </span>
              {order.notes}
            </p>
          )}

          <ul className="mt-4 space-y-1 border-t border-border pt-4 text-sm">
            {order.order_items.map((item) => (
              <li key={item.id} className="flex justify-between">
                <span>
                  {item.product_title} × {item.quantity}
                </span>
                <span>{formatPKR(item.line_total)}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
