import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/** POST /api/admin/products/[id]/duplicate — Duplicate a product with all its data */
export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Fetch the original product with all relations
    const original = await db.product.findUnique({
      where: { id },
      include: {
        images: { orderBy: { sortOrder: "asc" } },
        variants: true,
        collections: true,
        materials: true,
      },
    });

    if (!original) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Generate unique slug
    let slug = slugify(`${original.name} copy`);
    const existing = await db.product.findUnique({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Date.now().toString(36)}`;
    }

    // Create the duplicate product
    const duplicate = await db.product.create({
      data: {
        name: `${original.name} (Copy)`,
        slug,
        shortDescription: original.shortDescription,
        description: original.description,
        basePrice: original.basePrice,
        compareAtPrice: original.compareAtPrice,
        status: "DRAFT", // Always start as draft
        featured: false,
        seoTitle: original.seoTitle,
        seoDescription: original.seoDescription,
        // Duplicate images
        images:
          original.images.length > 0
            ? {
                create: original.images.map((img: any) => ({
                  url: img.url,
                  publicId: null,
                  altText: img.altText,
                  isPrimary: img.isPrimary,
                  sortOrder: img.sortOrder,
                })),
              }
            : undefined,
        // Duplicate collection links
        collections:
          original.collections.length > 0
            ? {
                create: original.collections.map((cp: any) => ({
                  collectionId: cp.collectionId,
                  sortOrder: cp.sortOrder,
                })),
              }
            : undefined,
        // Duplicate material links
        materials:
          original.materials.length > 0
            ? {
                create: original.materials.map((pm: any) => ({
                  materialId: pm.materialId,
                })),
              }
            : undefined,
      },
    });

    // Duplicate variants
    if (original.variants.length > 0) {
      for (const v of original.variants) {
        await db.productVariant.create({
          data: {
            productId: duplicate.id,
            name: v.name,
            sku: `${slug}-${slugify(v.name)}-${Date.now().toString(36)}`,
            color: v.color,
            colorHex: v.colorHex,
            deviceModelId: v.deviceModelId,
            materialId: v.materialId,
            price: v.price,
            inventoryCount: v.inventoryCount,
            trackInventory: v.trackInventory,
            isActive: v.isActive,
          },
        });
      }
    }

    return NextResponse.json({ product: duplicate }, { status: 201 });
  } catch (error: any) {
    console.error("Duplicate product error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to duplicate product" },
      { status: 500 }
    );
  }
}
