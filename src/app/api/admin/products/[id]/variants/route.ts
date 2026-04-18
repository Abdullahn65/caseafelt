import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

/** POST /api/admin/products/[id]/variants — Add variant to a product */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: productId } = await params;
    const body = await req.json();
    const {
      name,
      sku,
      color,
      colorHex,
      deviceModelId,
      materialId,
      price,
      inventoryCount = 25,
    } = body;

    if (!name || !deviceModelId) {
      return NextResponse.json(
        { error: "Name and device model are required." },
        { status: 400 }
      );
    }

    const product = await db.product.findUnique({ where: { id: productId } });
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const generatedSku =
      sku || `${product.slug}-${name.toLowerCase().replace(/\s+/g, "-")}-${Date.now().toString(36)}`;

    const variant = await db.productVariant.create({
      data: {
        productId,
        name,
        sku: generatedSku,
        color: color || null,
        colorHex: colorHex || null,
        deviceModelId,
        materialId: materialId || null,
        price: price ? Math.round(parseFloat(price) * 100) : null,
        inventoryCount: parseInt(inventoryCount) || 25,
        isActive: true,
      },
      include: { deviceModel: true, material: true },
    });

    return NextResponse.json({ variant }, { status: 201 });
  } catch (error: any) {
    console.error("Create variant error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create variant" },
      { status: 500 }
    );
  }
}
