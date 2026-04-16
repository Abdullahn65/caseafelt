import { NextRequest, NextResponse } from "next/server";
import { getCart } from "@/lib/data/cart";
import { stripe } from "@/lib/stripe";

/** POST /api/checkout — create Stripe Checkout session (guest-friendly) */
export async function POST(_req: NextRequest) {
  try {
    const cart = await getCart();

    if (!cart || cart.items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    const lineItems = cart.items.map((item: any) => {
      const unitPrice = item.variant.price ?? item.variant.product.basePrice;
      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: item.variant.product.name,
            description: [
              item.variant.deviceModel?.name,
              item.variant.color,
            ]
              .filter(Boolean)
              .join(" · "),
            images: item.variant.images?.[0]?.url
              ? [item.variant.images[0].url]
              : [],
          },
          unit_amount: unitPrice,
        },
        quantity: item.quantity,
      };
    });

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      // Collect customer email (no login needed)
      customer_creation: "if_required",
      shipping_address_collection: {
        allowed_countries: [
          "US",
          "GB",
          "DE",
          "FR",
          "NL",
          "BE",
          "AT",
          "CH",
          "IT",
          "ES",
          "PT",
          "SE",
          "DK",
          "NO",
          "FI",
          "IE",
          "CA",
          "AU",
        ],
      },
      metadata: {
        cartId: cart.id,
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cart`,
    });

    return NextResponse.redirect(session.url!, 303);
  } catch (error: any) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: error.message ?? "Checkout failed" },
      { status: 500 }
    );
  }
}
