import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/db/index";
import { comments } from "@/db/schema/index";
import { eq } from "drizzle-orm";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const db = await getDb();
    const { id } = await params;
    const commentId = parseInt(id);
    const body = await request.json();

    const { status } = body;

    if (!status || !["approved", "pending", "spam", "rejected"].includes(status)) {
      return NextResponse.json({ message: "Status komentar tidak valid" }, { status: 400 });
    }

    const [updated] = await db
      .update(comments)
      .set({
        status,
        updatedAt: new Date(),
      })
      .where(eq(comments.id, commentId))
      .returning();

    return NextResponse.json({ message: `Status komentar diubah ke ${status}`, data: updated });
  } catch (error: any) {
    console.error("PATCH /api/comments/[id] error:", error);
    return NextResponse.json({ message: "Gagal mengbarui status komentar" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const db = await getDb();
    const { id } = await params;
    const commentId = parseInt(id);

    await db.delete(comments).where(eq(comments.id, commentId));

    return NextResponse.json({ message: "Komentar berhasil dihapus" });
  } catch (error: any) {
    console.error("DELETE /api/comments/[id] error:", error);
    return NextResponse.json({ message: "Gagal menghapus komentar" }, { status: 500 });
  }
}
