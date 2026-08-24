import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/db/index";
import { authors, articles } from "@/db/schema/index";
import { eq, count, sql } from "drizzle-orm";
import { getSessionFromRequest, requireAuth } from "@/lib/server-session";
import { profileUpdateSchema } from "@/lib/validators/cms";
import { zodError } from "@/lib/api-response";

export async function GET(request: NextRequest) {
  try {
    const sessionUser = await getSessionFromRequest(request);
    if (!sessionUser) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const db = await getDb();

    if (!sessionUser.authorId) {
      return NextResponse.json({ message: "Profil tidak ditemukan" }, { status: 404 });
    }

    const [author] = await db
      .select()
      .from(authors)
      .where(eq(authors.id, sessionUser.authorId))
      .limit(1);

    if (!author) {
      return NextResponse.json({ message: "Profil tidak ditemukan" }, { status: 404 });
    }

    // Hitung statistik
    const [stats] = await db
      .select({
        totalArticles: count(),
        totalViews: sql<number>`coalesce(sum(${articles.viewCount}), 0)`,
      })
      .from(articles)
      .where(eq(articles.authorId, sessionUser.authorId));

    return NextResponse.json({
      ...author,
      totalArticles: stats?.totalArticles || 0,
      totalViews: Number(stats?.totalViews) || 0,
    });
  } catch (error) {
    console.error("GET /api/profile error:", error);
    return NextResponse.json({ message: "Gagal mengambil data profil" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const authGuard = await requireAuth(request);
    if (authGuard.error) return authGuard.error;
    const sessionUser = authGuard.user;

    const db = await getDb();

    if (!sessionUser.authorId) {
      return NextResponse.json({ message: "Profil tidak ditemukan" }, { status: 404 });
    }

    const parsed = profileUpdateSchema.safeParse(await request.json().catch(() => null));
    if (!parsed.success) return zodError(parsed.error);
    const updateData = parsed.data;

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ message: "Tidak ada data yang diperbarui" }, { status: 400 });
    }

    const [updated] = await db
      .update(authors)
      .set(updateData)
      .where(eq(authors.id, sessionUser.authorId))
      .returning();

    return NextResponse.json({ message: "Profil berhasil diperbarui", data: updated });
  } catch (error) {
    console.error("PUT /api/profile error:", error);
    return NextResponse.json({ message: "Gagal memperbarui profil" }, { status: 500 });
  }
}
