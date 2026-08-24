import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/server-session";
import { getDb } from "@/db/index";
import { comments } from "@/db/schema/index";
import { eq } from "drizzle-orm";
import { commentUpdateSchema, positiveIdSchema } from "@/lib/validators/cms";
import { zodError } from "@/lib/api-response";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authGuard = await requireAdmin(request); if (authGuard.error) return authGuard.error;
  try {
    const db = await getDb();
    const { id } = await params;
    const parsedId = positiveIdSchema.safeParse(id);
    if (!parsedId.success) return zodError(parsedId.error);
    const commentId = parsedId.data;
    const parsed = commentUpdateSchema.safeParse(await request.json().catch(() => null));
    if (!parsed.success) return zodError(parsed.error);
    const { status } = parsed.data;

    const [updated] = await db
      .update(comments)
      .set({
        status,
        updatedAt: new Date(),
      })
      .where(eq(comments.id, commentId))
      .returning();

    return NextResponse.json({ message: `Status komentar diubah ke ${status}`, data: updated });
  } catch (error) {
    console.error("PATCH /api/comments/[id] error:", error);
    return NextResponse.json({ message: "Gagal mengbarui status komentar" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authGuard = await requireAdmin(request); if (authGuard.error) return authGuard.error;
  try {
    const db = await getDb();
    const { id } = await params;
    const parsedId = positiveIdSchema.safeParse(id);
    if (!parsedId.success) return zodError(parsedId.error);
    const commentId = parsedId.data;

    await db.delete(comments).where(eq(comments.id, commentId));

    return NextResponse.json({ message: "Komentar berhasil dihapus" });
  } catch (error) {
    console.error("DELETE /api/comments/[id] error:", error);
    return NextResponse.json({ message: "Gagal menghapus komentar" }, { status: 500 });
  }
}
