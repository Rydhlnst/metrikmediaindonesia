import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/db/index";
import { notifications } from "@/db/schema/index";
import { eq, and, inArray } from "drizzle-orm";
import { canManageEditorial, requireAuth } from "@/lib/server-session";
import { getEditorialRecipientIds } from "@/lib/notifications";

export async function PUT(request: NextRequest) {
  try {
    const authGuard = await requireAuth(request);
    if (authGuard.error) return authGuard.error;
    const sessionUser = authGuard.user;

    const db = await getDb();
    const recipientIds = [sessionUser.id];
    if (canManageEditorial(sessionUser)) {
      recipientIds.push(...(await getEditorialRecipientIds()));
    }

    await db
      .update(notifications)
      .set({ isRead: true })
      .where(
        and(
          inArray(notifications.userId, recipientIds),
          eq(notifications.isRead, false)
        )
      );

    return NextResponse.json({ message: "Semua notifikasi ditandai sudah dibaca" });
  } catch (error) {
    console.error("PUT /api/notifications/read-all error:", error);
    return NextResponse.json(
      { message: "Gagal memperbarui notifikasi" },
      { status: 500 }
    );
  }
}
