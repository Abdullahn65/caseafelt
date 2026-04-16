import Link from "next/link";
import Image from "next/image";
import { cn, formatPrice } from "@/lib/utils";

/**
 * ProductCard — Phase 3 spec.
 * 
 * 4:5 image, product name, price, collection label overline.
 * Hover: subtle image scale (1.02). No "add to cart" on card — card links to PDP.
 */

interface ProductCardProps {
  product: {
    slug: string;
    name: string;
    basePrice: number;
    images: Array<{ url: string; altText: string }>;
    collections?: Array<{
      collection: { name: string; slug: string };
    }>;
  };
  className?: string;
}

function ProductCard({ product, className }: ProductCardProps) {
  const primaryImage = product.images[0];
  const collectionName = product.collections?.[0]?.collection.name;

  return (
    <Link
      href={`/products/${product.slug}`}
      className={cn("group block", className)}
    >
      {/* Image — 4:5 aspect ratio */}
      <div className="relative aspect-[4/5] overflow-hidden rounded-md bg-bg-secondary">
        {primaryImage ? (
          <Image
            src={primaryImage.url}
            alt={primaryImage.altText || product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-fg-tertiary">
            <span className="text-sm">No image</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="mt-3 space-y-1">
        {collectionName && (
          <p className="text-label">{collectionName}</p>
        )}
        <h3 className="text-base font-medium text-fg-primary group-hover:text-accent-olive transition-colors">
          {product.name}
        </h3>
        <p className="text-sm text-fg-secondary">
          {formatPrice(product.basePrice)}
        </p>
      </div>
    </Link>
  );
}

export { ProductCard };
export type { ProductCardProps };
