import { NextRequest, NextResponse } from "next/server";
import { requireEditor, requireAuth } from "@/lib/server-session";
import { getDb } from "@/db/index";
import { tags, articleTags } from "@/db/schema/index";
import { desc, eq, count } from "drizzle-orm";
import { tagSchema } from "@/lib/validators/cms";
import { zodError } from "@/lib/api-response";

export async function GET(request: NextRequest) {
  const authGuard = await requireAuth(request); if (authGuard.error) return authGuard.error;
  try {
    const db = await getDb();
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");

    if (slug) {
      const [tag] = await db
        .select()
        .from(tags)
        .where(eq(tags.slug, slug))
        .limit(1);

      if (!tag) {
        return NextResponse.json({ message: "Tag tidak ditemukan" }, { status: 404 });
      }

      return NextResponse.json(tag);
    }

    const items = await db
      .select({
        id: tags.id,
        name: tags.name,
        slug: tags.slug,
        createdAt: tags.createdAt,
        articleCount: count(articleTags.articleId),
      })
      .from(tags)
      .leftJoin(articleTags, eq(articleTags.tagId, tags.id))
      .groupBy(tags.id)
      .orderBy(desc(tags.createdAt));

    return NextResponse.json(items);
  } catch (error) {
    console.error("GET /api/tags error:", error);
    return NextResponse.json({ message: "Gagal mengambil data tags" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const authGuard = await requireEditor(request); if (authGuard.error) return authGuard.error;
  try {
    const db = await getDb();
    const parsed = tagSchema.safeParse(await request.json().catch(() => null));
    if (!parsed.success) return zodError(parsed.error);
    const { name, slug } = parsed.data;

    const [existing] = await db
      .select()
      .from(tags)
      .where(eq(tags.slug, slug))
      .limit(1);

    if (existing) {
      return NextResponse.json(
        { message: "Slug tag sudah digunakan" },
        { status: 400 }
      );
    }

    const [newTag] = await db
      .insert(tags)
      .values({ name, slug })
      .returning();

    return NextResponse.json(
      { message: "Tag berhasil dibuat", data: newTag },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/tags error:", error);
    return NextResponse.json({ message: "Gagal membuat tag" }, { status: 500 });
  }
}
