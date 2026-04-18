import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

/** GET /api/admin/products/[id] — Get single product for editing */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const product = await db.product.findUnique({
    where: { id },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      variants: {
        include: { deviceModel: true, material: true },
        orderBy: { createdAt: "asc" },
      },
      collections: { include: { collection: true } },
      materials: { include: { material: true } },
    },
  });

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  return NextResponse.json({ product });
}

/** PUT /api/admin/products/[id] — Update a product */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const {
      name,
      shortDescription,
      description,
      basePrice,
      compareAtPrice,
      status,
      featured,
      collectionIds,
      materialIds,
      imageUrl,
    } = body;

    const data: Record<string, any> = {};
    if (name !== undefined) data.name = name;
    if (shortDescription !== undefined)
      data.shortDescription = shortDescription || null;
    if (description !== undefined) data.description = description;
    if (basePrice !== undefined)
      data.basePrice = Math.round(parseFloat(basePrice) * 100);
    if (compareAtPrice !== undefined)
      data.compareAtPrice = compareAtPrice
        ? Math.round(parseFloat(compareAtPrice) * 100)
        : null;
    if (status !== undefined) data.status = status;
    if (featured !== undefined) data.featured = featured;

    const product = await db.product.update({
      where: { id },
      data,
    });

    // Update primary image if provided
    if (imageUrl !== undefined) {
      const existingPrimary = await db.productImage.findFirst({
        where: { productId: id, isPrimary: true },
      });
      if (existingPrimary) {
        await db.productImage.update({
          where: { id: existingPrimary.id },
          data: { url: imageUrl, altText: name || product.name },
        });
      } else {
        await db.productImage.create({
          data: {
            productId: id,
            url: imageUrl,
            altText: name || product.name,
            isPrimary: true,
            sortOrder: 0,
          },
        });
      }
    }

    // Update collections if provided
    if (collectionIds !== undefined) {
      await db.collectionProduct.deleteMany({ where: { productId: id } });
      if (collectionIds.length > 0) {
        await db.collectionProduct.createMany({
          data: collectionIds.map((cid: string, i: number) => ({
            collectionId: cid,
            productId: id,
            sortOrder: i,
          })),
        });
      }
    }

    // Update materials if provided
    if (materialIds !== undefined) {
      await db.productMaterial.deleteMany({ where: { productId: id } });
      if (materialIds.length > 0) {
        await db.productMaterial.createMany({
          data: materialIds.map((mid: string) => ({
            productId: id,
            materialId: mid,
          })),
        });
      }
    }

    return NextResponse.json({ product });
  } catch (error: any) {
    console.error("Update product error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update product" },
      { status: 500 }
    );
  }
}

/** DELETE /api/admin/products/[id] — Delete a product */
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await db.product.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Delete product error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete product" },
      { status: 500 }
    );
  }
}
