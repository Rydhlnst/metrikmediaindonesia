import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/db/index";
import { notifications } from "@/db/schema/index";
import { eq, desc, and, count, inArray } from "drizzle-orm";
import { canManageEditorial, getSessionFromRequest } from "@/lib/server-session";
import { getEditorialRecipientIds } from "@/lib/notifications";

export async function GET(request: NextRequest) {
  try {
    const sessionUser = await getSessionFromRequest(request);
    if (!sessionUser) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const db = await getDb();
    const recipientIds = [sessionUser.id];
    if (canManageEditorial(sessionUser)) {
      recipientIds.push(...(await getEditorialRecipientIds()));
    }

    // Get unread count
    const [unreadResult] = await db
      .select({ count: count() })
      .from(notifications)
      .where(
        and(
          inArray(notifications.userId, recipientIds),
          eq(notifications.isRead, false)
        )
      );

    // Get notifications (latest 20)
    const items = await db
      .select()
      .from(notifications)
      .where(inArray(notifications.userId, recipientIds))
      .orderBy(desc(notifications.createdAt))
      .limit(20);

    return NextResponse.json({
      notifications: items,
      unreadCount: unreadResult?.count || 0,
    });
  } catch (error) {
    console.error("GET /api/notifications error:", error);
    return NextResponse.json(
      { message: "Gagal mengambil notifikasi" },
      { status: 500 }
    );
  }
}
