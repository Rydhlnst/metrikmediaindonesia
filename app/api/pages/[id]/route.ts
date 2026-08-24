import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/server-session";
import { getDb } from "@/db/index";
import { pages } from "@/db/schema/index";
import { eq, and, ne } from "drizzle-orm";
import { pageSchema, positiveIdSchema } from "@/lib/validators/cms";
import { zodError } from "@/lib/api-response";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authGuard = await requireAdmin(request); if (authGuard.error) return authGuard.error;
  try {
    const db = await getDb();
    const { id } = await params;
    const parsedId = positiveIdSchema.safeParse(id);
    if (!parsedId.success) return zodError(parsedId.error);
    const pageId = parsedId.data;

    const [pageItem] = await db
      .select()
      .from(pages)
      .where(eq(pages.id, pageId))
      .limit(1);

    if (!pageItem) {
      return NextResponse.json({ message: "Halaman tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json(pageItem);
  } catch (error) {
    console.error("GET /api/pages/[id] error:", error);
    return NextResponse.json({ message: "Gagal mengambil data halaman" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authGuard = await requireAdmin(request); if (authGuard.error) return authGuard.error;
  try {
    const db = await getDb();
    const { id } = await params;
    const parsedId = positiveIdSchema.safeParse(id);
    if (!parsedId.success) return zodError(parsedId.error);
    const pageId = parsedId.data;
    const parsed = pageSchema.partial().safeParse(await request.json().catch(() => null));
    if (!parsed.success) return zodError(parsed.error);
    const { title, slug, content, excerpt, status, seoTitle, seoDescription } = parsed.data;

    const [existing] = await db
      .select()
      .from(pages)
      .where(eq(pages.id, pageId))
      .limit(1);

    if (!existing) {
      return NextResponse.json({ message: "Halaman tidak ditemukan" }, { status: 404 });
    }

    if (slug && slug !== existing.slug) {
      const [duplicate] = await db
        .select()
        .from(pages)
        .where(and(eq(pages.slug, slug), ne(pages.id, pageId)))
        .limit(1);

      if (duplicate) {
        return NextResponse.json({ message: "Slug halaman sudah digunakan" }, { status: 400 });
      }
    }

    const [updated] = await db
      .update(pages)
      .set({
        title: title ?? existing.title,
        slug: slug ?? existing.slug,
        content: content !== undefined ? content : existing.content,
        excerpt: excerpt !== undefined ? excerpt : existing.excerpt,
        status: status ?? existing.status,
        seoTitle: seoTitle !== undefined ? seoTitle : existing.seoTitle,
        seoDescription: seoDescription !== undefined ? seoDescription : existing.seoDescription,
        updatedAt: new Date(),
      })
      .where(eq(pages.id, pageId))
      .returning();

    return NextResponse.json({ message: "Halaman berhasil diperbarui", data: updated });
  } catch (error) {
    console.error("PUT /api/pages/[id] error:", error);
    return NextResponse.json({ message: "Gagal memperbarui halaman" }, { status: 500 });
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
    const pageId = parsedId.data;

    await db.delete(pages).where(eq(pages.id, pageId));

    return NextResponse.json({ message: "Halaman berhasil dihapus" });
  } catch (error) {
    console.error("DELETE /api/pages/[id] error:", error);
    return NextResponse.json({ message: "Gagal menghapus halaman" }, { status: 500 });
  }
}
