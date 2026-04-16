import Link from "next/link";
import {
  ShoppingBag,
  DollarSign,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { getDashboardMetrics } from "@/lib/data/orders";
import { getOrdersForAdmin } from "@/lib/data/orders";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export default async function AdminDashboardPage() {
  const [metrics, recentOrders] = await Promise.all([
    getDashboardMetrics(),
    getOrdersForAdmin({ pageSize: 5 }),
  ]);

  const cards = [
    {
      label: "Orders today",
      value: metrics.todaysOrders,
      icon: ShoppingBag,
    },
    {
      label: "Revenue today",
      value: formatPrice(metrics.todaysRevenue),
      icon: DollarSign,
    },
    {
      label: "Pending orders",
      value: metrics.pendingOrders,
      icon: Clock,
    },
    {
      label: "Low stock items",
      value: metrics.lowStockCount,
      icon: AlertTriangle,
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold">Dashboard</h1>

      {/* Metric cards */}
      <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-lg border border-border-default p-4"
          >
            <div className="flex items-center gap-2 text-fg-tertiary">
              <card.icon className="w-4 h-4" />
              <span className="text-xs font-medium uppercase tracking-wide">
                {card.label}
              </span>
            </div>
            <p className="mt-2 text-2xl font-semibold">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Recent orders</h2>
          <Link
            href="/admin/orders"
            className="text-sm text-accent-olive hover:underline"
          >
            View all
          </Link>
        </div>

        <div className="rounded-lg border border-border-default overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-default bg-bg-secondary text-left">
                <th className="px-4 py-3 font-medium">Order</th>
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-default">
              {recentOrders.orders.map((order: any) => (
                <tr key={order.id} className="hover:bg-bg-secondary/50">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="font-medium hover:underline"
                    >
                      #{order.orderNumber}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-fg-secondary">
                    {order.user?.name ?? order.user?.email ?? "Guest"}
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      variant={
                        order.status === "DELIVERED"
                          ? "success"
                          : order.status === "CANCELLED"
                          ? "error"
                          : order.status === "PENDING"
                          ? "warning"
                          : "default"
                      }
                    >
                      {order.status.toLowerCase()}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right font-medium">
                    {formatPrice(order.totalAmount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
