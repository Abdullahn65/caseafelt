import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getProducts, getCollections, getContentBlock } from "@/lib/data";
import { ProductCard } from "@/components/storefront/product-card";
import { CollectionCard } from "@/components/storefront/collection-card";
import { TrustStrip } from "@/components/storefront/trust-strip";
import { Button } from "@/components/ui/button";
import { OrganizationJsonLd, WebSiteJsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "CaseaFelt — Phone Cases Designed to Be Felt",
  description:
    "Premium phone cases crafted from real felt materials. Tactile, minimal, honest design.",
};

export default async function HomePage() {
  const [featuredProducts, collections, heroBlock, materialBlock] =
    await Promise.all([
      getProducts({ featured: true, limit: 4 }),
      getCollections(),
      getContentBlock("homepage-hero"),
      getContentBlock("material-story"),
    ]);

  return (
    <>
      <OrganizationJsonLd />
      <WebSiteJsonLd />

      {/* ── HERO SECTION ─────────────────────────────────── */}
      <section className="relative">
        <div className="relative aspect-[16/9] md:aspect-[21/9] bg-bg-secondary overflow-hidden">
          {heroBlock?.imageUrl ? (
            <Image
              src={heroBlock.imageUrl}
              alt={heroBlock.title ?? "CaseaFelt hero"}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-bg-tertiary to-bg-secondary" />
          )}
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
            <h1 className="text-4xl md:text-5xl font-semibold text-white max-w-2xl">
              {heroBlock?.title ?? "Felt in hand."}
            </h1>
            {heroBlock?.body && (
              <p className="mt-3 text-lg text-white/80 max-w-lg">
                {heroBlock.body}
              </p>
            )}
            <div className="mt-6">
              <Link href={heroBlock?.linkUrl ?? "/collections"}>
                <Button variant="primary" size="lg">
                  {heroBlock?.linkText ?? "Shop the collection"}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── TRUST STRIP ──────────────────────────────────── */}
      <TrustStrip />

      {/* ── MATERIAL STORY SECTION ───────────────────────── */}
      {materialBlock && (
        <section className="section-padding">
          <div className="container-page">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              {/* Image */}
              <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-bg-secondary">
                {materialBlock.imageUrl ? (
                  <Image
                    src={materialBlock.imageUrl}
                    alt="Material close-up"
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-bg-tertiary" />
                )}
              </div>
              {/* Text */}
              <div>
                <p className="text-label">The Material</p>
                <h2 className="mt-2 text-3xl font-semibold">
                  {materialBlock.title ?? "Designed to be felt, not just seen."}
                </h2>
                {materialBlock.body && (
                  <p className="mt-4 text-lg text-fg-secondary leading-relaxed">
                    {materialBlock.body}
                  </p>
                )}
                {materialBlock.linkUrl && (
                  <div className="mt-6">
                    <Link href={materialBlock.linkUrl}>
                      <Button variant="secondary">
                        {materialBlock.linkText ?? "Learn more"}
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── FEATURED PRODUCTS ────────────────────────────── */}
      {featuredProducts.length > 0 && (
        <section className="section-padding bg-bg-secondary/30">
          <div className="container-page">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-semibold">Featured</h2>
              <Link
                href="/products"
                className="text-sm font-medium text-fg-secondary hover:text-fg-primary transition-colors"
              >
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── COLLECTION PREVIEWS ──────────────────────────── */}
      {collections.length > 0 && (
        <section className="section-padding">
          <div className="container-page">
            <h2 className="text-2xl font-semibold mb-8">Collections</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {collections.slice(0, 3).map((collection) => (
                <CollectionCard key={collection.id} collection={collection} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
