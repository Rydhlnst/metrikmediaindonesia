import { NextRequest, NextResponse } from "next/server";
import { requireEditor } from "@/lib/server-session";
import { getDb } from "@/db/index";
import { topics } from "@/db/schema/index";
import { eq, and, ne } from "drizzle-orm";
import { positiveIdSchema, topicSchema } from "@/lib/validators/cms";
import { zodError } from "@/lib/api-response";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authGuard = await requireEditor(request); if (authGuard.error) return authGuard.error;
  try {
    const db = await getDb();
    const { id } = await params;
    const parsedId = positiveIdSchema.safeParse(id);
    if (!parsedId.success) return zodError(parsedId.error);
    const topicId = parsedId.data;

    const [topic] = await db
      .select()
      .from(topics)
      .where(eq(topics.id, topicId))
      .limit(1);

    if (!topic) {
      return NextResponse.json({ message: "Topik tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json(topic);
  } catch (error) {
    console.error("GET /api/topics/[id] error:", error);
    return NextResponse.json({ message: "Gagal mengambil data topik" }, { status: 500 });
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
    const topicId = parsedId.data;
    const parsed = topicSchema.partial().safeParse(await request.json().catch(() => null));
    if (!parsed.success) return zodError(parsed.error);
    const { name, slug, description, seoTitle, seoDescription, cover, isActive } = parsed.data;

    const [existing] = await db
      .select()
      .from(topics)
      .where(eq(topics.id, topicId))
      .limit(1);

    if (!existing) {
      return NextResponse.json({ message: "Topik tidak ditemukan" }, { status: 404 });
    }

    if (slug && slug !== existing.slug) {
      const [duplicate] = await db
        .select()
        .from(topics)
        .where(and(eq(topics.slug, slug), ne(topics.id, topicId)))
        .limit(1);

      if (duplicate) {
        return NextResponse.json({ message: "Slug topik sudah digunakan" }, { status: 400 });
      }
    }

    const [updated] = await db
      .update(topics)
      .set({
        name: name ?? existing.name,
        slug: slug ?? existing.slug,
        description: description !== undefined ? description : existing.description,
        cover: cover !== undefined ? cover : existing.cover,
        seoTitle: seoTitle !== undefined ? seoTitle : existing.seoTitle,
        seoDescription: seoDescription !== undefined ? seoDescription : existing.seoDescription,
        isActive: isActive !== undefined ? isActive : existing.isActive,
        updatedAt: new Date(),
      })
      .where(eq(topics.id, topicId))
      .returning();

    return NextResponse.json({ message: "Topik berhasil diperbarui", data: updated });
  } catch (error) {
    console.error("PUT /api/topics/[id] error:", error);
    return NextResponse.json({ message: "Gagal memperbarui topik" }, { status: 500 });
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
    const topicId = parsedId.data;

    await db.delete(topics).where(eq(topics.id, topicId));

    return NextResponse.json({ message: "Topik berhasil dihapus" });
  } catch (error) {
    console.error("DELETE /api/topics/[id] error:", error);
    return NextResponse.json({ message: "Gagal menghapus topik" }, { status: 500 });
  }
}
