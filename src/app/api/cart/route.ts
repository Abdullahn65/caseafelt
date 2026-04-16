import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getOrCreateCart } from "@/lib/data/cart";
import {
  addToCartSchema,
  updateCartItemSchema,
  removeCartItemSchema,
} from "@/lib/validations/cart";

/** POST /api/cart — add item to cart */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = addToCartSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { variantId, quantity } = parsed.data;

    // Verify variant exists and has stock
    const variant = await db.productVariant.findUnique({
      where: { id: variantId, isActive: true },
    });

    if (!variant) {
      return NextResponse.json({ error: "Variant not found" }, { status: 404 });
    }

    if (variant.inventoryCount < quantity) {
      return NextResponse.json({ error: "Insufficient stock" }, { status: 400 });
    }

    const cart = await getOrCreateCart();

    // Upsert cart item
    const existingItem = await db.cartItem.findFirst({
      where: { cartId: cart.id, variantId },
    });

    if (existingItem) {
      await db.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
      });
    } else {
      await db.cartItem.create({
        data: { cartId: cart.id, variantId, quantity },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message ?? "Failed to add to cart" },
      { status: 500 }
    );
  }
}

/** PATCH /api/cart — update item quantity */
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = updateCartItemSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { cartItemId, quantity } = parsed.data;

    await db.cartItem.update({
      where: { id: cartItemId },
      data: { quantity },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message ?? "Failed to update cart" },
      { status: 500 }
    );
  }
}

/** DELETE /api/cart — remove item from cart */
export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = removeCartItemSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    await db.cartItem.delete({
      where: { id: parsed.data.cartItemId },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message ?? "Failed to remove item" },
      { status: 500 }
    );
  }
}
