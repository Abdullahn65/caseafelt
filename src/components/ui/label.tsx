import { type LabelHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

/**
 * Label — Phase 3 spec: text-sm, font-medium, text-primary.
 */
interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {}

function Label({ className, ...props }: LabelProps) {
  return (
    <label
      className={cn("text-sm font-medium text-fg-primary", className)}
      {...props}
    />
  );
}

export { Label };
export type { LabelProps };
