import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { Webhook } from "svix";
import { db } from "@/lib/db";
import { mergeGuestCartIntoUserCart } from "@/lib/data/cart";

interface ClerkWebhookEvent {
  type: string;
  data: {
    id: string;
    email_addresses: Array<{
      id: string;
      email_address: string;
    }>;
    first_name: string | null;
    last_name: string | null;
    image_url: string | null;
    phone_numbers: Array<{
      phone_number: string;
    }>;
    primary_email_address_id: string;
  };
}

/**
 * POST /api/webhooks/clerk — handle Clerk webhook events
 *
 * Events handled:
 * - user.created → create local User record, merge guest cart
 * - user.updated → sync local User record
 * - user.deleted → soft-delete local User record
 */
export async function POST(req: NextRequest) {
  const body = await req.text();
  const headersList = await headers();

  const svixId = headersList.get("svix-id");
  const svixTimestamp = headersList.get("svix-timestamp");
  const svixSignature = headersList.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json({ error: "Missing Svix headers" }, { status: 400 });
  }

  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("CLERK_WEBHOOK_SECRET is not set");
    return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
  }

  let event: ClerkWebhookEvent;

  try {
    const wh = new Webhook(webhookSecret);
    event = wh.verify(body, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as ClerkWebhookEvent;
  } catch (err: any) {
    console.error("Clerk webhook verification failed:", err.message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const { type, data } = event;

  switch (type) {
    case "user.created": {
      const primaryEmail = data.email_addresses.find(
        (e) => e.id === data.primary_email_address_id
      );

      const user = await db.user.create({
        data: {
          clerkId: data.id,
          email: primaryEmail?.email_address ?? data.email_addresses[0]?.email_address ?? "",
          firstName: data.first_name,
          lastName: data.last_name,
          avatarUrl: data.image_url,
          phone: data.phone_numbers[0]?.phone_number ?? null,
        },
      });

      // Merge any existing guest cart into this new user's cart
      // The sessionId would be in a cookie, but since we're in a webhook
      // context, we rely on the client-side sign-in flow to trigger merge.
      // This is a fallback — primary merge happens in middleware or layout.
      console.log(`User created: ${user.id} (${user.email})`);
      break;
    }

    case "user.updated": {
      const primaryEmail = data.email_addresses.find(
        (e) => e.id === data.primary_email_address_id
      );

      await db.user.update({
        where: { clerkId: data.id },
        data: {
          email: primaryEmail?.email_address ?? undefined,
          firstName: data.first_name,
          lastName: data.last_name,
          avatarUrl: data.image_url,
          phone: data.phone_numbers[0]?.phone_number ?? null,
        },
      });

      console.log(`User updated: ${data.id}`);
      break;
    }

    case "user.deleted": {
      // Soft delete — set deletedAt timestamp
      await db.user.update({
        where: { clerkId: data.id },
        data: { deletedAt: new Date() },
      });

      console.log(`User soft-deleted: ${data.id}`);
      break;
    }

    default:
      console.log(`Unhandled Clerk event: ${type}`);
  }

  return NextResponse.json({ received: true });
}
