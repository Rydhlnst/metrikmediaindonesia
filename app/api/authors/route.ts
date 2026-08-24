import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, requireAuth } from "@/lib/server-session";
import { getDb } from "@/db/index";
import { authors, articles } from "@/db/schema/index";
import { desc, eq, count } from "drizzle-orm";
import { authorSchema } from "@/lib/validators/cms";
import { zodError } from "@/lib/api-response";

export async function GET(request: NextRequest) {
  const authGuard = await requireAuth(request); if (authGuard.error) return authGuard.error;
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
  } catch (error) {
    console.error("GET /api/authors error:", error);
    return NextResponse.json({ message: "Gagal mengambil data penulis" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const authGuard = await requireAdmin(request); if (authGuard.error) return authGuard.error;
  try {
    const db = await getDb();
    const parsed = authorSchema.safeParse(await request.json().catch(() => null));
    if (!parsed.success) return zodError(parsed.error);
    const { name, slug, bio, avatar, role = "Redaktur", socialLinks } = parsed.data;

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
  } catch (error) {
    console.error("POST /api/authors error:", error);
    return NextResponse.json({ message: "Gagal menambahkan penulis" }, { status: 500 });
  }
}
