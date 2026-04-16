import Link from "next/link";
import { getOrdersForAdmin } from "@/lib/data/orders";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const statusVariant: Record<string, "default" | "success" | "warning" | "error"> = {
  PENDING: "warning",
  CONFIRMED: "default",
  PROCESSING: "default",
  SHIPPED: "default",
  DELIVERED: "success",
  CANCELLED: "error",
  REFUNDED: "error",
};

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  const status = params.status;
  const search = params.search;
  const page = Number(params.page ?? "1");

  const { orders, total } = await getOrdersForAdmin({
    status,
    search,
    page,
    pageSize: 25,
  });

  const totalPages = Math.ceil(total / 25);

  return (
    <div>
      <h1 className="text-2xl font-semibold">Orders</h1>

      {/* Filters */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        {["ALL", "PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"].map(
          (s) => (
            <Link
              key={s}
              href={`/admin/orders${s === "ALL" ? "" : `?status=${s}`}`}
              className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${
                (s === "ALL" && !status) || status === s
                  ? "bg-fg-primary text-bg-primary border-fg-primary"
                  : "border-border-default text-fg-secondary hover:border-border-strong"
              }`}
            >
              {s.charAt(0) + s.slice(1).toLowerCase()}
            </Link>
          )
        )}
      </div>

      {/* Table */}
      <div className="mt-6 rounded-lg border border-border-default overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border-default bg-bg-secondary text-left">
              <th className="px-4 py-3 font-medium">Order</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Items</th>
              <th className="px-4 py-3 font-medium text-right">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-default">
            {orders.map((order: any) => (
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
                  {new Date(order.createdAt).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                  })}
                </td>
                <td className="px-4 py-3 text-fg-secondary">
                  {order.user?.name ?? order.user?.email ?? "Guest"}
                </td>
                <td className="px-4 py-3">
                  <Badge variant={statusVariant[order.status] ?? "default"}>
                    {order.status.toLowerCase()}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-fg-secondary">
                  {order._count?.items ?? order.items?.length ?? 0}
                </td>
                <td className="px-4 py-3 text-right font-medium">
                  {formatPrice(order.totalAmount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between text-sm">
          <p className="text-fg-tertiary">
            Page {page} of {totalPages} · {total} orders
          </p>
          <div className="flex gap-2">
            {page > 1 && (
              <Link
                href={`/admin/orders?page=${page - 1}${status ? `&status=${status}` : ""}`}
                className="px-3 py-1.5 rounded border border-border-default hover:bg-bg-secondary"
              >
                Previous
              </Link>
            )}
            {page < totalPages && (
              <Link
                href={`/admin/orders?page=${page + 1}${status ? `&status=${status}` : ""}`}
                className="px-3 py-1.5 rounded border border-border-default hover:bg-bg-secondary"
              >
                Next
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
