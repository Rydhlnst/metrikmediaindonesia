import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/server-session";
import { getDb } from "@/db/index";
import { pages } from "@/db/schema/index";
import { desc, eq } from "drizzle-orm";
import { pageSchema } from "@/lib/validators/cms";
import { zodError } from "@/lib/api-response";

export async function GET(request: NextRequest) {
  const authGuard = await requireAdmin(request); if (authGuard.error) return authGuard.error;
  try {
    const db = await getDb();
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");

    if (slug) {
      const [pageItem] = await db
        .select()
        .from(pages)
        .where(eq(pages.slug, slug))
        .limit(1);

      if (!pageItem) {
        return NextResponse.json({ message: "Halaman tidak ditemukan" }, { status: 404 });
      }

      return NextResponse.json(pageItem);
    }

    const items = await db.select().from(pages).orderBy(desc(pages.createdAt));
    return NextResponse.json(items);
  } catch (error) {
    console.error("GET /api/pages error:", error);
    return NextResponse.json({ message: "Gagal mengambil data halaman" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const authGuard = await requireAdmin(request); if (authGuard.error) return authGuard.error;
  try {
    const db = await getDb();
    const parsed = pageSchema.safeParse(await request.json().catch(() => null));
    if (!parsed.success) return zodError(parsed.error);
    const { title, slug, content, excerpt, status = "published", seoTitle, seoDescription } = parsed.data;

    const [existing] = await db
      .select()
      .from(pages)
      .where(eq(pages.slug, slug))
      .limit(1);

    if (existing) {
      return NextResponse.json({ message: "Slug halaman sudah digunakan" }, { status: 400 });
    }

    const [newPage] = await db
      .insert(pages)
      .values({
        title,
        slug,
        content: content || null,
        excerpt: excerpt || null,
        status,
        seoTitle: seoTitle || title,
        seoDescription: seoDescription || excerpt || null,
      })
      .returning();

    return NextResponse.json(
      { message: "Halaman berhasil dibuat", data: newPage },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/pages error:", error);
    return NextResponse.json({ message: "Gagal membuat halaman" }, { status: 500 });
  }
}
