import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/db/index";
import { authors, articles } from "@/db/schema/index";
import { desc, eq, count } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const db = await getDb();
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");

    if (slug) {
      const [author] = await db
        .select()
        .from(authors)
        .where(eq(authors.slug, slug))
        .limit(1);

      if (!author) {
        return NextResponse.json({ message: "Penulis tidak ditemukan" }, { status: 404 });
      }

      return NextResponse.json(author);
    }

    const items = await db.select().from(authors).orderBy(desc(authors.createdAt));

    const itemsWithCounts = await Promise.all(
      items.map(async (author) => {
        const [articleCount] = await db
          .select({ count: count() })
          .from(articles)
          .where(eq(articles.authorId, author.id));

        return {
          ...author,
          articleCount: articleCount?.count || 0,
        };
      })
    );

    return NextResponse.json(itemsWithCounts);
  } catch (error: any) {
    console.error("GET /api/authors error:", error);
    return NextResponse.json({ message: "Gagal mengambil data penulis" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const db = await getDb();
    const body = await request.json();

    const { name, slug, bio, avatar, role = "Redaktur", socialLinks } = body;

    if (!name || !slug) {
      return NextResponse.json({ message: "Nama dan slug penulis wajib diisi" }, { status: 400 });
    }

    const [existing] = await db
      .select()
      .from(authors)
      .where(eq(authors.slug, slug))
      .limit(1);

    if (existing) {
      return NextResponse.json({ message: "Slug penulis sudah digunakan" }, { status: 400 });
    }

    const [newAuthor] = await db
      .insert(authors)
      .values({
        name,
        slug,
        bio: bio || null,
        avatar: avatar || null,
        role,
        socialLinks: socialLinks || {},
      })
      .returning();

    return NextResponse.json(
      { message: "Penulis berhasil ditambahkan", data: newAuthor },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST /api/authors error:", error);
    return NextResponse.json({ message: "Gagal menambahkan penulis" }, { status: 500 });
  }
}
