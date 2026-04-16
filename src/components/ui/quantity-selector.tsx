"use client";

import { cn } from "@/lib/utils";
import { Minus, Plus } from "lucide-react";

/**
 * QuantitySelector — Phase 3 spec.
 * +/- buttons with number display. Min 1, max configurable.
 */

interface QuantitySelectorProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
  className?: string;
}

function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = 10,
  disabled = false,
  className,
}: QuantitySelectorProps) {
  const decrement = () => {
    if (value > min) onChange(value - 1);
  };

  const increment = () => {
    if (value < max) onChange(value + 1);
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-md border border-border-default",
        disabled && "opacity-50 pointer-events-none",
        className
      )}
    >
      <button
        type="button"
        onClick={decrement}
        disabled={disabled || value <= min}
        className="flex h-9 w-9 items-center justify-center text-fg-secondary hover:text-fg-primary hover:bg-bg-tertiary rounded-l-md transition-colors disabled:opacity-40"
        aria-label="Decrease quantity"
      >
        <Minus className="h-4 w-4" />
      </button>
      <span
        className="flex h-9 w-10 items-center justify-center text-sm font-medium text-fg-primary border-x border-border-default select-none"
        aria-live="polite"
        aria-label={`Quantity: ${value}`}
      >
        {value}
      </span>
      <button
        type="button"
        onClick={increment}
        disabled={disabled || value >= max}
        className="flex h-9 w-9 items-center justify-center text-fg-secondary hover:text-fg-primary hover:bg-bg-tertiary rounded-r-md transition-colors disabled:opacity-40"
        aria-label="Increase quantity"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}

export { QuantitySelector };
export type { QuantitySelectorProps };
