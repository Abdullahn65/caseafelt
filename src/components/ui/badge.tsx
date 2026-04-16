import { cn } from "@/lib/utils";

/**
 * Badge — Phase 3 spec.
 * 
 * Pill shape, text-xs, uppercase.
 * Variants: default (sand), success (olive), warning, error (burgundy).
 */

type BadgeVariant = "default" | "success" | "warning" | "error";

interface BadgeProps {
  variant?: BadgeVariant;
  className?: string;
  children: React.ReactNode;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-accent-sand/30 text-fg-primary",
  success: "bg-success/15 text-success",
  warning: "bg-warning/15 text-warning",
  error: "bg-error/15 text-error",
};

function Badge({ variant = "default", className, children }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5",
        "text-xs font-medium uppercase tracking-wide",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

export { Badge };
export type { BadgeProps, BadgeVariant };
