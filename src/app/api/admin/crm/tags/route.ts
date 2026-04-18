import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";

/** POST /api/admin/crm/tags — add a tag to a customer */
export async function POST(req: NextRequest) {
  try {
    const admin = await requireAdmin();
    const { userId, tag } = await req.json();

    if (!userId || !tag?.trim()) {
      return NextResponse.json({ error: "userId and tag required" }, { status: 400 });
    }

    const normalizedTag = tag.trim().toLowerCase().replace(/\s+/g, "-");

    const customerTag = await db.customerTag.upsert({
      where: { userId_tag: { userId, tag: normalizedTag } },
      update: {},
      create: { userId, tag: normalizedTag },
    });

    await db.auditLog.create({
      data: {
        action: "UPDATE",
        entityType: "customer",
        entityId: userId,
        userId: admin.id,
        metadata: { type: "tag_added", tag: normalizedTag },
      },
    });

    return NextResponse.json(customerTag, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

/** DELETE /api/admin/crm/tags — remove a tag from a customer */
export async function DELETE(req: NextRequest) {
  try {
    const admin = await requireAdmin();
    const { userId, tag } = await req.json();

    await db.customerTag.delete({
      where: { userId_tag: { userId, tag } },
    });

    await db.auditLog.create({
      data: {
        action: "UPDATE",
        entityType: "customer",
        entityId: userId,
        userId: admin.id,
        metadata: { type: "tag_removed", tag },
      },
    });

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
