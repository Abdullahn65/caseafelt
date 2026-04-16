import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { getProductBySlug, getProductReviewStats, getRelatedProducts } from "@/lib/data";
import { ProductCard } from "@/components/storefront/product-card";
import { ReviewCard, ReviewSummary } from "@/components/storefront/review-card";
import { BreadcrumbNav } from "@/components/storefront/breadcrumb-nav";
import { ProductInfo } from "@/components/storefront/product-info";
import { ProductJsonLd, BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { formatPrice } from "@/lib/utils";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product Not Found" };

  return {
    title: product.seoTitle || product.name,
    description: product.seoDescription || product.shortDescription || `${product.name} — premium felt phone case by CaseaFelt.`,
    openGraph: {
      images: product.images[0] ? [{ url: product.images[0].url }] : [],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const [reviewStats, relatedProducts] = await Promise.all([
    getProductReviewStats(product.id),
    getRelatedProducts(product.id),
  ]);

  const collectionName = product.collections[0]?.collection.name;
  const collectionSlug = product.collections[0]?.collection.slug;

  return (
    <>
      {/* Breadcrumb */}
      <div className="container-page">
        <BreadcrumbNav
          items={[
            { label: "Home", href: "/" },
            ...(collectionName && collectionSlug
              ? [{ label: collectionName, href: `/collections/${collectionSlug}` }]
              : []),
            { label: product.name },
          ]}
        />
      </div>

      {/* Product Top — Gallery + Info */}
      <section className="container-page pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Gallery */}
          <div>
            {/* Main Image */}
            <div className="relative aspect-[4/5] rounded-lg overflow-hidden bg-bg-secondary">
              {product.images[0] ? (
                <Image
                  src={product.images[0].url}
                  alt={product.images[0].altText || product.name}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-fg-tertiary">
                  No image
                </div>
              )}
            </div>
            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="mt-4 grid grid-cols-4 gap-3">
                {product.images.slice(0, 4).map((img) => (
                  <div
                    key={img.id}
                    className="relative aspect-square rounded-md overflow-hidden bg-bg-secondary border border-border-default cursor-pointer hover:border-border-strong transition-colors"
                  >
                    <Image
                      src={img.url}
                      alt={img.altText || ""}
                      fill
                      sizes="120px"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info — client component for variant selection */}
          <ProductInfo product={product} />
        </div>
      </section>

      {/* Product Story — below fold editorial */}
      <section className="section-padding bg-bg-secondary/30">
        <div className="container-page">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {product.images[1] && (
              <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
                <Image
                  src={product.images[1].url}
                  alt={product.images[1].altText || "Material detail"}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            )}
            <div>
              <p className="text-label">The Material</p>
              <h2 className="mt-2 text-2xl font-semibold">
                Crafted from real felt.
              </h2>
              <div className="mt-4 space-y-3 text-fg-secondary">
                <p>{product.description}</p>
              </div>
              {product.materials.length > 0 && (
                <div className="mt-6 space-y-2">
                  {product.materials.map((pm) => (
                    <div key={pm.material.id}>
                      <p className="text-sm font-medium">{pm.material.name}</p>
                      {pm.material.careInstructions && (
                        <p className="text-sm text-fg-tertiary">
                          Care: {pm.material.careInstructions}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Reviews */}
      {reviewStats.totalReviews > 0 && (
        <section className="section-padding">
          <div className="container-page">
            <h2 className="text-2xl font-semibold mb-6">Customer Reviews</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <ReviewSummary
                averageRating={reviewStats.averageRating}
                totalReviews={reviewStats.totalReviews}
                distribution={reviewStats.distribution}
              />
              <div className="lg:col-span-2 space-y-6">
                {product.reviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="section-padding bg-bg-secondary/30">
          <div className="container-page">
            <h2 className="text-2xl font-semibold mb-8">
              {collectionName ? `From the ${collectionName} collection` : "You might also like"}
            </h2>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 sm:gap-6">
              {relatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Structured Data */}
      <ProductJsonLd
        name={product.name}
        description={product.shortDescription || product.description || ""}
        slug={product.slug}
        imageUrl={product.images[0]?.url}
        price={product.basePrice}
        inStock={product.variants.some((v: { inventoryCount: number }) => v.inventoryCount > 0)}
        rating={
          reviewStats.totalReviews > 0
            ? { average: reviewStats.averageRating, count: reviewStats.totalReviews }
            : undefined
        }
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          ...(collectionName && collectionSlug
            ? [{ name: collectionName, url: `/collections/${collectionSlug}` }]
            : []),
          { name: product.name, url: `/products/${product.slug}` },
        ]}
      />
    </>
  );
}
