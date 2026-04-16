import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { orderStatusUpdateSchema } from "@/lib/validations/admin";

/** PATCH /api/admin/orders/[id]/status — update order status */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdmin();
    const { id } = await params;

    const body = await req.json();
    const parsed = orderStatusUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { status, trackingNumber, trackingUrl } = parsed.data;

    const order = await db.order.findUnique({ where: { id } });
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const updateData: Record<string, unknown> = { status };

    if (trackingNumber) updateData.trackingNumber = trackingNumber;
    if (trackingUrl) updateData.trackingUrl = trackingUrl;
    if (status === "SHIPPED") updateData.shippedAt = new Date();
    if (status === "DELIVERED") updateData.deliveredAt = new Date();

    // Update order + create audit log in a transaction
    const [updatedOrder] = await db.$transaction([
      db.order.update({
        where: { id },
        data: updateData,
      }),
      db.auditLog.create({
        data: {
          entityType: "ORDER",
          entityId: id,
          action: "STATUS_CHANGE",
          userId: admin.id,
          metadata: {
            from: order.status,
            to: status,
          },
        },
      }),
    ]);

    return NextResponse.json(updatedOrder);
  } catch (error: any) {
    console.error("Order status update error:", error);
    return NextResponse.json(
      { error: error.message ?? "Update failed" },
      { status: 500 }
    );
  }
}
