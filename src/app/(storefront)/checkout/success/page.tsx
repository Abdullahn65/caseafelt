import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle, Package, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";

export const metadata: Metadata = {
  title: "Order Confirmed",
};

interface SuccessPageProps {
  searchParams: Promise<{ session_id?: string }>;
}

export default async function CheckoutSuccessPage({
  searchParams,
}: SuccessPageProps) {
  const { session_id } = await searchParams;

  let order: {
    orderNumber: string;
    email: string;
    total: number;
    items: { id: string; productName: string; quantity: number }[];
  } | null = null;

  // Look up order by Stripe session ID
  if (session_id) {
    try {
      const dbOrder = await db.order.findUnique({
        where: { stripeSessionId: session_id },
        select: {
          orderNumber: true,
          email: true,
          total: true,
          items: {
            select: {
              id: true,
              productName: true,
              quantity: true,
            },
          },
        },
      });
      order = dbOrder;
    } catch {
      // Order might not be created yet (webhook lag) — that's fine
    }
  }

  return (
    <div className="container-page section-padding">
      <div className="max-w-lg mx-auto text-center">
        {/* Success Icon */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent-olive/10">
          <CheckCircle className="h-8 w-8 text-accent-olive" />
        </div>

        <h1 className="mt-6 text-3xl font-semibold">Thank you for your order!</h1>

        {order ? (
          <>
            <p className="mt-3 text-fg-secondary">
              Order <span className="font-semibold text-fg-primary">{order.orderNumber}</span> has
              been confirmed.
            </p>
            <p className="mt-1 text-sm text-fg-tertiary">
              A confirmation email will be sent to{" "}
              <span className="font-medium text-fg-secondary">{order.email}</span>.
            </p>

            {/* Order Summary */}
            <div className="mt-8 rounded-lg border border-border-default p-6 text-left">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-fg-tertiary">
                Order Summary
              </h2>
              <ul className="mt-4 space-y-3">
                {order.items.map((item) => (
                  <li key={item.id} className="flex items-center gap-3">
                    <Package className="h-4 w-4 text-fg-tertiary shrink-0" />
                    <span className="text-sm text-fg-secondary">
                      {item.productName}
                      {item.quantity > 1 && (
                        <span className="text-fg-tertiary"> × {item.quantity}</span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 pt-4 border-t border-border-default flex items-center justify-between">
                <span className="text-sm font-medium text-fg-secondary">Total paid</span>
                <span className="text-lg font-semibold">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(order.total / 100)}
                </span>
              </div>
            </div>
          </>
        ) : (
          <>
            <p className="mt-3 text-fg-secondary">
              Your payment was successful. We&apos;re processing your order now.
            </p>
            <p className="mt-1 text-sm text-fg-tertiary">
              You&apos;ll receive a confirmation email shortly with your order details.
            </p>
          </>
        )}

        {/* CTA */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href="/collections">
            <Button variant="primary" size="lg">
              Continue shopping
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Support note */}
        <p className="mt-6 text-xs text-fg-tertiary">
          Questions about your order?{" "}
          <Link href="/contact" className="underline hover:text-fg-secondary">
            Contact us
          </Link>{" "}
          and we&apos;ll be happy to help.
        </p>
      </div>
    </div>
  );
}
