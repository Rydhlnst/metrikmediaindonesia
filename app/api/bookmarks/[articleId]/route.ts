import { NextRequest, NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { getDb } from "@/db/index";
import { bookmarks } from "@/db/schema/index";
import { requireAuth } from "@/lib/server-session";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ articleId: string }> }
) {
  const authResult = await requireAuth(request);
  if (authResult.error) return authResult.error;
  const sessionUser = authResult.user;

  const { articleId } = await params;
  const id = Number(articleId);
  if (!Number.isInteger(id) || id <= 0) {
    return NextResponse.json({ message: "Invalid article id" }, { status: 400 });
  }

  const db = await getDb();
  await db
    .delete(bookmarks)
    .where(and(eq(bookmarks.userId, sessionUser.id), eq(bookmarks.articleId, id)));

  return NextResponse.json({ message: "Bookmark removed" });
}
