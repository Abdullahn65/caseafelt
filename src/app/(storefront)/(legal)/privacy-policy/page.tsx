import type { Metadata } from "next";
import { BreadcrumbNav } from "@/components/storefront/breadcrumb-nav";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "CaseaFelt privacy policy — how we collect, use, and protect your data.",
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <BreadcrumbNav items={[{ label: "Privacy Policy", href: "/privacy-policy" }]} />

      <h1 className="mt-8 text-3xl font-semibold">Privacy Policy</h1>
      <p className="mt-4 text-sm text-fg-tertiary">Last updated: January 2025</p>

      <div className="mt-8 space-y-6 text-fg-secondary leading-relaxed [&_h2]:text-fg-primary [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mt-8 [&_h2]:mb-3">
        <h2>1. Information we collect</h2>
        <p>
          When you visit our website or place an order, we collect certain
          information to process your purchase and improve your experience.
          This includes:
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Account information (name, email address)</li>
          <li>Shipping and billing addresses</li>
          <li>Payment information (processed securely via Stripe — we never store card details)</li>
          <li>Order history and preferences</li>
          <li>Device and browser information (for analytics)</li>
        </ul>

        <h2>2. How we use your information</h2>
        <p>We use your information to:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Process and fulfil your orders</li>
          <li>Send order confirmations and shipping updates</li>
          <li>Respond to customer support inquiries</li>
          <li>Send marketing communications (only with your consent)</li>
          <li>Improve our website and products</li>
        </ul>

        <h2>3. Sharing your information</h2>
        <p>
          We do not sell your personal information. We share data only with
          trusted service providers who help us operate our business:
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Stripe (payment processing)</li>
          <li>Shipping carriers (order delivery)</li>
          <li>Resend (transactional emails)</li>
          <li>Clerk (authentication)</li>
          <li>PostHog (privacy-friendly analytics)</li>
        </ul>

        <h2>4. Cookies</h2>
        <p>
          We use essential cookies to keep your shopping cart and session active.
          Analytics cookies are only set with your consent and help us understand
          how visitors use our site.
        </p>

        <h2>5. Your rights</h2>
        <p>
          Under GDPR and applicable privacy laws, you have the right to access,
          correct, delete, or export your personal data. You may also withdraw
          consent for marketing communications at any time.
        </p>
        <p>
          To exercise any of these rights, contact us at{" "}
          <a href="mailto:privacy@caseafelt.com" className="text-accent-olive hover:underline">
            privacy@caseafelt.com
          </a>.
        </p>

        <h2>6. Data retention</h2>
        <p>
          We retain order data for accounting and legal purposes. Account data
          is retained until you request deletion. Analytics data is anonymised
          and aggregated.
        </p>

        <h2>7. Contact</h2>
        <p>
          For privacy-related questions, email us at{" "}
          <a href="mailto:privacy@caseafelt.com" className="text-accent-olive hover:underline">
            privacy@caseafelt.com
          </a>.
        </p>
      </div>
    </>
  );
}
