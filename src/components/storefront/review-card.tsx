import { StarRating } from "@/components/ui/star-rating";
import { cn, formatRelativeDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

/**
 * ReviewCard — Phase 3 spec.
 * Star rating, title, body text (truncated with expand), author + "Verified Purchase" badge, relative date.
 */

interface ReviewCardProps {
  review: {
    id: string;
    rating: number;
    title?: string | null;
    body: string;
    authorName: string;
    isVerifiedPurchase: boolean;
    createdAt: Date | string;
  };
  className?: string;
}

function ReviewCard({ review, className }: ReviewCardProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <StarRating rating={review.rating} size="sm" />
      {review.title && (
        <h4 className="text-sm font-medium text-fg-primary">{review.title}</h4>
      )}
      <p className="text-sm text-fg-secondary line-clamp-4">{review.body}</p>
      <div className="flex items-center gap-2 text-xs text-fg-tertiary">
        <span>{review.authorName}</span>
        {review.isVerifiedPurchase && (
          <Badge variant="success">Verified Purchase</Badge>
        )}
        <span>·</span>
        <time dateTime={new Date(review.createdAt).toISOString()}>
          {formatRelativeDate(new Date(review.createdAt))}
        </time>
      </div>
    </div>
  );
}

/**
 * ReviewSummary — Phase 3 spec.
 * Average rating (stars + number), total review count, rating distribution bar chart.
 */

interface ReviewSummaryProps {
  averageRating: number;
  totalReviews: number;
  distribution: Record<number, number>; // { 1: count, 2: count, ... 5: count }
  className?: string;
}

function ReviewSummary({ averageRating, totalReviews, distribution, className }: ReviewSummaryProps) {
  const maxCount = Math.max(...Object.values(distribution), 1);

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center gap-3">
        <StarRating rating={averageRating} size="lg" />
        <span className="text-2xl font-semibold text-fg-primary">
          {averageRating.toFixed(1)}
        </span>
        <span className="text-sm text-fg-secondary">
          ({totalReviews} {totalReviews === 1 ? "review" : "reviews"})
        </span>
      </div>

      {/* Distribution bars */}
      <div className="space-y-1.5">
        {[5, 4, 3, 2, 1].map((star) => {
          const count = distribution[star] ?? 0;
          const percentage = totalReviews > 0 ? (count / maxCount) * 100 : 0;
          return (
            <div key={star} className="flex items-center gap-2 text-xs">
              <span className="w-3 text-right text-fg-secondary">{star}</span>
              <div className="h-2 flex-1 rounded-full bg-bg-tertiary overflow-hidden">
                <div
                  className="h-full rounded-full bg-accent-olive transition-all"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="w-6 text-right text-fg-tertiary">{count}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export { ReviewCard, ReviewSummary };
export type { ReviewCardProps, ReviewSummaryProps };
