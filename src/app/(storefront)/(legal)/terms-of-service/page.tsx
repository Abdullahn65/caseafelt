import type { Metadata } from "next";
import { BreadcrumbNav } from "@/components/storefront/breadcrumb-nav";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "CaseaFelt terms of service — the rules governing use of our website and purchases.",
};

export default function TermsOfServicePage() {
  return (
    <>
      <BreadcrumbNav
        items={[{ label: "Terms of Service", href: "/terms-of-service" }]}
      />

      <h1 className="mt-8 text-3xl font-semibold">Terms of Service</h1>
      <p className="mt-4 text-sm text-fg-tertiary">Last updated: January 2025</p>

      <div className="mt-8 space-y-6 text-fg-secondary leading-relaxed [&_h2]:text-fg-primary [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mt-8 [&_h2]:mb-3">
        <h2>1. Overview</h2>
        <p>
          These terms govern your use of the CaseaFelt website and your purchase
          of products from us. By using our website or placing an order, you
          agree to these terms.
        </p>

        <h2>2. Products and pricing</h2>
        <p>
          All product descriptions, images, and prices are as accurate as
          possible. We reserve the right to correct errors and update
          information without prior notice. Prices are displayed in EUR and
          include applicable VAT where required.
        </p>

        <h2>3. Orders</h2>
        <p>
          When you place an order, you are making an offer to purchase. We will
          confirm your order via email. We reserve the right to decline or
          cancel orders for any reason, including stock availability or
          suspected fraud.
        </p>

        <h2>4. Payment</h2>
        <p>
          Payment is processed securely through Stripe at the time of purchase.
          We accept major credit and debit cards. Your payment information is
          never stored on our servers.
        </p>

        <h2>5. Shipping</h2>
        <p>
          Shipping times and costs vary by destination and are calculated at
          checkout. We are not responsible for delays caused by customs,
          carriers, or force majeure events. See our{" "}
          <a href="/shipping-policy" className="text-accent-olive hover:underline">
            shipping policy
          </a>{" "}
          for details.
        </p>

        <h2>6. Returns and refunds</h2>
        <p>
          We accept returns within 30 days of delivery for items in unused,
          original condition. See our{" "}
          <a href="/return-policy" className="text-accent-olive hover:underline">
            return policy
          </a>{" "}
          for full details.
        </p>

        <h2>7. Intellectual property</h2>
        <p>
          All content on this website — including text, images, logos, and
          designs — is the property of CaseaFelt and is protected by copyright.
          You may not reproduce, distribute, or use any content without our
          written permission.
        </p>

        <h2>8. Limitation of liability</h2>
        <p>
          To the fullest extent permitted by law, CaseaFelt is not liable for
          any indirect, incidental, or consequential damages arising from your
          use of our website or products.
        </p>

        <h2>9. Governing law</h2>
        <p>
          These terms are governed by the laws of the European Union and the
          applicable national law of our registered business location.
        </p>

        <h2>10. Contact</h2>
        <p>
          For questions about these terms, contact us at{" "}
          <a href="mailto:legal@caseafelt.com" className="text-accent-olive hover:underline">
            legal@caseafelt.com
          </a>.
        </p>
      </div>
    </>
  );
}
