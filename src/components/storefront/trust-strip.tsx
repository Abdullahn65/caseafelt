import { cn } from "@/lib/utils";
import { Truck, RotateCcw, Hand, ShieldCheck } from "lucide-react";

/**
 * TrustStrip — Phase 3 spec.
 * Horizontal strip with 3–4 trust signals.
 * "Free shipping over $75", "30-day returns", "Real felt materials", "Secure checkout".
 */

const trustItems = [
  { icon: Truck, text: "Free shipping over $75" },
  { icon: RotateCcw, text: "30-day returns" },
  { icon: Hand, text: "Real felt materials" },
  { icon: ShieldCheck, text: "Secure checkout" },
];

interface TrustStripProps {
  className?: string;
}

function TrustStrip({ className }: TrustStripProps) {
  return (
    <div
      className={cn(
        "border-y border-border-default bg-bg-secondary/50",
        className
      )}
    >
      <div className="container-page">
        <div className="grid grid-cols-2 gap-4 py-4 sm:grid-cols-4 sm:gap-6 sm:py-5">
          {trustItems.map((item) => (
            <div
              key={item.text}
              className="flex items-center justify-center gap-2 text-center"
            >
              <item.icon className="h-4 w-4 shrink-0 text-fg-secondary" aria-hidden="true" />
              <span className="text-xs font-medium text-fg-secondary sm:text-sm">
                {item.text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export { TrustStrip };
export type { TrustStripProps };
