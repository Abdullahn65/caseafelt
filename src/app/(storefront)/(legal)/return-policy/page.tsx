import type { Metadata } from "next";
import { BreadcrumbNav } from "@/components/storefront/breadcrumb-nav";

export const metadata: Metadata = {
  title: "Return Policy",
  description: "CaseaFelt return policy — how to return or exchange your purchase.",
};

export default function ReturnPolicyPage() {
  return (
    <>
      <BreadcrumbNav
        items={[{ label: "Return Policy", href: "/return-policy" }]}
      />

      <h1 className="mt-8 text-3xl font-semibold">Return Policy</h1>
      <p className="mt-4 text-sm text-fg-tertiary">Last updated: January 2025</p>

      <div className="mt-8 space-y-6 text-fg-secondary leading-relaxed [&_h2]:text-fg-primary [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mt-8 [&_h2]:mb-3">
        <h2>30-day return guarantee</h2>
        <p>
          We want you to love your CaseaFelt case. If you're not completely
          satisfied, you can return your purchase within 30 days of delivery for
          a full refund.
        </p>

        <h2>Eligibility</h2>
        <p>To be eligible for a return, items must be:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>In original, unused condition</li>
          <li>Free from visible wear, stains, or damage</li>
          <li>Returned within 30 days of the delivery date</li>
        </ul>

        <h2>How to start a return</h2>
        <ol className="list-decimal pl-6 space-y-2">
          <li>
            Log into your{" "}
            <a href="/account/orders" className="text-accent-olive hover:underline">
              account
            </a>{" "}
            and find the order you'd like to return.
          </li>
          <li>
            Contact us at{" "}
            <a href="mailto:returns@caseafelt.com" className="text-accent-olive hover:underline">
              returns@caseafelt.com
            </a>{" "}
            with your order number and reason for return.
          </li>
          <li>We'll send you a prepaid return label within 1 business day.</li>
          <li>Ship the item back using the provided label.</li>
        </ol>

        <h2>Refund timeline</h2>
        <p>
          Once we receive and inspect your return, we'll process your refund
          within 5 business days. The refund will appear on your original
          payment method within 5–10 business days, depending on your bank.
        </p>

        <h2>Exchanges</h2>
        <p>
          Want a different device model or colour? Contact us and we'll arrange
          an exchange at no additional cost (subject to availability). We'll send
          the new item once we receive the original.
        </p>

        <h2>Damaged or defective items</h2>
        <p>
          If your case arrives damaged or has a manufacturing defect, contact us
          immediately. We'll send a replacement at no charge — no return needed
          in most cases.
        </p>

        <h2>Questions?</h2>
        <p>
          Contact our support team at{" "}
          <a href="mailto:returns@caseafelt.com" className="text-accent-olive hover:underline">
            returns@caseafelt.com
          </a>{" "}
          or visit our{" "}
          <a href="/support" className="text-accent-olive hover:underline">
            support page
          </a>.
        </p>
      </div>
    </>
  );
}
