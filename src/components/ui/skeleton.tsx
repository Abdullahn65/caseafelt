import { cn } from "@/lib/utils";

/**
 * Skeleton — Phase 3 spec.
 * Loading states. Matches bg-secondary color. Subtle pulse animation.
 */

interface SkeletonProps {
  className?: string;
}

function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn("skeleton-pulse", className)}
      aria-hidden="true"
    />
  );
}

/** Skeleton variants for common patterns */

function SkeletonText({ className, lines = 3 }: SkeletonProps & { lines?: number }) {
  return (
    <div className={cn("space-y-2", className)} aria-hidden="true">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "skeleton-pulse h-4",
            i === lines - 1 ? "w-2/3" : "w-full"
          )}
        />
      ))}
    </div>
  );
}

function SkeletonCard({ className }: SkeletonProps) {
  return (
    <div className={cn("space-y-3", className)} aria-hidden="true">
      <div className="skeleton-pulse aspect-[4/5] w-full rounded-md" />
      <div className="skeleton-pulse h-3 w-1/3" />
      <div className="skeleton-pulse h-4 w-2/3" />
      <div className="skeleton-pulse h-4 w-1/4" />
    </div>
  );
}

export { Skeleton, SkeletonText, SkeletonCard };
export type { SkeletonProps };
