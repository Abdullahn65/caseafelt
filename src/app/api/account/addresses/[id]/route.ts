import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { db } from "@/lib/db";

/** DELETE /api/account/addresses/[id] — remove an address */
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await params;

    // Ensure the address belongs to this user
    const address = await db.address.findFirst({
      where: { id, userId: user.id },
    });

    if (!address) {
      return NextResponse.json({ error: "Address not found" }, { status: 404 });
    }

    await db.address.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Address deletion error:", error);
    return NextResponse.json(
      { error: error.message ?? "Failed to delete address" },
      { status: 500 }
    );
  }
}
