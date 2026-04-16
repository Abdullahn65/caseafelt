import type { ReactNode } from "react";
import Link from "next/link";
import { Package, MapPin, Settings, HelpCircle } from "lucide-react";
import { BreadcrumbNav } from "@/components/storefront/breadcrumb-nav";

/** Force all account routes to be dynamic — never statically prerendered. */
export const dynamic = "force-dynamic";

const accountNav = [
  { href: "/account/orders", label: "Orders", icon: Package },
  { href: "/account/addresses", label: "Addresses", icon: MapPin },
  { href: "/account/settings", label: "Settings", icon: Settings },
  { href: "/account/support", label: "Support", icon: HelpCircle },
];

export default function AccountLayout({ children }: { children: ReactNode }) {
  return (
    <div className="container-page section-padding">
      <BreadcrumbNav items={[{ label: "Account", href: "/account" }]} />

      <h1 className="mt-8 text-3xl font-semibold">My account</h1>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-[220px_1fr] gap-8 lg:gap-12">
        {/* Sidebar */}
        <nav className="flex md:flex-col gap-2">
          {accountNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-fg-secondary hover:text-fg-primary hover:bg-bg-secondary transition-colors"
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Content */}
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
