import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/db/index";
import { notifications } from "@/db/schema/index";
import { eq, and, inArray } from "drizzle-orm";
import { canManageEditorial, requireAuth } from "@/lib/server-session";
import { positiveIdSchema } from "@/lib/validators/cms";
import { zodError } from "@/lib/api-response";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authGuard = await requireAuth(request);
    if (authGuard.error) return authGuard.error;
    const sessionUser = authGuard.user;

    const { id } = await params;
    const parsedId = positiveIdSchema.safeParse(id);
    if (!parsedId.success) return zodError(parsedId.error);
    const db = await getDb();
    const recipientIds = [sessionUser.id];
    if (canManageEditorial(sessionUser)) recipientIds.push("admin");

    const [updated] = await db
      .update(notifications)
      .set({ isRead: true })
      .where(
        and(
          eq(notifications.id, parsedId.data),
          inArray(notifications.userId, recipientIds)
        )
      )
      .returning();

    if (!updated) {
      return NextResponse.json(
        { message: "Notifikasi tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Notifikasi ditandai sudah dibaca" });
  } catch (error) {
    console.error("PUT /api/notifications/[id] error:", error);
    return NextResponse.json(
      { message: "Gagal memperbarui notifikasi" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authGuard = await requireAuth(request);
    if (authGuard.error) return authGuard.error;
    const sessionUser = authGuard.user;

    const { id } = await params;
    const parsedId = positiveIdSchema.safeParse(id);
    if (!parsedId.success) return zodError(parsedId.error);
    const db = await getDb();
    const recipientIds = [sessionUser.id];
    if (canManageEditorial(sessionUser)) recipientIds.push("admin");

    const [deleted] = await db
      .delete(notifications)
      .where(
        and(
          eq(notifications.id, parsedId.data),
          inArray(notifications.userId, recipientIds)
        )
      )
      .returning();

    if (!deleted) {
      return NextResponse.json(
        { message: "Notifikasi tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Notifikasi dihapus" });
  } catch (error) {
    console.error("DELETE /api/notifications/[id] error:", error);
    return NextResponse.json(
      { message: "Gagal menghapus notifikasi" },
      { status: 500 }
    );
  }
}
