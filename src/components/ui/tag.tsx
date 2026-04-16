import { cn } from "@/lib/utils";

/**
 * Tag — Phase 3 spec.
 * Sand background, charcoal text. Used for collection labels, material labels, customer tags (admin).
 */

interface TagProps {
  className?: string;
  removable?: boolean;
  onRemove?: () => void;
  children: React.ReactNode;
}

function Tag({ className, removable, onRemove, children }: TagProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-accent-sand/20 px-3 py-1",
        "text-xs font-medium text-fg-primary",
        className
      )}
    >
      {children}
      {removable && onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="ml-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full hover:bg-fg-primary/10"
          aria-label="Remove tag"
        >
          <svg width="8" height="8" viewBox="0 0 8 8" fill="none" aria-hidden="true">
            <path d="M1 1l6 6M7 1L1 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      )}
    </span>
  );
}

export { Tag };
export type { TagProps };
