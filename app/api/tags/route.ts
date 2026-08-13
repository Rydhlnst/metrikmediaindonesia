import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/db/index";
import { tags, articleTags } from "@/db/schema/index";
import { desc, eq, count } from "drizzle-orm";

export async function GET(request: NextRequest) {
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

    const items = await db.select().from(tags).orderBy(desc(tags.createdAt));

    const itemsWithCounts = await Promise.all(
      items.map(async (tag) => {
        const [articleCount] = await db
          .select({ count: count() })
          .from(articleTags)
          .where(eq(articleTags.tagId, tag.id));

        return {
          ...tag,
          articleCount: articleCount?.count || 0,
        };
      })
    );

    return NextResponse.json(itemsWithCounts);
  } catch (error: any) {
    console.error("GET /api/tags error:", error);
    return NextResponse.json({ message: "Gagal mengambil data tags" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const db = await getDb();
    const body = await request.json();

    const { name, slug } = body;

    if (!name || !slug) {
      return NextResponse.json(
        { message: "Nama dan slug tag wajib diisi" },
        { status: 400 }
      );
    }

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
  } catch (error: any) {
    console.error("POST /api/tags error:", error);
    return NextResponse.json({ message: "Gagal membuat tag" }, { status: 500 });
  }
}
