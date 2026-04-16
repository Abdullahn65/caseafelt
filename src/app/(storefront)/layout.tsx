import { NavHeader } from "@/components/layout/nav-header";
import { NavFooter } from "@/components/layout/nav-footer";

/**
 * Storefront layout — wraps all public-facing pages.
 * Header + main content + footer.
 */
export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NavHeader />
      <main id="main-content">{children}</main>
      <NavFooter />
    </>
  );
}
