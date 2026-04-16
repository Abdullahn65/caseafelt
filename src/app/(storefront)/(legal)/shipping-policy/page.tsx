import type { Metadata } from "next";
import { BreadcrumbNav } from "@/components/storefront/breadcrumb-nav";

export const metadata: Metadata = {
  title: "Shipping Policy",
  description: "CaseaFelt shipping policy — delivery times, costs, and international shipping.",
};

export default function ShippingPolicyPage() {
  return (
    <>
      <BreadcrumbNav
        items={[{ label: "Shipping Policy", href: "/shipping-policy" }]}
      />

      <h1 className="mt-8 text-3xl font-semibold">Shipping Policy</h1>
      <p className="mt-4 text-sm text-fg-tertiary">Last updated: January 2025</p>

      <div className="mt-8 space-y-6 text-fg-secondary leading-relaxed [&_h2]:text-fg-primary [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mt-8 [&_h2]:mb-3">
        <h2>Processing time</h2>
        <p>
          Orders are processed within 1–2 business days. You'll receive a
          confirmation email once your order ships, including a tracking link.
        </p>

        <h2>Shipping rates and delivery times</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-border-default text-left text-fg-primary">
                <th className="py-2 pr-4 font-medium">Destination</th>
                <th className="py-2 pr-4 font-medium">Standard</th>
                <th className="py-2 pr-4 font-medium">Express</th>
                <th className="py-2 font-medium">Cost</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-default">
              <tr>
                <td className="py-2 pr-4">Europe (EU)</td>
                <td className="py-2 pr-4">5–7 business days</td>
                <td className="py-2 pr-4">2–3 business days</td>
                <td className="py-2">From €4.95</td>
              </tr>
              <tr>
                <td className="py-2 pr-4">UK & Switzerland</td>
                <td className="py-2 pr-4">7–10 business days</td>
                <td className="py-2 pr-4">3–5 business days</td>
                <td className="py-2">From €6.95</td>
              </tr>
              <tr>
                <td className="py-2 pr-4">North America</td>
                <td className="py-2 pr-4">7–14 business days</td>
                <td className="py-2 pr-4">4–6 business days</td>
                <td className="py-2">From €8.95</td>
              </tr>
              <tr>
                <td className="py-2 pr-4">Rest of world</td>
                <td className="py-2 pr-4">10–21 business days</td>
                <td className="py-2 pr-4">5–10 business days</td>
                <td className="py-2">From €12.95</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2>Free shipping</h2>
        <p>
          Orders of €75 or more qualify for free standard shipping to all
          destinations.
        </p>

        <h2>Tracking</h2>
        <p>
          All shipments include tracking. You'll receive your tracking number
          via email once the order ships. You can also view tracking information
          in your{" "}
          <a href="/account/orders" className="text-accent-olive hover:underline">
            account
          </a>.
        </p>

        <h2>Customs and duties</h2>
        <p>
          For international orders outside the EU, customs duties and taxes may
          apply upon delivery. These are the responsibility of the buyer and
          vary by country. We recommend checking with your local customs office
          for details.
        </p>

        <h2>Lost or delayed packages</h2>
        <p>
          If your package hasn't arrived within the estimated delivery window,
          contact us at{" "}
          <a href="mailto:shipping@caseafelt.com" className="text-accent-olive hover:underline">
            shipping@caseafelt.com
          </a>
          . We'll investigate and arrange a replacement or refund if needed.
        </p>
      </div>
    </>
  );
}
