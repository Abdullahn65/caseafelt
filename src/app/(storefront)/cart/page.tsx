import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getCart } from "@/lib/data/cart";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CartItemList } from "@/components/storefront/cart-item-list";

export const metadata: Metadata = {
  title: "Your Cart",
};

export default async function CartPage() {
  const cart = await getCart();
  const items = cart?.items ?? [];

  const subtotal = items.reduce((sum: number, item: any) => {
    const unitPrice = item.variant.price ?? item.variant.product.basePrice;
    return sum + unitPrice * item.quantity;
  }, 0);

  if (items.length === 0) {
    return (
      <div className="container-page section-padding text-center">
        <h1 className="text-3xl font-semibold">Your cart</h1>
        <p className="mt-4 text-lg text-fg-secondary">Your cart is empty.</p>
        <p className="mt-1 text-sm text-fg-tertiary">
          Start with our latest collection.
        </p>
        <div className="mt-8">
          <Link href="/collections">
            <Button variant="primary">Shop the collection</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-page section-padding">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-semibold">Your cart</h1>
        <p className="text-sm text-fg-secondary">
          {items.length} {items.length === 1 ? "item" : "items"}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <CartItemList items={items} />
        </div>

        {/* Summary */}
        <div className="lg:sticky lg:top-20 h-fit space-y-6">
          <div className="rounded-lg border border-border-default p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-fg-secondary">Subtotal</span>
              <span className="font-semibold">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex items-center justify-between text-sm text-fg-tertiary">
              <span>Shipping</span>
              <span>Calculated at checkout</span>
            </div>
            <div className="h-px bg-border-default" />
            <form action="/api/checkout" method="POST">
              <Button type="submit" variant="primary" size="lg" className="w-full">
                Continue to checkout
              </Button>
            </form>
            <p className="text-xs text-center text-fg-tertiary">
              Secure checkout via Stripe
            </p>
            {subtotal < 7500 && (
              <p className="text-xs text-center text-fg-secondary">
                Add {formatPrice(7500 - subtotal)} more for free shipping
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
