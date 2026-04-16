import type { Metadata } from "next";
import Link from "next/link";
import { requireAuth } from "@/lib/auth";
import { getOrdersByUserId } from "@/lib/data/orders";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "My Orders",
};

const statusVariant: Record<string, "default" | "success" | "warning" | "error"> = {
  PENDING: "warning",
  CONFIRMED: "default",
  PROCESSING: "default",
  SHIPPED: "default",
  DELIVERED: "success",
  CANCELLED: "error",
  REFUNDED: "error",
};

export default async function OrdersPage() {
  const user = await requireAuth();
  const orders = await getOrdersByUserId(user.id);

  if (orders.length === 0) {
    return (
      <div>
        <h2 className="text-xl font-semibold">Orders</h2>
        <p className="mt-4 text-fg-secondary">You haven&apos;t placed any orders yet.</p>
        <Link
          href="/collections"
          className="mt-2 inline-block text-sm text-accent-olive hover:underline"
        >
          Start shopping →
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold">Orders</h2>

      <div className="mt-6 space-y-4">
        {orders.map((order: any) => (
          <Link
            key={order.id}
            href={`/account/orders/${order.id}`}
            className="block rounded-lg border border-border-default p-4 hover:border-border-strong transition-colors"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">
                  Order #{order.orderNumber}
                </p>
                <p className="text-xs text-fg-tertiary mt-0.5">
                  {new Date(order.createdAt).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div className="text-right flex items-center gap-3">
                <Badge variant={statusVariant[order.status] ?? "default"}>
                  {order.status.toLowerCase()}
                </Badge>
                <span className="text-sm font-semibold">
                  {formatPrice(order.totalAmount)}
                </span>
              </div>
            </div>
            <div className="mt-3 flex gap-2 overflow-hidden">
              {order.items.slice(0, 4).map((item: any) => (
                <div
                  key={item.id}
                  className="w-12 h-12 rounded bg-bg-secondary shrink-0"
                  title={item.productName}
                />
              ))}
              {order.items.length > 4 && (
                <div className="w-12 h-12 rounded bg-bg-secondary shrink-0 flex items-center justify-center text-xs text-fg-tertiary">
                  +{order.items.length - 4}
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
