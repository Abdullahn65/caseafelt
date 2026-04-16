import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

/**
 * Input — Phase 3 spec.
 * 
 * Height: h-11. Border: border-default. Focus: border-strong ring.
 * Background: white (#FFFFFF), not bg-primary (contrast).
 */
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, type, ...props }, ref) => {
    return (
      <div className="w-full">
        <input
          type={type}
          ref={ref}
          className={cn(
            "flex h-11 w-full rounded-md border bg-white px-4 text-base text-fg-primary",
            "placeholder:text-fg-tertiary",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-strong focus-visible:ring-offset-1",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error
              ? "border-error"
              : "border-border-default",
            className
          )}
          aria-invalid={error ? "true" : undefined}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-sm text-error" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
export type { InputProps };
