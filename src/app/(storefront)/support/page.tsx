import type { Metadata } from "next";
import Link from "next/link";
import { HelpCircle, MessageCircle } from "lucide-react";
import { getContentBlock } from "@/lib/data/products";
import { BreadcrumbNav } from "@/components/storefront/breadcrumb-nav";
import { Button } from "@/components/ui/button";
import { FaqAccordion } from "@/components/storefront/faq-accordion";

export const metadata: Metadata = {
  title: "Support",
  description:
    "Find answers to common questions or reach out to the CaseaFelt support team.",
};

const faqCategories = [
  {
    title: "Orders & shipping",
    items: [
      {
        q: "How long does shipping take?",
        a: "Standard shipping takes 5–7 business days within Europe and 7–14 days internationally. Express options are available at checkout.",
      },
      {
        q: "Do you ship internationally?",
        a: "Yes — we ship worldwide. Shipping costs and estimated delivery times are calculated at checkout based on your location.",
      },
      {
        q: "Can I track my order?",
        a: "Absolutely. You'll receive a tracking link via email once your order ships. You can also view tracking info in your account under Orders.",
      },
      {
        q: "Is free shipping available?",
        a: "Orders over €75 qualify for free standard shipping. This applies to all destinations.",
      },
    ],
  },
  {
    title: "Returns & exchanges",
    items: [
      {
        q: "What's your return policy?",
        a: "We accept returns within 30 days of delivery for items in original condition. See our full return policy for details.",
      },
      {
        q: "How do I start a return?",
        a: "Log into your account, navigate to Orders, and select the order you'd like to return. You can also contact us directly.",
      },
      {
        q: "Can I exchange for a different device model?",
        a: "Yes — contact us and we'll arrange an exchange. We'll send you a prepaid return label for the original item.",
      },
    ],
  },
  {
    title: "Products & care",
    items: [
      {
        q: "How do I care for my felt case?",
        a: "Wool felt is naturally dirt-resistant. For light marks, brush gently with a soft lint brush. For deeper cleaning, spot-clean with a damp cloth and mild soap, then air dry flat.",
      },
      {
        q: "Will the felt pill over time?",
        a: "High-quality wool felt may show minimal pilling in high-friction areas during the first few weeks. This settles naturally. You can remove any pills with a fabric shaver.",
      },
      {
        q: "Do your cases provide good protection?",
        a: "Our cases are designed for everyday protection — drops from pocket height, scratches, and bumps. They feature a raised lip around the camera and screen edges. For extreme impact protection, we recommend a dedicated rugged case.",
      },
    ],
  },
];

export default async function SupportPage() {
  const supportHero = await getContentBlock("support-hero");

  return (
    <div className="container-page section-padding">
      <BreadcrumbNav items={[{ label: "Support", href: "/support" }]} />

      {/* Hero */}
      <section className="mt-8 text-center max-w-2xl mx-auto">
        <h1 className="text-4xl font-semibold">
          {supportHero?.title ?? "How can we help?"}
        </h1>
        <p className="mt-4 text-lg text-fg-secondary">
          {supportHero?.body ??
            "Find answers below or reach out to our team directly."}
        </p>
      </section>

      {/* Quick actions */}
      <section className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto">
        <Link
          href="/contact"
          className="flex items-center gap-3 rounded-lg border border-border-default p-4 hover:border-border-strong transition-colors"
        >
          <MessageCircle className="w-5 h-5 text-accent-olive shrink-0" />
          <div>
            <p className="font-medium text-sm">Contact us</p>
            <p className="text-xs text-fg-tertiary">Send us a message</p>
          </div>
        </Link>
        <Link
          href="/account/support"
          className="flex items-center gap-3 rounded-lg border border-border-default p-4 hover:border-border-strong transition-colors"
        >
          <HelpCircle className="w-5 h-5 text-accent-olive shrink-0" />
          <div>
            <p className="font-medium text-sm">Support tickets</p>
            <p className="text-xs text-fg-tertiary">View existing tickets</p>
          </div>
        </Link>
      </section>

      {/* FAQ */}
      <section className="mt-16 max-w-2xl mx-auto">
        <h2 className="text-2xl font-semibold text-center mb-8">
          Frequently asked questions
        </h2>
        <div className="space-y-8">
          {faqCategories.map((category) => (
            <div key={category.title}>
              <h3 className="text-label mb-4">{category.title}</h3>
              <FaqAccordion items={category.items} />
            </div>
          ))}
        </div>
      </section>

      {/* Still need help? */}
      <section className="mt-16 text-center">
        <p className="text-fg-secondary">
          Still need help?{" "}
          <Link href="/contact" className="text-accent-olive hover:underline font-medium">
            Get in touch
          </Link>
        </p>
      </section>
    </div>
  );
}
