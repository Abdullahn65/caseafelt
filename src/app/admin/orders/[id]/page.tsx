import { notFound } from "next/navigation";
import Link from "next/link";
import { getOrderForAdmin } from "@/lib/data/orders";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { OrderStatusForm } from "@/components/admin/order-status-form";

const statusVariant: Record<string, "default" | "success" | "warning" | "error"> = {
  PENDING: "warning",
  CONFIRMED: "default",
  PROCESSING: "default",
  SHIPPED: "default",
  DELIVERED: "success",
  CANCELLED: "error",
  REFUNDED: "error",
};

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await getOrderForAdmin(id);

  if (!order) {
    notFound();
  }

  const shipping = order.shippingAddress as Record<string, string> | null;

  return (
    <div>
      <Link
        href="/admin/orders"
        className="text-sm text-fg-secondary hover:text-fg-primary"
      >
        ← Back to orders
      </Link>

      <div className="mt-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">
          Order #{order.orderNumber}
        </h1>
        <Badge variant={statusVariant[order.status] ?? "default"}>
          {order.status.toLowerCase()}
        </Badge>
      </div>

      <p className="mt-1 text-sm text-fg-tertiary">
        {new Date(order.createdAt).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "long",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </p>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items + totals */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h2 className="text-label mb-3">Items</h2>
            <div className="divide-y divide-border-default border-y border-border-default">
              {order.items.map((item: any) => (
                <div key={item.id} className="py-3 flex justify-between">
                  <div>
                    <p className="text-sm font-medium">{item.productName}</p>
                    <p className="text-xs text-fg-tertiary">
                      SKU: {item.variantSku} · Qty: {item.quantity}
                    </p>
                  </div>
                  <p className="text-sm font-medium">
                    {formatPrice(item.unitPrice * item.quantity)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-fg-secondary">Subtotal</span>
              <span>{formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-fg-secondary">Shipping</span>
              <span>{formatPrice(order.shipping)}</span>
            </div>
            {order.tax > 0 && (
              <div className="flex justify-between">
                <span className="text-fg-secondary">Tax</span>
                <span>{formatPrice(order.tax)}</span>
              </div>
            )}
            <div className="h-px bg-border-default" />
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer */}
          <div>
            <h2 className="text-label mb-2">Customer</h2>
            <p className="text-sm">
              {[order.user?.firstName, order.user?.lastName].filter(Boolean).join(" ") || "Guest"}
            </p>
            <p className="text-sm text-fg-secondary">{order.user?.email}</p>
          </div>

          {/* Shipping */}
          {shipping && (
            <div>
              <h2 className="text-label mb-2">Shipping address</h2>
              <p className="text-sm text-fg-secondary">
                {shipping.name}
                <br />
                {shipping.line1}
                {shipping.line2 && (
                  <>
                    <br />
                    {shipping.line2}
                  </>
                )}
                <br />
                {shipping.city}, {shipping.state} {shipping.postalCode}
                <br />
                {shipping.country}
              </p>
            </div>
          )}

          {/* Status update */}
          <div>
            <h2 className="text-label mb-2">Update status</h2>
            <OrderStatusForm orderId={order.id} currentStatus={order.status} />
          </div>
        </div>
      </div>
    </div>
  );
}
