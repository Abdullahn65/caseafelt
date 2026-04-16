import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * CollectionCard — Phase 3 spec.
 * Landscape image, collection name, headline text. Links to collection page.
 */

interface CollectionCardProps {
  collection: {
    slug: string;
    name: string;
    headline?: string | null;
    imageUrl?: string | null;
  };
  className?: string;
}

function CollectionCard({ collection, className }: CollectionCardProps) {
  return (
    <Link
      href={`/collections/${collection.slug}`}
      className={cn("group block overflow-hidden rounded-lg", className)}
    >
      <div className="relative aspect-[3/2] bg-bg-secondary">
        {collection.imageUrl ? (
          <Image
            src={collection.imageUrl}
            alt={collection.name}
            fill
            sizes="(max-width: 640px) 100vw, 50vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-bg-tertiary">
            <span className="text-label">{collection.name}</span>
          </div>
        )}
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <p className="text-xs font-medium uppercase tracking-widest text-white/80">
            Collection
          </p>
          <h3 className="mt-1 text-xl font-semibold text-white">
            {collection.name}
          </h3>
          {collection.headline && (
            <p className="mt-1 text-sm text-white/80 line-clamp-2">
              {collection.headline}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}

export { CollectionCard };
export type { CollectionCardProps };
