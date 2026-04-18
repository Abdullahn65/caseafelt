import type { ReactNode } from "react";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { UserButton } from "@clerk/nextjs";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  HelpCircle,
  FileText,
  Boxes,
  UserCog,
} from "lucide-react";

/** Force all admin routes to be dynamic — never statically prerendered. */
export const dynamic = "force-dynamic";

const adminNav = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/crm", label: "CRM", icon: UserCog },
  { href: "/admin/support", label: "Support", icon: HelpCircle },
  { href: "/admin/content", label: "Content", icon: FileText },
  { href: "/admin/inventory", label: "Inventory", icon: Boxes },
];

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const admin = await requireAdmin();

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 border-r border-border-default bg-bg-primary">
        <div className="sticky top-0 flex flex-col h-screen">
          <div className="p-4 border-b border-border-default">
            <Link href="/" className="text-sm font-semibold tracking-wide">
              CaseaFelt
            </Link>
            <p className="text-xs text-fg-tertiary mt-0.5">Admin</p>
          </div>
          <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
            {adminNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm text-fg-secondary hover:text-fg-primary hover:bg-bg-secondary transition-colors"
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="p-4 border-t border-border-default space-y-3">
            <div className="flex items-center gap-2">
              <UserButton afterSignOutUrl="/" />
              <span className="text-xs text-fg-secondary truncate">
                {admin.firstName ?? admin.email}
              </span>
            </div>
            <Link
              href="/"
              className="text-xs text-fg-tertiary hover:text-fg-secondary"
            >
              ← Back to store
            </Link>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0">
        <div className="p-6 lg:p-8 max-w-6xl">{children}</div>
      </main>
    </div>
  );
}
