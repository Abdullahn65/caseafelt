import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/** POST /api/admin/products — Create a new product */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      shortDescription,
      description,
      basePrice, // in dollars, e.g. "45.00"
      compareAtPrice,
      status = "DRAFT",
      featured = false,
      collectionIds = [],
      materialIds = [],
      imageUrl,
      variants = [],
    } = body;

    if (!name || !description || !basePrice) {
      return NextResponse.json(
        { error: "Name, description, and base price are required." },
        { status: 400 }
      );
    }

    const priceInCents = Math.round(parseFloat(basePrice) * 100);
    const compareInCents = compareAtPrice
      ? Math.round(parseFloat(compareAtPrice) * 100)
      : null;

    // Generate unique slug
    let slug = slugify(name);
    const existing = await db.product.findUnique({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Date.now().toString(36)}`;
    }

    const product = await db.product.create({
      data: {
        name,
        slug,
        shortDescription: shortDescription || null,
        description,
        basePrice: priceInCents,
        compareAtPrice: compareInCents,
        status,
        featured,
        // Create primary image if provided
        images: imageUrl
          ? {
              create: {
                url: imageUrl,
                altText: name,
                isPrimary: true,
                sortOrder: 0,
              },
            }
          : undefined,
        // Link collections
        collections:
          collectionIds.length > 0
            ? {
                create: collectionIds.map((id: string, i: number) => ({
                  collectionId: id,
                  sortOrder: i,
                })),
              }
            : undefined,
        // Link materials
        materials:
          materialIds.length > 0
            ? {
                create: materialIds.map((id: string) => ({
                  materialId: id,
                })),
              }
            : undefined,
      },
      include: {
        images: true,
        collections: { include: { collection: true } },
      },
    });

    // Create variants if provided
    if (variants.length > 0) {
      for (const v of variants) {
        await db.productVariant.create({
          data: {
            productId: product.id,
            name: v.name,
            sku: v.sku || `${slug}-${slugify(v.name)}-${Date.now().toString(36)}`,
            color: v.color || null,
            colorHex: v.colorHex || null,
            deviceModelId: v.deviceModelId,
            materialId: v.materialId || null,
            price: v.price ? Math.round(parseFloat(v.price) * 100) : null,
            inventoryCount: parseInt(v.inventoryCount) || 25,
            isActive: true,
          },
        });
      }
    }

    return NextResponse.json({ product }, { status: 201 });
  } catch (error: any) {
    console.error("Create product error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create product" },
      { status: 500 }
    );
  }
}
