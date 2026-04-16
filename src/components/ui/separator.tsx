import { cn } from "@/lib/utils";

/**
 * Separator — Phase 3 spec.
 * 1px border-default. Horizontal or vertical.
 */

interface SeparatorProps {
  orientation?: "horizontal" | "vertical";
  className?: string;
}

function Separator({ orientation = "horizontal", className }: SeparatorProps) {
  return (
    <div
      role="separator"
      aria-orientation={orientation}
      className={cn(
        "shrink-0 bg-border-default",
        orientation === "horizontal" ? "h-px w-full" : "h-full w-px",
        className
      )}
    />
  );
}

export { Separator };
export type { SeparatorProps };
