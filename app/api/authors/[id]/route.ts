import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, requireAuth } from "@/lib/server-session";
import { getDb } from "@/db/index";
import { authors } from "@/db/schema/index";
import { eq, and, ne } from "drizzle-orm";
import { authorSchema, positiveIdSchema } from "@/lib/validators/cms";
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
    const authorId = parsedId.data;

    const [author] = await db
      .select()
      .from(authors)
      .where(eq(authors.id, authorId))
      .limit(1);

    if (!author) {
      return NextResponse.json({ message: "Penulis tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json(author);
  } catch (error) {
    console.error("GET /api/authors/[id] error:", error);
    return NextResponse.json({ message: "Gagal mengambil data penulis" }, { status: 500 });
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
    const authorId = parsedId.data;
    const parsed = authorSchema.partial().safeParse(await request.json().catch(() => null));
    if (!parsed.success) return zodError(parsed.error);
    const { name, slug, bio, avatar, role, socialLinks } = parsed.data;

    const [existing] = await db
      .select()
      .from(authors)
      .where(eq(authors.id, authorId))
      .limit(1);

    if (!existing) {
      return NextResponse.json({ message: "Penulis tidak ditemukan" }, { status: 404 });
    }

    if (slug && slug !== existing.slug) {
      const [duplicate] = await db
        .select()
        .from(authors)
        .where(and(eq(authors.slug, slug), ne(authors.id, authorId)))
        .limit(1);

      if (duplicate) {
        return NextResponse.json({ message: "Slug penulis sudah digunakan" }, { status: 400 });
      }
    }

    const [updated] = await db
      .update(authors)
      .set({
        name: name ?? existing.name,
        slug: slug ?? existing.slug,
        bio: bio !== undefined ? bio : existing.bio,
        avatar: avatar !== undefined ? avatar : existing.avatar,
        role: role ?? existing.role,
        socialLinks: socialLinks !== undefined ? socialLinks : existing.socialLinks,
        updatedAt: new Date(),
      })
      .where(eq(authors.id, authorId))
      .returning();

    return NextResponse.json({ message: "Penulis berhasil diperbarui", data: updated });
  } catch (error) {
    console.error("PUT /api/authors/[id] error:", error);
    return NextResponse.json({ message: "Gagal memperbarui penulis" }, { status: 500 });
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
    const authorId = parsedId.data;

    await db.delete(authors).where(eq(authors.id, authorId));

    return NextResponse.json({ message: "Penulis berhasil dihapus" });
  } catch (error) {
    console.error("DELETE /api/authors/[id] error:", error);
    return NextResponse.json({ message: "Gagal menghapus penulis" }, { status: 500 });
  }
}
