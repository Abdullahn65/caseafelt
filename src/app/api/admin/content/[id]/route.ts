import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";

/** PATCH /api/admin/content/[id] — update content block */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;

    const body = await req.json();

    const block = await db.contentBlock.findUnique({ where: { id } });
    if (!block) {
      return NextResponse.json({ error: "Content block not found" }, { status: 404 });
    }

    const updated = await db.contentBlock.update({
      where: { id },
      data: {
        title: body.title ?? null,
        body: body.body ?? null,
        imageUrl: body.imageUrl ?? null,
        linkUrl: body.linkUrl ?? null,
        linkText: body.linkText ?? null,
        status: body.status ?? block.status,
      },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error("Content block update error:", error);
    return NextResponse.json(
      { error: error.message ?? "Update failed" },
      { status: 500 }
    );
  }
}
