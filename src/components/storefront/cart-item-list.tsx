"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { QuantitySelector } from "@/components/ui/quantity-selector";
import { formatPrice } from "@/lib/utils";

interface CartItem {
  id: string;
  quantity: number;
  variant: {
    id: string;
    sku: string;
    name: string;
    price: number | null;
    inventoryCount: number;
    color: string | null;
    colorHex: string | null;
    deviceModel: {
      name: string;
    } | null;
    product: {
      id: string;
      name: string;
      slug: string;
      basePrice: number;
    };
    images: { url: string; altText: string }[];
  };
}

interface CartItemListProps {
  items: CartItem[];
}

export function CartItemList({ items }: CartItemListProps) {
  return (
    <div className="divide-y divide-border-default">
      {items.map((item) => (
        <CartItemRow key={item.id} item={item} />
      ))}
    </div>
  );
}

function CartItemRow({ item }: { item: CartItem }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const unitPrice = item.variant.price ?? item.variant.product.basePrice;
  const image = item.variant.images[0];

  async function handleQuantityChange(newQuantity: number) {
    setError(null);
    startTransition(async () => {
      try {
        const res = await fetch("/api/cart", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cartItemId: item.id,
            quantity: newQuantity,
          }),
        });
        if (!res.ok) {
          const data = await res.json();
          setError(data.error ?? "Failed to update quantity");
          return;
        }
        // Refresh the page to reflect updated cart
        window.location.reload();
      } catch {
        setError("Something went wrong");
      }
    });
  }

  async function handleRemove() {
    setError(null);
    startTransition(async () => {
      try {
        const res = await fetch("/api/cart", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cartItemId: item.id }),
        });
        if (!res.ok) {
          const data = await res.json();
          setError(data.error ?? "Failed to remove item");
          return;
        }
        window.location.reload();
      } catch {
        setError("Something went wrong");
      }
    });
  }

  return (
    <div
      className={`py-6 first:pt-0 last:pb-0 ${isPending ? "opacity-50 pointer-events-none" : ""}`}
    >
      <div className="flex gap-4">
        {/* Image */}
        <Link
          href={`/products/${item.variant.product.slug}`}
          className="shrink-0 w-24 h-24 rounded-md overflow-hidden bg-bg-secondary"
        >
          {image && (
            <Image
              src={image.url}
              alt={image.altText || item.variant.product.name}
              width={96}
              height={96}
              className="w-full h-full object-cover"
            />
          )}
        </Link>

        {/* Details */}
        <div className="flex-1 min-w-0 space-y-1">
          <Link
            href={`/products/${item.variant.product.slug}`}
            className="font-medium hover:underline line-clamp-1"
          >
            {item.variant.product.name}
          </Link>
          <p className="text-sm text-fg-secondary">
            {item.variant.deviceModel?.name}
            {item.variant.color && ` · ${item.variant.color}`}
          </p>
          <p className="text-sm font-medium">{formatPrice(unitPrice)}</p>

          {/* Quantity & Remove */}
          <div className="flex items-center gap-4 pt-2">
            <QuantitySelector
              value={item.quantity}
              min={1}
              max={Math.min(item.variant.inventoryCount, 10)}
              onChange={handleQuantityChange}
            />
            <button
              onClick={handleRemove}
              aria-label={`Remove ${item.variant.product.name} from cart`}
              className="text-fg-tertiary hover:text-fg-primary transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Line total */}
        <div className="shrink-0 text-right">
          <p className="font-semibold">{formatPrice(unitPrice * item.quantity)}</p>
        </div>
      </div>

      {error && (
        <p className="mt-2 text-sm text-functional-error">{error}</p>
      )}
    </div>
  );
}
