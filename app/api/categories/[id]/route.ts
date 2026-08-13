import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/db/index";
import { categories } from "@/db/schema/index";
import { eq, and, ne } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const db = await getDb();
    const { id } = await params;
    const catId = parseInt(id);

    const [category] = await db
      .select()
      .from(categories)
      .where(eq(categories.id, catId))
      .limit(1);

    if (!category) {
      return NextResponse.json({ message: "Kategori tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json(category);
  } catch (error: any) {
    console.error("GET /api/categories/[id] error:", error);
    return NextResponse.json({ message: "Gagal mengambil data kategori" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const db = await getDb();
    const { id } = await params;
    const catId = parseInt(id);
    const body = await request.json();

    const { name, slug, description, color, seoTitle, seoDescription } = body;

    const [existing] = await db
      .select()
      .from(categories)
      .where(eq(categories.id, catId))
      .limit(1);

    if (!existing) {
      return NextResponse.json({ message: "Kategori tidak ditemukan" }, { status: 404 });
    }

    // Check slug collision
    if (slug && slug !== existing.slug) {
      const [duplicate] = await db
        .select()
        .from(categories)
        .where(and(eq(categories.slug, slug), ne(categories.id, catId)))
        .limit(1);

      if (duplicate) {
        return NextResponse.json(
          { message: "Slug kategori sudah digunakan" },
          { status: 400 }
        );
      }
    }

    const [updated] = await db
      .update(categories)
      .set({
        name: name ?? existing.name,
        slug: slug ?? existing.slug,
        description: description !== undefined ? description : existing.description,
        color: color ?? existing.color,
        seoTitle: seoTitle !== undefined ? seoTitle : existing.seoTitle,
        seoDescription: seoDescription !== undefined ? seoDescription : existing.seoDescription,
        updatedAt: new Date(),
      })
      .where(eq(categories.id, catId))
      .returning();

    return NextResponse.json({ message: "Kategori berhasil diperbarui", data: updated });
  } catch (error: any) {
    console.error("PUT /api/categories/[id] error:", error);
    return NextResponse.json({ message: "Gagal memperbarui kategori" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const db = await getDb();
    const { id } = await params;
    const catId = parseInt(id);

    await db.delete(categories).where(eq(categories.id, catId));

    return NextResponse.json({ message: "Kategori berhasil dihapus" });
  } catch (error: any) {
    console.error("DELETE /api/categories/[id] error:", error);
    return NextResponse.json({ message: "Gagal menghapus kategori" }, { status: 500 });
  }
}
