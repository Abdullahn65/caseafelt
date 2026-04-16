import { cn } from "@/lib/utils";

/**
 * Avatar — Phase 3 spec.
 * Circle, sizes: sm (32px), default (40px), lg (48px). Admin only.
 */

interface AvatarProps {
  src?: string | null;
  alt?: string;
  fallback?: string; // Initials like "JD"
  size?: "sm" | "default" | "lg";
  className?: string;
}

const sizeMap = {
  sm: "h-8 w-8 text-xs",
  default: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
};

function Avatar({ src, alt = "", fallback, size = "default", className }: AvatarProps) {
  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        className={cn(
          "inline-block shrink-0 rounded-full object-cover",
          sizeMap[size],
          className
        )}
      />
    );
  }

  return (
    <div
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full bg-bg-tertiary font-medium text-fg-secondary",
        sizeMap[size],
        className
      )}
      aria-hidden={!alt}
      aria-label={alt || undefined}
    >
      {fallback || "?"}
    </div>
  );
}

export { Avatar };
export type { AvatarProps };
