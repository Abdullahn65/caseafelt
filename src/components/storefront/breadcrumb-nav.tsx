import Link from "next/link";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

/**
 * BreadcrumbNav — Phase 3 spec.
 * Structured data (schema.org BreadcrumbList).
 */

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbNavProps {
  items: BreadcrumbItem[];
  className?: string;
}

function BreadcrumbNav({ items, className }: BreadcrumbNavProps) {
  return (
    <nav aria-label="Breadcrumb" className={cn("py-3", className)}>
      <ol
        className="flex items-center gap-1.5 text-sm"
        itemScope
        itemType="https://schema.org/BreadcrumbList"
      >
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li
              key={index}
              className="flex items-center gap-1.5"
              itemProp="itemListElement"
              itemScope
              itemType="https://schema.org/ListItem"
            >
              {isLast || !item.href ? (
                <span
                  className="text-fg-secondary"
                  itemProp="name"
                  aria-current={isLast ? "page" : undefined}
                >
                  {item.label}
                </span>
              ) : (
                <>
                  <Link
                    href={item.href}
                    className="text-fg-tertiary hover:text-fg-primary transition-colors"
                    itemProp="item"
                  >
                    <span itemProp="name">{item.label}</span>
                  </Link>
                  <ChevronRight className="h-3.5 w-3.5 text-fg-tertiary" aria-hidden="true" />
                </>
              )}
              <meta itemProp="position" content={String(index + 1)} />
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export { BreadcrumbNav };
export type { BreadcrumbNavProps, BreadcrumbItem };
