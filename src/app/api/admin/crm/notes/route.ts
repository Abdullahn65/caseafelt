import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";

/** POST /api/admin/crm/notes — add a note to a customer */
export async function POST(req: NextRequest) {
  try {
    const admin = await requireAdmin();
    const { userId, body } = await req.json();

    if (!userId || !body?.trim()) {
      return NextResponse.json({ error: "userId and body required" }, { status: 400 });
    }

    const note = await db.customerNote.create({
      data: { userId, body: body.trim(), createdBy: admin.id },
    });

    await db.auditLog.create({
      data: {
        action: "UPDATE",
        entityType: "customer",
        entityId: userId,
        userId: admin.id,
        metadata: { type: "note_added", noteId: note.id },
      },
    });

    return NextResponse.json(note, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
