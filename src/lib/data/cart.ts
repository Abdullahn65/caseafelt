import { db } from "@/lib/db";
import { cookies } from "next/headers";
import { getCurrentUser } from "@/lib/auth";

// ─────────────────────────────────────────────────────────────
// Cart Queries
// ─────────────────────────────────────────────────────────────

const CART_SESSION_COOKIE = "caseafelt_cart_session";

const cartInclude = {
  items: {
    include: {
      variant: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              slug: true,
              basePrice: true,
            },
          },
          deviceModel: {
            select: { name: true },
          },
          images: {
            where: { isPrimary: true },
            take: 1,
            select: { url: true, altText: true },
          },
        },
      },
    },
    orderBy: { addedAt: "asc" as const },
  },
} as const;

/**
 * Get or create a cart for the current user/session.
 * 
 * - Authenticated: cart linked to user
 * - Guest: cart linked to session cookie
 * - Login triggers merge (handled separately in cart actions)
 */
export async function getOrCreateCart() {
  const user = await getCurrentUser();
  const cookieStore = await cookies();

  // Authenticated user — find or create by userId
  if (user) {
    let cart = await db.cart.findUnique({
      where: { userId: user.id },
      include: cartInclude,
    });

    if (!cart) {
      cart = await db.cart.create({
        data: { userId: user.id },
        include: cartInclude,
      });
    }

    return cart;
  }

  // Guest — find or create by sessionId cookie
  let sessionId = cookieStore.get(CART_SESSION_COOKIE)?.value;

  if (sessionId) {
    const cart = await db.cart.findUnique({
      where: { sessionId },
      include: cartInclude,
    });

    if (cart) return cart;
  }

  // No existing cart — create new one with a fresh session ID
  sessionId = crypto.randomUUID();
  cookieStore.set(CART_SESSION_COOKIE, sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: "/",
  });

  return db.cart.create({
    data: { sessionId },
    include: cartInclude,
  });
}

/** Get cart without creating one (for display purposes, like cart count) */
export async function getCart() {
  const user = await getCurrentUser();
  const cookieStore = await cookies();

  if (user) {
    return db.cart.findUnique({
      where: { userId: user.id },
      include: cartInclude,
    });
  }

  const sessionId = cookieStore.get(CART_SESSION_COOKIE)?.value;
  if (!sessionId) return null;

  return db.cart.findUnique({
    where: { sessionId },
    include: cartInclude,
  });
}

/** Get cart item count (for header badge) */
export async function getCartItemCount(): Promise<number> {
  const cart = await getCart();
  if (!cart) return 0;
  return cart.items.reduce((sum, item) => sum + item.quantity, 0);
}

/**
 * Merge guest cart into user cart on login.
 * 
 * Rules (from Phase 2):
 * - If item exists in both, keep the higher quantity
 * - Guest cart is deleted after merge
 */
export async function mergeGuestCartIntoUserCart(userId: string) {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(CART_SESSION_COOKIE)?.value;
  if (!sessionId) return;

  const guestCart = await db.cart.findUnique({
    where: { sessionId },
    include: { items: true },
  });

  if (!guestCart || guestCart.items.length === 0) return;

  // Find or create user cart
  let userCart = await db.cart.findUnique({
    where: { userId },
    include: { items: true },
  });

  if (!userCart) {
    userCart = await db.cart.create({
      data: { userId },
      include: { items: true },
    });
  }

  // Merge items
  for (const guestItem of guestCart.items) {
    const existingItem = userCart.items.find(
      (item) => item.variantId === guestItem.variantId
    );

    if (existingItem) {
      // Keep the higher quantity
      if (guestItem.quantity > existingItem.quantity) {
        await db.cartItem.update({
          where: { id: existingItem.id },
          data: { quantity: guestItem.quantity },
        });
      }
    } else {
      // Move item to user cart
      await db.cartItem.create({
        data: {
          cartId: userCart.id,
          variantId: guestItem.variantId,
          quantity: guestItem.quantity,
        },
      });
    }
  }

  // Delete guest cart
  await db.cart.delete({ where: { id: guestCart.id } });

  // Clear session cookie
  cookieStore.delete(CART_SESSION_COOKIE);
}
