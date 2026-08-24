import { NextRequest, NextResponse } from "next/server";
import { requireEditor, requireAuth } from "@/lib/server-session";
import { getDb } from "@/db/index";
import { categories } from "@/db/schema/index";
import { eq, and, ne } from "drizzle-orm";
import { categorySchema, positiveIdSchema } from "@/lib/validators/cms";
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
    const catId = parsedId.data;

    const [category] = await db
      .select()
      .from(categories)
      .where(eq(categories.id, catId))
      .limit(1);

    if (!category) {
      return NextResponse.json({ message: "Kategori tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json(category);
  } catch (error) {
    console.error("GET /api/categories/[id] error:", error);
    return NextResponse.json({ message: "Gagal mengambil data kategori" }, { status: 500 });
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
    const catId = parsedId.data;
    const parsed = categorySchema.partial().safeParse(await request.json().catch(() => null));
    if (!parsed.success) return zodError(parsed.error);
    const { name, slug, description, color, seoTitle, seoDescription, isActive } = parsed.data;

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
        color: color !== undefined ? color : existing.color,
        seoTitle: seoTitle !== undefined ? seoTitle : existing.seoTitle,
        seoDescription: seoDescription !== undefined ? seoDescription : existing.seoDescription,
        isActive: isActive !== undefined ? isActive : existing.isActive,
        updatedAt: new Date(),
      })
      .where(eq(categories.id, catId))
      .returning();

    return NextResponse.json({ message: "Kategori berhasil diperbarui", data: updated });
  } catch (error) {
    console.error("PUT /api/categories/[id] error:", error);
    return NextResponse.json({ message: "Gagal memperbarui kategori" }, { status: 500 });
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
    const catId = parsedId.data;

    await db.delete(categories).where(eq(categories.id, catId));

    return NextResponse.json({ message: "Kategori berhasil dihapus" });
  } catch (error) {
    console.error("DELETE /api/categories/[id] error:", error);
    return NextResponse.json({ message: "Gagal menghapus kategori" }, { status: 500 });
  }
}
