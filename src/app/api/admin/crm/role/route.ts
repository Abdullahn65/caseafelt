import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";

/** PATCH /api/admin/crm/role — change a user's role (SUPER_ADMIN only) */
export async function PATCH(req: NextRequest) {
  try {
    const admin = await requireAdmin();
    if (admin.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Only SUPER_ADMIN can change roles" }, { status: 403 });
    }

    const { userId, role } = await req.json();
    if (!["CUSTOMER", "ADMIN", "SUPER_ADMIN"].includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    const updated = await db.user.update({
      where: { id: userId },
      data: { role },
      select: { id: true, email: true, role: true, firstName: true, lastName: true },
    });

    await db.auditLog.create({
      data: {
        action: "UPDATE",
        entityType: "user",
        entityId: userId,
        userId: admin.id,
        metadata: { type: "role_changed", newRole: role },
      },
    });

    return NextResponse.json(updated);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
