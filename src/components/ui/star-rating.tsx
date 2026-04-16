import { cn } from "@/lib/utils";
import { Star } from "lucide-react";

/**
 * StarRating — Phase 3 spec.
 * Display mode: filled/empty stars.
 * Filled = accent-olive, Empty = border-default.
 */

interface StarRatingProps {
  rating: number; // 1–5, can be fractional for display
  maxRating?: number;
  size?: "sm" | "default" | "lg";
  className?: string;
}

const sizeMap = {
  sm: "h-3.5 w-3.5",
  default: "h-4 w-4",
  lg: "h-5 w-5",
};

function StarRating({ rating, maxRating = 5, size = "default", className }: StarRatingProps) {
  return (
    <div className={cn("inline-flex items-center gap-0.5", className)} role="img" aria-label={`${rating} out of ${maxRating} stars`}>
      {Array.from({ length: maxRating }).map((_, i) => {
        const filled = i < Math.round(rating);
        return (
          <Star
            key={i}
            className={cn(
              sizeMap[size],
              filled ? "fill-accent-olive text-accent-olive" : "fill-none text-border-default"
            )}
            aria-hidden="true"
          />
        );
      })}
    </div>
  );
}

/**
 * StarRatingInput — clickable star rating for review forms.
 */
interface StarRatingInputProps {
  value: number;
  onChange: (value: number) => void;
  maxRating?: number;
  className?: string;
}

function StarRatingInput({ value, onChange, maxRating = 5, className }: StarRatingInputProps) {
  return (
    <div className={cn("inline-flex items-center gap-1", className)} role="radiogroup" aria-label="Rating">
      {Array.from({ length: maxRating }).map((_, i) => {
        const starValue = i + 1;
        const filled = starValue <= value;
        return (
          <button
            key={i}
            type="button"
            onClick={() => onChange(starValue)}
            className="p-0.5 transition-colors hover:scale-110"
            role="radio"
            aria-checked={starValue === value}
            aria-label={`${starValue} star${starValue > 1 ? "s" : ""}`}
          >
            <Star
              className={cn(
                "h-6 w-6",
                filled ? "fill-accent-olive text-accent-olive" : "fill-none text-border-default hover:text-accent-olive/50"
              )}
              aria-hidden="true"
            />
          </button>
        );
      })}
    </div>
  );
}

export { StarRating, StarRatingInput };
export type { StarRatingProps, StarRatingInputProps };
