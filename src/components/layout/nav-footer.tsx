import Link from "next/link";
import { NewsletterForm } from "@/components/forms/newsletter-form";

/**
 * NavFooter — Phase 3 spec.
 * Four-column grid: Shop links, Company links, Support links, Newsletter mini-form.
 * Below: policy links, copyright.
 */

function NavFooter() {
  return (
    <footer className="border-t border-border-default bg-bg-inverse text-fg-inverse">
      {/* Newsletter section */}
      <div className="border-b border-white/10">
        <div className="container-page section-padding">
          <div className="max-w-xl mx-auto text-center">
            <p className="text-label text-white/60">Stay in touch</p>
            <h2 className="mt-2 text-2xl font-semibold">New textures, new collections.</h2>
            <div className="mt-4">
              <NewsletterForm source="footer" />
            </div>
            <p className="mt-2 text-xs text-white/40">
              No spam. Unsubscribe anytime.
            </p>
          </div>
        </div>
      </div>

      {/* Link columns */}
      <div className="container-page py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Shop */}
          <div>
            <h3 className="text-sm font-semibold text-white/80 uppercase tracking-wider">Shop</h3>
            <ul className="mt-4 space-y-3">
              <li><Link href="/collections" className="text-sm text-white/60 hover:text-white transition-colors">All Collections</Link></li>
              <li><Link href="/products" className="text-sm text-white/60 hover:text-white transition-colors">All Products</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold text-white/80 uppercase tracking-wider">Company</h3>
            <ul className="mt-4 space-y-3">
              <li><Link href="/about" className="text-sm text-white/60 hover:text-white transition-colors">About</Link></li>
              <li><Link href="/contact" className="text-sm text-white/60 hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold text-white/80 uppercase tracking-wider">Support</h3>
            <ul className="mt-4 space-y-3">
              <li><Link href="/support" className="text-sm text-white/60 hover:text-white transition-colors">FAQ & Help</Link></li>
              <li><Link href="/shipping-policy" className="text-sm text-white/60 hover:text-white transition-colors">Shipping</Link></li>
              <li><Link href="/return-policy" className="text-sm text-white/60 hover:text-white transition-colors">Returns</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold text-white/80 uppercase tracking-wider">Legal</h3>
            <ul className="mt-4 space-y-3">
              <li><Link href="/privacy-policy" className="text-sm text-white/60 hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms-of-service" className="text-sm text-white/60 hover:text-white transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="container-page py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} CaseaFelt. All rights reserved.
          </p>
          <p className="text-xs text-white/40">
            Phone cases designed to be felt, not just seen.
          </p>
        </div>
      </div>
    </footer>
  );
}

export { NavFooter };
