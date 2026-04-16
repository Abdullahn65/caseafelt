import type { Metadata } from "next";
import Image from "next/image";
import { getContentBlock } from "@/lib/data/products";
import { BreadcrumbNav } from "@/components/storefront/breadcrumb-nav";
import { NewsletterForm } from "@/components/forms/newsletter-form";

export const metadata: Metadata = {
  title: "About",
  description:
    "CaseaFelt was founded on a simple observation: the objects we carry every day should feel as intentional as the spaces we live in.",
};

export default async function AboutPage() {
  const aboutHero = await getContentBlock("about-hero");
  const aboutStory = await getContentBlock("about-story");
  const aboutMaterial = await getContentBlock("about-material");

  return (
    <div className="container-page section-padding">
      <BreadcrumbNav items={[{ label: "About", href: "/about" }]} />

      {/* Hero */}
      <section className="mt-8 text-center max-w-2xl mx-auto">
        <h1 className="text-4xl font-semibold">
          {aboutHero?.title ?? "Designed to be felt"}
        </h1>
        <p className="mt-4 text-lg text-fg-secondary leading-relaxed">
          {aboutHero?.body ??
            "CaseaFelt was founded on a simple observation: the objects we carry every day should feel as intentional as the spaces we live in."}
        </p>
      </section>

      {/* Story */}
      <section className="mt-16 max-w-prose mx-auto space-y-6 text-fg-secondary leading-relaxed">
        <h2 className="text-2xl font-semibold text-fg-primary">
          {aboutStory?.title ?? "Our story"}
        </h2>
        <p>
          {aboutStory?.body ??
            "We began with felt — a material that has protected, insulated, and comforted for thousands of years. We wondered what would happen if we brought that same material intelligence to the device we touch most: the phone. The answer was CaseaFelt."}
        </p>
        <p>
          Every case in our collection starts with premium European wool felt,
          selected for density, hand-feel, and longevity. We pair it with
          plant-tanned leather, organic cotton canvas, and other materials chosen
          for how they age — not how they look on day one.
        </p>
        <p>
          Our design philosophy is simple: protection should be beautiful, and
          beauty should be tactile. No logos on the outside. No unnecessary
          bulk. Just quiet, confident design that gets better with every day
          you carry it.
        </p>
      </section>

      {/* Material image section */}
      <section className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="aspect-[4/3] rounded-lg overflow-hidden bg-bg-secondary">
          <Image
            src={aboutMaterial?.imageUrl ?? "/images/about-material.jpg"}
            alt="CaseaFelt materials close-up"
            width={640}
            height={480}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">
            {aboutMaterial?.title ?? "Material-first design"}
          </h2>
          <p className="text-fg-secondary leading-relaxed">
            {aboutMaterial?.body ??
              "We source our wool felt from mills in Portugal and Germany. Each batch is tested for density, pill resistance, and colorfastness before it enters production. The result is a material that softens with use without losing its structure."}
          </p>
          <p className="text-fg-secondary leading-relaxed">
            Our leather comes from tanneries that use vegetable-based processes,
            producing hides that develop a rich patina over months of use.
            Every scratch tells a story.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="mt-16">
        <h2 className="text-2xl font-semibold text-center mb-8">What we believe</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {[
            {
              title: "Tactile over visual",
              body: "Great design is felt before it's seen. We optimise for hand-feel, weight, and the moment of first touch.",
            },
            {
              title: "Honest materials",
              body: "We use materials that age with grace. No coatings to peel, no prints to fade — just raw quality that improves over time.",
            },
            {
              title: "Quiet confidence",
              body: "No loud branding. No trend-chasing. We design for people who know what they like and don't need to prove it.",
            },
          ].map((value) => (
            <div key={value.title} className="text-center space-y-2">
              <h3 className="text-lg font-medium">{value.title}</h3>
              <p className="text-sm text-fg-secondary leading-relaxed">
                {value.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="mt-16 text-center">
        <h2 className="text-2xl font-semibold">Stay in touch</h2>
        <p className="mt-2 text-fg-secondary">
          New collections, material stories, and quiet updates — no spam, ever.
        </p>
        <div className="mt-6 max-w-md mx-auto">
          <NewsletterForm />
        </div>
      </section>
    </div>
  );
}
