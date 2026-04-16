import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import { sendOrderConfirmation } from "@/lib/email/order-confirmation";
import type Stripe from "stripe";
import type { Prisma } from "@prisma/client";

/**
 * POST /api/webhooks/stripe — handle Stripe webhook events
 *
 * Events handled:
 * - checkout.session.completed → create Order + OrderItems + Payment, decrement stock, clear cart
 */
export async function POST(req: NextRequest) {
  const body = await req.text();
  const headersList = await headers();
  const sig = headersList.get("stripe-signature");

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err: any) {
    console.error("Stripe webhook signature verification failed:", err.message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      await handleCheckoutComplete(event.data.object as Stripe.Checkout.Session);
      break;
    }
    // Future: payment_intent.payment_failed, charge.refunded, etc.
    default:
      console.log(`Unhandled Stripe event: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}

// ─────────────────────────────────────────────────────────────
// Handler: checkout.session.completed
// ─────────────────────────────────────────────────────────────

async function handleCheckoutComplete(session: Stripe.Checkout.Session) {
  const cartId = session.metadata?.cartId;

  if (!cartId) {
    console.error("Stripe checkout session missing cartId metadata");
    return;
  }

  // Prevent duplicate order creation (idempotency check)
  const existingOrder = await db.order.findUnique({
    where: { stripeSessionId: session.id },
  });
  if (existingOrder) {
    console.log(`Order already exists for session ${session.id}`);
    return;
  }

  // Guest email from Stripe checkout
  const customerEmail =
    session.customer_details?.email ??
    session.customer_email ??
    "";

  // Fetch cart with items
  const cart = await db.cart.findUnique({
    where: { id: cartId },
    include: {
      items: {
        include: {
          variant: {
            include: {
              product: { select: { name: true, basePrice: true } },
              deviceModel: { select: { name: true } },
              images: { take: 1, orderBy: { sortOrder: "asc" }, select: { url: true } },
            },
          },
        },
      },
    },
  });

  if (!cart || cart.items.length === 0) {
    console.error(`Cart ${cartId} is empty or not found`);
    return;
  }

  // Build order items from cart
  const orderItems = cart.items.map((item: typeof cart.items[number]) => {
    const unitPrice = item.variant.price ?? item.variant.product.basePrice;
    return {
      variantId: item.variant.id,
      productName: item.variant.product.name,
      variantName: item.variant.name,
      sku: item.variant.sku,
      deviceModel: item.variant.deviceModel?.name ?? "Universal",
      unitPrice,
      quantity: item.quantity,
      totalPrice: unitPrice * item.quantity,
      imageUrl: item.variant.images[0]?.url ?? null,
    };
  });

  const subtotal = orderItems.reduce((sum: number, i: { totalPrice: number }) => sum + i.totalPrice, 0);
  const shippingCost = (session.shipping_cost?.amount_total ?? 0);
  const total = session.amount_total ?? subtotal + shippingCost;

  // Build shipping address snapshot from Stripe
  const stripeAddr = session.shipping_details?.address;
  const shippingAddress = stripeAddr
    ? {
        name: session.shipping_details?.name ?? "",
        line1: stripeAddr.line1 ?? "",
        line2: stripeAddr.line2 ?? "",
        city: stripeAddr.city ?? "",
        state: stripeAddr.state ?? "",
        postalCode: stripeAddr.postal_code ?? "",
        country: stripeAddr.country ?? "",
      }
    : {};

  // Generate order number: CF-YYYYMMDD-XXXX
  const today = new Date();
  const dateStr =
    today.getFullYear().toString() +
    (today.getMonth() + 1).toString().padStart(2, "0") +
    today.getDate().toString().padStart(2, "0");

  const todayOrderCount = await db.order.count({
    where: {
      createdAt: {
        gte: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
      },
    },
  });
  const orderNumber = `CF-${dateStr}-${(todayOrderCount + 1).toString().padStart(4, "0")}`;

  // Create order + items + payment in a transaction
  type TxClient = Omit<typeof db, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">;
  await db.$transaction(async (tx: TxClient) => {
    const order = await tx.order.create({
      data: {
        orderNumber,
        userId: null, // Guest checkout — no user ID
        email: customerEmail,
        status: "CONFIRMED",
        subtotal,
        shipping: shippingCost,
        total,
        shippingAddress,
        stripeSessionId: session.id,
        stripePaymentIntentId:
          typeof session.payment_intent === "string"
            ? session.payment_intent
            : session.payment_intent?.id ?? null,
        items: {
          create: orderItems,
        },
      },
    });

    // Create payment record
    const paymentIntentId =
      typeof session.payment_intent === "string"
        ? session.payment_intent
        : session.payment_intent?.id ?? "";

    if (paymentIntentId) {
      await tx.payment.create({
        data: {
          orderId: order.id,
          stripePaymentIntentId: paymentIntentId,
          amount: total,
          currency: session.currency ?? "usd",
          status: "SUCCEEDED",
          paidAt: new Date(),
        },
      });
    }

    // Decrement inventory for each variant
    for (const item of cart.items) {
      if (item.variant.trackInventory) {
        await tx.productVariant.update({
          where: { id: item.variant.id },
          data: {
            inventoryCount: { decrement: item.quantity },
          },
        });
      }
    }

    // Clear cart items
    await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
  });

  console.log(`Order ${orderNumber} created for session ${session.id}`);

  // Send order confirmation email (fire-and-forget, won't throw)
  if (customerEmail) {
    await sendOrderConfirmation({
      orderNumber,
      customerEmail,
      customerName: session.shipping_details?.name ?? undefined,
      items: orderItems.map((item: { productName: string; variantName: string; quantity: number; unitPrice: number }) => ({
        productName: item.productName,
        variantName: item.variantName,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      })),
      subtotal,
      shippingCost,
      total,
      currency: (session.currency ?? "usd").toUpperCase(),
    });
  }
}
