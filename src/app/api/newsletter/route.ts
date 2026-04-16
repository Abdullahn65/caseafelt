import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { newsletterSchema } from "@/lib/validations/newsletter";
import { isEmailSubscribed } from "@/lib/data/queries";

/** POST /api/newsletter — subscribe email */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = newsletterSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { email } = parsed.data;

    const alreadySubscribed = await isEmailSubscribed(email);
    if (alreadySubscribed) {
      return NextResponse.json({ success: true, message: "Subscribed" });
    }

    await db.newsletterSubscriber.create({
      data: { email },
    });

    return NextResponse.json({ success: true, message: "Subscribed" });
  } catch (error: any) {
    console.error("Newsletter subscription error:", error);
    return NextResponse.json(
      { error: "Subscription failed" },
      { status: 500 }
    );
  }
}
