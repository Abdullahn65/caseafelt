/**
 * JSON-LD structured data components for SEO.
 *
 * Outputs <script type="application/ld+json"> tags for Google rich results.
 */

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://caseafelt.com";
const BRAND_NAME = "CaseaFelt";

// ─────────────────────────────────────────────────────────────
// Organization (used on homepage)
// ─────────────────────────────────────────────────────────────

export function OrganizationJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: BRAND_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    sameAs: [],
    contactPoint: {
      "@type": "ContactPoint",
      email: "hello@caseafelt.com",
      contactType: "customer service",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// ─────────────────────────────────────────────────────────────
// WebSite (sitelinks search box)
// ─────────────────────────────────────────────────────────────

export function WebSiteJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: BRAND_NAME,
    url: SITE_URL,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// ─────────────────────────────────────────────────────────────
// Product
// ─────────────────────────────────────────────────────────────

interface ProductJsonLdProps {
  name: string;
  description: string;
  slug: string;
  imageUrl?: string;
  price: number; // in cents
  currency?: string;
  sku?: string;
  inStock?: boolean;
  rating?: {
    average: number;
    count: number;
  };
}

export function ProductJsonLd({
  name,
  description,
  slug,
  imageUrl,
  price,
  currency = "USD",
  sku,
  inStock = true,
  rating,
}: ProductJsonLdProps) {
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    url: `${SITE_URL}/products/${slug}`,
    brand: {
      "@type": "Brand",
      name: BRAND_NAME,
    },
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/products/${slug}`,
      priceCurrency: currency,
      price: (price / 100).toFixed(2),
      availability: inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: BRAND_NAME,
      },
    },
  };

  if (imageUrl) {
    data.image = imageUrl;
  }

  if (sku) {
    data.sku = sku;
  }

  if (rating && rating.count > 0) {
    data.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: rating.average.toFixed(1),
      reviewCount: rating.count,
    };
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// ─────────────────────────────────────────────────────────────
// BreadcrumbList
// ─────────────────────────────────────────────────────────────

interface BreadcrumbItem {
  name: string;
  url: string;
}

export function BreadcrumbJsonLd({ items }: { items: BreadcrumbItem[] }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${SITE_URL}${item.url}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// ─────────────────────────────────────────────────────────────
// CollectionPage
// ─────────────────────────────────────────────────────────────

export function CollectionJsonLd({
  name,
  description,
  slug,
}: {
  name: string;
  description: string;
  slug: string;
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    description,
    url: `${SITE_URL}/collections/${slug}`,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
