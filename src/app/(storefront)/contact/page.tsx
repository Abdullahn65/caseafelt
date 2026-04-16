import type { Metadata } from "next";
import { BreadcrumbNav } from "@/components/storefront/breadcrumb-nav";
import { ContactForm } from "@/components/forms/contact-form";
import { Mail, MapPin, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with the CaseaFelt team. We're here to help with orders, products, and general inquiries.",
};

export default function ContactPage() {
  return (
    <div className="container-page section-padding">
      <BreadcrumbNav items={[{ label: "Contact", href: "/contact" }]} />

      <div className="mt-8 max-w-2xl">
        <h1 className="text-4xl font-semibold">Get in touch</h1>
        <p className="mt-4 text-lg text-fg-secondary">
          Have a question about your order, a product, or just want to say
          hello? We'd love to hear from you.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Form */}
        <div className="lg:col-span-2">
          <ContactForm />
        </div>

        {/* Sidebar */}
        <aside className="space-y-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-fg-primary">
              <Mail className="w-4 h-4" />
              <h3 className="font-medium">Email</h3>
            </div>
            <p className="text-sm text-fg-secondary">
              <a
                href="mailto:hello@caseafelt.com"
                className="hover:underline"
              >
                hello@caseafelt.com
              </a>
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-fg-primary">
              <Clock className="w-4 h-4" />
              <h3 className="font-medium">Response time</h3>
            </div>
            <p className="text-sm text-fg-secondary">
              We typically reply within 24 hours on business days.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-fg-primary">
              <MapPin className="w-4 h-4" />
              <h3 className="font-medium">Based in</h3>
            </div>
            <p className="text-sm text-fg-secondary">
              Europe — shipping worldwide.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
