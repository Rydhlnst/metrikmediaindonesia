import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/db/index";
import { authors } from "@/db/schema/index";
import { eq, and, ne } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const db = await getDb();
    const { id } = await params;
    const authorId = parseInt(id);

    const [author] = await db
      .select()
      .from(authors)
      .where(eq(authors.id, authorId))
      .limit(1);

    if (!author) {
      return NextResponse.json({ message: "Penulis tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json(author);
  } catch (error: any) {
    console.error("GET /api/authors/[id] error:", error);
    return NextResponse.json({ message: "Gagal mengambil data penulis" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const db = await getDb();
    const { id } = await params;
    const authorId = parseInt(id);
    const body = await request.json();

    const { name, slug, bio, avatar, role, socialLinks } = body;

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
        socialLinks: socialLinks ?? existing.socialLinks,
        updatedAt: new Date(),
      })
      .where(eq(authors.id, authorId))
      .returning();

    return NextResponse.json({ message: "Penulis berhasil diperbarui", data: updated });
  } catch (error: any) {
    console.error("PUT /api/authors/[id] error:", error);
    return NextResponse.json({ message: "Gagal memperbarui penulis" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const db = await getDb();
    const { id } = await params;
    const authorId = parseInt(id);

    await db.delete(authors).where(eq(authors.id, authorId));

    return NextResponse.json({ message: "Penulis berhasil dihapus" });
  } catch (error: any) {
    console.error("DELETE /api/authors/[id] error:", error);
    return NextResponse.json({ message: "Gagal menghapus penulis" }, { status: 500 });
  }
}
