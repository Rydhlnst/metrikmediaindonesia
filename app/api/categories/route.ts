import { NextRequest, NextResponse } from "next/server";
import { requireEditor, requireAuth } from "@/lib/server-session";
import { getDb } from "@/db/index";
import { categories, articles } from "@/db/schema/index";
import { desc, eq, count } from "drizzle-orm";
import { categorySchema } from "@/lib/validators/cms";
import { zodError } from "@/lib/api-response";

export async function GET(request: NextRequest) {
  const authGuard = await requireAuth(request); if (authGuard.error) return authGuard.error;
  try {
    const db = await getDb();
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");

    if (slug) {
      const [category] = await db
        .select()
        .from(categories)
        .where(eq(categories.slug, slug))
        .limit(1);

      if (!category) {
        return NextResponse.json({ message: "Kategori tidak ditemukan" }, { status: 404 });
      }

      return NextResponse.json(category);
    }

    const items = await db.select().from(categories).orderBy(desc(categories.createdAt));

    // Get article count for each category
    const itemsWithCounts = await Promise.all(
      items.map(async (cat) => {
        const [articleCount] = await db
          .select({ count: count() })
          .from(articles)
          .where(eq(articles.categoryId, cat.id));

        return {
          ...cat,
          articleCount: articleCount?.count || 0,
        };
      })
    );

    return NextResponse.json(itemsWithCounts);
  } catch (error) {
    console.error("GET /api/categories error:", error);
    return NextResponse.json({ message: "Gagal mengambil data kategori" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const authGuard = await requireEditor(request); if (authGuard.error) return authGuard.error;
  try {
    const db = await getDb();
    const parsed = categorySchema.safeParse(await request.json().catch(() => null));
    if (!parsed.success) return zodError(parsed.error);
    const { name, slug, description, color, seoTitle, seoDescription, isActive } = parsed.data;

    // Check duplicate slug
    const [existing] = await db
      .select()
      .from(categories)
      .where(eq(categories.slug, slug))
      .limit(1);

    if (existing) {
      return NextResponse.json(
        { message: "Slug kategori sudah digunakan" },
        { status: 400 }
      );
    }

    const [newCategory] = await db
      .insert(categories)
      .values({
        name,
        slug,
        description: description || null,
        color: color || "#DC2626",
        seoTitle: seoTitle || name,
        seoDescription: seoDescription || description || null,
        isActive: isActive ?? true,
      })
      .returning();

    return NextResponse.json(
      { message: "Kategori berhasil dibuat", data: newCategory },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/categories error:", error);
    return NextResponse.json({ message: "Gagal membuat kategori" }, { status: 500 });
  }
}
