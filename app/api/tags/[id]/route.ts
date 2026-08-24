import { NextRequest, NextResponse } from "next/server";
import { requireEditor, requireAuth } from "@/lib/server-session";
import { getDb } from "@/db/index";
import { tags } from "@/db/schema/index";
import { eq, and, ne } from "drizzle-orm";
import { positiveIdSchema, tagSchema } from "@/lib/validators/cms";
import { zodError } from "@/lib/api-response";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authGuard = await requireAuth(request); if (authGuard.error) return authGuard.error;
  try {
    const db = await getDb();
    const { id } = await params;
    const parsedId = positiveIdSchema.safeParse(id);
    if (!parsedId.success) return zodError(parsedId.error);
    const tagId = parsedId.data;

    const [tag] = await db
      .select()
      .from(tags)
      .where(eq(tags.id, tagId))
      .limit(1);

    if (!tag) {
      return NextResponse.json({ message: "Tag tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json(tag);
  } catch (error) {
    console.error("GET /api/tags/[id] error:", error);
    return NextResponse.json({ message: "Gagal mengambil data tag" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authGuard = await requireEditor(request); if (authGuard.error) return authGuard.error;
  try {
    const db = await getDb();
    const { id } = await params;
    const parsedId = positiveIdSchema.safeParse(id);
    if (!parsedId.success) return zodError(parsedId.error);
    const tagId = parsedId.data;
    const parsed = tagSchema.partial().safeParse(await request.json().catch(() => null));
    if (!parsed.success) return zodError(parsed.error);
    const { name, slug } = parsed.data;

    const [existing] = await db
      .select()
      .from(tags)
      .where(eq(tags.id, tagId))
      .limit(1);

    if (!existing) {
      return NextResponse.json({ message: "Tag tidak ditemukan" }, { status: 404 });
    }

    if (slug && slug !== existing.slug) {
      const [duplicate] = await db
        .select()
        .from(tags)
        .where(and(eq(tags.slug, slug), ne(tags.id, tagId)))
        .limit(1);

      if (duplicate) {
        return NextResponse.json({ message: "Slug tag sudah digunakan" }, { status: 400 });
      }
    }

    const [updated] = await db
      .update(tags)
      .set({
        name: name ?? existing.name,
        slug: slug ?? existing.slug,
      })
      .where(eq(tags.id, tagId))
      .returning();

    return NextResponse.json({ message: "Tag berhasil diperbarui", data: updated });
  } catch (error) {
    console.error("PUT /api/tags/[id] error:", error);
    return NextResponse.json({ message: "Gagal memperbarui tag" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authGuard = await requireEditor(request); if (authGuard.error) return authGuard.error;
  try {
    const db = await getDb();
    const { id } = await params;
    const parsedId = positiveIdSchema.safeParse(id);
    if (!parsedId.success) return zodError(parsedId.error);
    const tagId = parsedId.data;

    await db.delete(tags).where(eq(tags.id, tagId));

    return NextResponse.json({ message: "Tag berhasil dihapus" });
  } catch (error) {
    console.error("DELETE /api/tags/[id] error:", error);
    return NextResponse.json({ message: "Gagal menghapus tag" }, { status: 500 });
  }
}
