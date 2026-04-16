"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn, formatPrice } from "@/lib/utils";
import { Truck, RotateCcw, Check } from "lucide-react";

/**
 * ProductInfo — Phase 3 spec.
 * Client component for variant selection + add to cart.
 * 
 * Variant selection UX:
 * 1. Device picker: two dropdowns (brand → model)
 * 2. Color swatches: circles from variant.colorHex
 * 3. Price resolution: variant.price || product.basePrice
 * 4. Inventory check: disable add-to-cart if OOS
 * 5. URL updates with query params for shareability
 */

interface Variant {
  id: string;
  name: string;
  color: string | null;
  colorHex: string | null;
  price: number | null;
  inventoryCount: number;
  isActive: boolean;
  deviceModel: {
    id: string;
    brand: string;
    name: string;
    slug: string;
    family: string | null;
  };
  material: {
    id: string;
    name: string;
  } | null;
}

interface ProductInfoProps {
  product: {
    id: string;
    name: string;
    basePrice: number;
    compareAtPrice: number | null;
    shortDescription: string | null;
    variants: Variant[];
    collections: Array<{
      collection: { name: string; slug: string };
    }>;
  };
}

function ProductInfo({ product }: ProductInfoProps) {
  const router = useRouter();

  // Extract unique brands and device models
  const devicesByBrand = useMemo(() => {
    const map = new Map<string, { id: string; name: string; slug: string }[]>();
    for (const v of product.variants) {
      const brand = v.deviceModel.brand;
      if (!map.has(brand)) map.set(brand, []);
      const existing = map.get(brand)!;
      if (!existing.find((d) => d.id === v.deviceModel.id)) {
        existing.push({ id: v.deviceModel.id, name: v.deviceModel.name, slug: v.deviceModel.slug });
      }
    }
    return map;
  }, [product.variants]);

  const brands = useMemo(() => Array.from(devicesByBrand.keys()), [devicesByBrand]);

  // State
  const [selectedBrand, setSelectedBrand] = useState(brands[0] ?? "");
  const [selectedDeviceId, setSelectedDeviceId] = useState(() => {
    const firstBrandDevices = devicesByBrand.get(brands[0] ?? "") ?? [];
    return firstBrandDevices[0]?.id ?? "";
  });
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [addedMessage, setAddedMessage] = useState("");

  // Filtered variants for selected device
  const variantsForDevice = useMemo(
    () => product.variants.filter((v) => v.deviceModel.id === selectedDeviceId),
    [product.variants, selectedDeviceId]
  );

  // Selected variant
  const selectedVariant = useMemo(() => {
    if (selectedVariantId) {
      return variantsForDevice.find((v) => v.id === selectedVariantId) ?? variantsForDevice[0];
    }
    return variantsForDevice[0] ?? null;
  }, [variantsForDevice, selectedVariantId]);

  // Price
  const price = selectedVariant?.price ?? product.basePrice;
  const comparePrice = product.compareAtPrice;
  const isOutOfStock = selectedVariant ? selectedVariant.inventoryCount <= 0 : false;

  // Handlers
  const handleBrandChange = (brand: string) => {
    setSelectedBrand(brand);
    const devices = devicesByBrand.get(brand) ?? [];
    setSelectedDeviceId(devices[0]?.id ?? "");
    setSelectedVariantId(null);
  };

  const handleDeviceChange = (deviceId: string) => {
    setSelectedDeviceId(deviceId);
    setSelectedVariantId(null);
  };

  const handleColorSelect = (variantId: string) => {
    setSelectedVariantId(variantId);
  };

  const handleAddToCart = async () => {
    if (!selectedVariant || isOutOfStock) return;

    setIsAdding(true);
    setAddedMessage("");

    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          variantId: selectedVariant.id,
          quantity: 1,
        }),
      });

      if (res.ok) {
        setAddedMessage("Added to cart");
        router.refresh(); // Refresh server components (cart count)
        setTimeout(() => setAddedMessage(""), 3000);
      } else {
        const data = await res.json();
        setAddedMessage(data.error ?? "Failed to add to cart");
      }
    } catch {
      setAddedMessage("Something went wrong");
    } finally {
      setIsAdding(false);
    }
  };

  const collectionName = product.collections[0]?.collection.name;

  return (
    <div className="lg:sticky lg:top-20 space-y-6">
      {/* Collection overline */}
      {collectionName && (
        <p className="text-label">{collectionName} Collection</p>
      )}

      {/* Product name */}
      <h1 className="text-3xl font-semibold">{product.name}</h1>

      {/* Price */}
      <div className="flex items-center gap-2">
        <span className="text-xl font-semibold">{formatPrice(price)}</span>
        {comparePrice && comparePrice > price && (
          <span className="text-lg text-fg-tertiary line-through">
            {formatPrice(comparePrice)}
          </span>
        )}
      </div>

      {product.shortDescription && (
        <p className="text-fg-secondary">{product.shortDescription}</p>
      )}

      {/* Device Picker */}
      <div className="space-y-3">
        <p className="text-sm font-medium">Device</p>
        <div className="flex gap-3">
          {/* Brand */}
          <select
            value={selectedBrand}
            onChange={(e) => handleBrandChange(e.target.value)}
            className="h-11 flex-1 rounded-md border border-border-default bg-white px-4 text-sm"
            aria-label="Select brand"
          >
            {brands.map((brand) => (
              <option key={brand} value={brand}>{brand}</option>
            ))}
          </select>

          {/* Model */}
          <select
            value={selectedDeviceId}
            onChange={(e) => handleDeviceChange(e.target.value)}
            className="h-11 flex-1 rounded-md border border-border-default bg-white px-4 text-sm"
            aria-label="Select model"
          >
            {(devicesByBrand.get(selectedBrand) ?? []).map((device) => (
              <option key={device.id} value={device.id}>{device.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Color / Variant Swatches */}
      {variantsForDevice.length > 1 && (
        <div className="space-y-3">
          <p className="text-sm font-medium">
            Color{selectedVariant?.color ? `: ${selectedVariant.color}` : ""}
          </p>
          <div className="flex gap-2">
            {variantsForDevice.map((v) => {
              const isSelected = v.id === (selectedVariant?.id ?? "");
              const isOOS = v.inventoryCount <= 0;
              return (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => handleColorSelect(v.id)}
                  className={cn(
                    "relative h-10 w-10 rounded-full border-2 transition-all",
                    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-strong",
                    isSelected ? "border-fg-primary scale-110" : "border-transparent hover:border-border-strong",
                  )}
                  style={{ backgroundColor: v.colorHex ?? "#E8E3DC" }}
                  aria-label={`${v.name}${isOOS ? " (out of stock)" : ""}`}
                  aria-pressed={isSelected}
                  title={v.name}
                >
                  {isOOS && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="h-[1px] w-8 bg-fg-primary/60 rotate-45" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Separator */}
      <div className="h-px bg-border-default" />

      {/* Add to cart */}
      <Button
        variant="primary"
        size="lg"
        className="w-full"
        onClick={handleAddToCart}
        loading={isAdding}
        disabled={isOutOfStock}
      >
        {isOutOfStock
          ? "Out of stock — check another device"
          : `Add to cart — ${formatPrice(price)}`}
      </Button>

      {addedMessage && (
        <p className={cn(
          "text-sm text-center font-medium",
          addedMessage === "Added to cart" ? "text-success" : "text-error"
        )}>
          {addedMessage}
        </p>
      )}

      {/* Trust signals */}
      <div className="space-y-2 text-sm text-fg-secondary">
        <div className="flex items-center gap-2">
          <Truck className="h-4 w-4" />
          <span>Free shipping over $75</span>
        </div>
        <div className="flex items-center gap-2">
          <RotateCcw className="h-4 w-4" />
          <span>30-day returns</span>
        </div>
        {selectedVariant?.material && (
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4" />
            <span>{selectedVariant.material.name}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export { ProductInfo };
export type { ProductInfoProps };
