import { db } from "@/lib/db";
import type { Prisma } from "@prisma/client";

// ─────────────────────────────────────────────────────────────
// Products
// ─────────────────────────────────────────────────────────────

/** Standard includes for product cards (list views) */
const productCardInclude = {
  images: {
    where: { isPrimary: true },
    take: 1,
  },
  collections: {
    include: { collection: { select: { name: true, slug: true } } },
    take: 1,
  },
} satisfies Prisma.ProductInclude;

/** Full product includes for PDP */
const productFullInclude = {
  images: { orderBy: [{ isPrimary: "desc" as const }, { sortOrder: "asc" as const }] },
  variants: {
    where: { isActive: true },
    include: {
      deviceModel: true,
      material: true,
      images: { orderBy: { sortOrder: "asc" as const } },
    },
    orderBy: { createdAt: "asc" as const },
  },
  collections: {
    include: { collection: { select: { id: true, name: true, slug: true } } },
  },
  materials: {
    include: { material: true },
  },
  reviews: {
    where: { isApproved: true },
    orderBy: { createdAt: "desc" as const },
    take: 6,
    select: {
      id: true,
      rating: true,
      title: true,
      body: true,
      authorName: true,
      isVerifiedPurchase: true,
      createdAt: true,
    },
  },
} satisfies Prisma.ProductInclude;

/** Get active products for storefront (card view) */
export async function getProducts(options?: {
  featured?: boolean;
  limit?: number;
  collectionSlug?: string;
  deviceSlug?: string;
  orderBy?: "newest" | "price-asc" | "price-desc";
}) {
  const { featured, limit, collectionSlug, deviceSlug, orderBy = "newest" } = options ?? {};

  const where: Prisma.ProductWhereInput = {
    status: "ACTIVE",
  };

  if (featured !== undefined) {
    where.featured = featured;
  }

  if (collectionSlug) {
    where.collections = {
      some: {
        collection: { slug: collectionSlug, status: "PUBLISHED" },
      },
    };
  }

  if (deviceSlug) {
    where.variants = {
      some: {
        isActive: true,
        deviceModel: { slug: deviceSlug, isActive: true },
      },
    };
  }

  const orderByClause: Prisma.ProductOrderByWithRelationInput =
    orderBy === "price-asc"
      ? { basePrice: "asc" }
      : orderBy === "price-desc"
        ? { basePrice: "desc" }
        : { createdAt: "desc" };

  return db.product.findMany({
    where,
    include: productCardInclude,
    orderBy: orderByClause,
    ...(limit ? { take: limit } : {}),
  });
}

/** Get a single product by slug (PDP) */
export async function getProductBySlug(slug: string) {
  return db.product.findUnique({
    where: { slug, status: "ACTIVE" },
    include: productFullInclude,
  });
}

/** Get review aggregate for a product */
export async function getProductReviewStats(productId: string) {
  const [stats, distribution] = await Promise.all([
    db.review.aggregate({
      where: { productId, isApproved: true },
      _avg: { rating: true },
      _count: { id: true },
    }),
    db.review.groupBy({
      by: ["rating"],
      where: { productId, isApproved: true },
      _count: { id: true },
    }),
  ]);

  const dist: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  for (const d of distribution) {
    dist[d.rating] = d._count.id;
  }

  return {
    averageRating: stats._avg.rating ?? 0,
    totalReviews: stats._count.id,
    distribution: dist,
  };
}

/** Get related products (same collection, excluding current) */
export async function getRelatedProducts(productId: string, limit = 4) {
  // First get the product's collection IDs
  const product = await db.product.findUnique({
    where: { id: productId },
    select: {
      collections: { select: { collectionId: true } },
    },
  });

  if (!product || product.collections.length === 0) return [];

  const collectionIds = product.collections.map((c) => c.collectionId);

  return db.product.findMany({
    where: {
      id: { not: productId },
      status: "ACTIVE",
      collections: {
        some: { collectionId: { in: collectionIds } },
      },
    },
    include: productCardInclude,
    take: limit,
    orderBy: { createdAt: "desc" },
  });
}

// ─────────────────────────────────────────────────────────────
// Collections
// ─────────────────────────────────────────────────────────────

/** Get all published collections */
export async function getCollections() {
  return db.collection.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { sortOrder: "asc" },
  });
}

/** Get a single collection by slug */
export async function getCollectionBySlug(slug: string) {
  return db.collection.findUnique({
    where: { slug, status: "PUBLISHED" },
  });
}

// ─────────────────────────────────────────────────────────────
// Device Models
// ─────────────────────────────────────────────────────────────

/** Get all active device models, grouped by brand/family */
export async function getDeviceModels() {
  return db.deviceModel.findMany({
    where: { isActive: true },
    orderBy: [{ brand: "asc" }, { sortOrder: "asc" }, { name: "asc" }],
  });
}

/** Get device models that have active variants for a specific product */
export async function getDeviceModelsForProduct(productId: string) {
  const variants = await db.productVariant.findMany({
    where: { productId, isActive: true },
    select: { deviceModelId: true },
    distinct: ["deviceModelId"],
  });

  const deviceModelIds = variants.map((v) => v.deviceModelId);

  return db.deviceModel.findMany({
    where: { id: { in: deviceModelIds }, isActive: true },
    orderBy: [{ brand: "asc" }, { sortOrder: "asc" }],
  });
}

/** Get device models that have active variants in a collection */
export async function getDeviceModelsForCollection(collectionSlug: string) {
  const variants = await db.productVariant.findMany({
    where: {
      isActive: true,
      product: {
        status: "ACTIVE",
        collections: {
          some: { collection: { slug: collectionSlug } },
        },
      },
    },
    select: { deviceModelId: true },
    distinct: ["deviceModelId"],
  });

  const deviceModelIds = variants.map((v) => v.deviceModelId);

  return db.deviceModel.findMany({
    where: { id: { in: deviceModelIds }, isActive: true },
    orderBy: [{ brand: "asc" }, { sortOrder: "asc" }],
  });
}

// ─────────────────────────────────────────────────────────────
// Content Blocks
// ─────────────────────────────────────────────────────────────

/** Get a published content block by key */
export async function getContentBlock(key: string) {
  return db.contentBlock.findUnique({
    where: { key, status: "PUBLISHED" },
  });
}

/** Get multiple content blocks by key prefix */
export async function getContentBlocksByPrefix(prefix: string) {
  return db.contentBlock.findMany({
    where: {
      key: { startsWith: prefix },
      status: "PUBLISHED",
    },
    orderBy: { key: "asc" },
  });
}

// ─────────────────────────────────────────────────────────────
// Materials
// ─────────────────────────────────────────────────────────────

/** Get all materials */
export async function getMaterials() {
  return db.material.findMany({
    orderBy: { name: "asc" },
  });
}
