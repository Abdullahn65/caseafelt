import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { contactSchema } from "@/lib/validations/contact";

/** POST /api/contact — submit contact form */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { name, email, type, subject, message } = parsed.data;

    await db.contactSubmission.create({
      data: {
        name,
        email,
        type,
        subject,
        message,
      },
    });

    // TODO: Phase 5 — send confirmation email via Resend

    return NextResponse.json({
      success: true,
      message: "Your message has been received. We'll get back to you soon.",
    });
  } catch (error: any) {
    console.error("Contact submission error:", error);
    return NextResponse.json(
      { error: "Submission failed" },
      { status: 500 }
    );
  }
}
