import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { requireAuth } from "@/lib/auth";
import { getOrderByIdForUser } from "@/lib/data/orders";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Order Details",
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

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireAuth();
  const { id } = await params;
  const order = await getOrderByIdForUser(id, user.id);

  if (!order) {
    notFound();
  }

  const shipping = order.shippingAddress as Record<string, string> | null;

  return (
    <div>
      <Link
        href="/account/orders"
        className="text-sm text-fg-secondary hover:text-fg-primary"
      >
        ← Back to orders
      </Link>

      <div className="mt-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          Order #{order.orderNumber}
        </h2>
        <Badge variant={statusVariant[order.status] ?? "default"}>
          {order.status.toLowerCase()}
        </Badge>
      </div>

      <p className="mt-1 text-sm text-fg-tertiary">
        Placed on{" "}
        {new Date(order.createdAt).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
      </p>

      {/* Items */}
      <div className="mt-8 space-y-4">
        <h3 className="text-label">Items</h3>
        <div className="divide-y divide-border-default border-y border-border-default">
          {order.items.map((item: any) => (
            <div key={item.id} className="py-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{item.productName}</p>
                <p className="text-xs text-fg-tertiary mt-0.5">
                  {item.variantSku} · Qty {item.quantity}
                </p>
              </div>
              <p className="text-sm font-medium">
                {formatPrice(item.unitPrice * item.quantity)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Totals */}
      <div className="mt-6 space-y-2 text-sm">
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

      {/* Shipping address */}
      {shipping && (
        <div className="mt-8">
          <h3 className="text-label">Shipping address</h3>
          <p className="mt-2 text-sm text-fg-secondary">
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
    </div>
  );
}
