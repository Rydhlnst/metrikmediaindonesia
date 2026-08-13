import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/db/index";
import { pages } from "@/db/schema/index";
import { desc, eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
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
  } catch (error: any) {
    console.error("GET /api/pages error:", error);
    return NextResponse.json({ message: "Gagal mengambil data halaman" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const db = await getDb();
    const body = await request.json();

    const { title, slug, content, excerpt, status = "published", seoTitle, seoDescription } = body;

    if (!title || !slug) {
      return NextResponse.json({ message: "Judul dan slug halaman wajib diisi" }, { status: 400 });
    }

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
  } catch (error: any) {
    console.error("POST /api/pages error:", error);
    return NextResponse.json({ message: "Gagal membuat halaman" }, { status: 500 });
  }
}
