import Link from "next/link";
import { ShoppingBag, ChevronDown } from "lucide-react";
import { getCartItemCount } from "@/lib/data/cart";
import { getContentBlock } from "@/lib/data/products";
import { MobileMenu } from "@/components/layout/mobile-menu";

/**
 * NavHeader — Phase 3 spec.
 * Logo left, nav center, cart icon right with count badge. Sticky on scroll.
 * Announcement bar above (ContentBlock-driven).
 */

async function AnnouncementBar() {
  const block = await getContentBlock("announcement-bar");
  if (!block) return null;

  return (
    <div className="bg-bg-secondary text-center py-2 px-4">
      <p className="text-xs font-medium text-fg-secondary sm:text-sm">
        {block.title}
        {block.linkUrl && block.linkText && (
          <>
            {" "}
            <Link href={block.linkUrl} className="underline hover:text-fg-primary">
              {block.linkText}
            </Link>
          </>
        )}
      </p>
    </div>
  );
}

async function NavHeader() {
  const cartCount = await getCartItemCount();

  return (
    <>
      <AnnouncementBar />
      <header className="sticky top-0 z-40 border-b border-border-default bg-bg-primary/95 backdrop-blur supports-[backdrop-filter]:bg-bg-primary/80">
        <div className="container-page">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="text-xl font-semibold tracking-tight text-fg-primary hover:no-underline">
              CaseaFelt
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
              <div className="relative group">
                <button className="flex items-center gap-1 text-sm font-medium text-fg-secondary hover:text-fg-primary transition-colors">
                  Shop
                  <ChevronDown className="h-3.5 w-3.5" />
                </button>
                {/* Dropdown — shows on hover */}
                <div className="invisible group-hover:visible opacity-0 group-hover:opacity-100 absolute top-full left-0 mt-2 w-48 rounded-md border border-border-default bg-bg-primary shadow-lg transition-all py-2">
                  <Link href="/collections" className="block px-4 py-2 text-sm text-fg-secondary hover:text-fg-primary hover:bg-bg-secondary transition-colors">
                    All Collections
                  </Link>
                  <Link href="/products" className="block px-4 py-2 text-sm text-fg-secondary hover:text-fg-primary hover:bg-bg-secondary transition-colors">
                    All Products
                  </Link>
                </div>
              </div>
              <Link href="/about" className="text-sm font-medium text-fg-secondary hover:text-fg-primary transition-colors">
                About
              </Link>
              <Link href="/contact" className="text-sm font-medium text-fg-secondary hover:text-fg-primary transition-colors">
                Contact
              </Link>
            </nav>

            {/* Right side: Cart */}
            <div className="flex items-center gap-4">
              {/* Cart */}
              <Link
                href="/cart"
                className="relative flex items-center justify-center h-11 w-11 rounded-md hover:bg-bg-tertiary transition-colors"
                aria-label={`Cart${cartCount > 0 ? `, ${cartCount} items` : ""}`}
              >
                <ShoppingBag className="h-5 w-5 text-fg-primary" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-accent-olive text-[10px] font-semibold text-fg-inverse">
                    {cartCount > 9 ? "9+" : cartCount}
                  </span>
                )}
              </Link>

              {/* Mobile menu */}
              <MobileMenu />
            </div>
          </div>
        </div>
      </header>
    </>
  );
}

export { NavHeader };
