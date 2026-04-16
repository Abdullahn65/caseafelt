import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { getCollectionBySlug, getProducts, getDeviceModelsForCollection } from "@/lib/data";
import { ProductCard } from "@/components/storefront/product-card";
import { BreadcrumbNav } from "@/components/storefront/breadcrumb-nav";
import { CollectionJsonLd, BreadcrumbJsonLd } from "@/components/seo/json-ld";

interface CollectionPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ device?: string; sort?: string }>;
}

export async function generateMetadata({ params }: CollectionPageProps): Promise<Metadata> {
  const { slug } = await params;
  const collection = await getCollectionBySlug(slug);
  if (!collection) return { title: "Collection Not Found" };

  return {
    title: collection.seoTitle || collection.name,
    description: collection.seoDescription || collection.description || `Shop the ${collection.name} collection at CaseaFelt.`,
  };
}

export default async function CollectionPage({ params, searchParams }: CollectionPageProps) {
  const { slug } = await params;
  const { device, sort } = await searchParams;

  const collection = await getCollectionBySlug(slug);
  if (!collection) notFound();

  const [products, deviceModels] = await Promise.all([
    getProducts({
      collectionSlug: slug,
      deviceSlug: device,
      orderBy: sort as "newest" | "price-asc" | "price-desc" | undefined,
    }),
    getDeviceModelsForCollection(slug),
  ]);

  return (
    <>
      <CollectionJsonLd
        name={collection.name}
        description={collection.description ?? `Shop the ${collection.name} collection at CaseaFelt.`}
        slug={collection.slug}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Collections", url: "/collections" },
          { name: collection.name, url: `/collections/${collection.slug}` },
        ]}
      />

      {/* Breadcrumb */}
      <div className="container-page">
        <BreadcrumbNav
          items={[
            { label: "Home", href: "/" },
            { label: "Collections", href: "/collections" },
            { label: collection.name },
          ]}
        />
      </div>

      {/* Collection Header */}
      <section className="relative">
        <div className="relative aspect-[21/9] md:aspect-[3/1] bg-bg-secondary overflow-hidden">
          {collection.imageUrl ? (
            <Image
              src={collection.imageUrl}
              alt={collection.name}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          ) : (
            <div className="h-full w-full bg-bg-tertiary" />
          )}
          <div className="absolute inset-0 bg-black/30" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
            <p className="text-xs font-medium uppercase tracking-widest text-white/80">
              Collection
            </p>
            <h1 className="mt-2 text-3xl md:text-4xl font-semibold text-white">
              {collection.name}
            </h1>
            {collection.description && (
              <p className="mt-2 text-base text-white/80 max-w-lg">
                {collection.description}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Filter Bar + Product Grid */}
      <section className="section-padding">
        <div className="container-page">
          {/* Filter bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              {/* Device filter */}
              <select
                defaultValue={device ?? ""}
                className="h-9 rounded-md border border-border-default bg-white px-3 text-sm text-fg-primary"
                aria-label="Filter by device"
              >
                <option value="">All devices</option>
                {deviceModels.map((dm: { id: string; slug: string; name: string }) => (
                  <option key={dm.id} value={dm.slug}>
                    {dm.name}
                  </option>
                ))}
              </select>

              {/* Sort */}
              <select
                defaultValue={sort ?? "newest"}
                className="h-9 rounded-md border border-border-default bg-white px-3 text-sm text-fg-primary"
                aria-label="Sort products"
              >
                <option value="newest">Newest</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>

            <p className="text-sm text-fg-secondary">
              {products.length} {products.length === 1 ? "product" : "products"}
            </p>
          </div>

          {/* Product Grid */}
          {products.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 sm:gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center">
              <p className="text-lg text-fg-secondary">
                No products found{device ? " for this device" : ""}.
              </p>
              <p className="mt-2 text-sm text-fg-tertiary">
                Try adjusting your filters or check back soon.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
