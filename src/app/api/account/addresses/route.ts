import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { db } from "@/lib/db";
import { addressSchema } from "@/lib/validations/account";

/** POST /api/account/addresses — create a new address */
export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await req.json();
    const parsed = addressSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // If this address is set as default, unset existing defaults
    if (data.isDefault) {
      await db.address.updateMany({
        where: { userId: user.id, isDefault: true },
        data: { isDefault: false },
      });
    }

    const address = await db.address.create({
      data: {
        userId: user.id,
        label: data.label ?? null,
        firstName: user.firstName ?? "",
        lastName: user.lastName ?? "",
        line1: data.line1,
        line2: data.line2 ?? null,
        city: data.city,
        state: data.state ?? "",
        postalCode: data.postalCode,
        country: data.country,
        isDefault: data.isDefault ?? false,
      },
    });

    return NextResponse.json(address, { status: 201 });
  } catch (error: any) {
    console.error("Address creation error:", error);
    return NextResponse.json(
      { error: error.message ?? "Failed to create address" },
      { status: 500 }
    );
  }
}

/** GET /api/account/addresses — list addresses */
export async function GET() {
  try {
    const user = await requireAuth();

    const addresses = await db.address.findMany({
      where: { userId: user.id },
      orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
    });

    return NextResponse.json(addresses);
  } catch (error: any) {
    console.error("Address list error:", error);
    return NextResponse.json(
      { error: error.message ?? "Failed to load addresses" },
      { status: 500 }
    );
  }
}
